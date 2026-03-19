import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Plus, X, AlertTriangle, ShieldCheck, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getStepIcon, checkConflicts } from "./utils";

const getDateKey = () => new Date().toISOString().slice(0, 10);

interface RoutineStep {
  name: string;
  isSunscreen?: boolean;
  isAcid?: boolean;
}

const DEFAULT_MORNING: RoutineStep[] = [
  { name: "Gel de Limpeza" },
  { name: "Tônico / Essência" },
  { name: "Vitamina C (Tratamento)" },
  { name: "Hidratante Leve" },
  { name: "Protetor Solar FPS 60", isSunscreen: true },
];

const DEFAULT_NIGHT: RoutineStep[] = [
  { name: "Cleansing Oil (Limpeza Dupla)" },
  { name: "Sabonete Facial" },
  { name: "Tratamento do Dia", isAcid: true }, // dynamic via skin cycling
  { name: "Hidratação Profunda" },
];

const SKIN_CYCLE_PHASES = [
  { label: "Esfoliação", emoji: "✨", desc: "Ácido Glicólico ou Lático", color: "text-sk-mint" },
  { label: "Retinol", emoji: "💎", desc: "Anti-idade e renovação", color: "text-sk-lavender" },
  { label: "Recuperação", emoji: "🧊", desc: "Só hidratação e calmantes", color: "text-muted-foreground" },
  { label: "Recuperação", emoji: "🧊", desc: "Só hidratação e calmantes", color: "text-muted-foreground" },
];

