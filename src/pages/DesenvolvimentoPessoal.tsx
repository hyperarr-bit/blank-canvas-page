import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Star, Target, Heart, Shield, Brain,
  Lightbulb, BookOpen, Award, Eye, Sparkles, Edit3, Check, ChevronRight,
  Flame, TrendingUp, Users, Compass, Zap, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const defaultAffirmations = [
  "Eu mereço ser amado(a)",
  "Eu sou próspero(a)",
  "Eu sou abençoado(a)",
  "Tudo o que eu faço dá certo",
  "Eu sou criativo(a)",
  "Minha família e eu somos cheios de saúde",
  "Eu mereço ser feliz",
];

const defaultMotivations = [
  "Dar uma vida melhor para minha família",
  "Ter liberdade financeira",
  "Poder trabalhar de onde eu quiser",
];

const lifeAreas = [
  { id: "saude", name: "Saúde", icon: Heart, color: "text-red-400" },
  { id: "financas", name: "Finanças", icon: TrendingUp, color: "text-green-400" },
  { id: "relacionamentos", name: "Relacionamentos", icon: Users, color: "text-pink-400" },
  { id: "carreira", name: "Carreira", icon: Award, color: "text-blue-400" },
  { id: "espiritualidade", name: "Espiritualidade", icon: Sparkles, color: "text-purple-400" },
  { id: "lazer", name: "Lazer", icon: Star, color: "text-yellow-400" },
  { id: "intelectual", name: "Intelectual", icon: BookOpen, color: "text-cyan-400" },
  { id: "emocional", name: "Emocional", icon: Brain, color: "text-orange-400" },
];

