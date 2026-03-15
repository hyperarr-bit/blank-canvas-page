import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { LifeHubData } from "@/hooks/use-life-hub-data";

interface NextHoursTimelineProps {
  data: LifeHubData;
}

export const NextHoursTimeline = ({ data }: NextHoursTimelineProps) => {
  const hour = new Date().getHours();

  // Build timeline items from available data
  const items: { time: string; label: string; done: boolean; emoji: string }[] = [];

  if (data.todayWorkoutGroup && !data.workoutDone) {
    items.push({ time: "Hoje", label: `Treino: ${data.todayWorkoutGroup}`, done: false, emoji: "🏋️" });
  }
  if (data.todayWorkoutGroup && data.workoutDone) {
    items.push({ time: "✓", label: `Treino: ${data.todayWorkoutGroup}`, done: true, emoji: "🏋️" });
  }

  if (data.mealsTotal > 0) {
    const remaining = data.mealsTotal - data.mealsLogged;
    if (remaining > 0) {
      items.push({ time: "Hoje", label: `${remaining} refeição${remaining > 1 ? "ões" : ""} restante${remaining > 1 ? "s" : ""}`, done: false, emoji: "🍽️" });
    }
  }

  if (data.waterGlasses < data.waterGoal) {
    items.push({ time: "Hoje", label: `${data.waterGoal - data.waterGlasses} copos de água`, done: false, emoji: "💧" });
  }

  if (data.supplementsTotal > 0 && data.supplementsTaken < data.supplementsTotal) {
    items.push({ time: "Hoje", label: `${data.supplementsTotal - data.supplementsTaken} suplemento${data.supplementsTotal - data.supplementsTaken > 1 ? "s" : ""}`, done: false, emoji: "💊" });
  }

  if (items.length === 0) {
    items.push({ time: "🎉", label: "Tudo em dia! Relaxe.", done: true, emoji: "✨" });
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pendências de hoje</h3>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 4).map((item, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border border-border/50 ${item.done ? "bg-muted/30 opacity-60" : "bg-card"}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: item.done ? 0.6 : 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <span className="text-sm">{item.emoji}</span>
            <span className={`text-xs flex-1 ${item.done ? "line-through text-muted-foreground" : "font-medium"}`}>{item.label}</span>
            <span className="text-[10px] text-muted-foreground">{item.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
