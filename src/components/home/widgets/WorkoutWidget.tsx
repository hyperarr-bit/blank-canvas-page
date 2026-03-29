import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useUserData } from "@/hooks/use-user-data";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const WorkoutWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const { get, set } = useUserData();
  const todayStr = new Date().toISOString().slice(0, 10);

  const toggleWorkoutDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const log = get<any>("core-treino-log", {});
    if (log[todayStr]) {
      const { [todayStr]: _, ...rest } = log;
      set("core-treino-log", rest);
    } else {
      set("core-treino-log", { ...log, [todayStr]: true });
    }
  };

  if (size === "small") {
    return (
      <button onClick={() => navigate("/treino")} className="w-full text-left rounded-xl border border-border overflow-hidden">
        <div className="bg-blue-200 dark:bg-blue-800/50 px-3 py-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-blue-900 dark:text-blue-200">🏋️ TREINO</h3>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3">
          {data.todayWorkoutGroup ? (
            <>
              <p className="text-sm font-bold">{data.todayWorkoutGroup}</p>
              <p className={`text-[10px] ${data.workoutDone ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                {data.workoutDone ? "✓ Concluído" : "Pendente"}
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Dia de descanso 😴</p>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="w-full text-left rounded-xl border border-border overflow-hidden">
      <div className="bg-blue-200 dark:bg-blue-800/50 px-4 py-2 flex items-center justify-between">
        <button onClick={() => navigate("/treino")} className="text-[11px] font-black uppercase tracking-wider text-blue-900 dark:text-blue-200">🏋️ TREINO</button>
        {data.todayWorkoutGroup && (
          <button onClick={toggleWorkoutDone} className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${data.workoutDone ? "bg-emerald-500 text-white" : "border-2 border-blue-400/50 text-blue-600 dark:text-blue-300 hover:border-emerald-500"}`}>
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4">
        {data.todayWorkoutGroup ? (
          <>
            <p className="text-xl font-bold">{data.todayWorkoutGroup}</p>
            <p className={`text-xs mt-1 ${data.workoutDone ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>
              {data.workoutDone ? "✓ Treino concluído!" : "⏳ Toque no ✓ para concluir"}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Dia de descanso 😴</p>
        )}
      </div>
    </div>
  );
};
