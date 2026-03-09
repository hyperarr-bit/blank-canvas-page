import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Heart, Dumbbell, Ruler, Sparkles,
  ChevronDown, ChevronUp, Check, Star, TrendingUp, Droplets,
  Timer, Utensils, Stethoscope, Clock, Play, Pause, RotateCcw,
  Trophy, Flame, Target, Zap, Activity
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
const mealColors: Record<string, string> = {
  "Café da Manhã": "bg-amber-100 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30",
  "Almoço": "bg-green-100 dark:bg-green-500/10 border-green-300 dark:border-green-500/30",
  "Lanche": "bg-blue-100 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30",
  "Janta": "bg-purple-100 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/30"
};

const presetMealPlan: Record<string, Record<string, string>> = {
  SEGUNDA: { "Café da Manhã": "Omelete de 3 claras + 1 ovo inteiro, com espinafre e tomate; 1 fatia de pão integral; café ou chá sem açúcar.", "Almoço": "Filé de frango grelhado (150g), arroz integral (1/2 xícara), brócolis no vapor e salada de folhas verdes com azeite e limão.", "Lanche": "1 iogurte natural + 1 colher de chia + 1 maçã.", "Janta": "Crepioca com 2 ovos, queijo e 100g de frango desfiado." },
  TERÇA: { "Café da Manhã": "Tapioca (2 colheres de goma) com queijo cottage e peito de peru; 1 banana com canela.", "Almoço": "Peixe assado (150g), batata-doce (100g), salada de rúcula, tomate, pepino com azeite.", "Lanche": "1 punhado de castanhas (30g) + 1 fruta.", "Janta": "Omelete de atum com cenoura ralada e orégano; salada de alface e abacate." },
  QUARTA: { "Café da Manhã": "Mingau de aveia (30g) com leite + 1 colher de pasta de amendoim + 1 iogurte natural.", "Almoço": "Carne vermelha magra (150g), quinoa (1/2 xícara), abobrinha e vagem refogadas.", "Lanche": "Shake de proteína com água ou leite vegetal e morangos.", "Janta": "Salada grande com mix de folhas, ovo cozido, grão-de-bico, cenoura e azeite." },
  QUINTA: { "Café da Manhã": "Pão integral com pasta de amendoim + banana fatiada; café sem açúcar.", "Almoço": "Frango ao curry com arroz integral e legumes salteados.", "Lanche": "Mix de oleaginosas + 1 fruta.", "Janta": "Sopa de legumes com frango desfiado." },
  SEXTA: { "Café da Manhã": "Ovos mexidos com tomate e manjericão; torrada integral.", "Almoço": "Salmão grelhado com purê de batata-doce e salada verde.", "Lanche": "Iogurte grego com granola e mel.", "Janta": "Wrap integral com frango, alface, tomate e molho de iogurte." },
  SÁBADO: { "Café da Manhã": "Panqueca de banana com aveia; café com leite.", "Almoço": "Livre — aproveite com equilíbrio 🍕", "Lanche": "Frutas da estação.", "Janta": "Salada Caesar com frango grelhado." },
  DOMINGO: { "Café da Manhã": "Açaí com granola e frutas (porção controlada).", "Almoço": "Churrasco em família — priorize carnes magras e saladas 🥗", "Lanche": "Chá + biscoito integral.", "Janta": "Caldo verde com torradinha." },
};

const exerciseColors: string[] = [
  "bg-blue-200 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300",
  "bg-green-200 dark:bg-green-500/20 text-green-800 dark:text-green-300",
  "bg-purple-200 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300",
  "bg-red-200 dark:bg-red-500/20 text-red-800 dark:text-red-300",
  "bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300",
  "bg-cyan-200 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300",
  "bg-pink-200 dark:bg-pink-500/20 text-pink-800 dark:text-pink-300",
];

