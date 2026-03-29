import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useUserData } from "@/hooks/use-user-data";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WidgetSize } from "@/hooks/use-home-widgets";
import { useState } from "react";

export const CaloriesWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const { get, set } = useUserData();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealCals, setMealCals] = useState("");
  const todayStr = new Date().toISOString().slice(0, 10);

  const handleQuickMeal = (e: React.FormEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!mealName || !mealCals) return;
    const log = get<any>("core-dieta-log", {});
    const todayMeals = log[todayStr] || {};
    const id = `quick-${Date.now()}`;
    todayMeals[id] = { name: mealName, calories: parseFloat(mealCals) };
    set("core-dieta-log", { ...log, [todayStr]: todayMeals });
    setMealName(""); setMealCals(""); setShowQuickAdd(false);
  };

  const pct = data.caloriesGoal > 0 ? Math.round((data.caloriesConsumed / data.caloriesGoal) * 100) : 0;

  if (size === "small") {
    return (
      <button onClick={() => navigate("/dieta")} className="w-full text-left rounded-xl border border-border overflow-hidden">
        <div className="bg-green-200 dark:bg-green-800/50 px-3 py-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-green-900 dark:text-green-200">🥗 CALORIAS</h3>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-3">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold">{data.caloriesConsumed}</span>
            <span className="text-[10px] text-muted-foreground">/ {data.caloriesGoal} kcal</span>
          </div>
          <ProgressBar value={data.caloriesConsumed} max={data.caloriesGoal} colorClass="bg-emerald-500" />
        </div>
      </button>
    );
  }

  return (
    <div className="w-full text-left rounded-xl border border-border overflow-hidden">
      <div className="bg-green-200 dark:bg-green-800/50 px-4 py-2 flex items-center justify-between">
        <button onClick={() => navigate("/dieta")} className="text-[11px] font-black uppercase tracking-wider text-green-900 dark:text-green-200">🥗 CALORIAS</button>
        <button onClick={(e) => { e.stopPropagation(); setShowQuickAdd(!showQuickAdd); }} className="w-6 h-6 rounded-md bg-green-300/50 dark:bg-green-700/50 text-green-800 dark:text-green-200 flex items-center justify-center">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="bg-green-50 dark:bg-green-950/20 p-4">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xl font-bold">{data.caloriesConsumed}</span>
          <span className="text-xs text-muted-foreground">/ {data.caloriesGoal} kcal</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{pct}%</span>
        </div>
        <ProgressBar value={data.caloriesConsumed} max={data.caloriesGoal} colorClass="bg-emerald-500" />
        <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
          <span>🥩 P: {data.mealsLogged}</span><span>🍞 C: —</span><span>🥑 G: —</span>
        </div>
        {showQuickAdd && (
          <form onSubmit={handleQuickMeal} className="mt-3 space-y-2 border-t border-green-200/50 dark:border-green-800/30 pt-3" onClick={e => e.stopPropagation()}>
            <input value={mealName} onChange={e => setMealName(e.target.value)} placeholder="Refeição" className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background" />
            <div className="flex gap-2">
              <input value={mealCals} onChange={e => setMealCals(e.target.value)} placeholder="Calorias" type="number" className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background" />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Salvar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
