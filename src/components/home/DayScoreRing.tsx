import { motion } from "framer-motion";

interface DayScoreRingProps {
  score: number;
  streak: number;
}

export const DayScoreRing = ({ score, streak }: DayScoreRingProps) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "hsl(142, 71%, 45%)";
    if (score >= 50) return "hsl(38, 92%, 50%)";
    return "hsl(var(--accent))";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excelente!";
    if (score >= 60) return "Bom dia!";
    if (score >= 30) return "Vamos lá!";
    return "Comece agora";
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={getScoreColor()} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-3xl font-black" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}>
            {score}
          </motion.span>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">pontos</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <motion.p className="text-lg font-black mb-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          {getScoreLabel()}
        </motion.p>
        <p className="text-[10px] text-muted-foreground mb-3">Score baseado nas atividades do dia</p>

        {streak > 0 && (
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <span className="text-sm">🔥</span>
            <span className="text-xs font-black text-amber-700 dark:text-amber-300">{streak} dia{streak > 1 ? "s" : ""}</span>
            <span className="text-[9px] text-amber-600/70 dark:text-amber-400/70">consecutivo{streak > 1 ? "s" : ""}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