export const SkincareRoutine = () => {
  const today = getDateKey();
  const [morningSteps, setMorningSteps] = usePersistedState<RoutineStep[]>("skincare-am-steps", DEFAULT_MORNING);
  const [nightSteps, setNightSteps] = usePersistedState<RoutineStep[]>("skincare-pm-steps", DEFAULT_NIGHT);
  const [morningChecked, setMorningChecked] = usePersistedState<Record<string, number[]>>("skincare-morning-checked", {});
  const [nightChecked, setNightChecked] = usePersistedState<Record<string, number[]>>("skincare-night-checked", {});
  const [cycleStart, setCycleStart] = usePersistedState<string>("skincare-cycle-start", today);
  const [checkins] = usePersistedState<Record<string, string>>("skincare-daily-checkin", {});
  const [triggers] = usePersistedState<string[]>("skincare-triggers", []);
  const [showGuide, setShowGuide] = useState(false);
  const [newStep, setNewStep] = useState("");
  const [editingPeriod, setEditingPeriod] = useState<"am" | "pm" | null>(null);

  const todaySkin = checkins[today] || "";
  const isSensitive = todaySkin === "sensivel";

  // Skin Cycling phase
  const daysSinceStart = Math.floor((new Date(today + "T12:00:00").getTime() - new Date(cycleStart + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24));
  const cyclePhase = ((daysSinceStart % 4) + 4) % 4;
  const currentPhase = SKIN_CYCLE_PHASES[cyclePhase];

  const todayMorning = morningChecked[today] || [];
  const todayNight = nightChecked[today] || [];

  const toggleStep = (period: "am" | "pm", index: number) => {
    if (period === "am") {
      const arr = [...todayMorning];
      arr.includes(index) ? arr.splice(arr.indexOf(index), 1) : arr.push(index);
      setMorningChecked(prev => ({ ...prev, [today]: arr }));
    } else {
      const arr = [...todayNight];
      arr.includes(index) ? arr.splice(arr.indexOf(index), 1) : arr.push(index);
      setNightChecked(prev => ({ ...prev, [today]: arr }));
    }
  };

  // Filter night steps if sensitive
  const effectiveNightSteps = isSensitive
    ? nightSteps.filter(s => !s.isAcid)
    : nightSteps;

  // Sunscreen check
  const sunscreenIdx = morningSteps.findIndex(s => s.isSunscreen);
  const sunscreenDone = sunscreenIdx >= 0 && todayMorning.includes(sunscreenIdx);
  const morningComplete = morningSteps.length > 0 && todayMorning.length === morningSteps.length;
  const morningMissingSunscreen = todayMorning.length === morningSteps.length - 1 && !sunscreenDone;

  const morningPct = morningSteps.length > 0 ? Math.round((todayMorning.length / morningSteps.length) * 100) : 0;
  const nightPct = effectiveNightSteps.length > 0 ? Math.round((todayNight.length / effectiveNightSteps.length) * 100) : 0;

  // Conflict detection
  const allStepNames = [...morningSteps.map(s => s.name), ...nightSteps.map(s => s.name)];
  const conflicts = checkConflicts(allStepNames);

  const addStep = (period: "am" | "pm") => {
    if (!newStep.trim()) return;
    const step: RoutineStep = { name: newStep.trim() };
    if (period === "am") setMorningSteps(prev => [...prev, step]);
    else setNightSteps(prev => [...prev, step]);
    setNewStep("");
  };

  const removeStep = (period: "am" | "pm", idx: number) => {
    if (period === "am") setMorningSteps(prev => prev.filter((_, i) => i !== idx));
    else setNightSteps(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Conflict alerts */}
      {conflicts.length > 0 && (
        <div className="sk-card rounded-xl p-3 border-sk-coral/30">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-sk-coral" />
            <p className="text-[11px] font-bold text-sk-coral">Conflitos Detectados</p>
          </div>
          {conflicts.map((c, i) => (
            <div key={i} className="pl-5 mb-1">
              <p className="text-[10px] text-sk-coral/80">{c.message}</p>
              <p className="text-[9px] text-muted-foreground">💡 {c.suggestion}</p>
            </div>
          ))}
        </div>
      )}

      {conflicts.length === 0 && allStepNames.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sk-mint/5 border border-sk-mint/15">
          <ShieldCheck className="w-3.5 h-3.5 text-sk-mint" />
          <p className="text-[10px] text-sk-mint font-medium">Nenhum conflito de ativos ✅</p>
        </div>
      )}

      {/* ====== MORNING ====== */}
      <div className="sk-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-sk-mint" />
            <h3 className="text-sm font-bold text-sk-mint">ROTINA DA MANHÃ</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] border-sk-mint/30 text-sk-mint">{todayMorning.length}/{morningSteps.length}</Badge>
            <button onClick={() => setEditingPeriod(editingPeriod === "am" ? null : "am")} className="text-muted-foreground hover:text-foreground">
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-sk-mint transition-all duration-500" style={{ width: `${morningPct}%` }} />
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {morningSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 group py-1.5 px-1 rounded-lg hover:bg-muted/30 transition-colors">
              <Checkbox
                checked={todayMorning.includes(i)}
                onCheckedChange={() => toggleStep("am", i)}
                className="border-sk-mint/40 data-[state=checked]:bg-sk-mint data-[state=checked]:border-sk-mint"
              />
              <span className="text-base">{getStepIcon(step.name)}</span>
              <span className={`text-sm flex-1 ${todayMorning.includes(i) ? "line-through text-muted-foreground/60" : ""}`}>
                {step.name}
              </span>
              {step.isSunscreen && !todayMorning.includes(i) && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sk-coral/15 text-sk-coral font-bold animate-pulse-glow">
                  OBRIGATÓRIO
                </span>
              )}
              {editingPeriod === "am" && (
                <button onClick={() => removeStep("am", i)} className="text-sk-coral/60 hover:text-sk-coral">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {morningMissingSunscreen && (
          <div className="px-3 py-2 rounded-lg bg-sk-coral/10 border border-sk-coral/20">
            <p className="text-[10px] text-sk-coral font-medium">☀️ Aplique o Protetor Solar para concluir a rotina!</p>
          </div>
        )}

        {editingPeriod === "am" && (
          <div className="flex gap-2">
            <Input placeholder="Novo passo..." value={newStep} onChange={e => setNewStep(e.target.value)}
              className="h-8 text-xs bg-muted/30 border-border/50"
              onKeyDown={e => { if (e.key === "Enter") addStep("am"); }} />
            <Button size="sm" className="h-8 bg-sk-mint/20 text-sk-mint hover:bg-sk-mint/30 border-0" onClick={() => addStep("am")}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* ====== NIGHT ====== */}
      <div className="sk-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-sk-lavender" />
            <h3 className="text-sm font-bold text-sk-lavender">ROTINA DA NOITE</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] border-sk-lavender/30 text-sk-lavender">{todayNight.length}/{effectiveNightSteps.length}</Badge>
            <button onClick={() => setEditingPeriod(editingPeriod === "pm" ? null : "pm")} className="text-muted-foreground hover:text-foreground">
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skin Cycling Phase */}
        {!isSensitive && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sk-lavender/5 border border-sk-lavender/15">
            <span className="text-lg">{currentPhase.emoji}</span>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-sk-lavender">Skin Cycling: {currentPhase.label}</p>
              <p className="text-[9px] text-muted-foreground">{currentPhase.desc}</p>
            </div>
            <span className="text-[8px] text-muted-foreground">Dia {(cyclePhase + 1)}/4</span>
          </div>
        )}

        {isSensitive && (
          <div className="px-3 py-2 rounded-xl bg-sk-coral/5 border border-sk-coral/15">
            <p className="text-[10px] text-sk-coral font-medium">🍅 Modo sensível — apenas hidratação e calmantes</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-sk-lavender transition-all duration-500" style={{ width: `${nightPct}%` }} />
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {effectiveNightSteps.map((step, i) => {
            const displayName = step.isAcid && !isSensitive ? `${currentPhase.emoji} ${currentPhase.label} (${currentPhase.desc})` : step.name;
            return (
              <div key={i} className="flex items-center gap-2.5 group py-1.5 px-1 rounded-lg hover:bg-muted/30 transition-colors">
                <Checkbox
                  checked={todayNight.includes(i)}
                  onCheckedChange={() => toggleStep("pm", i)}
                  className="border-sk-lavender/40 data-[state=checked]:bg-sk-lavender data-[state=checked]:border-sk-lavender"
                />
                <span className="text-base">{step.isAcid ? currentPhase.emoji : getStepIcon(step.name)}</span>
                <span className={`text-sm flex-1 ${todayNight.includes(i) ? "line-through text-muted-foreground/60" : ""}`}>
                  {displayName}
                </span>
                {i === 0 && !todayNight.includes(0) && (
                  <span className="text-[8px] text-muted-foreground">Remova o protetor!</span>
                )}
                {editingPeriod === "pm" && (
                  <button onClick={() => removeStep("pm", i)} className="text-sk-coral/60 hover:text-sk-coral">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {editingPeriod === "pm" && (
          <div className="flex gap-2">
            <Input placeholder="Novo passo..." value={newStep} onChange={e => setNewStep(e.target.value)}
              className="h-8 text-xs bg-muted/30 border-border/50"
              onKeyDown={e => { if (e.key === "Enter") addStep("pm"); }} />
            <Button size="sm" className="h-8 bg-sk-lavender/20 text-sk-lavender hover:bg-sk-lavender/30 border-0" onClick={() => addStep("pm")}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Skin Cycling Config */}
      <div className="sk-card rounded-2xl p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-foreground">🔄 Ciclo de 4 Dias</p>
            <p className="text-[9px] text-muted-foreground">Esfoliação → Retinol → Recuperação × 2</p>
          </div>
          <div className="flex gap-1">
            {SKIN_CYCLE_PHASES.map((p, i) => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-all ${
                i === cyclePhase ? "border-sk-mint bg-sk-mint/20 scale-110" : "border-border/50"
              }`}>
                {p.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conflict guide */}
      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground" onClick={() => setShowGuide(!showGuide)}>
        <AlertTriangle className="w-3 h-3 mr-1.5" /> Guia: Pode vs. Não Pode
      </Button>
      {showGuide && (
        <div className="sk-card rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold">📋 Combinações a evitar</h4>
          {[
            { bad: "Retinol + AHA/BHA", tip: "Alterne os dias" },
            { bad: "Retinol + Vitamina C", tip: "Vit C de manhã, Retinol à noite" },
            { bad: "Peróxido de Benzoíla + Vitamina C", tip: "Nunca juntos" },
            { bad: "AHA + BHA juntos", tip: "Alterne os dias" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className="text-sk-coral font-bold">✗</span>
              <div><span className="font-medium">{item.bad}</span> <span className="text-muted-foreground">— {item.tip}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* Triggers banner */}
      {triggers.length > 0 && (
        <div className="px-3 py-2 rounded-xl bg-sk-coral/10 border border-sk-coral/20">
          <p className="text-[10px] text-sk-coral font-bold mb-0.5">🚫 Ingredientes a evitar</p>
          <p className="text-[9px] text-sk-coral/70">{triggers.join(", ")}</p>
        </div>
      )}
    </div>
  );
};
