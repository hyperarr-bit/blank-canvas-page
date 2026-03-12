import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, ShoppingBag, Sun, Moon, Plus, Trash2, Check, X, CalendarDays, Sparkles, Package, Star, Camera, TrendingUp, Heart, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const genId = () => crypto.randomUUID();
const getDateKey = () => new Date().toISOString().slice(0, 10);
const getDayOfWeek = () => new Date().getDay();

// ============= CRONOGRAMA CAPILAR =============
const CronogramaCapilar = () => {
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const types = ["hidratacao", "nutricao", "reconstrucao"] as const;
  const typeLabels: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
    hidratacao: { label: "Hidratação", emoji: "💧", color: "text-blue-600", bg: "bg-blue-500/15 border-blue-300" },
    nutricao: { label: "Nutrição", emoji: "🥑", color: "text-green-600", bg: "bg-green-500/15 border-green-300" },
    reconstrucao: { label: "Reconstrução", emoji: "🔧", color: "text-amber-600", bg: "bg-amber-500/15 border-amber-300" },
  };

  const [schedule, setSchedule] = usePersistedState<Record<string, string>>("capilar-schedule", { "0": "", "1": "hidratacao", "2": "", "3": "nutricao", "4": "", "5": "reconstrucao", "6": "" });
  const [history, setHistory] = usePersistedState<Record<string, string>>("capilar-history", {});
  const today = getDateKey();
  const todayDow = getDayOfWeek();
  const todayType = schedule[String(todayDow)];

  const markDone = () => { if (todayType) setHistory(prev => ({ ...prev, [today]: todayType })); };

  const streak = (() => {
    let count = 0; const d = new Date();
    for (let i = 0; i < 30; i++) {
      const key = d.toISOString().slice(0, 10); const dow = d.getDay();
      if (schedule[String(dow)] && history[key]) count++;
      else if (schedule[String(dow)] && !history[key] && i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="font-semibold text-sm">Cronograma Capilar</h3><p className="text-[10px] text-muted-foreground">Organize sua rotina H / N / R</p></div>
        <Badge variant="secondary" className="text-xs">🔥 {streak} streak</Badge>
      </div>
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (<div key={t} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${typeLabels[t].bg}`}><span className="text-sm">{typeLabels[t].emoji}</span><span className="text-[10px] font-medium">{typeLabels[t].label}</span></div>))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day, i) => {
          const type = schedule[String(i)]; const isToday = i === todayDow; const done = i === todayDow && history[today];
          return (
            <div key={i} className={`text-center p-2 rounded-xl border transition-all ${isToday ? "ring-2 ring-primary" : ""} ${type ? typeLabels[type]?.bg || "bg-muted/30" : "bg-muted/30 border-border"}`}>
              <span className={`text-[10px] font-bold ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
              <div className="text-lg mt-1">{type ? typeLabels[type]?.emoji : "—"}</div>
              {done && <Check className="w-3 h-3 mx-auto text-green-600 mt-0.5" />}
              <Select value={type || "none"} onValueChange={v => setSchedule(prev => ({ ...prev, [String(i)]: v === "none" ? "" : v }))}>
                <SelectTrigger className="h-5 text-[8px] border-0 bg-transparent p-0 mt-1 justify-center shadow-none"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none">—</SelectItem>{types.map(t => <SelectItem key={t} value={t}>{typeLabels[t].emoji}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
      {todayType && !history[today] && <Button className="w-full" size="sm" onClick={markDone}><Check className="w-4 h-4 mr-1" /> Marcar {typeLabels[todayType].label} como feita</Button>}
      {history[today] && <div className="text-center text-sm text-green-600 font-medium">✅ {typeLabels[history[today]]?.label} feita hoje!</div>}
    </div>
  );
};

// ============= PRODUCT INVENTORY =============
const ProductInventory = () => {
  type Product = { id: string; name: string; category: string; brand: string; opened: boolean; expiry: string; notes: string; rating: number; repurchase: boolean };
  const categories = ["Skincare", "Cabelo", "Maquiagem", "Corpo", "Unhas", "Outro"];
  const [products, setProducts] = usePersistedState<Product[]>("beauty-products", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ category: "Skincare", opened: false, rating: 0, repurchase: false });

  const save = () => {
    if (!form.name) return;
    setProducts(prev => [...prev, { id: genId(), name: form.name || "", category: form.category || "Outro", brand: form.brand || "", opened: form.opened || false, expiry: form.expiry || "", notes: form.notes || "", rating: form.rating || 0, repurchase: form.repurchase || false }]);
    setForm({ category: "Skincare", opened: false, rating: 0, repurchase: false }); setShowForm(false);
  };

  const catEmoji: Record<string, string> = { Skincare: "🧴", Cabelo: "💇", Maquiagem: "💄", Corpo: "🧼", Unhas: "💅", Outro: "✨" };

  // Products expiring soon
  const expiringSoon = products.filter(p => {
    if (!p.expiry) return false;
    const diff = (new Date(p.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff < 30;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div><h3 className="font-semibold text-sm">Inventário de Produtos</h3><p className="text-[10px] text-muted-foreground">{products.length} produtos</p></div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Novo</Button>
      </div>

      {expiringSoon.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-500/10 border-amber-300">
          <CardContent className="p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Vencendo em breve:</p>
            {expiringSoon.map(p => <p key={p.id} className="text-[10px] text-amber-600">{p.name} — {p.expiry}</p>)}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => {
          const count = products.filter(p => p.category === c).length;
          if (count === 0) return null;
          return <Badge key={c} variant="secondary" className="text-[10px]">{catEmoji[c]} {c}: {count}</Badge>;
        })}
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Nome do produto" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Marca" value={form.brand || ""} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="h-9 text-sm" />
              <Select value={form.category || "Skincare"} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent></Select>
            </div>
            <Input type="date" placeholder="Validade" value={form.expiry || ""} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} className="h-9 text-sm" />
            <Textarea placeholder="Notas (como usar, resultados...)" value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-sm min-h-[50px]" />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs"><Checkbox checked={form.repurchase} onCheckedChange={v => setForm(p => ({...p, repurchase: !!v}))} /> Recomprar</label>
            </div>
            <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={save}>Salvar</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {products.map(p => (
          <Card key={p.id}>
            <CardContent className="p-3 flex items-center gap-3">
              <span className="text-xl">{catEmoji[p.category] || "✨"}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{p.name}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {p.brand && <span className="text-[10px] text-muted-foreground">{p.brand}</span>}
                  <Badge variant="outline" className="text-[9px] px-1 py-0">{p.category}</Badge>
                  {p.repurchase && <Badge className="text-[8px] px-1 py-0 bg-green-500/20 text-green-700 border-green-300">🔄 Recomprar</Badge>}
                  {p.expiry && <span className="text-[9px] text-muted-foreground">Val: {p.expiry}</span>}
                </div>
                {p.notes && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{p.notes}</p>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}><Trash2 className="w-3 h-3" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {products.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhum produto cadastrado. 🧴</p>}
    </div>
  );
};

// ============= SKINCARE ROUTINE =============
const SkincareRoutine = () => {
  const today = getDateKey();
  const [morningSteps, setMorningSteps] = usePersistedState<string[]>("skincare-morning-steps", ["Lavar o rosto", "Tônico", "Sérum Vitamina C", "Hidratante", "Protetor Solar"]);
  const [nightSteps, setNightSteps] = usePersistedState<string[]>("skincare-night-steps", ["Demaquilante", "Lavar o rosto", "Tônico", "Sérum Retinol", "Hidratante", "Lip balm"]);
  const [morningChecked, setMorningChecked] = usePersistedState<Record<string, number[]>>("skincare-morning-checked", {});
  const [nightChecked, setNightChecked] = usePersistedState<Record<string, number[]>>("skincare-night-checked", {});
  const [newMorning, setNewMorning] = useState("");
  const [newNight, setNewNight] = useState("");

  const todayMorning = morningChecked[today] || [];
  const todayNight = nightChecked[today] || [];

  const toggleStep = (period: "morning" | "night", index: number) => {
    if (period === "morning") {
      const arr = [...todayMorning]; if (arr.includes(index)) arr.splice(arr.indexOf(index), 1); else arr.push(index);
      setMorningChecked(prev => ({ ...prev, [today]: arr }));
    } else {
      const arr = [...todayNight]; if (arr.includes(index)) arr.splice(arr.indexOf(index), 1); else arr.push(index);
      setNightChecked(prev => ({ ...prev, [today]: arr }));
    }
  };

  const streak = (() => {
    let count = 0; const d = new Date();
    for (let i = 0; i < 60; i++) {
      const key = d.toISOString().slice(0, 10);
      const m = morningChecked[key]; const n = nightChecked[key];
      if ((m && m.length > 0) || (n && n.length > 0)) count++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  const morningPct = morningSteps.length > 0 ? Math.round((todayMorning.length / morningSteps.length) * 100) : 0;
  const nightPct = nightSteps.length > 0 ? Math.round((todayNight.length / nightSteps.length) * 100) : 0;

  const RoutineBlock = ({ title, icon: Icon, steps, setSteps, checked, period, newStep, setNewStep, color }: any) => (
    <Card>
      <CardHeader className="pb-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} /><CardTitle className="text-sm">{title}</CardTitle></div>
          <Badge variant="secondary" className="text-[10px]">{checked.length}/{steps.length}</Badge>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
          <div className={`h-full rounded-full transition-all ${period === "morning" ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${period === "morning" ? morningPct : nightPct}%` }} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-1.5">
        {steps.map((step: string, i: number) => (
          <div key={i} className="flex items-center gap-2 group">
            <Checkbox checked={checked.includes(i)} onCheckedChange={() => toggleStep(period, i)} />
            <span className={`text-sm flex-1 ${checked.includes(i) ? "line-through text-muted-foreground" : ""}`}>{step}</span>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={() => setSteps((prev: string[]) => prev.filter((_: string, j: number) => j !== i))}><X className="w-3 h-3" /></Button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Input placeholder="Novo passo..." value={newStep} onChange={(e: any) => setNewStep(e.target.value)} className="h-8 text-xs" onKeyDown={(e: any) => { if (e.key === "Enter" && newStep.trim()) { setSteps((prev: string[]) => [...prev, newStep.trim()]); setNewStep(""); } }} />
          <Button size="sm" className="h-8" onClick={() => { if (newStep.trim()) { setSteps((prev: string[]) => [...prev, newStep.trim()]); setNewStep(""); } }}><Plus className="w-3 h-3" /></Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold text-sm">Rotina do Dia</h3><Badge variant="secondary" className="text-xs">🔥 {streak} dias seguidos</Badge></div>
      <RoutineBlock title="Morning Routine ☀️" icon={Sun} steps={morningSteps} setSteps={setMorningSteps} checked={todayMorning} period="morning" newStep={newMorning} setNewStep={setNewMorning} color="text-amber-500" />
      <RoutineBlock title="Night Routine 🌙" icon={Moon} steps={nightSteps} setSteps={setNightSteps} checked={todayNight} period="night" newStep={newNight} setNewStep={setNewNight} color="text-indigo-500" />
    </div>
  );
};

// ============= SKIN DIARY =============
const SkinDiary = () => {
  const [entries, setEntries] = usePersistedState<{id: string; date: string; skin: string; mood: string; notes: string; products: string}[]>("beauty-skin-diary", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ skin: "normal", mood: "😊", notes: "", products: "" });
  const today = getDateKey();

  const skinTypes = ["oleosa", "seca", "normal", "mista", "sensível", "acneica"];
  const moods = ["😊", "😐", "😔", "🤩", "😴"];
  const skinEmoji: Record<string, string> = { oleosa: "💦", seca: "🏜️", normal: "✨", mista: "🔄", sensível: "🌸", acneica: "🔴" };

  const save = () => {
    setEntries(prev => [{ id: genId(), date: today, ...form }, ...prev]);
    setForm({ skin: "normal", mood: "😊", notes: "", products: "" }); setShowForm(false);
  };

  const todayEntry = entries.find(e => e.date === today);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="font-semibold text-sm">Diário de Pele</h3><p className="text-[10px] text-muted-foreground">Acompanhe a evolução da sua pele</p></div>
        {!todayEntry && <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Hoje</Button>}
      </div>

      {todayEntry && (
        <Card className="bg-green-50 dark:bg-green-500/10 border-green-300">
          <CardContent className="p-3">
            <p className="text-xs font-bold text-green-700">✅ Registro de hoje feito!</p>
            <p className="text-[10px] text-green-600">Pele: {skinEmoji[todayEntry.skin]} {todayEntry.skin} | Humor: {todayEntry.mood}</p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-xs font-medium mb-1">Como está sua pele hoje?</p>
              <div className="flex gap-1.5 flex-wrap">
                {skinTypes.map(s => (
                  <button key={s} onClick={() => setForm(p => ({...p, skin: s}))}
                    className={`px-2 py-1 rounded-lg text-[10px] border transition-all ${form.skin === s ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
                    {skinEmoji[s]} {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-1">Humor</p>
              <div className="flex gap-2">
                {moods.map(m => (
                  <button key={m} onClick={() => setForm(p => ({...p, mood: m}))}
                    className={`text-xl p-1 rounded-lg border transition-all ${form.mood === m ? "border-primary bg-primary/10 scale-110" : "border-transparent"}`}>{m}</button>
                ))}
              </div>
            </div>
            <Textarea value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Observações (irritações, melhorias, etc)..." className="text-xs min-h-[60px]" />
            <Input value={form.products} onChange={e => setForm(p => ({...p, products: e.target.value}))} placeholder="Produtos usados hoje" className="h-8 text-xs" />
            <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={save}>Salvar</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <div className="space-y-2">
        {entries.slice(0, 14).map(e => (
          <Card key={e.id}>
            <CardContent className="p-3 flex items-start gap-3">
              <span className="text-xl">{skinEmoji[e.skin]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
                  <Badge variant="outline" className="text-[9px]">{e.skin}</Badge>
                  <span className="text-sm">{e.mood}</span>
                </div>
                {e.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{e.notes}</p>}
                {e.products && <p className="text-[9px] text-muted-foreground/70 mt-0.5">🧴 {e.products}</p>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setEntries(prev => prev.filter(x => x.id !== e.id))}><Trash2 className="w-3 h-3" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {entries.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Comece a acompanhar sua pele! 🌟</p>}
    </div>
  );
};

// ============= MAIN =============
const Beleza = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4" /></Button>
          <div><h1 className="text-lg font-bold tracking-tight">💆 Skincare & Self-Care</h1><p className="text-[11px] text-muted-foreground">Seu ritual de beleza e cuidado pessoal</p></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="routine">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="routine" className="text-xs"><Sparkles className="w-3.5 h-3.5 mr-1" />Rotina</TabsTrigger>
            <TabsTrigger value="capilar" className="text-xs"><Droplets className="w-3.5 h-3.5 mr-1" />Capilar</TabsTrigger>
            <TabsTrigger value="products" className="text-xs"><Package className="w-3.5 h-3.5 mr-1" />Produtos</TabsTrigger>
            <TabsTrigger value="diary" className="text-xs"><Camera className="w-3.5 h-3.5 mr-1" />Diário</TabsTrigger>
          </TabsList>
          <TabsContent value="routine"><SkincareRoutine /></TabsContent>
          <TabsContent value="capilar"><CronogramaCapilar /></TabsContent>
          <TabsContent value="products"><ProductInventory /></TabsContent>
          <TabsContent value="diary"><SkinDiary /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Beleza;
