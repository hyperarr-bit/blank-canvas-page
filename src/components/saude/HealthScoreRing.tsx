import { motion } from "framer-motion";

interface HealthScoreRingProps {
  score: number;
  waterPct: number;
  sleepOk: boolean;
  medsCount: number;
  medsTotal: number;
}

export const HealthScoreRing = ({ score, waterPct, sleepOk, medsCount, medsTotal }: HealthScoreRingProps) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "hsl(var(--saude-green))";
    if (score >= 50) return "hsl(var(--saude-yellow))";
    return "hsl(var(--saude-red))";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--saude-card))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-black"
            style={{ color: getColor() }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-medium text-saude-muted uppercase tracking-wider">Health Score</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${waterPct >= 100 ? "bg-saude-green" : "bg-saude-yellow"}`} />
          <span className="text-saude-muted">Água {waterPct >= 100 ? "✓" : `${Math.round(waterPct)}%`}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${sleepOk ? "bg-saude-green" : "bg-saude-red"}`} />
          <span className="text-saude-muted">Sono {sleepOk ? "OK" : "⚠"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${medsCount >= medsTotal ? "bg-saude-green" : "bg-saude-yellow"}`} />
          <span className="text-saude-muted">Meds {medsCount}/{medsTotal}</span>
        </div>
      </div>
    </div>
  );
};
