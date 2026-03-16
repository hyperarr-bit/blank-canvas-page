import { useNavigate } from "react-router-dom";
import { Apple } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const CaloriesWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();

  if (size === "small") {
    return (
      <button onClick={() => navigate("/dieta")} className="w-full text-left bg-card rounded-2xl p-4 shadow-sm hover:shadow-md border border-border/50 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-400/20">
            <Apple className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Calorias</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold">{data.caloriesConsumed}</span>
              <span className="text-[10px] text-muted-foreground">/ {data.caloriesGoal} kcal</span>
            </div>
            <ProgressBar value={data.caloriesConsumed} max={data.caloriesGoal} colorClass="bg-emerald-500" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <button onClick={() => navigate("/dieta")} className="w-full text-left bg-card rounded-2xl p-4 shadow-sm hover:shadow-md border border-border/50 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-400/20">
          <Apple className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Calorias</h3>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-xl font-bold">{data.caloriesConsumed}</span>
        <span className="text-xs text-muted-foreground">/ {data.caloriesGoal} kcal</span>
      </div>
      <ProgressBar value={data.caloriesConsumed} max={data.caloriesGoal} colorClass="bg-emerald-500" />
    </button>
  );
};