const defaultWorkoutPlan: Record<string, { muscle: string; exercises: { name: string; sets: string; reps: string; carga: string; done: boolean }[] }> = {
  SEGUNDA: { muscle: "Quadríceps e Posterior", exercises: [
    { name: "Leg Press", sets: "4", reps: "10", carga: "200Kg", done: false },
    { name: "Extensora", sets: "4", reps: "10", carga: "10Kg", done: false },
    { name: "Passada", sets: "2", reps: "15", carga: "60Kg", done: false },
    { name: "Flexora", sets: "4", reps: "10", carga: "30Kg", done: false },
    { name: "Abdutora", sets: "4", reps: "10", carga: "30Kg", done: false },
  ]},
  TERÇA: { muscle: "Costas e Bíceps", exercises: [
    { name: "Puxada Frontal", sets: "4", reps: "10", carga: "30Kg", done: false },
    { name: "Remada Baixa", sets: "4", reps: "12", carga: "35Kg", done: false },
    { name: "Remada com Halter", sets: "4", reps: "12", carga: "10Kg", done: false },
    { name: "Rosca Direta", sets: "3", reps: "12", carga: "5Kg", done: false },
    { name: "Rosca Concentrada", sets: "3", reps: "12", carga: "5Kg", done: false },
  ]},
  QUARTA: { muscle: "Ombros e Tríceps", exercises: [
    { name: "Desenvolvimento", sets: "4", reps: "12", carga: "10Kg", done: false },
    { name: "Elevação lateral", sets: "3", reps: "15", carga: "5Kg", done: false },
    { name: "Elevação frontal", sets: "3", reps: "12", carga: "5Kg", done: false },
    { name: "Tríceps corda", sets: "3", reps: "15", carga: "15Kg", done: false },
    { name: "Tríceps francês", sets: "3", reps: "12", carga: "8Kg", done: false },
  ]},
  QUINTA: { muscle: "Glúteos", exercises: [
    { name: "Hip Thrust", sets: "4", reps: "12", carga: "80Kg", done: false },
    { name: "Agachamento Sumô", sets: "4", reps: "15", carga: "40Kg", done: false },
    { name: "Elevação pélvica", sets: "4", reps: "15", carga: "20Kg", done: false },
    { name: "Cadeira abdutora", sets: "3", reps: "15", carga: "30Kg", done: false },
    { name: "Stiff", sets: "3", reps: "12", carga: "30Kg", done: false },
  ]},
  SEXTA: { muscle: "Peito e Abdômen", exercises: [
    { name: "Supino reto", sets: "4", reps: "12", carga: "20Kg", done: false },
    { name: "Supino inclinado", sets: "3", reps: "12", carga: "15Kg", done: false },
    { name: "Crucifixo", sets: "3", reps: "15", carga: "8Kg", done: false },
    { name: "Abdominal infra", sets: "3", reps: "20", carga: "—", done: false },
    { name: "Prancha", sets: "3", reps: "45s", carga: "—", done: false },
  ]},
  SÁBADO: { muscle: "Cardio + Full Body", exercises: [
    { name: "Corrida / Bike", sets: "1", reps: "30min", carga: "—", done: false },
    { name: "Burpees", sets: "3", reps: "15", carga: "—", done: false },
  ]},
  DOMINGO: { muscle: "Descanso", exercises: [] },
};

