import { useNavigate } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useUserData } from "@/hooks/use-user-data";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const HabitsWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const { get, set } = useUserData();
  const todayStr = new Date().toISOString().slice(0, 10);

  const toggleHabit = (habitKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const log = get<any>("core-rotina-habit-log", {});
    const todayLog = log[todayStr] || {};
    if (todayLog[habitKey]) {
      const { [habitKey]: _, ...rest } = todayLog;
      set("core-rotina-habit-log", { ...log, [todayStr]: rest });
    } else {
      set("core-rotina-habit-log", { ...log, [todayStr]: { ...todayLog, [habitKey]: true } });
    }
  };

  const habits = get<any[]>("core-rotina-habits", []);
  const habitLog = get<any>("core-rotina-habit-log", {});
  const todayHabits = habitLog[todayStr] || {};
  const topHabits = habits.slice(0, 3).map((h: any) => {
    const key = h.id || h.name || h;
    return { key, name: typeof h === "string" ? h : h.name || "Hábito", done: !!todayHabits[key] };
  });

  if (size === "small") {
    return (
      <button onClick={() => navigate("/rotina")} className="w-full text-left rounded-xl border border-border overflow-hidden">
        <div className="bg-emerald-200 dark:bg-emerald-800/50 px-3 py-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">✅ HÁBITOS</h3>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold">{data.tasksCompleted}</span>
            <span className="text-[10px] text-muted-foreground">/ {data.tasksTotal} feitos</span>
          </div>
          <ProgressBar value={data.tasksCompleted} max={data.tasksTotal} colorClass="bg-emerald-500" />
        </div>
      </button>
    );
  }

  return (
    <div className="w-full text-left rounded-xl border border-border overflow-hidden">
      <div className="bg-emerald-200 dark:bg-emerald-800/50 px-4 py-2 flex items-center justify-between">
        <button onClick={() => navigate("/rotina")} className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">✅ HÁBITOS</button>
        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{data.tasksCompleted}/{data.tasksTotal}</span>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4">
        <ProgressBar value={data.tasksCompleted} max={data.tasksTotal} colorClass="bg-emerald-500" />
        {topHabits.length > 0 ? (
          <div className="mt-3 space-y-1.5">
            {topHabits.map(h => (
              <button key={h.key} onClick={(e) => toggleHabit(h.key, e)} className="w-full flex items-center gap-2.5 text-left group">
                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${h.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30 group-hover:border-emerald-500"}`}>
                  {h.done && <CheckSquare className="w-3 h-3" />}
                </div>
                <span className={`text-xs ${h.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{h.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground mt-2">Nenhum hábito cadastrado</p>
        )}
      </div>
    </div>
  );
};
