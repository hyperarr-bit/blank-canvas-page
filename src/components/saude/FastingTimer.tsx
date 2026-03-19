import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Play, Square } from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";

const FASTING_PHASES = [
  { hours: 0, label: "Digestão", color: "text-saude-yellow", emoji: "🍽️" },
  { hours: 4, label: "Pós-absorção", color: "text-saude-blue", emoji: "⚡" },
  { hours: 8, label: "Gluconeogênese", color: "text-saude-blue", emoji: "🔄" },
  { hours: 12, label: "Cetose Leve", color: "text-saude-green", emoji: "🔥" },
  { hours: 16, label: "Queima de Gordura", color: "text-saude-green", emoji: "💪" },
  { hours: 20, label: "Autofagia", color: "text-saude-green", emoji: "🧬" },
];

export const FastingTimer = () => {
  const [fastingStart, setFastingStart] = usePersistedState<string | null>("core-saude-fasting-start", null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!fastingStart) { setElapsed(0); return; }
    const update = () => setElapsed(Math.floor((Date.now() - new Date(fastingStart).getTime()) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [fastingStart]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const currentPhase = [...FASTING_PHASES].reverse().find(p => hours >= p.hours) || FASTING_PHASES[0];
  const nextPhase = FASTING_PHASES.find(p => p.hours > hours);

  const toggle = () => {
    if (fastingStart) {
      setFastingStart(null);
    } else {
      setFastingStart(new Date().toISOString());
    }
  };

  return (
    <div className="saude-glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-saude-blue" />
        <span className="text-xs font-bold uppercase tracking-wider">Relógio de Jejum</span>
      </div>

      {fastingStart ? (
        <div className="space-y-4">
          {/* Timer display */}
          <div className="text-center">
            <div className="font-mono text-4xl font-black tracking-tighter">
              <span className="text-saude-blue">{String(hours).padStart(2, "0")}</span>
              <span className="text-saude-muted">:</span>
              <span className="text-saude-blue">{String(minutes).padStart(2, "0")}</span>
              <span className="text-saude-muted text-2xl">:{String(seconds).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Phase indicator */}
          <motion.div
            key={currentPhase.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-saude-card"
          >
            <span className="text-lg">{currentPhase.emoji}</span>
            <span className={`text-sm font-bold ${currentPhase.color}`}>{currentPhase.label}</span>
          </motion.div>

          {/* Phase progress */}
          <div className="flex gap-1">
            {FASTING_PHASES.map((phase, i) => (
              <div
                key={phase.label}
                className={`flex-1 h-1.5 rounded-full transition-colors ${hours >= phase.hours ? "bg-saude-blue" : "bg-saude-card"}`}
              />
            ))}
          </div>

          {nextPhase && (
            <p className="text-[11px] text-saude-muted text-center">
              Próxima fase: <span className="font-bold">{nextPhase.emoji} {nextPhase.label}</span> em {nextPhase.hours - hours}h
            </p>
          )}

          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saude-red/20 hover:bg-saude-red/30 text-saude-red text-xs font-bold transition-colors"
          >
            <Square className="w-3.5 h-3.5" /> Encerrar Jejum
          </button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-xs text-saude-muted">Nenhum jejum ativo</p>
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-saude-blue/20 hover:bg-saude-blue/30 text-saude-blue text-sm font-bold transition-colors"
          >
            <Play className="w-4 h-4" /> Iniciar Jejum
          </button>
        </div>
      )}
    </div>
  );
};
