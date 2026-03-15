import { motion } from "framer-motion";

function safeJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export const WeekCalendarWidget = () => {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Build the week days (Mon-Sun)
  const weekDays: { date: string; label: string; dayNum: number; isToday: boolean }[] = [];
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    weekDays.push({
      date: dateStr,
      label: dayNames[d.getDay()],
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  // Check what was done each day
  const workoutLog = safeJSON<any>("core-treino-log", {});
  const habitLog = safeJSON<any>("core-rotina-habit-log", {});
  const habits = safeJSON<any[]>("core-rotina-habits", []);

  const getDayStatus = (date: string): "done" | "partial" | "empty" | "future" => {
    if (date > todayStr) return "future";
    const hasWorkout = !!workoutLog[date];
    const dayHabits = habitLog[date] || {};
    const habitsDone = Object.keys(dayHabits).length;
    const total = habits.length;
    if (hasWorkout && habitsDone >= total * 0.8) return "done";
    if (hasWorkout || habitsDone > 0) return "partial";
    return "empty";
  };

  const statusColors = {
    done: "bg-emerald-500 text-white",
    partial: "bg-amber-400/30 text-foreground",
    empty: "bg-muted text-muted-foreground",
    future: "bg-transparent text-muted-foreground/40 border border-border/30",
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">📅 Visão da Semana</h4>
      <div className="flex gap-1.5">
        {weekDays.map((day, i) => (
          <motion.div
            key={day.date}
            className="flex-1 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="text-[8px] font-medium text-muted-foreground">{day.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              day.isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background " : ""
            }${statusColors[getDayStatus(day.date)]}`}>
              {day.dayNum}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 justify-center">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[8px] text-muted-foreground">Completo</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400/50" /><span className="text-[8px] text-muted-foreground">Parcial</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-muted" /><span className="text-[8px] text-muted-foreground">Vazio</span></div>
      </div>
    </div>
  );
};
