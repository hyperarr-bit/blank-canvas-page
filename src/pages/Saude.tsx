import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Heart, Apple, Dumbbell, Ruler, Sparkles,
  ChevronDown, ChevronUp, Edit3, Check, Star, TrendingUp, Droplets
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

const weekDays = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
const dayColors: Record<string, string> = {
  SEGUNDA: "bg-blue-500", TERÇA: "bg-indigo-500", QUARTA: "bg-green-500",
  QUINTA: "bg-yellow-500", SEXTA: "bg-pink-500", SÁBADO: "bg-purple-500", DOMINGO: "bg-violet-500"
};
const meals = ["Café da Manhã", "Almoço", "Lanche", "Janta"];
const mealEmojis: Record<string, string> = { "Café da Manhã": "🌅", "Almoço": "🍽️", "Lanche": "🍎", "Janta": "🌙" };

const defaultMealPlan: Record<string, Record<string, string>> = {};
weekDays.forEach(d => { defaultMealPlan[d] = {}; meals.forEach(m => { defaultMealPlan[d][m] = ""; }); });

// Preset meal plan
const presetMealPlan: Record<string, Record<string, string>> = {
  SEGUNDA: { "Café da Manhã": "Omelete de 3 claras + 1 ovo inteiro, com espinafre e tomate; 1 fatia de pão integral; café ou chá sem açúcar.", "Almoço": "Filé de frango grelhado (150g), arroz integral (1/2 xícara), brócolis no vapor e salada de folhas verdes com azeite e limão.", "Lanche": "1 iogurte natural + 1 colher de chia + 1 maçã.", "Janta": "Crepioca com 2 ovos, queijo e 100g de frango desfiado." },
  TERÇA: { "Café da Manhã": "Tapioca (2 colheres de goma) com queijo cottage e peito de peru; 1 banana com canela.", "Almoço": "Peixe assado (150g), batata-doce (100g), salada de rúcula, tomate, pepino com azeite.", "Lanche": "1 punhado de castanhas (30g) + 1 fruta (como pera ou kiwi).", "Janta": "Omelete de atum (em água) com cenoura ralada e orégano; salada de alface e abacate." },
  QUARTA: { "Café da Manhã": "Mingau de aveia (30g de aveia com leite desnatado ou vegetal) + 1 colher de pasta de amendoim + 1 iogurte natural.", "Almoço": "Carne vermelha magra (150g), quinoa (1/2 xícara), abobrinha e vagem refogadas.", "Lanche": "Shake de proteína (whey) com água ou leite vegetal e morangos.", "Janta": "Salada grande com mix de folhas, ovo cozido, grão-de-bico, cenoura e azeite." },
  QUINTA: { "Café da Manhã": "Pão integral com pasta de amendoim + banana fatiada; café sem açúcar.", "Almoço": "Frango ao curry com arroz integral e legumes salteados.", "Lanche": "Mix de oleaginosas + 1 fruta.", "Janta": "Sopa de legumes com frango desfiado." },
  SEXTA: { "Café da Manhã": "Ovos mexidos com tomate e manjericão; torrada integral.", "Almoço": "Salmão grelhado com purê de batata-doce e salada verde.", "Lanche": "Iogurte grego com granola e mel.", "Janta": "Wrap integral com frango, alface, tomate e molho de iogurte." },
  SÁBADO: { "Café da Manhã": "Panqueca de banana com aveia; café com leite.", "Almoço": "Livre — aproveite com equilíbrio 🍕", "Lanche": "Frutas da estação.", "Janta": "Salada Caesar com frango grelhado." },
  DOMINGO: { "Café da Manhã": "Açaí com granola e frutas (porção controlada).", "Almoço": "Churrasco em família — priorize carnes magras e saladas 🥗", "Lanche": "Chá + biscoito integral.", "Janta": "Caldo verde com torradinha." },
};

const muscleGroups = ["Peito", "Costas", "Ombro", "Bíceps", "Tríceps", "Perna", "Glúteo", "Abdômen", "Cardio"];

