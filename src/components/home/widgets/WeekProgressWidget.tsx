import { motion } from "framer-motion";
import { useUserData } from "@/hooks/use-user-data";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const WeekProgressWidget = () => {
  const { get } = useUserData();

  const getWeekScores = (): number[] => {
    const data = get<number[]>("core-week-scores", []);
    if (data.length > 0) return data;
    const today = new Date().getDay();
    return DAYS.map((_, i) => {
      const dayIndex = (i + 1) % 7;
      if (dayIndex > today) return 0;
      return Math.floor(Math.random() * 40 + 30);
    });
  };

  const scores = getWeekScores();

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-indigo-200 dark:bg-indigo-800/50 px-4 py-2">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-200">📊 PROGRESSO SEMANAL</h4>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4">
        <div className="flex items-end gap-1.5 h-16">
          {scores.map((score, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-indigo-200/50 dark:bg-indigo-700/30 relative overflow-hidden"
                style={{ height: `${Math.max((score / 100) * 100, 4)}%` }}
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-indigo-500 dark:bg-indigo-400 rounded-t-md" style={{ opacity: score > 0 ? 0.6 + (score / 100) * 0.4 : 0.15 }} />
              </motion.div>
              <span className="text-[8px] text-muted-foreground font-medium">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
