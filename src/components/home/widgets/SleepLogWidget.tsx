import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Minus, Plus } from "lucide-react";

function safeJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export const SleepLogWidget = () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [sleepLog, setSleepLog] = useState(() => safeJSON<Record<string, number>>("core-saude-sleep", {}));
  const hours = sleepLog[todayStr] || 0;

  const update = (val: number) => {
    const clamped = Math.max(0, Math.min(14, val));
    const next = { ...sleepLog, [todayStr]: clamped };
    setSleepLog(next);
    localStorage.setItem("core-saude-sleep", JSON.stringify(next));
  };

  const quality = hours >= 7 ? "Ótimo 😊" : hours >= 5 ? "Regular 😐" : hours > 0 ? "Pouco 😴" : "Não registrado";

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">😴 Sono de Hoje</h4>
      <div className="flex items-center gap-4">
        <Moon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
        <div className="flex items-center gap-3">
          <button onClick={() => update(hours - 0.5)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
            <Minus className="w-3 h-3" />
          </button>
          <div className="text-center min-w-[3rem]">
            <span className="text-lg font-bold">{hours}</span>
            <span className="text-[10px] text-muted-foreground ml-0.5">h</span>
          </div>
          <button onClick={() => update(hours + 0.5)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span className="text-[10px] text-muted-foreground ml-auto">{quality}</span>
      </div>
    </div>
  );
};
