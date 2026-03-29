import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useUserData } from "@/hooks/use-user-data";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const HealthWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const { get, set } = useUserData();
  const todayStr = new Date().toISOString().slice(0, 10);

  const adjustWater = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const log = get<any>("core-saude-water", {});
    const current = log[todayStr] || 0;
    const next = Math.max(0, current + delta);
    set("core-saude-water", { ...log, [todayStr]: next });
  };

  if (size === "small") {
    return (
      <button onClick={() => navigate("/saude")} className="w-full text-left rounded-xl border border-border overflow-hidden">
        <div className="bg-red-200 dark:bg-red-800/50 px-3 py-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-red-900 dark:text-red-200">❤️ SAÚDE</h3>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">💧</span>
            <span className="text-xs font-medium">{data.waterGlasses}/{data.waterGoal}</span>
          </div>
          <ProgressBar value={data.waterGlasses} max={data.waterGoal} colorClass="bg-cyan-500" />
        </div>
      </button>
    );
  }

  return (
    <div className="w-full text-left rounded-xl border border-border overflow-hidden">
      <div className="bg-red-200 dark:bg-red-800/50 px-4 py-2">
        <button onClick={() => navigate("/saude")} className="text-[11px] font-black uppercase tracking-wider text-red-900 dark:text-red-200">❤️ SAÚDE</button>
      </div>
      <div className="bg-red-50 dark:bg-red-950/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">💧</span>
          <span className="text-sm font-bold">{data.waterGlasses}/{data.waterGoal} copos</span>
        </div>
        <ProgressBar value={data.waterGlasses} max={data.waterGoal} colorClass="bg-cyan-500" />
        <div className="flex items-center gap-2 mt-3">
          <button onClick={(e) => adjustWater(-1, e)} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1 flex justify-center gap-1">
            {Array.from({ length: data.waterGoal }).map((_, i) => (
              <div key={i} className={`w-2.5 h-5 rounded-sm transition-colors ${i < data.waterGlasses ? "bg-cyan-500" : "bg-muted"}`} />
            ))}
          </div>
          <button onClick={(e) => adjustWater(1, e)} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
