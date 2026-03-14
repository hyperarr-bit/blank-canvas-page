import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Check, Timer, Play, Pause, RotateCcw,
  Trophy, Flame, Dumbbell, TrendingUp, Target, Zap, BarChart3, Calendar,
  Award, Star, Clock, Volume2, VolumeX, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  SEGUNDA: { muscle: "", exercises: [] },
  TERÇA: { muscle: "", exercises: [] },
  QUARTA: { muscle: "", exercises: [] },
  QUINTA: { muscle: "", exercises: [] },
  SEXTA: { muscle: "", exercises: [] },
  SÁBADO: { muscle: "", exercises: [] },
  DOMINGO: { muscle: "Descanso", exercises: [] },
};

const muscleGroupIcons: Record<string, string> = {
  "Quadríceps e Posterior": "🦵", "Costas e Bíceps": "💪", "Ombros e Tríceps": "🏋️",
  "Glúteos": "🍑", "Peito e Abdômen": "🫁", "Cardio + Full Body": "🏃", "Descanso": "😴"
};

const Treino = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const todayDayName = weekDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const [workoutPlan, setWorkoutPlan] = usePersistedState("saude-workouts-v2", defaultWorkoutPlan);
  const [newExName, setNewExName] = useState("");
  const [workoutLog, setWorkoutLog] = usePersistedState<string[]>("saude-workout-log", []);
  const [workoutNotes, setWorkoutNotes] = usePersistedState<Record<string, string>>("saude-workout-notes", {});
  const [personalRecords, setPersonalRecords] = usePersistedState<{id: string; exercise: string; record: string; date: string}[]>("saude-prs", []);
  const [newPRExercise, setNewPRExercise] = useState("");
  const [newPRRecord, setNewPRRecord] = useState("");

  // Rest timer
  const [restTime, setRestTime] = useState(60);
  const [restCountdown, setRestCountdown] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = usePersistedState("treino-sound", true);
  const restRef = useRef<NodeJS.Timeout | null>(null);

  // Workout session timer
  const [sessionStart, setSessionStart] = usePersistedState<string | null>("treino-session-start", null);
  const [sessionElapsed, setSessionElapsed] = useState(0);

  // Weekly volume tracker
  const [weeklyVolume, setWeeklyVolume] = usePersistedState<Record<string, number>>("treino-weekly-volume", {});

  // Exercise history
  const [exerciseHistory, setExerciseHistory] = usePersistedState<{date: string; exercise: string; sets: string; reps: string; carga: string}[]>("treino-exercise-history", []);

  // Expanded day for mobile
  const [expandedDay, setExpandedDay] = useState<string | null>(todayDayName);

  // Selected view
  const [viewMode, setViewMode] = usePersistedState<"grid" | "today">("treino-view", "today");

  // Streak calculation
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

  // Total weekly sets
  const totalWeeklySets = Object.values(workoutPlan).reduce((total, day) =>
    total + day.exercises.reduce((s, ex) => s + (Number(ex.sets) || 0), 0), 0
  );

  // Muscle group distribution
  const muscleDistribution = weekDays.map(day => ({
    day: day.slice(0, 3),
    muscle: workoutPlan[day]?.muscle || "",
    exercises: workoutPlan[day]?.exercises.length || 0,
    volume: workoutPlan[day]?.exercises.reduce((s, ex) => s + (Number(ex.sets) || 0) * (Number(ex.reps) || 0), 0) || 0
  }));

  // Rest timer logic
  useEffect(() => {
    if (restRunning && restCountdown > 0) {
      restRef.current = setTimeout(() => setRestCountdown(prev => prev - 1), 1000);
    } else if (restCountdown === 0 && restRunning) {
      setRestRunning(false);
      if (soundEnabled) {
        try { const ctx = new AudioContext(); const osc = ctx.createOscillator(); osc.connect(ctx.destination); osc.frequency.value = 800; osc.start(); setTimeout(() => osc.stop(), 300); } catch {}
      }
    }
    return () => { if (restRef.current) clearTimeout(restRef.current); };
  }, [restRunning, restCountdown, soundEnabled]);

  // Session timer
  useEffect(() => {
    if (!sessionStart) { setSessionElapsed(0); return; }
    const interval = setInterval(() => {
      setSessionElapsed(Math.floor((Date.now() - new Date(sessionStart).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600); const m = Math.floor((secs % 3600) / 60); const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const logWorkoutToday = () => {
    if (!workoutLog.includes(today)) setWorkoutLog([...workoutLog, today]);
    // Calculate volume
    const todayWorkout = workoutPlan[todayDayName];
    if (todayWorkout) {
      const vol = todayWorkout.exercises.reduce((s, ex) => s + (Number(ex.sets) || 0) * (Number(ex.reps) || 0) * (parseFloat(ex.carga) || 0), 0);
      setWeeklyVolume(prev => ({ ...prev, [today]: vol }));
    }
    // Save exercise history
    const todayExercises = workoutPlan[todayDayName]?.exercises || [];
    const newHistory = todayExercises.filter(ex => ex.done).map(ex => ({
      date: today, exercise: ex.name, sets: ex.sets, reps: ex.reps, carga: ex.carga
    }));
    if (newHistory.length > 0) setExerciseHistory(prev => [...newHistory, ...prev].slice(0, 500));
    setSessionStart(null);
  };

  const todayWorkout = workoutPlan[todayDayName];
  const todayProgress = todayWorkout ? todayWorkout.exercises.filter(e => e.done).length / Math.max(todayWorkout.exercises.length, 1) * 100 : 0;

  const renderWorkoutDay = (day: string) => {
    const workout = workoutPlan[day];
    if (!workout) return null;
    if (workout.exercises.length === 0) return (
      <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
        <div className={`${dayColors[day]} text-white p-3 font-bold text-sm flex items-center justify-between`}>
          <span>{day}</span>
          <span className="text-lg">{muscleGroupIcons[workout.muscle] || "😴"}</span>
        </div>
        <div className="p-4 text-center"><p className="text-xs text-muted-foreground">Dia de descanso 😴</p></div>
      </div>
    );
    return (
      <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
        <div className={`${dayColors[day]} text-white p-3`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">{day} {day === todayDayName ? "⬅️ HOJE" : ""}</p>
              <p className="text-xs opacity-80">{muscleGroupIcons[workout.muscle]} {workout.muscle}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">{workout.exercises.filter(e => e.done).length}/{workout.exercises.length}</p>
              <div className="w-16 h-1.5 bg-white/30 rounded-full mt-1">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${workout.exercises.filter(e => e.done).length / Math.max(workout.exercises.length, 1) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-[20px_1fr_auto_28px] gap-2 text-[10px] font-bold text-muted-foreground uppercase border-b border-border pb-1 mb-2">
            <span></span><span>Exercício</span><span className="text-center">Séries - Reps - Carga</span><span className="text-center">✓</span>
          </div>
          {workout.exercises.map((ex, i) => (
            <div key={i} className={`grid grid-cols-[20px_1fr_auto_28px] gap-2 items-center py-1.5 ${i < workout.exercises.length - 1 ? "border-b border-border/30" : ""} ${ex.done ? "opacity-60" : ""}`}>
              <span className="text-[10px] text-muted-foreground">{i + 1}</span>
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${exerciseColors[i % exerciseColors.length]} ${ex.done ? "line-through" : ""}`}>
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
                if (!ex.done) { setRestCountdown(restTime); setRestRunning(true); }
              }} className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto transition-all ${ex.done ? "bg-green-500 border-green-500 scale-110" : "border-muted-foreground/30 hover:border-green-400"}`}>
                {ex.done && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>
          ))}
          <div className="flex gap-1 mt-2 pt-2 border-t border-border/30">
            <Input value={day === expandedDay ? newExName : ""} onChange={e => { setExpandedDay(day); setNewExName(e.target.value); }} placeholder="+ Novo exercício..." className="text-xs h-6 flex-1 bg-transparent" />
            <Button size="sm" className="h-6 px-2" onClick={() => {
              if (newExName.trim()) { const u = { ...workoutPlan }; u[day].exercises.push({ name: newExName.trim(), sets: "3", reps: "12", carga: "—", done: false }); setWorkoutPlan({...u}); setNewExName(""); }
            }}><Plus className="w-3 h-3" /></Button>
          </div>
          <div className="mt-2 pt-2 border-t border-border/30">
            <Input value={workoutNotes[day] || ""} onChange={e => setWorkoutNotes({ ...workoutNotes, [day]: e.target.value })}
              placeholder="📝 Obs do dia..." className="text-[10px] h-6 bg-muted/20 border-none" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2"><Dumbbell className="w-5 h-5 text-blue-500" /> MEU TREINO</h1>
            <p className="text-xs text-muted-foreground">Planilha, recordes e progresso</p>
          </div>
          <div className="flex items-center gap-2">
            {sessionStart && (
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full border border-green-300">
                <Clock className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-bold text-green-700 font-mono">{formatTime(sessionElapsed)}</span>
              </div>
            )}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 px-2 py-1 rounded-full border border-orange-300">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-700">{streak}🔥</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="treino" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            <TabsTrigger value="treino" className="text-xs px-3 py-1.5">🏋️ TREINO</TabsTrigger>
            <TabsTrigger value="records" className="text-xs px-3 py-1.5">🏆 RECORDES</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs px-3 py-1.5">📊 ESTATÍSTICAS</TabsTrigger>
            <TabsTrigger value="history" className="text-xs px-3 py-1.5">📅 HISTÓRICO</TabsTrigger>
          </TabsList>

          {/* ========== TREINO DO DIA + PLANILHA ========== */}
          <TabsContent value="treino" className="space-y-4">
            {/* Today's quick stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 text-center border border-blue-200 dark:border-blue-500/30">
                <Dumbbell className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <p className="text-lg font-bold">{todayWorkout?.exercises.length || 0}</p>
                <p className="text-[9px] text-muted-foreground">Exercícios</p>
              </div>
              <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-3 text-center border border-green-200 dark:border-green-500/30">
                <Check className="w-5 h-5 mx-auto text-green-500 mb-1" />
                <p className="text-lg font-bold">{todayWorkout?.exercises.filter(e => e.done).length || 0}</p>
                <p className="text-[9px] text-muted-foreground">Feitos</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-3 text-center border border-purple-200 dark:border-purple-500/30">
                <BarChart3 className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                <p className="text-lg font-bold">{totalWeeklySets}</p>
                <p className="text-[9px] text-muted-foreground">Séries/sem</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-3 text-center border border-orange-200 dark:border-orange-500/30">
                <Flame className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                <p className="text-lg font-bold">{workoutLog.length}</p>
                <p className="text-[9px] text-muted-foreground">Total treinos</p>
              </div>
            </div>

            {/* Rest Timer */}
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold flex items-center gap-2"><Timer className="w-4 h-4 text-blue-500" /> TIMER DE DESCANSO</h3>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-muted-foreground">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                {[30, 45, 60, 90, 120].map(t => (
                  <button key={t} onClick={() => { setRestTime(t); setRestCountdown(t); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${restTime === t && !restRunning ? "bg-blue-500 text-white border-blue-500" : "border-border hover:border-blue-300"}`}>{t}s</button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
                      strokeDasharray={`${((restCountdown || restTime) / restTime) * 176} 176`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono">{restCountdown > 0 ? restCountdown : restTime}</span>
                </div>
                {!restRunning ? (
                  <Button size="sm" onClick={() => { setRestCountdown(restCountdown || restTime); setRestRunning(true); }}><Play className="w-3 h-3 mr-1" /> Iniciar</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setRestRunning(false)}><Pause className="w-3 h-3 mr-1" /> Pausar</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => { setRestRunning(false); setRestCountdown(restTime); }}><RotateCcw className="w-3 h-3" /></Button>
              </div>
            </div>

            {/* Session controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!sessionStart ? (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1" onClick={() => setSessionStart(new Date().toISOString())}>
                    <Play className="w-3 h-3" /> Iniciar Sessão
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => { logWorkoutToday(); }}>
                    <Check className="w-3 h-3" /> Finalizar Treino
                  </Button>
                )}
                <Button size="sm" variant={viewMode === "today" ? "default" : "outline"} onClick={() => setViewMode("today")} className="text-xs">Hoje</Button>
                <Button size="sm" variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")} className="text-xs">Semana</Button>
              </div>
              {todayProgress > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${todayProgress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-green-600">{Math.round(todayProgress)}%</span>
                </div>
              )}
            </div>

            {/* Workout grid */}
            {viewMode === "today" ? (
              <div className="space-y-4">
                {renderWorkoutDay(todayDayName)}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {weekDays.map(day => renderWorkoutDay(day))}
              </div>
            )}
          </TabsContent>

          {/* ========== RECORDES ========== */}
          <TabsContent value="records" className="space-y-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/30 p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> MEUS RECORDES PESSOAIS (PRs)</h3>
              <p className="text-xs text-muted-foreground mb-3">Registre seus maiores pesos e conquistas 💪</p>
              {personalRecords.map((pr, i) => (
                <div key={pr.id} className="flex items-center gap-3 bg-white/50 dark:bg-background/30 rounded-lg p-3 border border-yellow-200/50 dark:border-yellow-500/20 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400/20">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <Trophy className="w-4 h-4 text-yellow-500" />}
                  </div>
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

            {/* Achievements */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-purple-500" /> CONQUISTAS</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Primeiro Treino", desc: "Registrou o primeiro treino", unlocked: workoutLog.length >= 1, icon: "🎯" },
                  { name: "Sequência 7", desc: "7 dias seguidos", unlocked: streak >= 7, icon: "🔥" },
                  { name: "Sequência 30", desc: "30 dias seguidos!", unlocked: streak >= 30, icon: "⚡" },
                  { name: "Centurião", desc: "100 treinos registrados", unlocked: workoutLog.length >= 100, icon: "💯" },
                  { name: "PR Hunter", desc: "5+ recordes pessoais", unlocked: personalRecords.length >= 5, icon: "🏆" },
                  { name: "Madrugador", desc: "Treinou antes das 7h", unlocked: false, icon: "🌅" },
                ].map(a => (
                  <div key={a.name} className={`rounded-xl border p-3 text-center ${a.unlocked ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200" : "bg-muted/30 border-border opacity-50"}`}>
                    <span className="text-2xl">{a.icon}</span>
                    <p className="text-xs font-bold mt-1">{a.name}</p>
                    <p className="text-[9px] text-muted-foreground">{a.desc}</p>
                    {a.unlocked && <Badge className="text-[8px] mt-1 bg-green-500">Desbloqueado!</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ========== ESTATÍSTICAS ========== */}
          <TabsContent value="stats" className="space-y-4">
            {/* Muscle Group Distribution */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-500" /> DISTRIBUIÇÃO SEMANAL</h3>
              <div className="space-y-2">
                {muscleDistribution.map(d => (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-8">{d.day}</span>
                    <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all"
                        style={{ width: `${Math.min((d.volume / Math.max(...muscleDistribution.map(x => x.volume), 1)) * 100, 100)}%` }} />
                      <span className="absolute inset-0 flex items-center px-2 text-[10px] font-medium">{d.muscle}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground w-12 text-right">{d.exercises} ex</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Volume Chart */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> VOLUME DE TREINO (últimos 14 dias)</h3>
              <div className="flex items-end gap-1 h-24">
                {Array.from({ length: 14 }, (_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (13 - i));
                  const dateStr = d.toISOString().split("T")[0];
                  const vol = weeklyVolume[dateStr] || 0;
                  const trained = workoutLog.includes(dateStr);
                  const maxVol = Math.max(...Object.values(weeklyVolume), 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      {vol > 0 && <span className="text-[7px] font-bold">{(vol/1000).toFixed(0)}k</span>}
                      <div className={`w-full rounded-t transition-all ${trained ? "bg-green-400" : "bg-muted/30"}`}
                        style={{ height: `${vol > 0 ? Math.max((vol / maxVol) * 80, 10) : 4}%` }} />
                      <span className="text-[7px] text-muted-foreground">{d.getDate()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak Heatmap */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> HEATMAP — {streak} dias de sequência 🔥</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {Array.from({ length: 60 }, (_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (59 - i));
                  const dateStr = d.toISOString().split("T")[0];
                  const trained = workoutLog.includes(dateStr);
                  return (
                    <div key={i} title={d.toLocaleDateString("pt-BR")}
                      className={`w-4 h-4 rounded-sm transition-colors ${trained ? "bg-green-400 hover:bg-green-500" : "bg-muted/30 hover:bg-muted/50"} border border-border/30`} />
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground">Últimos 60 dias — verde = treinou</p>
            </div>
          </TabsContent>

          {/* ========== HISTÓRICO ========== */}
          <TabsContent value="history" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> HISTÓRICO DE EXERCÍCIOS</h3>
              {exerciseHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Finalize um treino para ver o histórico aqui 📋</p>
              ) : (
                <div className="space-y-1">
                  {exerciseHistory.slice(0, 50).map((h, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-1.5 text-xs border border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{new Date(h.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                        <span className="font-medium">{h.exercise}</span>
                      </div>
                      <span className="text-muted-foreground">{h.sets}×{h.reps} — {h.carga}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Treino;