const defaultWorkoutPlan: Record<string, { muscle: string; exercises: { name: string; sets: string; reps: string }[] }> = {
  SEGUNDA: { muscle: "Peito + Tríceps", exercises: [
    { name: "Supino reto", sets: "4", reps: "12" }, { name: "Supino inclinado", sets: "3", reps: "12" },
    { name: "Crucifixo", sets: "3", reps: "15" }, { name: "Tríceps corda", sets: "3", reps: "15" }, { name: "Tríceps francês", sets: "3", reps: "12" }
  ]},
  TERÇA: { muscle: "Costas + Bíceps", exercises: [
    { name: "Puxada frontal", sets: "4", reps: "12" }, { name: "Remada curvada", sets: "3", reps: "12" },
    { name: "Remada unilateral", sets: "3", reps: "12" }, { name: "Rosca direta", sets: "3", reps: "12" }, { name: "Rosca martelo", sets: "3", reps: "12" }
  ]},
  QUARTA: { muscle: "Perna + Glúteo", exercises: [
    { name: "Agachamento", sets: "4", reps: "12" }, { name: "Leg press", sets: "4", reps: "15" },
    { name: "Cadeira extensora", sets: "3", reps: "15" }, { name: "Stiff", sets: "3", reps: "12" }, { name: "Elevação pélvica", sets: "4", reps: "15" }
  ]},
  QUINTA: { muscle: "Ombro + Abdômen", exercises: [
    { name: "Desenvolvimento", sets: "4", reps: "12" }, { name: "Elevação lateral", sets: "3", reps: "15" },
    { name: "Elevação frontal", sets: "3", reps: "12" }, { name: "Abdominal infra", sets: "3", reps: "20" }, { name: "Prancha", sets: "3", reps: "45s" }
  ]},
  SEXTA: { muscle: "Cardio + Full Body", exercises: [
    { name: "Corrida / Bike", sets: "1", reps: "30min" }, { name: "Burpees", sets: "3", reps: "15" },
    { name: "Jumping jacks", sets: "3", reps: "30" }, { name: "Mountain climber", sets: "3", reps: "20" }
  ]},
  SÁBADO: { muscle: "Descanso ativo", exercises: [{ name: "Caminhada / Yoga / Alongamento", sets: "1", reps: "40min" }] },
  DOMINGO: { muscle: "Descanso", exercises: [] },
};

