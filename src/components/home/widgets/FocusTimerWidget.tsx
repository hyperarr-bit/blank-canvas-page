import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

export const FocusTimerWidget = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = window.setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (seconds === 0 && running) setRunning(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = ((25 * 60 - seconds) / (25 * 60)) * 100;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-rose-200 dark:bg-rose-800/50 px-4 py-2">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-900 dark:text-rose-200">⏱️ TIMER DE FOCO</h4>
      </div>
      <div className="bg-rose-50 dark:bg-rose-950/20 p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <motion.circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 20} animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - pct / 100) }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold tabular-nums">{mins}:{secs.toString().padStart(2, "0")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setRunning(!running)} className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={() => { setRunning(false); setSeconds(25 * 60); }} className="w-9 h-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
