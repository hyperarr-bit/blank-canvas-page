import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sun, Moon, Plus, X, AlertTriangle, ShieldCheck } from "lucide-react";
import { getStepIcon, checkConflicts, type ConflictRule } from "./utils";

const getDateKey = () => new Date().toISOString().slice(0, 10);

export const SkincareRoutine = () => {
  const today = getDateKey();
  const [morningSteps, setMorningSteps] = usePersistedState<string[]>("skincare-morning-steps", []);
  const [nightSteps, setNightSteps] = usePersistedState<string[]>("skincare-night-steps", []);
  const [morningChecked, setMorningChecked] = usePersistedState<Record<string, number[]>>("skincare-morning-checked", {});
  const [nightChecked, setNightChecked] = usePersistedState<Record<string, number[]>>("skincare-night-checked", {});
  const [newMorning, setNewMorning] = useState("");
  const [newNight, setNewNight] = useState("");
  const [showConflicts, setShowConflicts] = useState(false);

  const todayMorning = morningChecked[today] || [];
  const todayNight = nightChecked[today] || [];

  const toggleStep = (period: "morning" | "night", index: number) => {
    if (period === "morning") {
      const arr = [...todayMorning];
      arr.includes(index) ? arr.splice(arr.indexOf(index), 1) : arr.push(index);
      setMorningChecked(prev => ({ ...prev, [today]: arr }));
    } else {
      const arr = [...todayNight];
      arr.includes(index) ? arr.splice(arr.indexOf(index), 1) : arr.push(index);
      setNightChecked(prev => ({ ...prev, [today]: arr }));
    }
  };

  // Conflict detection
  const allConflicts: ConflictRule[] = [
    ...checkConflicts(morningSteps),
    ...checkConflicts(nightSteps),
  ];

  const morningPct = morningSteps.length > 0 ? Math.round((todayMorning.length / morningSteps.length) * 100) : 0;
  const nightPct = nightSteps.length > 0 ? Math.round((todayNight.length / nightSteps.length) * 100) : 0;

  const RoutineBlock = ({ title, icon: Icon, steps, setSteps, checked, period, newStep, setNewStep, pct, color }: {
    title: string; icon: typeof Sun; steps: string[]; setSteps: (v: string[] | ((p: string[]) => string[])) => void;
    checked: number[]; period: "morning" | "night"; newStep: string; setNewStep: (v: string) => void; pct: number; color: string;
  }) => (
    <Card>
      <CardHeader className="pb-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-[10px]">{checked.length}/{steps.length}</Badge>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
          <div className={`h-full rounded-full transition-all duration-500 ${period === "morning" ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5 group py-1">
            <Checkbox checked={checked.includes(i)} onCheckedChange={() => toggleStep(period, i)} />
            <span className="text-base">{getStepIcon(step)}</span>
            <span className={`text-sm flex-1 ${checked.includes(i) ? "line-through text-muted-foreground" : ""}`}>{step}</span>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0" onClick={() => setSteps(prev => prev.filter((_, j) => j !== i))}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Ex: Sérum vitamina C, Retinol..."
            value={newStep}
            onChange={e => setNewStep(e.target.value)}
            className="h-8 text-xs"
            onKeyDown={e => {
              if (e.key === "Enter" && newStep.trim()) {
                setSteps(prev => [...prev, newStep.trim()]);
                setNewStep("");
              }
            }}
          />
          <Button size="sm" className="h-8" onClick={() => { if (newStep.trim()) { setSteps(prev => [...prev, newStep.trim()]); setNewStep(""); } }}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Inline conflict alerts */}
      {allConflicts.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-500/10">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-bold text-amber-700">⚠️ Conflitos Detectados</p>
            </div>
            {allConflicts.map((c, i) => (
              <div key={i} className="pl-6 space-y-0.5">
                <p className="text-[11px] font-medium text-amber-800">{c.message}</p>
                <p className="text-[10px] text-amber-600">💡 {c.suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {allConflicts.length === 0 && (morningSteps.length > 0 || nightSteps.length > 0) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <p className="text-[11px] text-green-700 font-medium">Nenhum conflito de ativos detectado ✅</p>
        </div>
      )}

      <RoutineBlock title="Morning Routine ☀️" icon={Sun} steps={morningSteps} setSteps={setMorningSteps} checked={todayMorning} period="morning" newStep={newMorning} setNewStep={setNewMorning} pct={morningPct} color="text-amber-500" />
      <RoutineBlock title="Night Routine 🌙" icon={Moon} steps={nightSteps} setSteps={setNightSteps} checked={todayNight} period="night" newStep={newNight} setNewStep={setNewNight} pct={nightPct} color="text-indigo-500" />

      {/* Conflict checker button */}
      <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowConflicts(!showConflicts)}>
        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
        Guia: Pode vs. Não Pode
      </Button>
      {showConflicts && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h4 className="text-xs font-bold mb-2">📋 Combinações a evitar</h4>
            {[
              { bad: "Retinol + AHA/BHA", tip: "Alterne os dias" },
              { bad: "Retinol + Vitamina C", tip: "Vit C de manhã, Retinol à noite" },
              { bad: "Peróxido de Benzoíla + Vitamina C", tip: "Nunca juntos" },
              { bad: "Peróxido de Benzoíla + Retinol", tip: "Horários diferentes" },
              { bad: "AHA + BHA juntos", tip: "Alterne os dias" },
              { bad: "Vitamina C + Niacinamida alta conc.", tip: "Espere 15 min entre" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className="text-destructive font-bold">✗</span>
                <div><span className="font-medium">{item.bad}</span> <span className="text-muted-foreground">— {item.tip}</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
