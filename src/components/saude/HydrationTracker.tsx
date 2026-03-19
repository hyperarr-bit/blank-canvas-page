import { motion } from "framer-motion";
import { Droplets, Plus } from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";

const todayStr = () => new Date().toISOString().slice(0, 10);

export const HydrationTracker = () => {
  const today = todayStr();
  const [waterLog, setWaterLog] = usePersistedState<Record<string, number>>("core-saude-water", {});
  const [waterGoal] = usePersistedState<number>("core-saude-water-goal", 8);

  const current = waterLog[today] || 0;
  const pct = Math.min(100, (current / waterGoal) * 100);
  const mlCurrent = current * 250;
  const mlGoal = waterGoal * 250;

  const addWater = () => {
    setWaterLog(prev => ({ ...prev, [today]: Math.min((prev[today] || 0) + 1, 20) }));
  };

  return (
    <div className="saude-glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-saude-blue" />
          <span className="text-xs font-bold uppercase tracking-wider">Hidratação</span>
        </div>
        <span className="text-xs text-saude-muted">{mlCurrent}ml / {mlGoal}ml</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Visual cup */}
        <div className="relative w-16 h-24 rounded-b-2xl rounded-t-lg border-2 border-saude-blue/30 overflow-hidden flex-shrink-0">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-saude-blue/80 to-saude-blue/40"
            initial={{ height: 0 }}
            animate={{ height: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black text-white drop-shadow-md">{current}</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-saude-card overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-saude-blue/60 to-saude-blue"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: waterGoal }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${i < current ? "bg-saude-blue" : "bg-saude-card"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>

          {/* Add button */}
          <button
            onClick={addWater}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saude-blue/20 hover:bg-saude-blue/30 text-saude-blue text-xs font-bold transition-colors w-full justify-center"
          >
            <Plus className="w-3.5 h-3.5" /> +250ml
          </button>
        </div>
      </div>
    </div>
  );
};