const Saude = () => {
  const navigate = useNavigate();

  // DIETA
  const [mealPlan, setMealPlan] = usePersistedState<Record<string, Record<string, string>>>("saude-meals", presetMealPlan);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editMealValue, setEditMealValue] = useState("");
  const [expandedDay, setExpandedDay] = useState<string | null>("SEGUNDA");

  // TREINOS
  const [workoutPlan, setWorkoutPlan] = usePersistedState("saude-workouts", defaultWorkoutPlan);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>("SEGUNDA");
  const [newExName, setNewExName] = useState("");

  // MEDIDAS
  const [measurements, setMeasurements] = usePersistedState<{date: string; peso: string; cintura: string; quadril: string; braco: string; coxa: string; peitoral: string}[]>("saude-measures", []);
  const [newMeasure, setNewMeasure] = useState({ date: new Date().toISOString().split("T")[0], peso: "", cintura: "", quadril: "", braco: "", coxa: "", peitoral: "" });

  // SAÚDE
  const [waterGoal, setWaterGoal] = usePersistedState("saude-water-goal", 8);
  const [waterToday, setWaterToday] = usePersistedState("saude-water-today", 0);
  const [waterDate, setWaterDate] = usePersistedState("saude-water-date", "");
  const [supplements, setSupplements] = usePersistedState<{name: string; time: string; taken: boolean}[]>("saude-supplements", [
    { name: "Whey Protein", time: "Pós-treino", taken: false },
    { name: "Creatina", time: "Manhã", taken: false },
    { name: "Vitamina D", time: "Manhã", taken: false },
    { name: "Ômega 3", time: "Almoço", taken: false },
  ]);
  const [newSuppName, setNewSuppName] = useState("");
  const [sleepHours, setSleepHours] = usePersistedState("saude-sleep", "7");

  // BELEZA
  const [skincareMorning, setSkincareMorning] = usePersistedState<{step: string; done: boolean}[]>("saude-skincare-am", [
    { step: "Lavar o rosto", done: false }, { step: "Tônico", done: false },
    { step: "Sérum vitamina C", done: false }, { step: "Hidratante", done: false }, { step: "Protetor solar", done: false },
  ]);
  const [skincareNight, setSkincareNight] = usePersistedState<{step: string; done: boolean}[]>("saude-skincare-pm", [
    { step: "Demaquilante / Óleo", done: false }, { step: "Sabonete facial", done: false },
    { step: "Tônico", done: false }, { step: "Sérum retinol/ácido", done: false }, { step: "Hidratante noturno", done: false },
  ]);
  const [beautyNotes, setBeautyNotes] = usePersistedState("saude-beauty-notes", "");
  const [hairCare, setHairCare] = usePersistedState<string[]>("saude-hair", ["Cronograma capilar", "Hidratação semanal", "Corte a cada 3 meses"]);
  const [newHair, setNewHair] = useState("");

  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (waterDate !== today) { setWaterToday(0); setWaterDate(today); }
  }, [today]);

  const startEditMeal = (day: string, meal: string) => {
    setEditingMeal(`${day}-${meal}`);
    setEditMealValue(mealPlan[day]?.[meal] || "");
  };

  const saveMeal = (day: string, meal: string) => {
    setMealPlan({ ...mealPlan, [day]: { ...mealPlan[day], [meal]: editMealValue } });
    setEditingMeal(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" /> SAÚDE EM ORDEM
            </h1>
            <p className="text-xs text-muted-foreground">Dieta, treinos, medidas, saúde e beleza</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="dieta" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            {[
              { v: "dieta", l: "DIETA" }, { v: "treinos", l: "TREINOS" },
              { v: "medidas", l: "MEDIDAS" }, { v: "saude", l: "SAÚDE" }, { v: "beleza", l: "BELEZA" },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} className="text-xs px-3 py-1.5">{t.l}</TabsTrigger>
            ))}
          </TabsList>

          {/* ========== DIETA ========== */}
          <TabsContent value="dieta" className="space-y-3">
            <p className="text-xs text-muted-foreground">Clique no dia para ver/editar as refeições. Toque no texto para editar.</p>
            {weekDays.map(day => (
              <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                <button onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                  className={`w-full flex items-center justify-between p-3 ${dayColors[day]} text-white font-bold text-sm`}>
                  <span>{day}</span>
                  {expandedDay === day ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedDay === day && (
                  <div className="p-3 space-y-3">
                    {meals.map(meal => {
                      const key = `${day}-${meal}`;
                      const isEditing = editingMeal === key;
                      return (
                        <div key={meal} className="border-l-4 border-primary/20 pl-3">
                          <p className="text-xs font-bold mb-1">{meal} {mealEmojis[meal]}</p>
                          {isEditing ? (
                            <div className="flex gap-2">
                              <Textarea value={editMealValue} onChange={e => setEditMealValue(e.target.value)} className="text-xs min-h-[60px] flex-1" />
                              <Button size="sm" className="h-8 self-end" onClick={() => saveMeal(day, meal)}><Check className="w-3 h-3" /></Button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground cursor-pointer hover:bg-muted/50 rounded p-1 -m-1"
                              onClick={() => startEditMeal(day, meal)}>
                              {mealPlan[day]?.[meal] || <span className="italic">Clique para adicionar...</span>}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          {/* ========== TREINOS ========== */}
          <TabsContent value="treinos" className="space-y-3">
            <p className="text-xs text-muted-foreground">Planilha de treinos semanal. Clique para expandir e editar.</p>
            {weekDays.map(day => {
              const workout = workoutPlan[day];
              if (!workout) return null;
              return (
                <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button onClick={() => setExpandedWorkout(expandedWorkout === day ? null : day)}
                    className={`w-full flex items-center justify-between p-3 ${dayColors[day]} text-white font-bold text-sm`}>
                    <span>{day} — {workout.muscle}</span>
                    {expandedWorkout === day ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedWorkout === day && (
                    <div className="p-3">
                      {workout.exercises.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">Dia de descanso 😴</p>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-[1fr_50px_50px] gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                            <span>Exercício</span><span className="text-center">Séries</span><span className="text-center">Reps</span>
                          </div>
                          {workout.exercises.map((ex, i) => (
                            <div key={i} className="grid grid-cols-[1fr_50px_50px] gap-2 items-center bg-muted/30 rounded-md p-2">
                              <Input value={ex.name} onChange={e => {
                                const updated = { ...workoutPlan }; updated[day].exercises[i].name = e.target.value; setWorkoutPlan(updated);
                              }} className="text-xs h-7 border-none bg-transparent p-0" />
                              <Input value={ex.sets} onChange={e => {
                                const updated = { ...workoutPlan }; updated[day].exercises[i].sets = e.target.value; setWorkoutPlan(updated);
                              }} className="text-xs h-7 text-center border-none bg-transparent p-0" />
                              <Input value={ex.reps} onChange={e => {
                                const updated = { ...workoutPlan }; updated[day].exercises[i].reps = e.target.value; setWorkoutPlan(updated);
                              }} className="text-xs h-7 text-center border-none bg-transparent p-0" />
                            </div>
                          ))}
                          <div className="flex gap-2 mt-2">
                            <Input value={newExName} onChange={e => setNewExName(e.target.value)} placeholder="Novo exercício..." className="text-xs h-7 flex-1" />
                            <Button size="sm" className="h-7 px-2" onClick={() => {
                              if (newExName.trim()) {
                                const updated = { ...workoutPlan };
                                updated[day].exercises.push({ name: newExName.trim(), sets: "3", reps: "12" });
                                setWorkoutPlan(updated); setNewExName("");
                              }
                            }}><Plus className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          {/* ========== MEDIDAS ========== */}
          <TabsContent value="medidas" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Ruler className="w-4 h-4" /> REGISTRO DE MEDIDAS</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <Input type="date" value={newMeasure.date} onChange={e => setNewMeasure({ ...newMeasure, date: e.target.value })} className="text-xs h-8 col-span-2 sm:col-span-4" />
                {(["peso", "cintura", "quadril", "braco", "coxa", "peitoral"] as const).map(field => (
                  <div key={field} className="relative">
                    <Input value={newMeasure[field]} onChange={e => setNewMeasure({ ...newMeasure, [field]: e.target.value })}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="text-xs h-8 pr-8" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{field === "peso" ? "kg" : "cm"}</span>
                  </div>
                ))}
              </div>
              <Button size="sm" className="w-full" onClick={() => {
                if (newMeasure.peso || newMeasure.cintura) {
                  setMeasurements([...measurements, { ...newMeasure }]);
                  setNewMeasure({ date: new Date().toISOString().split("T")[0], peso: "", cintura: "", quadril: "", braco: "", coxa: "", peitoral: "" });
                }
              }}>Salvar medidas</Button>
            </div>

            {measurements.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-xs font-bold mb-3">📊 HISTÓRICO</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">Data</th>
                        <th className="text-center p-2">Peso</th>
                        <th className="text-center p-2">Cintura</th>
                        <th className="text-center p-2">Quadril</th>
                        <th className="text-center p-2">Braço</th>
                        <th className="text-center p-2">Coxa</th>
                        <th className="text-center p-2">Peito</th>
                        <th className="p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.sort((a, b) => b.date.localeCompare(a.date)).map((m, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="p-2 font-medium">{new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR")}</td>
                          <td className="text-center p-2">{m.peso || "—"}</td>
                          <td className="text-center p-2">{m.cintura || "—"}</td>
                          <td className="text-center p-2">{m.quadril || "—"}</td>
                          <td className="text-center p-2">{m.braco || "—"}</td>
                          <td className="text-center p-2">{m.coxa || "—"}</td>
                          <td className="text-center p-2">{m.peitoral || "—"}</td>
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
                <h3 className="text-xs font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> EVOLUÇÃO</h3>
                <p className="text-xs text-muted-foreground">
                  Peso: {measurements[measurements.length - 1].peso || "?"} kg → {measurements[0].peso || "?"} kg
                  ({Number(measurements[0].peso) - Number(measurements[measurements.length - 1].peso) > 0 ? "+" : ""}
                  {(Number(measurements[0].peso) - Number(measurements[measurements.length - 1].peso)).toFixed(1)} kg)
                </p>
              </div>
            )}
          </TabsContent>

          {/* ========== SAÚDE ========== */}
          <TabsContent value="saude" className="space-y-4">
            {/* Água */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /> ÁGUA HOJE</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: waterGoal }, (_, i) => (
                    <button key={i} onClick={() => setWaterToday(i < waterToday ? i : i + 1)}
                      className={`w-8 h-10 rounded-lg border-2 transition-all ${i < waterToday ? "bg-blue-400 border-blue-500 text-white" : "border-blue-200 dark:border-blue-500/30 text-blue-300"}`}>
                      <Droplets className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
                </div>
                <span className="text-lg font-bold">{waterToday}/{waterGoal}</span>
              </div>
              <Progress value={(waterToday / waterGoal) * 100} className="h-2" />
            </div>

            {/* Sono */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/30 p-4">
              <h3 className="text-xs font-bold mb-3">😴 SONO DE ONTEM</h3>
              <div className="flex items-center gap-3">
                <Input type="number" value={sleepHours} onChange={e => setSleepHours(e.target.value)} className="text-xs h-8 w-20" min="0" max="14" step="0.5" />
                <span className="text-xs text-muted-foreground">horas</span>
                <span className={`text-xs font-bold ${Number(sleepHours) >= 7 ? "text-green-500" : Number(sleepHours) >= 5 ? "text-yellow-500" : "text-red-500"}`}>
                  {Number(sleepHours) >= 7 ? "✅ Ótimo" : Number(sleepHours) >= 5 ? "⚠️ Regular" : "❌ Pouco"}
                </span>
              </div>
            </div>

            {/* Suplementos */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">💊 SUPLEMENTOS DO DIA</h3>
              <div className="space-y-2">
                {supplements.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg p-2 border border-border">
                    <button onClick={() => {
                      const updated = [...supplements]; updated[i] = { ...s, taken: !s.taken }; setSupplements(updated);
                    }} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${s.taken ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
                      {s.taken && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${s.taken ? "line-through text-muted-foreground" : ""}`}>{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.time}</p>
                    </div>
                    <button onClick={() => setSupplements(supplements.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input value={newSuppName} onChange={e => setNewSuppName(e.target.value)} placeholder="Novo suplemento..." className="text-xs h-8" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newSuppName.trim()) { setSupplements([...supplements, { name: newSuppName.trim(), time: "Manhã", taken: false }]); setNewSuppName(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          </TabsContent>

          {/* ========== BELEZA ========== */}
          <TabsContent value="beleza" className="space-y-4">
            {/* Skincare Manhã */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-xl border border-amber-200 dark:border-amber-500/30 p-4">
              <h3 className="text-xs font-bold mb-3">🌅 SKINCARE MANHÃ</h3>
              <div className="space-y-2">
                {skincareMorning.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button onClick={() => {
                      const updated = [...skincareMorning]; updated[i] = { ...s, done: !s.done }; setSkincareMorning(updated);
                    }} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${s.done ? "bg-amber-500 border-amber-500" : "border-amber-300"}`}>
                      {s.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-xs ${s.done ? "line-through text-muted-foreground" : ""}`}>{i + 1}. {s.step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skincare Noite */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/30 p-4">
              <h3 className="text-xs font-bold mb-3">🌙 SKINCARE NOITE</h3>
              <div className="space-y-2">
                {skincareNight.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button onClick={() => {
                      const updated = [...skincareNight]; updated[i] = { ...s, done: !s.done }; setSkincareNight(updated);
                    }} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${s.done ? "bg-indigo-500 border-indigo-500" : "border-indigo-300"}`}>
                      {s.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-xs ${s.done ? "line-through text-muted-foreground" : ""}`}>{i + 1}. {s.step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cabelo */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">💇 CUIDADOS COM O CABELO</h3>
              <div className="space-y-1 mb-2">
                {hairCare.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-1.5 text-xs border border-border">
                    <span>{item}</span>
                    <button onClick={() => setHairCare(hairCare.filter((_, j) => j !== i))}><X className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newHair} onChange={e => setNewHair(e.target.value)} placeholder="Novo cuidado..." className="text-xs h-8" />
                <Button size="sm" className="h-8" onClick={() => { if (newHair.trim()) { setHairCare([...hairCare, newHair.trim()]); setNewHair(""); } }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>

            {/* Notas de Beleza */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">📝 NOTAS DE BELEZA</h3>
              <Textarea value={beautyNotes} onChange={e => setBeautyNotes(e.target.value)}
                placeholder="Produtos que gostei, próximos procedimentos, lembretes..." className="text-xs min-h-[80px]" />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Saude;
