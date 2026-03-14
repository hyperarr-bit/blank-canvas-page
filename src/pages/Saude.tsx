import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Heart, Ruler,
  Check, TrendingUp, Droplets, Stethoscope,
  Target, Activity, Moon, Sun, Zap
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

const getDateKey = (d?: Date) => {
  const date = d || new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const moodEmojis = [
  { emoji: "😄", label: "Ótimo", color: "bg-green-400", value: 5 },
  { emoji: "🙂", label: "Bem", color: "bg-green-300", value: 4 },
  { emoji: "😐", label: "Neutro", color: "bg-yellow-300", value: 3 },
  { emoji: "😕", label: "Meh", color: "bg-orange-300", value: 2 },
  { emoji: "😞", label: "Ruim", color: "bg-red-300", value: 1 },
];

// ============= HEALTH TRACKER (from Rotina) =============
const HealthTracker = () => {
  const today = getDateKey();
  const [waterLog, setWaterLog] = usePersistedState<Record<string, number>>("water-log", {});
  const [sleepLog, setSleepLog] = usePersistedState<Record<string, number>>("sleep-log", {});
  const [sleepInput, setSleepInput] = useState(String(sleepLog[today] || ""));
  const waterGoal = 8;
  const waterToday = waterLog[today] || 0;
  const sleepToday = sleepLog[today] || 0;

  const addWater = () => setWaterLog(prev => ({ ...prev, [today]: Math.min((prev[today] || 0) + 1, 15) }));
  const removeWater = () => setWaterLog(prev => ({ ...prev, [today]: Math.max((prev[today] || 0) - 1, 0) }));
  const saveSleep = (val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0 && n <= 24) {
      setSleepLog(prev => ({ ...prev, [today]: n }));
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 flex items-center gap-2">
        <Droplets className="w-4 h-4 text-white" />
        <span className="font-bold text-sm text-white">SAÚDE DIÁRIA</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-xs">ÁGUA</span>
            <span className="text-xs text-muted-foreground ml-auto">{waterToday}/{waterGoal} copos</span>
          </div>
          <Progress value={(waterToday / waterGoal) * 100} className="h-2" />
          <div className="flex flex-wrap gap-1">
            {[...Array(waterGoal)].map((_, i) => (
              <div key={i} className={`w-6 h-8 rounded-md border flex items-center justify-center text-sm transition-colors ${i < waterToday ? "bg-blue-100 border-blue-300 text-blue-600" : "bg-muted/30 border-border text-muted-foreground/30"}`}>
                💧
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={removeWater} className="h-7 text-xs flex-1">−</Button>
            <Button size="sm" onClick={addWater} className="h-7 text-xs flex-1 bg-blue-500 hover:bg-blue-600">+ Copo</Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-xs">SONO</span>
            <span className="text-xs text-muted-foreground ml-auto">{sleepToday}h</span>
          </div>
          <Progress value={(sleepToday / 8) * 100} className="h-2" />
          <div className="text-center py-2">
            <span className="text-3xl font-bold">{sleepToday || "—"}</span>
            <span className="text-sm text-muted-foreground ml-1">horas</span>
            <div className="text-[10px] text-muted-foreground mt-1">
              {sleepToday >= 7 ? "✅ Boa noite!" : sleepToday > 0 ? "⚠️ Durma mais!" : "Registre seu sono"}
            </div>
          </div>
          <Input
            type="number" step="0.5" min="0" max="24" placeholder="Horas dormidas"
            value={sleepInput}
            onChange={e => { setSleepInput(e.target.value); saveSleep(e.target.value); }}
            className="h-7 text-xs"
          />
        </div>
      </div>
    </div>
  );
};

// ============= MOOD TRACKER (from Rotina) =============
const MoodTracker = () => {
  const [moodLog, setMoodLog] = usePersistedState<Record<string, { mood: number; note: string }>>("mood-log", {});
  const today = getDateKey();
  const todayMood = moodLog[today];
  const [note, setNote] = useState(todayMood?.note || "");

  const logMood = (value: number) => {
    setMoodLog(prev => ({ ...prev, [today]: { mood: value, note: prev[today]?.note || "" } }));
  };

  const saveNote = () => {
    if (todayMood) {
      setMoodLog(prev => ({ ...prev, [today]: { ...prev[today], note } }));
    }
  };

  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = getDateKey(d);
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return { key, dayName: dayNames[d.getDay()], mood: moodLog[key]?.mood };
  });

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-3 flex items-center gap-2">
        <Heart className="w-4 h-4 text-white" />
        <span className="font-bold text-sm text-white">COMO VOCÊ ESTÁ HOJE?</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-center gap-3">
          {moodEmojis.map(m => (
            <button key={m.value} onClick={() => logMood(m.value)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${todayMood?.mood === m.value ? "bg-primary/10 ring-2 ring-primary scale-110" : "hover:bg-muted"}`}>
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
        {todayMood && (
          <div className="flex gap-2">
            <Input placeholder="O que aconteceu hoje? (opcional)" value={note} onChange={e => setNote(e.target.value)} onBlur={saveNote} onKeyDown={e => e.key === "Enter" && saveNote()} className="text-xs h-8" />
          </div>
        )}
        <div className="flex items-end justify-between gap-1 h-16">
          {last7.map(d => (
            <div key={d.key} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full rounded-sm transition-all"
                style={{ height: d.mood ? `${d.mood * 10}px` : "4px", backgroundColor: d.mood ? `hsl(${(d.mood - 1) * 30}, 70%, 55%)` : "hsl(var(--muted))" }} />
              <span className="text-[9px] text-muted-foreground">{d.dayName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============= ENERGY TRACKER (from Rotina) =============
const EnergyTracker = () => {
  const today = getDateKey();
  const [energyLog, setEnergyLog] = usePersistedState<Record<string, number[]>>("energy-log", {});
  const periods = ["Manhã", "Tarde", "Noite"];
  const periodIcons = [<Sun key="s" className="w-3 h-3" />, <Zap key="z" className="w-3 h-3" />, <Moon key="m" className="w-3 h-3" />];
  const todayEnergy = energyLog[today] || [0, 0, 0];

  const setEnergy = (periodIndex: number, value: number) => {
    const newEnergy = [...todayEnergy];
    newEnergy[periodIndex] = value;
    setEnergyLog(prev => ({ ...prev, [today]: newEnergy }));
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-white" />
        <span className="font-bold text-sm text-white">NÍVEL DE ENERGIA</span>
      </div>
      <div className="p-4 space-y-3">
        {periods.map((period, pi) => (
          <div key={period} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16 text-xs text-muted-foreground">
              {periodIcons[pi]}
              <span>{period}</span>
            </div>
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} onClick={() => setEnergy(pi, v)}
                  className={`flex-1 h-6 rounded-md text-[10px] font-bold transition-all ${v <= todayEnergy[pi]
                    ? v <= 2 ? "bg-red-400 text-white" : v <= 3 ? "bg-yellow-400 text-white" : "bg-green-400 text-white"
                    : "bg-muted text-muted-foreground"
                  }`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
        {todayEnergy.some(e => e > 0) && (
          <div className="text-center text-xs text-muted-foreground pt-1">
            Média: {(todayEnergy.filter(e => e > 0).reduce((a, b) => a + b, 0) / todayEnergy.filter(e => e > 0).length).toFixed(1)} ⚡
          </div>
        )}
      </div>
    </div>
  );
};

// ============= SUPPLEMENTS TRACKER =============
const SupplementsTracker = () => {
  const [supplements, setSupplements] = usePersistedState<{name: string; time: string; taken: boolean}[]>("saude-supplements", []);
  const [newSuppName, setNewSuppName] = useState("");

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-white" />
        <span className="font-bold text-sm text-white">SUPLEMENTOS</span>
      </div>
      <div className="p-4 space-y-2">
        {supplements.map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg p-2 border border-border">
            <button onClick={() => { const u = [...supplements]; u[i] = { ...s, taken: !s.taken }; setSupplements(u); }}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${s.taken ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
              {s.taken && <Check className="w-3 h-3 text-white" />}
            </button>
            <div className="flex-1"><p className={`text-xs font-medium ${s.taken ? "line-through text-muted-foreground" : ""}`}>{s.name}</p><p className="text-[10px] text-muted-foreground">{s.time}</p></div>
            <button onClick={() => setSupplements(supplements.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Input value={newSuppName} onChange={e => setNewSuppName(e.target.value)} placeholder="Novo suplemento..." className="text-xs h-8" />
          <Button size="sm" className="h-8" onClick={() => { if (newSuppName.trim()) { setSupplements([...supplements, { name: newSuppName.trim(), time: "Manhã", taken: false }]); setNewSuppName(""); }}}><Plus className="w-3 h-3" /></Button>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN =============
const Saude = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // MEDIDAS
  const [measurements, setMeasurements] = usePersistedState<{date: string; peso: string; cintura: string; quadril: string; braco: string; coxa: string; peitoral: string}[]>("saude-measures", []);
  const [newMeasure, setNewMeasure] = useState({ date: today, peso: "", cintura: "", quadril: "", braco: "", coxa: "", peitoral: "" });

  // CHECKUPS
  const [checkups, setCheckups] = usePersistedState<{id: string; name: string; lastDate: string; nextDate: string}[]>("saude-checkups", [
    { id: "1", name: "Dentista", lastDate: "", nextDate: "" },
    { id: "2", name: "Dermatologista", lastDate: "", nextDate: "" },
    { id: "3", name: "Exame de sangue", lastDate: "", nextDate: "" },
    { id: "4", name: "Oftalmologista", lastDate: "", nextDate: "" },
    { id: "5", name: "Ginecologista/Urologista", lastDate: "", nextDate: "" },
  ]);
  const [newCheckupName, setNewCheckupName] = useState("");

  // BODY GOALS
  const [bodyGoals, setBodyGoals] = usePersistedState<{id: string; goal: string; current: string; target: string}[]>("saude-body-goals", [
    { id: "1", goal: "Peso", current: "", target: "" },
    { id: "2", goal: "Cintura", current: "", target: "" },
    { id: "3", goal: "% Gordura", current: "", target: "" },
  ]);

  // PROGRESS NOTES
  const [progressNotes, setProgressNotes] = usePersistedState<{date: string; text: string}[]>("saude-progress-notes", []);
  const [newProgressNote, setNewProgressNote] = useState("");

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" /> SAÚDE EM ORDEM</h1>
            <p className="text-xs text-muted-foreground">Medidas, suplementos, check-ups e bem-estar</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="saude" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            <TabsTrigger value="saude" className="text-xs px-3 py-1.5">💧 SAÚDE</TabsTrigger>
            <TabsTrigger value="medidas" className="text-xs px-3 py-1.5">📏 MEDIDAS</TabsTrigger>
            <TabsTrigger value="checkups" className="text-xs px-3 py-1.5">🩺 CHECK-UPS</TabsTrigger>
            <TabsTrigger value="metas" className="text-xs px-3 py-1.5">🎯 METAS</TabsTrigger>
            <TabsTrigger value="progresso" className="text-xs px-3 py-1.5">📈 PROGRESSO</TabsTrigger>
          </TabsList>

          {/* ========== SAÚDE (Rotina-style) ========== */}
          <TabsContent value="saude" className="space-y-4">
            <HealthTracker />
            <div className="grid md:grid-cols-2 gap-4">
              <MoodTracker />
              <EnergyTracker />
            </div>
            <SupplementsTracker />
          </TabsContent>

          {/* ========== MEDIDAS ========== */}
          <TabsContent value="medidas" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Ruler className="w-4 h-4" /> REGISTRO DE MEDIDAS</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <Input type="date" value={newMeasure.date} onChange={e => setNewMeasure({ ...newMeasure, date: e.target.value })} className="text-xs h-8 col-span-2 sm:col-span-4" />
                {(["peso", "cintura", "quadril", "braco", "coxa", "peitoral"] as const).map(f => (
                  <div key={f} className="relative">
                    <Input value={newMeasure[f]} onChange={e => setNewMeasure({ ...newMeasure, [f]: e.target.value })} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} className="text-xs h-8 pr-8" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{f === "peso" ? "kg" : "cm"}</span>
                  </div>
                ))}
              </div>
              <Button size="sm" className="w-full" onClick={() => {
                if (newMeasure.peso || newMeasure.cintura) { setMeasurements([...measurements, { ...newMeasure }]); setNewMeasure({ date: today, peso: "", cintura: "", quadril: "", braco: "", coxa: "", peitoral: "" }); }
              }}>Salvar medidas</Button>
            </div>
            {measurements.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-xs font-bold mb-3">📊 HISTÓRICO</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border"><th className="text-left p-2">Data</th><th className="text-center p-2">Peso</th><th className="text-center p-2">Cintura</th><th className="text-center p-2">Quadril</th><th className="text-center p-2">Braço</th><th className="text-center p-2">Coxa</th><th className="text-center p-2">Peito</th><th className="p-2"></th></tr></thead>
                    <tbody>
                      {measurements.sort((a, b) => b.date.localeCompare(a.date)).map((m, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="p-2 font-medium">{new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR")}</td>
                          <td className="text-center p-2">{m.peso || "—"}</td><td className="text-center p-2">{m.cintura || "—"}</td>
                          <td className="text-center p-2">{m.quadril || "—"}</td><td className="text-center p-2">{m.braco || "—"}</td>
                          <td className="text-center p-2">{m.coxa || "—"}</td><td className="text-center p-2">{m.peitoral || "—"}</td>
                          <td className="p-2"><button onClick={() => setMeasurements(measurements.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {measurements.length >= 2 && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4">
                <h3 className="text-xs font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> EVOLUÇÃO DO PESO</h3>
                <div className="flex items-end gap-1 h-24 mt-2">
                  {measurements.sort((a, b) => a.date.localeCompare(b.date)).slice(-12).map((m, i) => {
                    const w = Number(m.peso) || 0; const max = Math.max(...measurements.map(x => Number(x.peso) || 0)); const min = Math.min(...measurements.filter(x => Number(x.peso)).map(x => Number(x.peso)));
                    const pct = max === min ? 50 : ((w - min) / (max - min)) * 80 + 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold">{w}</span>
                        <div className="w-full bg-green-400 rounded-t" style={{ height: `${pct}%` }} />
                        <span className="text-[7px] text-muted-foreground">{new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ========== CHECK-UPS ========== */}
          <TabsContent value="checkups" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> MEUS CHECK-UPS</h3>
              {checkups.map((c, i) => (
                <div key={c.id} className="bg-muted/30 rounded-lg p-3 border border-border mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{c.name}</p>
                    <button onClick={() => setCheckups(checkups.filter(x => x.id !== c.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-[10px] text-muted-foreground mb-1">Última vez</p>
                      <Input type="date" value={c.lastDate} onChange={e => { const u = [...checkups]; u[i] = { ...c, lastDate: e.target.value }; setCheckups(u); }} className="text-xs h-7" /></div>
                    <div><p className="text-[10px] text-muted-foreground mb-1">Próximo</p>
                      <Input type="date" value={c.nextDate} onChange={e => { const u = [...checkups]; u[i] = { ...c, nextDate: e.target.value }; setCheckups(u); }} className="text-xs h-7" /></div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input value={newCheckupName} onChange={e => setNewCheckupName(e.target.value)} placeholder="Novo check-up..." className="text-xs h-8" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newCheckupName.trim()) { setCheckups([...checkups, { id: Date.now().toString(), name: newCheckupName.trim(), lastDate: "", nextDate: "" }]); setNewCheckupName(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          </TabsContent>

          {/* ========== METAS DO CORPO ========== */}
          <TabsContent value="metas" className="space-y-4">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/10 dark:to-pink-500/10 rounded-xl border border-rose-200 dark:border-rose-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-rose-500" /> METAS DO CORPO</h3>
              <p className="text-xs text-muted-foreground mb-3">Defina onde você está e onde quer chegar:</p>
              {bodyGoals.map((g, i) => (
                <div key={g.id} className="grid grid-cols-[1fr_80px_80px_24px] gap-2 items-center mb-2">
                  <Input value={g.goal} onChange={e => { const u = [...bodyGoals]; u[i] = { ...g, goal: e.target.value }; setBodyGoals(u); }} className="text-xs h-8 font-medium" />
                  <Input value={g.current} onChange={e => { const u = [...bodyGoals]; u[i] = { ...g, current: e.target.value }; setBodyGoals(u); }} placeholder="Atual" className="text-xs h-8" />
                  <Input value={g.target} onChange={e => { const u = [...bodyGoals]; u[i] = { ...g, target: e.target.value }; setBodyGoals(u); }} placeholder="Meta" className="text-xs h-8" />
                  <button onClick={() => setBodyGoals(bodyGoals.filter(x => x.id !== g.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => setBodyGoals([...bodyGoals, { id: Date.now().toString(), goal: "", current: "", target: "" }])}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar meta
              </Button>
            </div>
          </TabsContent>

          {/* ========== PROGRESSO ========== */}
          <TabsContent value="progresso" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> REGISTRO DE PROGRESSO</h3>
              <p className="text-xs text-muted-foreground mb-3">Registre como você está se sentindo:</p>
              <div className="flex gap-2 mb-3">
                <Textarea value={newProgressNote} onChange={e => setNewProgressNote(e.target.value)} placeholder="Ex: Me sentindo mais disposto, roupas ficando mais largas..." className="text-xs min-h-[60px] flex-1" />
              </div>
              <Button size="sm" className="w-full" onClick={() => {
                if (newProgressNote.trim()) { setProgressNotes([{ date: today, text: newProgressNote.trim() }, ...progressNotes]); setNewProgressNote(""); }
              }}>Salvar registro 📸</Button>
              <div className="space-y-2 mt-4">
                {progressNotes.map((n, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold">{new Date(n.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <button onClick={() => setProgressNotes(progressNotes.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                    </div>
                    <p className="text-xs">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Saude;
