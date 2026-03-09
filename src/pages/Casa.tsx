import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Check, Home, ShoppingCart, Sparkles,
  Paintbrush, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

interface GroceryCategory {
  name: string;
  emoji: string;
  color: string;
  items: { text: string; checked: boolean }[];
}

const defaultGroceries: GroceryCategory[] = [
  { name: "HortiFrutti", emoji: "🥬", color: "bg-green-500", items: [
    { text: "Cebola roxa", checked: false }, { text: "Berinjela", checked: false }, { text: "Alho", checked: false },
    { text: "Batata", checked: false }, { text: "Aipim", checked: false }, { text: "Cenoura", checked: false },
    { text: "Maçã", checked: true }, { text: "Banana", checked: true }, { text: "Melão", checked: true },
    { text: "Limão", checked: true }, { text: "Abacaxi", checked: true }, { text: "Brócolis", checked: false },
    { text: "Couve-flor", checked: false }, { text: "Pimentão verde", checked: false }, { text: "Pepino", checked: false },
  ]},
  { name: "Açougue e Peixaria", emoji: "🥩", color: "bg-red-500", items: [
    { text: "Carne moída", checked: false }, { text: "Filé mignon", checked: false },
    { text: "Sobrecoxa", checked: false }, { text: "Peito de frango", checked: true }, { text: "Salmão", checked: false },
  ]},
  { name: "Laticínios e Frios", emoji: "🧀", color: "bg-blue-500", items: [
    { text: "Leite desnatado", checked: false }, { text: "Iogurte Grego Zero", checked: true },
    { text: "Requeijão light", checked: false }, { text: "Queijo", checked: false }, { text: "Yopro", checked: true },
  ]},
  { name: "Mercearia", emoji: "🏪", color: "bg-purple-500", items: [
    { text: "Azeite de oliva", checked: false }, { text: "Lentilha", checked: false }, { text: "Macarrão", checked: true },
    { text: "Farinha de trigo", checked: true }, { text: "Tapioca", checked: false }, { text: "Açúcar", checked: false },
    { text: "Atum", checked: false }, { text: "Milho", checked: true }, { text: "Creme de leite", checked: false },
    { text: "Café", checked: false }, { text: "Chá", checked: false }, { text: "Aveia", checked: false },
  ]},
  { name: "Padaria", emoji: "🥖", color: "bg-amber-500", items: [
    { text: "Pão francês", checked: true }, { text: "Pão de forma", checked: false }, { text: "Bolo de laranja", checked: false },
  ]},
  { name: "Congelados", emoji: "🍦", color: "bg-yellow-500", items: [
    { text: "Sorvete", checked: false }, { text: "Pão de queijo", checked: false },
    { text: "Pizza congelada", checked: false }, { text: "Batata frita", checked: false },
  ]},
  { name: "Limpeza", emoji: "🧹", color: "bg-cyan-500", items: [
    { text: "Esponja", checked: false }, { text: "Vanish", checked: false }, { text: "Desinfetante", checked: false },
    { text: "Sabão em pó", checked: false }, { text: "Amaciante", checked: false },
  ]},
  { name: "Higiene Pessoal", emoji: "🛁", color: "bg-pink-400", items: [
    { text: "Lenço umedecido", checked: false }, { text: "Cotopaxi", checked: false },
    { text: "Shampoo", checked: false }, { text: "Condicionador", checked: false },
  ]},
  { name: "Bebidas", emoji: "🥤", color: "bg-indigo-500", items: [
    { text: "Suco de uva", checked: true }, { text: "Coca Zero", checked: true }, { text: "Água mineral", checked: false },
  ]},
];

const weekDays = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
const dayCleanColors: Record<string, string> = {
  SEGUNDA: "border-l-blue-500", TERÇA: "border-l-indigo-500", QUARTA: "border-l-green-500",
  QUINTA: "border-l-yellow-500", SEXTA: "border-l-pink-500", SÁBADO: "border-l-purple-500", DOMINGO: "border-l-violet-500"
};

const defaultCleaningRoutine: Record<string, string[]> = {
  SEGUNDA: ["Limpar cozinha", "Lavar louça", "Passar pano no chão"],
  TERÇA: ["Limpar banheiros", "Trocar toalhas"],
  QUARTA: ["Aspirar a casa toda", "Limpar espelhos"],
  QUINTA: ["Lavar roupas", "Passar roupas"],
  SEXTA: ["Organizar armários", "Limpar geladeira"],
  SÁBADO: ["Faxina geral", "Trocar roupa de cama"],
  DOMINGO: ["Descanso / Organização leve"],
};

const Casa = () => {
  const navigate = useNavigate();

  // LISTA DO MERCADO
  const [groceries, setGroceries] = usePersistedState<GroceryCategory[]>("casa-groceries", defaultGroceries);
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});

  // ROTINA DE LIMPEZA
  const [cleaningRoutine, setCleaningRoutine] = usePersistedState("casa-cleaning", defaultCleaningRoutine);
  const [cleaningDone, setCleaningDone] = usePersistedState<Record<string, boolean[]>>("casa-cleaning-done", {});
  const [newCleanTask, setNewCleanTask] = useState<Record<string, string>>({});

  // COMPRAS E AFAZERES
  const [errands, setErrands] = usePersistedState<{id: string; text: string; done: boolean; priority: string}[]>("casa-errands", []);
  const [newErrand, setNewErrand] = useState("");

  // MANUTENÇÃO DA CASA
  const [maintenance, setMaintenance] = usePersistedState<{id: string; task: string; lastDone: string; frequency: string}[]>("casa-maintenance", [
    { id: "1", task: "Dedetização", lastDone: "", frequency: "6 meses" },
    { id: "2", task: "Limpeza de ar-condicionado", lastDone: "", frequency: "3 meses" },
    { id: "3", task: "Troca de filtro de água", lastDone: "", frequency: "6 meses" },
    { id: "4", task: "Revisão elétrica", lastDone: "", frequency: "1 ano" },
  ]);
  const [newMainTask, setNewMainTask] = useState("");

  const toggleGroceryItem = (catIdx: number, itemIdx: number) => {
    const updated = [...groceries];
    updated[catIdx].items[itemIdx].checked = !updated[catIdx].items[itemIdx].checked;
    setGroceries(updated);
  };

  const addGroceryItem = (catIdx: number) => {
    const text = newItemInputs[catIdx.toString()]?.trim();
    if (!text) return;
    const updated = [...groceries];
    updated[catIdx].items.push({ text, checked: false });
    setGroceries(updated);
    setNewItemInputs({ ...newItemInputs, [catIdx.toString()]: "" });
  };

  const removeGroceryItem = (catIdx: number, itemIdx: number) => {
    const updated = [...groceries];
    updated[catIdx].items.splice(itemIdx, 1);
    setGroceries(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2"><Home className="w-5 h-5 text-cyan-500" /> CASA EM ORDEM</h1>
            <p className="text-xs text-muted-foreground">Lista de mercado, limpeza, compras e manutenção</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="mercado" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            {[
              { v: "mercado", l: "LISTA DO MERCADO" }, { v: "limpeza", l: "ROTINA DE LIMPEZA" },
              { v: "afazeres", l: "COMPRAS E AFAZERES" }, { v: "manutencao", l: "MANUTENÇÃO" },
            ].map(t => <TabsTrigger key={t.v} value={t.v} className="text-xs px-3 py-1.5">{t.l}</TabsTrigger>)}
          </TabsList>

          {/* ========== LISTA DO MERCADO ========== */}
          <TabsContent value="mercado" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groceries.map((cat, ci) => (
                <div key={ci} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className={`${cat.color} text-white p-3 flex items-center gap-2`}>
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-sm font-bold">{cat.name}</span>
                    <span className="ml-auto text-xs opacity-80">{cat.items.filter(i => i.checked).length}/{cat.items.length}</span>
                  </div>
                  <div className="p-3 space-y-1">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2 group">
                        <button onClick={() => toggleGroceryItem(ci, ii)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${item.checked ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                          {item.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                        </button>
                        <span className={`text-xs flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.text}</span>
                        <button onClick={() => removeGroceryItem(ci, ii)} className="opacity-0 group-hover:opacity-100"><X className="w-3 h-3 text-muted-foreground" /></button>
                      </div>
                    ))}
                    <div className="flex gap-1 mt-2">
                      <Input value={newItemInputs[ci.toString()] || ""} onChange={e => setNewItemInputs({ ...newItemInputs, [ci.toString()]: e.target.value })}
                        placeholder="Adicionar..." className="text-xs h-7" onKeyDown={e => e.key === "Enter" && addGroceryItem(ci)} />
                      <Button size="sm" className="h-7 px-2" onClick={() => addGroceryItem(ci)}><Plus className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ========== ROTINA DE LIMPEZA ========== */}
          <TabsContent value="limpeza" className="space-y-3">
            {weekDays.map(day => {
              const tasks = cleaningRoutine[day] || [];
              const done = cleaningDone[day] || Array(tasks.length).fill(false);
              return (
                <div key={day} className={`bg-card rounded-xl border border-border border-l-4 ${dayCleanColors[day]} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold">{day}</h3>
                    <span className="text-xs text-muted-foreground">{done.filter(Boolean).length}/{tasks.length}</span>
                  </div>
                  <div className="space-y-1">
                    {tasks.map((task, ti) => (
                      <div key={ti} className="flex items-center gap-2 group">
                        <button onClick={() => {
                          const u = [...done]; u[ti] = !u[ti]; setCleaningDone({ ...cleaningDone, [day]: u });
                        }} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${done[ti] ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
                          {done[ti] && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`text-xs flex-1 ${done[ti] ? "line-through text-muted-foreground" : ""}`}>{task}</span>
                        <button onClick={() => {
                          const u = { ...cleaningRoutine }; u[day] = tasks.filter((_, i) => i !== ti); setCleaningRoutine(u);
                          const d = { ...cleaningDone }; d[day] = done.filter((_, i) => i !== ti); setCleaningDone(d);
                        }} className="opacity-0 group-hover:opacity-100"><X className="w-3 h-3 text-muted-foreground" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Input value={newCleanTask[day] || ""} onChange={e => setNewCleanTask({ ...newCleanTask, [day]: e.target.value })}
                      placeholder="Nova tarefa..." className="text-xs h-7" onKeyDown={e => {
                        if (e.key === "Enter" && newCleanTask[day]?.trim()) {
                          setCleaningRoutine({ ...cleaningRoutine, [day]: [...tasks, newCleanTask[day].trim()] });
                          setCleaningDone({ ...cleaningDone, [day]: [...done, false] });
                          setNewCleanTask({ ...newCleanTask, [day]: "" });
                        }
                      }} />
                    <Button size="sm" className="h-7 px-2" onClick={() => {
                      if (newCleanTask[day]?.trim()) {
                        setCleaningRoutine({ ...cleaningRoutine, [day]: [...tasks, newCleanTask[day].trim()] });
                        setCleaningDone({ ...cleaningDone, [day]: [...done, false] });
                        setNewCleanTask({ ...newCleanTask, [day]: "" });
                      }
                    }}><Plus className="w-3 h-3" /></Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* ========== COMPRAS E AFAZERES ========== */}
          <TabsContent value="afazeres" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> COMPRAS E AFAZERES PENDENTES</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newErrand} onChange={e => setNewErrand(e.target.value)} placeholder="Ex: Comprar cortina nova" className="text-xs h-8 flex-1"
                  onKeyDown={e => { if (e.key === "Enter" && newErrand.trim()) { setErrands([...errands, { id: Date.now().toString(), text: newErrand.trim(), done: false, priority: "media" }]); setNewErrand(""); }}} />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newErrand.trim()) { setErrands([...errands, { id: Date.now().toString(), text: newErrand.trim(), done: false, priority: "media" }]); setNewErrand(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              {errands.map((e, i) => (
                <div key={e.id} className={`flex items-center gap-3 rounded-lg p-3 border mb-1 ${e.done ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30" : "bg-muted/30 border-border"}`}>
                  <button onClick={() => { const u = [...errands]; u[i] = { ...e, done: !e.done }; setErrands(u); }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${e.done ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
                    {e.done && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-xs flex-1 ${e.done ? "line-through text-muted-foreground" : ""}`}>{e.text}</span>
                  <select value={e.priority} onChange={ev => { const u = [...errands]; u[i] = { ...e, priority: ev.target.value }; setErrands(u); }}
                    className="text-[10px] bg-background border border-border rounded px-1 py-0.5">
                    <option value="alta">🔴 Alta</option><option value="media">🟡 Média</option><option value="baixa">🟢 Baixa</option>
                  </select>
                  <button onClick={() => setErrands(errands.filter(x => x.id !== e.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
              {errands.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Nenhum afazer pendente 🎉</p>}
            </div>
          </TabsContent>

          {/* ========== MANUTENÇÃO ========== */}
          <TabsContent value="manutencao" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">🔧 MANUTENÇÃO DA CASA</h3>
              {maintenance.map((m, i) => (
                <div key={m.id} className="bg-muted/30 rounded-lg p-3 border border-border mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{m.task}</p>
                    <button onClick={() => setMaintenance(maintenance.filter(x => x.id !== m.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-[10px] text-muted-foreground mb-1">Última vez</p>
                      <Input type="date" value={m.lastDone} onChange={e => { const u = [...maintenance]; u[i] = { ...m, lastDone: e.target.value }; setMaintenance(u); }} className="text-xs h-7" /></div>
                    <div><p className="text-[10px] text-muted-foreground mb-1">Frequência</p>
                      <Input value={m.frequency} onChange={e => { const u = [...maintenance]; u[i] = { ...m, frequency: e.target.value }; setMaintenance(u); }} className="text-xs h-7" /></div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input value={newMainTask} onChange={e => setNewMainTask(e.target.value)} placeholder="Nova manutenção..." className="text-xs h-8" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newMainTask.trim()) { setMaintenance([...maintenance, { id: Date.now().toString(), task: newMainTask.trim(), lastDone: "", frequency: "" }]); setNewMainTask(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Casa;