const Saude = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // DIETA
  const [mealPlan, setMealPlan] = usePersistedState("saude-meals", presetMealPlan);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editMealValue, setEditMealValue] = useState("");
  const [expandedDay, setExpandedDay] = useState<string | null>("SEGUNDA");

  // TREINOS
  const [workoutPlan, setWorkoutPlan] = usePersistedState("saude-workouts-v2", defaultWorkoutPlan);
  const [newExName, setNewExName] = useState("");

  // MEDIDAS
  const [measurements, setMeasurements] = usePersistedState<{date: string; peso: string; cintura: string; quadril: string; braco: string; coxa: string; peitoral: string}[]>("saude-measures", []);
  const [newMeasure, setNewMeasure] = useState({ date: today, peso: "", cintura: "", quadril: "", braco: "", coxa: "", peitoral: "" });

  // ÁGUA & SONO & SUPLEMENTOS
  const [waterGoal] = usePersistedState("saude-water-goal", 8);
  const [waterToday, setWaterToday] = usePersistedState("saude-water-today", 0);
  const [waterDate, setWaterDate] = usePersistedState("saude-water-date", "");
  const [supplements, setSupplements] = usePersistedState<{name: string; time: string; taken: boolean}[]>("saude-supplements", [
    { name: "Whey Protein", time: "Pós-treino", taken: false }, { name: "Creatina", time: "Manhã", taken: false },
    { name: "Vitamina D", time: "Manhã", taken: false }, { name: "Ômega 3", time: "Almoço", taken: false },
  ]);
  const [newSuppName, setNewSuppName] = useState("");
  const [sleepHours, setSleepHours] = usePersistedState("saude-sleep", "7");

  // SKINCARE & BELEZA
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

  // CALORIAS & MACROS
  const [calorieGoal, setCalorieGoal] = usePersistedState("saude-cal-goal", 2000);
  const [dailyMeals, setDailyMeals] = usePersistedState<Record<string, {name: string; cal: number; prot: number; carb: number; fat: number}[]>>("saude-daily-meals", {});
  const todayMeals = dailyMeals[today] || [];
  const [newMealName, setNewMealName] = useState("");
  const [newMealCal, setNewMealCal] = useState("");
  const [newMealProt, setNewMealProt] = useState("");
  const [newMealCarb, setNewMealCarb] = useState("");
  const [newMealFat, setNewMealFat] = useState("");

  // REST TIMER
  const [restTime, setRestTime] = useState(60);
  const [restCountdown, setRestCountdown] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const restRef = useRef<NodeJS.Timeout | null>(null);

  // FASTING TIMER
  const [fastingGoal, setFastingGoal] = usePersistedState("saude-fast-goal", 16);
  const [fastingStart, setFastingStart] = usePersistedState<string | null>("saude-fast-start", null);
  const [fastingElapsed, setFastingElapsed] = useState(0);

  // RECIPES
  const [recipes, setRecipes] = usePersistedState<{id: string; name: string; ingredients: string; instructions: string; category: string}[]>("saude-recipes", []);
  const [newRecipeName, setNewRecipeName] = useState("");

  // CHECKUPS
  const [checkups, setCheckups] = usePersistedState<{id: string; name: string; lastDate: string; nextDate: string}[]>("saude-checkups", [
    { id: "1", name: "Dentista", lastDate: "", nextDate: "" },
    { id: "2", name: "Dermatologista", lastDate: "", nextDate: "" },
    { id: "3", name: "Exame de sangue", lastDate: "", nextDate: "" },
    { id: "4", name: "Oftalmologista", lastDate: "", nextDate: "" },
    { id: "5", name: "Ginecologista/Urologista", lastDate: "", nextDate: "" },
  ]);
  const [newCheckupName, setNewCheckupName] = useState("");

  // PROGRESS NOTES
  const [progressNotes, setProgressNotes] = usePersistedState<{date: string; text: string}[]>("saude-progress-notes", []);
  const [newProgressNote, setNewProgressNote] = useState("");

  // === NEW: PERSONAL RECORDS ===
  const [personalRecords, setPersonalRecords] = usePersistedState<{id: string; exercise: string; record: string; date: string}[]>("saude-prs", [
    { id: "1", exercise: "Leg Press", record: "200Kg", date: "" },
    { id: "2", exercise: "Supino Reto", record: "40Kg", date: "" },
    { id: "3", exercise: "Agachamento", record: "60Kg", date: "" },
  ]);
  const [newPRExercise, setNewPRExercise] = useState("");
  const [newPRRecord, setNewPRRecord] = useState("");

  // === NEW: WORKOUT STREAK ===
  const [workoutLog, setWorkoutLog] = usePersistedState<string[]>("saude-workout-log", []);
  const streak = (() => {
    if (workoutLog.length === 0) return 0;
    const sorted = [...workoutLog].sort((a, b) => b.localeCompare(a));
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split("T")[0];
      if (sorted.includes(dateStr)) { count++; d.setDate(d.getDate() - 1); }
      else if (i === 0) { d.setDate(d.getDate() - 1); continue; }
      else break;
    }
    return count;
  })();

  // === NEW: BMI CALCULATOR ===
  const [bmiHeight, setBmiHeight] = usePersistedState("saude-bmi-height", "");
  const [bmiWeight, setBmiWeight] = usePersistedState("saude-bmi-weight", "");
  const bmi = bmiHeight && bmiWeight ? (Number(bmiWeight) / Math.pow(Number(bmiHeight) / 100, 2)).toFixed(1) : null;
  const bmiCategory = bmi ? (Number(bmi) < 18.5 ? "Abaixo" : Number(bmi) < 25 ? "Normal ✅" : Number(bmi) < 30 ? "Sobrepeso" : "Obesidade") : "";
  const bmiColor = bmi ? (Number(bmi) < 18.5 ? "text-blue-500" : Number(bmi) < 25 ? "text-green-500" : Number(bmi) < 30 ? "text-yellow-500" : "text-red-500") : "";

  // === NEW: BODY GOALS ===
  const [bodyGoals, setBodyGoals] = usePersistedState<{id: string; goal: string; current: string; target: string}[]>("saude-body-goals", [
    { id: "1", goal: "Peso", current: "", target: "" },
    { id: "2", goal: "Cintura", current: "", target: "" },
    { id: "3", goal: "% Gordura", current: "", target: "" },
  ]);

  // === NEW: WORKOUT NOTES PER DAY ===
  const [workoutNotes, setWorkoutNotes] = usePersistedState<Record<string, string>>("saude-workout-notes", {});

  useEffect(() => { if (waterDate !== today) { setWaterToday(0); setWaterDate(today); } }, [today]);

  // Rest timer logic
  useEffect(() => {
    if (restRunning && restCountdown > 0) {
      restRef.current = setTimeout(() => setRestCountdown(prev => prev - 1), 1000);
    } else if (restCountdown === 0 && restRunning) { setRestRunning(false); }
    return () => { if (restRef.current) clearTimeout(restRef.current); };
  }, [restRunning, restCountdown]);

  // Fasting timer
  useEffect(() => {
    if (!fastingStart) { setFastingElapsed(0); return; }
    const interval = setInterval(() => {
      setFastingElapsed(Math.floor((Date.now() - new Date(fastingStart).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [fastingStart]);

  const startEditMeal = (day: string, meal: string) => { setEditingMeal(`${day}-${meal}`); setEditMealValue(mealPlan[day]?.[meal] || ""); };
  const saveMeal = (day: string, meal: string) => { setMealPlan({ ...mealPlan, [day]: { ...mealPlan[day], [meal]: editMealValue } }); setEditingMeal(null); };

  const formatTime = (secs: number) => { const h = Math.floor(secs / 3600); const m = Math.floor((secs % 3600) / 60); const s = secs % 60; return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`; };

  const totalCal = todayMeals.reduce((s, m) => s + m.cal, 0);
  const totalProt = todayMeals.reduce((s, m) => s + m.prot, 0);
  const totalCarb = todayMeals.reduce((s, m) => s + m.carb, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);

  const logWorkoutToday = () => {
    if (!workoutLog.includes(today)) setWorkoutLog([...workoutLog, today]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" /> SAÚDE EM ORDEM</h1>
            <p className="text-xs text-muted-foreground">Dieta, treinos, medidas, saúde e beleza</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-300 dark:border-orange-500/30">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{streak} dias</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="dieta" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            {[
              { v: "dieta", l: "DIETA" }, { v: "calorias", l: "CALORIAS" }, { v: "treinos", l: "PLANILHA DE TREINOS" },
              { v: "records", l: "RECORDES" }, { v: "medidas", l: "MEDIDAS" }, { v: "saude", l: "SAÚDE" },
              { v: "jejum", l: "JEJUM" }, { v: "receitas", l: "RECEITAS" }, { v: "checkups", l: "CHECK-UPS" },
              { v: "beleza", l: "BELEZA" }, { v: "metas", l: "METAS CORPO" }, { v: "progresso", l: "PROGRESSO" },
            ].map(t => <TabsTrigger key={t.v} value={t.v} className="text-xs px-3 py-1.5">{t.l}</TabsTrigger>)}
          </TabsList>

          {/* ========== DIETA ========== */}
          <TabsContent value="dieta" className="space-y-3">
            <p className="text-xs text-muted-foreground">Cardápio semanal completo — clique para editar:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weekDays.map(day => (
                <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className={`${dayColors[day]} text-white p-3 font-bold text-sm text-center`}>
                    {day}
                  </div>
                  <div className="p-3 space-y-3">
                    {meals.map(meal => {
                      const key = `${day}-${meal}`; const isEditing = editingMeal === key;
                      return (
                        <div key={meal} className={`rounded-lg p-2 border ${mealColors[meal]}`}>
                          <p className="text-xs font-bold mb-1">{meal} {mealEmojis[meal]}</p>
                          {isEditing ? (
                            <div className="flex gap-1">
                              <Textarea value={editMealValue} onChange={e => setEditMealValue(e.target.value)} className="text-[10px] min-h-[50px] flex-1 bg-white/50 dark:bg-background/50" />
                              <Button size="sm" className="h-7 self-end" onClick={() => saveMeal(day, meal)}><Check className="w-3 h-3" /></Button>
                            </div>
                          ) : (
                            <p className="text-[11px] leading-relaxed cursor-pointer hover:opacity-70" onClick={() => startEditMeal(day, meal)}>
                              {mealPlan[day]?.[meal] || <span className="italic text-muted-foreground">Clique para adicionar...</span>}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ========== CALORIAS & MACROS ========== */}
          <TabsContent value="calorias" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Utensils className="w-4 h-4" /> CALORIAS E MACROS — {new Date().toLocaleDateString("pt-BR")}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs">Meta diária:</span>
                <Input type="number" value={calorieGoal} onChange={e => setCalorieGoal(Number(e.target.value))} className="text-xs h-8 w-24" />
                <span className="text-xs text-muted-foreground">kcal</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-orange-50 dark:bg-orange-500/10 rounded-lg p-2 text-center border border-orange-200 dark:border-orange-500/30">
                  <p className="text-lg font-bold">{totalCal}</p><p className="text-[10px] text-muted-foreground">kcal</p>
                  <Progress value={Math.min((totalCal / calorieGoal) * 100, 100)} className="h-1 mt-1" />
                </div>
                <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-2 text-center border border-red-200 dark:border-red-500/30">
                  <p className="text-lg font-bold">{totalProt}g</p><p className="text-[10px] text-muted-foreground">Proteína</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-2 text-center border border-blue-200 dark:border-blue-500/30">
                  <p className="text-lg font-bold">{totalCarb}g</p><p className="text-[10px] text-muted-foreground">Carbo</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-2 text-center border border-yellow-200 dark:border-yellow-500/30">
                  <p className="text-lg font-bold">{totalFat}g</p><p className="text-[10px] text-muted-foreground">Gordura</p>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                <Input value={newMealName} onChange={e => setNewMealName(e.target.value)} placeholder="Refeição" className="text-xs h-8 flex-1" />
                <Input type="number" value={newMealCal} onChange={e => setNewMealCal(e.target.value)} placeholder="kcal" className="text-xs h-8 w-16" />
                <Input type="number" value={newMealProt} onChange={e => setNewMealProt(e.target.value)} placeholder="P" className="text-xs h-8 w-12" />
                <Input type="number" value={newMealCarb} onChange={e => setNewMealCarb(e.target.value)} placeholder="C" className="text-xs h-8 w-12" />
                <Input type="number" value={newMealFat} onChange={e => setNewMealFat(e.target.value)} placeholder="G" className="text-xs h-8 w-12" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newMealName.trim()) {
                    setDailyMeals({ ...dailyMeals, [today]: [...todayMeals, { name: newMealName.trim(), cal: Number(newMealCal) || 0, prot: Number(newMealProt) || 0, carb: Number(newMealCarb) || 0, fat: Number(newMealFat) || 0 }] });
                    setNewMealName(""); setNewMealCal(""); setNewMealProt(""); setNewMealCarb(""); setNewMealFat("");
                  }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              {todayMeals.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-1.5 text-xs mb-1 border border-border">
                  <span className="font-medium">{m.name}</span>
                  <div className="flex items-center gap-3">
                    <span>{m.cal}kcal</span><span className="text-red-500">{m.prot}P</span><span className="text-blue-500">{m.carb}C</span><span className="text-yellow-600">{m.fat}G</span>
                    <button onClick={() => setDailyMeals({ ...dailyMeals, [today]: todayMeals.filter((_, j) => j !== i) })}><X className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* BMI Calculator */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-500/10 dark:to-cyan-500/10 rounded-xl border border-teal-200 dark:border-teal-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-teal-500" /> CALCULADORA IMC</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1"><Input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} placeholder="Altura" className="text-xs h-8 w-20" /><span className="text-xs text-muted-foreground">cm</span></div>
                <div className="flex items-center gap-1"><Input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} placeholder="Peso" className="text-xs h-8 w-20" /><span className="text-xs text-muted-foreground">kg</span></div>
              </div>
              {bmi && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold">{bmi}</span>
                  <span className={`text-sm font-bold ${bmiColor}`}>{bmiCategory}</span>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ========== PLANILHA DE TREINOS (matching reference image) ========== */}
          <TabsContent value="treinos" className="space-y-4">
            {/* Rest Timer */}
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20 p-4">
              <h3 className="text-xs font-bold mb-2 flex items-center gap-2"><Timer className="w-4 h-4 text-blue-500" /> TIMER DE DESCANSO</h3>
              <div className="flex items-center gap-3">
                {[30, 45, 60, 90, 120].map(t => (
                  <button key={t} onClick={() => { setRestTime(t); setRestCountdown(t); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${restTime === t && !restRunning ? "bg-blue-500 text-white border-blue-500" : "border-border"}`}>{t}s</button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <p className="text-3xl font-bold font-mono">{restCountdown > 0 ? restCountdown : restTime}s</p>
                {!restRunning ? (
                  <Button size="sm" onClick={() => { setRestCountdown(restCountdown || restTime); setRestRunning(true); }}><Play className="w-3 h-3 mr-1" /> Iniciar</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setRestRunning(false)}><Pause className="w-3 h-3 mr-1" /> Pausar</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => { setRestRunning(false); setRestCountdown(restTime); }}><RotateCcw className="w-3 h-3" /></Button>
              </div>
            </div>

            {/* Log workout button */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Planilha de treinos — estilo academia profissional:</p>
              <Button size="sm" variant="outline" onClick={logWorkoutToday} className="text-xs gap-1">
                <Check className="w-3 h-3" /> Registrar treino hoje
              </Button>
            </div>

            {/* Workout grid - all days visible like the reference image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {weekDays.map(day => {
                const workout = workoutPlan[day]; if (!workout) return null;
                if (workout.exercises.length === 0) return (
                  <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className={`${dayColors[day]} text-white p-3 font-bold text-sm`}>{day}</div>
                    <div className="p-4 text-center"><p className="text-xs text-muted-foreground">Dia de descanso 😴</p></div>
                  </div>
                );
                return (
                  <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className={`${dayColors[day]} text-white p-3`}>
                      <p className="font-bold text-sm">{day}</p>
                      <p className="text-xs opacity-80">{workout.muscle}</p>
                    </div>
                    <div className="p-3">
                      {/* Table header */}
                      <div className="grid grid-cols-[20px_1fr_auto_28px] gap-2 text-[10px] font-bold text-muted-foreground uppercase border-b border-border pb-1 mb-2">
                        <span></span>
                        <span>Exercício</span>
                        <span className="text-center">Repetição e Carga</span>
                        <span className="text-center">Done</span>
                      </div>
                      {/* Exercises */}
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className={`grid grid-cols-[20px_1fr_auto_28px] gap-2 items-center py-1.5 ${i < workout.exercises.length - 1 ? "border-b border-border/30" : ""}`}>
                          <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${exerciseColors[i % exerciseColors.length]}`}>
                              {ex.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Input value={ex.sets} onChange={e => { const u = { ...workoutPlan }; u[day].exercises[i].sets = e.target.value; setWorkoutPlan({...u}); }}
                              className="text-xs h-6 w-8 text-center border-none bg-transparent p-0" />
                            <span className="text-muted-foreground text-xs">-</span>
                            <Input value={ex.reps} onChange={e => { const u = { ...workoutPlan }; u[day].exercises[i].reps = e.target.value; setWorkoutPlan({...u}); }}
                              className="text-xs h-6 w-8 text-center border-none bg-transparent p-0" />
                            <span className="text-muted-foreground text-xs">-</span>
                            <Input value={ex.carga} onChange={e => { const u = { ...workoutPlan }; u[day].exercises[i].carga = e.target.value; setWorkoutPlan({...u}); }}
                              className="text-xs h-6 w-16 text-center border-none bg-transparent p-0 font-medium" />
                          </div>
                          <button onClick={() => {
                            const u = { ...workoutPlan }; u[day].exercises[i].done = !ex.done; setWorkoutPlan({...u});
                          }} className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto ${ex.done ? "bg-blue-500 border-blue-500" : "border-blue-300"}`}>
                            {ex.done && <Check className="w-3 h-3 text-white" />}
                          </button>
                        </div>
                      ))}
                      {/* Add new exercise */}
                      <div className="flex gap-1 mt-2 pt-2 border-t border-border/30">
                        <Input value={newExName} onChange={e => setNewExName(e.target.value)} placeholder="+ Novo exercício..." className="text-xs h-6 flex-1 bg-transparent" />
                        <Button size="sm" className="h-6 px-2" onClick={() => {
                          if (newExName.trim()) { const u = { ...workoutPlan }; u[day].exercises.push({ name: newExName.trim(), sets: "3", reps: "12", carga: "—", done: false }); setWorkoutPlan({...u}); setNewExName(""); }
                        }}><Plus className="w-3 h-3" /></Button>
                      </div>
                      {/* Workout notes */}
                      <div className="mt-2 pt-2 border-t border-border/30">
                        <Input value={workoutNotes[day] || ""} onChange={e => setWorkoutNotes({ ...workoutNotes, [day]: e.target.value })}
                          placeholder="Observações do dia..." className="text-[10px] h-6 bg-muted/20 border-none" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ========== RECORDES PESSOAIS ========== */}
          <TabsContent value="records" className="space-y-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> MEUS RECORDES PESSOAIS (PRs)</h3>
              <p className="text-xs text-muted-foreground mb-3">Registre seus maiores pesos e conquistas 💪</p>
              {personalRecords.map((pr, i) => (
                <div key={pr.id} className="flex items-center gap-3 bg-white/50 dark:bg-background/30 rounded-lg p-3 border border-yellow-200/50 dark:border-yellow-500/20 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />
                  <div className="flex-1">
                    <Input value={pr.exercise} onChange={e => { const u = [...personalRecords]; u[i] = { ...pr, exercise: e.target.value }; setPersonalRecords(u); }}
                      className="text-xs h-6 font-bold border-none bg-transparent p-0" />
                  </div>
                  <Input value={pr.record} onChange={e => { const u = [...personalRecords]; u[i] = { ...pr, record: e.target.value }; setPersonalRecords(u); }}
                    className="text-xs h-6 w-24 text-center font-bold border-none bg-transparent p-0 text-yellow-700 dark:text-yellow-300" />
                  <Input type="date" value={pr.date} onChange={e => { const u = [...personalRecords]; u[i] = { ...pr, date: e.target.value }; setPersonalRecords(u); }}
                    className="text-[10px] h-6 w-28 border-none bg-transparent p-0" />
                  <button onClick={() => setPersonalRecords(personalRecords.filter(x => x.id !== pr.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <Input value={newPRExercise} onChange={e => setNewPRExercise(e.target.value)} placeholder="Exercício" className="text-xs h-8 flex-1" />
                <Input value={newPRRecord} onChange={e => setNewPRRecord(e.target.value)} placeholder="Recorde" className="text-xs h-8 w-24" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newPRExercise.trim()) { setPersonalRecords([...personalRecords, { id: Date.now().toString(), exercise: newPRExercise.trim(), record: newPRRecord, date: today }]); setNewPRExercise(""); setNewPRRecord(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>

            {/* Workout History */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> HISTÓRICO DE TREINOS — {streak} dias de sequência 🔥</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {Array.from({ length: 30 }, (_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (29 - i));
                  const dateStr = d.toISOString().split("T")[0];
                  const trained = workoutLog.includes(dateStr);
                  return (
                    <div key={i} title={d.toLocaleDateString("pt-BR")}
                      className={`w-5 h-5 rounded-sm ${trained ? "bg-green-400" : "bg-muted/30"} border border-border/30`} />
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground">Últimos 30 dias — verde = treinou</p>
            </div>
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

          {/* ========== SAÚDE ========== */}
          <TabsContent value="saude" className="space-y-4">
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
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/30 p-4">
              <h3 className="text-xs font-bold mb-3">😴 SONO</h3>
              <div className="flex items-center gap-3">
                <Input type="number" value={sleepHours} onChange={e => setSleepHours(e.target.value)} className="text-xs h-8 w-20" min="0" max="14" step="0.5" />
                <span className="text-xs text-muted-foreground">horas</span>
                <span className={`text-xs font-bold ${Number(sleepHours) >= 7 ? "text-green-500" : Number(sleepHours) >= 5 ? "text-yellow-500" : "text-red-500"}`}>
                  {Number(sleepHours) >= 7 ? "✅ Ótimo" : Number(sleepHours) >= 5 ? "⚠️ Regular" : "❌ Pouco"}
                </span>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">💊 SUPLEMENTOS</h3>
              {supplements.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg p-2 border border-border mb-1">
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
          </TabsContent>

          {/* ========== JEJUM INTERMITENTE ========== */}
          <TabsContent value="jejum" className="space-y-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 rounded-xl border border-orange-200 dark:border-orange-500/30 p-4 text-center">
              <h3 className="text-xs font-bold mb-3 flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> JEJUM INTERMITENTE</h3>
              <div className="flex justify-center gap-2 mb-4">
                {[16, 18, 20, 24].map(h => (
                  <button key={h} onClick={() => setFastingGoal(h)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${fastingGoal === h ? "bg-orange-500 text-white border-orange-500" : "border-border"}`}>
                    {h}:{24 - h}
                  </button>
                ))}
              </div>
              <div className="w-40 h-40 mx-auto rounded-full border-8 border-orange-200 dark:border-orange-500/30 flex items-center justify-center mb-4 relative">
                {fastingStart && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="72" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray={`${Math.min((fastingElapsed / (fastingGoal * 3600)) * 452, 452)} 452`} strokeLinecap="round" />
                  </svg>
                )}
                <div className="text-center z-10">
                  <p className="text-2xl font-bold font-mono">{formatTime(fastingStart ? fastingElapsed : 0)}</p>
                  <p className="text-xs text-muted-foreground">de {fastingGoal}h</p>
                </div>
              </div>
              {!fastingStart ? (
                <Button onClick={() => setFastingStart(new Date().toISOString())} className="bg-orange-500 hover:bg-orange-600 text-white">Iniciar jejum 🍽️</Button>
              ) : (
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setFastingStart(null)}>Cancelar</Button>
                  {fastingElapsed >= fastingGoal * 3600 && <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setFastingStart(null)}>Jejum completo! ✅</Button>}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">Meta: {fastingGoal}h jejum / {24 - fastingGoal}h alimentação</p>
            </div>
          </TabsContent>

          {/* ========== RECEITAS ========== */}
          <TabsContent value="receitas" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Utensils className="w-4 h-4" /> MINHAS RECEITAS SAUDÁVEIS</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newRecipeName} onChange={e => setNewRecipeName(e.target.value)} placeholder="Nome da receita" className="text-xs h-8 flex-1" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newRecipeName.trim()) { setRecipes([...recipes, { id: Date.now().toString(), name: newRecipeName.trim(), ingredients: "", instructions: "", category: "Almoço" }]); setNewRecipeName(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              {recipes.map((r, i) => (
                <div key={r.id} className="bg-muted/30 rounded-lg p-3 border border-border mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{r.name}</p>
                    <button onClick={() => setRecipes(recipes.filter(x => x.id !== r.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                  <Textarea value={r.ingredients} onChange={e => { const u = [...recipes]; u[i] = { ...r, ingredients: e.target.value }; setRecipes(u); }} placeholder="Ingredientes..." className="text-xs min-h-[40px] mb-2" />
                  <Textarea value={r.instructions} onChange={e => { const u = [...recipes]; u[i] = { ...r, instructions: e.target.value }; setRecipes(u); }} placeholder="Modo de preparo..." className="text-xs min-h-[40px]" />
                </div>
              ))}
              {recipes.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Salve suas receitas favoritas aqui 🥗</p>}
            </div>
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

          {/* ========== BELEZA ========== */}
          <TabsContent value="beleza" className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-xl border border-amber-200 dark:border-amber-500/30 p-4">
              <h3 className="text-xs font-bold mb-3">🌅 SKINCARE MANHÃ</h3>
              {skincareMorning.map((s, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <button onClick={() => { const u = [...skincareMorning]; u[i] = { ...s, done: !s.done }; setSkincareMorning(u); }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${s.done ? "bg-amber-500 border-amber-500" : "border-amber-300"}`}>
                    {s.done && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-xs ${s.done ? "line-through text-muted-foreground" : ""}`}>{i + 1}. {s.step}</span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/30 p-4">
              <h3 className="text-xs font-bold mb-3">🌙 SKINCARE NOITE</h3>
              {skincareNight.map((s, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <button onClick={() => { const u = [...skincareNight]; u[i] = { ...s, done: !s.done }; setSkincareNight(u); }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${s.done ? "bg-indigo-500 border-indigo-500" : "border-indigo-300"}`}>
                    {s.done && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-xs ${s.done ? "line-through text-muted-foreground" : ""}`}>{i + 1}. {s.step}</span>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">💇 CABELO</h3>
              {hairCare.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-1.5 text-xs border border-border mb-1">
                  <span>{item}</span><button onClick={() => setHairCare(hairCare.filter((_, j) => j !== i))}><X className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input value={newHair} onChange={e => setNewHair(e.target.value)} placeholder="Novo cuidado..." className="text-xs h-8" />
                <Button size="sm" className="h-8" onClick={() => { if (newHair.trim()) { setHairCare([...hairCare, newHair.trim()]); setNewHair(""); }}}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">📝 NOTAS DE BELEZA</h3>
              <Textarea value={beautyNotes} onChange={e => setBeautyNotes(e.target.value)} placeholder="Produtos, procedimentos, lembretes..." className="text-xs min-h-[80px]" />
            </div>
          </TabsContent>

          {/* ========== METAS DO CORPO ========== */}
          <TabsContent value="metas" className="space-y-4">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/10 dark:to-pink-500/10 rounded-xl border border-rose-200 dark:border-rose-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-rose-500" /> METAS DO CORPO</h3>
              <p className="text-xs text-muted-foreground mb-3">Defina onde você está e onde quer chegar:</p>
              {bodyGoals.map((g, i) => (
                <div key={g.id} className="grid grid-cols-[1fr_80px_80px_24px] gap-2 items-center mb-2">
                  <Input value={g.goal} onChange={e => { const u = [...bodyGoals]; u[i] = { ...g, goal: e.target.value }; setBodyGoals(u); }}
                    className="text-xs h-8 font-medium" />
                  <div className="relative">
                    <Input value={g.current} onChange={e => { const u = [...bodyGoals]; u[i] = { ...g, current: e.target.value }; setBodyGoals(u); }}
                      placeholder="Atual" className="text-xs h-8" />
                  </div>
                  <div className="relative">
                    <Input value={g.target} onChange={e => { const u = [...bodyGoals]; u[i] = { ...g, target: e.target.value }; setBodyGoals(u); }}
                      placeholder="Meta" className="text-xs h-8" />
                  </div>
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
              <p className="text-xs text-muted-foreground mb-3">Registre como você está se sentindo no corpo e na saúde:</p>
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