const DesenvolvimentoPessoal = () => {
  const navigate = useNavigate();

  // SOBRE MIM
  const [motivations, setMotivations] = usePersistedState<string[]>("dp-motivations", defaultMotivations);
  const [newMotivation, setNewMotivation] = useState("");
  const [affirmations, setAffirmations] = usePersistedState<string[]>("dp-affirmations", defaultAffirmations);
  const [newAffirmation, setNewAffirmation] = useState("");
  const [strengths, setStrengths] = usePersistedState<string[]>("dp-strengths", ["Comunicativo(a)", "Disciplinado(a)", "Organizado(a)"]);
  const [newStrength, setNewStrength] = useState("");
  const [weaknesses, setWeaknesses] = usePersistedState<string[]>("dp-weaknesses", ["Perfeccionismo", "Ansiedade"]);
  const [newWeakness, setNewWeakness] = useState("");
  const [skills, setSkills] = usePersistedState<string[]>("dp-skills", ["Treinar", "Ler", "Disciplina", "Oratória"]);
  const [newSkill, setNewSkill] = useState("");
  const [skillsToLearn, setSkillsToLearn] = usePersistedState<string[]>("dp-skills-learn", ["Falar inglês", "Cozinhar", "Falar em público", "Correr"]);
  const [newSkillToLearn, setNewSkillToLearn] = useState("");
  const [values, setValues] = usePersistedState<string[]>("dp-values", ["Fé em Deus", "Família", "Honestidade", "Gratidão"]);
  const [newValue, setNewValue] = useState("");
  const [canControl, setCanControl] = usePersistedState<string[]>("dp-can-control", ["Minhas atitudes", "Meu esforço", "Minha rotina"]);
  const [newCanControl, setNewCanControl] = useState("");
  const [cantControl, setCantControl] = usePersistedState<string[]>("dp-cant-control", ["Opinião dos outros", "O passado", "O clima"]);
  const [newCantControl, setNewCantControl] = useState("");

  // METAS DE VIDA
  const [lifeGoals, setLifeGoals] = usePersistedState<{id: string; text: string; deadline: string; done: boolean}[]>("dp-life-goals", []);
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");

  // RODA DA VIDA
  const [wheelScores, setWheelScores] = usePersistedState<Record<string, number>>("dp-wheel", 
    Object.fromEntries(lifeAreas.map(a => [a.id, 5]))
  );

  // BUCKET LIST
  const [bucketList, setBucketList] = usePersistedState<{id: string; text: string; done: boolean}[]>("dp-bucket", []);
  const [newBucket, setNewBucket] = useState("");

  // DIÁRIO DE GRATIDÃO
  const [gratitudeEntries, setGratitudeEntries] = usePersistedState<Record<string, string[]>>("dp-gratitude", {});
  const today = new Date().toISOString().split("T")[0];
  const [todayGratitude, setTodayGratitude] = useState<string[]>(() => gratitudeEntries[today] || ["", "", ""]);

  // LEITURAS / APRENDIZADOS
  const [books, setBooks] = usePersistedState<{id: string; title: string; author: string; status: string; rating: number; notes: string}[]>("dp-books", []);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");

  // VISION BOARD TEXTUAL
  const [visionItems, setVisionItems] = usePersistedState<{id: string; category: string; text: string}[]>("dp-vision", []);
  const [newVisionText, setNewVisionText] = useState("");
  const [newVisionCategory, setNewVisionCategory] = useState("carreira");

  const addToList = (list: string[], setList: (v: string[]) => void, value: string, setValue: (v: string) => void) => {
    if (value.trim()) { setList([...list, value.trim()]); setValue(""); }
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, idx: number) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const saveGratitude = () => {
    setGratitudeEntries({ ...gratitudeEntries, [today]: todayGratitude });
  };

  const ListEditor = ({ items, setItems, newItem, setNewItem, placeholder, colorClass }: {
    items: string[]; setItems: (v: string[]) => void; newItem: string; setNewItem: (v: string) => void; placeholder: string; colorClass: string;
  }) => (
    <div>
      <div className="flex gap-2 mb-2">
        <Input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder={placeholder}
          className="text-xs h-8" onKeyDown={e => e.key === "Enter" && addToList(items, setItems, newItem, setNewItem)} />
        <Button size="sm" className="h-8 px-2" onClick={() => addToList(items, setItems, newItem, setNewItem)}><Plus className="w-3 h-3" /></Button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs ${colorClass}`}>
            <span>{item}</span>
            <button onClick={() => removeFromList(items, setItems, i)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> DESENVOLVIMENTO PESSOAL
            </h1>
            <p className="text-xs text-muted-foreground">Conheça-se, evolua, conquiste</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="sobre" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            {[
              { v: "sobre", l: "SOBRE MIM" },
              { v: "metas", l: "METAS" },
              { v: "roda", l: "RODA DA VIDA" },
              { v: "leituras", l: "LEITURAS" },
              { v: "bucket", l: "BUCKET LIST" },
              { v: "visao", l: "VISÃO" },
              { v: "gratidao", l: "GRATIDÃO" },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} className="text-xs px-3 py-1.5">{t.l}</TabsTrigger>
            ))}
          </TabsList>

          {/* ========== SOBRE MIM ========== */}
          <TabsContent value="sobre" className="space-y-4">
            {/* Motivações */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" /> O QUE ME MOTIVA A ACORDAR TODOS OS DIAS?
              </h3>
              <ListEditor items={motivations} setItems={setMotivations} newItem={newMotivation} setNewItem={setNewMotivation}
                placeholder="Adicionar motivação..." colorClass="bg-yellow-100/80 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Afirmações */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10 rounded-xl border border-pink-200 dark:border-pink-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" /> AFIRMAÇÕES
                </h3>
                <ListEditor items={affirmations} setItems={setAffirmations} newItem={newAffirmation} setNewItem={setNewAffirmation}
                  placeholder="Nova afirmação..." colorClass="bg-pink-100/80 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20" />
              </div>

              {/* Forças */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl border border-green-200 dark:border-green-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" /> MINHAS FORÇAS
                </h3>
                <ListEditor items={strengths} setItems={setStrengths} newItem={newStrength} setNewItem={setNewStrength}
                  placeholder="Nova força..." colorClass="bg-green-100/80 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20" />
              </div>

              {/* Fraquezas */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 rounded-xl border border-red-200 dark:border-red-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" /> MINHAS FRAQUEZAS
                </h3>
                <ListEditor items={weaknesses} setItems={setWeaknesses} newItem={newWeakness} setNewItem={setNewWeakness}
                  placeholder="Nova fraqueza..." colorClass="bg-red-100/80 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20" />
              </div>

              {/* Habilidades */}
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-500/10 dark:to-sky-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" /> MINHAS PRINCIPAIS HABILIDADES
                </h3>
                <ListEditor items={skills} setItems={setSkills} newItem={newSkill} setNewItem={setNewSkill}
                  placeholder="Nova habilidade..." colorClass="bg-blue-100/80 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20" />
              </div>

              {/* Habilidades a Desenvolver */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-500/10 dark:to-teal-500/10 rounded-xl border border-cyan-200 dark:border-cyan-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-500" /> HABILIDADES QUE QUERO DESENVOLVER
                </h3>
                <ListEditor items={skillsToLearn} setItems={setSkillsToLearn} newItem={newSkillToLearn} setNewItem={setNewSkillToLearn}
                  placeholder="Nova habilidade..." colorClass="bg-cyan-100/80 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20" />
              </div>

              {/* Valores Inegociáveis */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-500" /> VALORES INEGOCIÁVEIS
                </h3>
                <ListEditor items={values} setItems={setValues} newItem={newValue} setNewItem={setNewValue}
                  placeholder="Novo valor..." colorClass="bg-purple-100/80 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20" />
              </div>
            </div>

            {/* O que posso / não posso controlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> O QUE EU POSSO CONTROLAR/MUDAR
                </h3>
                <ListEditor items={canControl} setItems={setCanControl} newItem={newCanControl} setNewItem={setNewCanControl}
                  placeholder="Adicionar..." colorClass="bg-emerald-100/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20" />
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-500/10 dark:to-gray-500/10 rounded-xl border border-slate-200 dark:border-slate-500/30 p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" /> O QUE NÃO POSSO CONTROLAR, MAS POSSO INFLUENCIAR
                </h3>
                <ListEditor items={cantControl} setItems={setCantControl} newItem={newCantControl} setNewItem={setNewCantControl}
                  placeholder="Adicionar..." colorClass="bg-slate-100/80 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20" />
              </div>
            </div>
          </TabsContent>

          {/* ========== METAS DE VIDA ========== */}
          <TabsContent value="metas" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> METAS DE VIDA</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newGoalText} onChange={e => setNewGoalText(e.target.value)} placeholder="Ex: Comprar minha casa" className="text-xs h-8 flex-1" />
                <Input type="date" value={newGoalDeadline} onChange={e => setNewGoalDeadline(e.target.value)} className="text-xs h-8 w-36" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newGoalText.trim()) {
                    setLifeGoals([...lifeGoals, { id: Date.now().toString(), text: newGoalText.trim(), deadline: newGoalDeadline, done: false }]);
                    setNewGoalText(""); setNewGoalDeadline("");
                  }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              <div className="space-y-2">
                {lifeGoals.map((g, i) => (
                  <div key={g.id} className={`flex items-center gap-3 rounded-lg p-3 border ${g.done ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30" : "bg-muted/30 border-border"}`}>
                    <button onClick={() => {
                      const updated = [...lifeGoals]; updated[i] = { ...g, done: !g.done }; setLifeGoals(updated);
                    }} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${g.done ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
                      {g.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${g.done ? "line-through text-muted-foreground" : ""}`}>{g.text}</p>
                      {g.deadline && <p className="text-xs text-muted-foreground">Prazo: {new Date(g.deadline).toLocaleDateString("pt-BR")}</p>}
                    </div>
                    <button onClick={() => setLifeGoals(lifeGoals.filter(x => x.id !== g.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                ))}
                {lifeGoals.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Adicione suas metas de vida acima ✨</p>}
              </div>
            </div>

            {/* Metas por Área */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">📊 PROGRESSO POR ÁREA</h3>
              <div className="space-y-3">
                {lifeAreas.map(area => {
                  const Icon = area.icon;
                  return (
                    <div key={area.id} className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${area.color}`} />
                      <span className="text-xs font-medium w-28">{area.name}</span>
                      <div className="flex-1">
                        <Progress value={wheelScores[area.id] * 10} className="h-2" />
                      </div>
                      <span className="text-xs font-bold w-8 text-right">{wheelScores[area.id]}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ========== RODA DA VIDA ========== */}
          <TabsContent value="roda" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-2 flex items-center gap-2"><Compass className="w-4 h-4" /> RODA DA VIDA</h3>
              <p className="text-xs text-muted-foreground mb-4">Avalie de 0 a 10 sua satisfação em cada área da vida:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lifeAreas.map(area => {
                  const Icon = area.icon;
                  const score = wheelScores[area.id];
                  return (
                    <div key={area.id} className="bg-muted/30 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${area.color}`} />
                        <span className="text-xs font-bold">{area.name}</span>
                        <span className="ml-auto text-lg font-bold">{score}</span>
                      </div>
                      <input type="range" min={0} max={10} value={score}
                        onChange={e => setWheelScores({ ...wheelScores, [area.id]: Number(e.target.value) })}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary" />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>Insatisfeito</span><span>Pleno</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-3 border border-purple-500/20">
                <p className="text-xs font-bold mb-1">📈 Média geral: {(Object.values(wheelScores).reduce((a, b) => a + b, 0) / lifeAreas.length).toFixed(1)}/10</p>
                <p className="text-[10px] text-muted-foreground">Foque nas áreas com nota mais baixa para equilibrar sua vida.</p>
              </div>
            </div>
          </TabsContent>

          {/* ========== LEITURAS ========== */}
          <TabsContent value="leituras" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> MEUS LIVROS E APRENDIZADOS</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newBookTitle} onChange={e => setNewBookTitle(e.target.value)} placeholder="Título do livro" className="text-xs h-8 flex-1" />
                <Input value={newBookAuthor} onChange={e => setNewBookAuthor(e.target.value)} placeholder="Autor" className="text-xs h-8 w-32" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newBookTitle.trim()) {
                    setBooks([...books, { id: Date.now().toString(), title: newBookTitle.trim(), author: newBookAuthor.trim(), status: "lendo", rating: 0, notes: "" }]);
                    setNewBookTitle(""); setNewBookAuthor("");
                  }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              <div className="space-y-2">
                {books.map((book, i) => (
                  <div key={book.id} className="bg-muted/30 rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select value={book.status} onChange={e => {
                          const updated = [...books]; updated[i] = { ...book, status: e.target.value }; setBooks(updated);
                        }} className="text-xs bg-background border border-border rounded px-2 py-1">
                          <option value="quero-ler">Quero ler</option>
                          <option value="lendo">Lendo</option>
                          <option value="lido">Lido</option>
                        </select>
                        <button onClick={() => setBooks(books.filter(b => b.id !== book.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} onClick={() => {
                          const updated = [...books]; updated[i] = { ...book, rating: s }; setBooks(updated);
                        }}>
                          <Star className={`w-4 h-4 ${s <= book.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
                        </button>
                      ))}
                    </div>
                    <Textarea value={book.notes} onChange={e => {
                      const updated = [...books]; updated[i] = { ...book, notes: e.target.value }; setBooks(updated);
                    }} placeholder="Anotações e aprendizados..." className="text-xs min-h-[60px]" />
                  </div>
                ))}
                {books.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Adicione livros que está lendo ou quer ler 📚</p>}
              </div>
            </div>
          </TabsContent>

          {/* ========== BUCKET LIST ========== */}
          <TabsContent value="bucket" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> BUCKET LIST — COISAS QUE QUERO FAZER NA VIDA</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newBucket} onChange={e => setNewBucket(e.target.value)} placeholder="Ex: Conhecer a Aurora Boreal"
                  className="text-xs h-8 flex-1" onKeyDown={e => e.key === "Enter" && newBucket.trim() && (setBucketList([...bucketList, { id: Date.now().toString(), text: newBucket.trim(), done: false }]), setNewBucket(""))} />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newBucket.trim()) { setBucketList([...bucketList, { id: Date.now().toString(), text: newBucket.trim(), done: false }]); setNewBucket(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              <div className="space-y-2">
                {bucketList.map((item, i) => (
                  <div key={item.id} className={`flex items-center gap-3 rounded-lg p-3 border ${item.done ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30" : "bg-muted/30 border-border"}`}>
                    <button onClick={() => {
                      const updated = [...bucketList]; updated[i] = { ...item, done: !item.done }; setBucketList(updated);
                    }} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${item.done ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
                      {item.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-sm flex-1 ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.text}</span>
                    <button onClick={() => setBucketList(bucketList.filter(x => x.id !== item.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                ))}
                {bucketList.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">O que você quer fazer antes de morrer? 🌍</p>}
              </div>
              {bucketList.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  ✅ {bucketList.filter(b => b.done).length}/{bucketList.length} realizados
                </div>
              )}
            </div>
          </TabsContent>

          {/* ========== VISÃO ========== */}
          <TabsContent value="visao" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Eye className="w-4 h-4" /> QUADRO DE VISÃO</h3>
              <p className="text-xs text-muted-foreground mb-3">Escreva seus sonhos e objetivos para visualizar diariamente:</p>
              <div className="flex gap-2 mb-3">
                <select value={newVisionCategory} onChange={e => setNewVisionCategory(e.target.value)}
                  className="text-xs bg-background border border-border rounded px-2 py-1 h-8">
                  {lifeAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <Input value={newVisionText} onChange={e => setNewVisionText(e.target.value)} placeholder="Ex: Morar na praia em 5 anos"
                  className="text-xs h-8 flex-1" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newVisionText.trim()) {
                    setVisionItems([...visionItems, { id: Date.now().toString(), category: newVisionCategory, text: newVisionText.trim() }]);
                    setNewVisionText("");
                  }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lifeAreas.filter(a => visionItems.some(v => v.category === a.id)).map(area => {
                  const Icon = area.icon;
                  return (
                    <div key={area.id} className="bg-muted/30 rounded-lg p-3 border border-border">
                      <h4 className="text-xs font-bold flex items-center gap-2 mb-2"><Icon className={`w-3 h-3 ${area.color}`} />{area.name}</h4>
                      <div className="space-y-1">
                        {visionItems.filter(v => v.category === area.id).map(item => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <span>✨ {item.text}</span>
                            <button onClick={() => setVisionItems(visionItems.filter(v => v.id !== item.id))}><X className="w-3 h-3 text-muted-foreground" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {visionItems.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Adicione seus sonhos ao quadro de visão 🎯</p>}
            </div>
          </TabsContent>

          {/* ========== GRATIDÃO ========== */}
          <TabsContent value="gratidao" className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-xl border border-amber-200 dark:border-amber-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500" /> DIÁRIO DE GRATIDÃO — {new Date().toLocaleDateString("pt-BR")}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Escreva 3 coisas pelas quais você é grato(a) hoje:</p>
              <div className="space-y-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm">{i + 1}.</span>
                    <Input value={todayGratitude[i] || ""} onChange={e => {
                      const updated = [...todayGratitude]; updated[i] = e.target.value; setTodayGratitude(updated);
                    }} placeholder="Sou grato(a) por..." className="text-xs h-8" />
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-3 w-full" onClick={saveGratitude}>Salvar gratidão de hoje 🙏</Button>
            </div>

            {/* Histórico */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">📅 HISTÓRICO DE GRATIDÃO</h3>
              <div className="space-y-2">
                {Object.entries(gratitudeEntries).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14).map(([date, items]) => (
                  <div key={date} className="bg-muted/30 rounded-lg p-3 border border-border">
                    <p className="text-xs font-bold mb-1">{new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
                    <div className="space-y-0.5">
                      {items.filter(Boolean).map((item, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {item}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(gratitudeEntries).length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Seu histórico aparecerá aqui 💛</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DesenvolvimentoPessoal;
