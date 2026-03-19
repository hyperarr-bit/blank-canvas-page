import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Zap, Scale, Stethoscope, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { HealthScoreRing } from "@/components/saude/HealthScoreRing";
import { HydrationTracker } from "@/components/saude/HydrationTracker";
import { PharmacyChecklist } from "@/components/saude/PharmacyChecklist";
import { FastingTimer } from "@/components/saude/FastingTimer";
import { BodyEvolution } from "@/components/saude/BodyEvolution";
import { MedicalLog } from "@/components/saude/MedicalLog";
import { ToolsEmergency } from "@/components/saude/ToolsEmergency";

const todayStr = () => new Date().toISOString().slice(0, 10);

const Saude = () => {
  const navigate = useNavigate();
  const today = todayStr();

  // Compute health score from all signals
  const [waterLog] = usePersistedState<Record<string, number>>("core-saude-water", {});
  const [waterGoal] = usePersistedState<number>("core-saude-water-goal", 8);
  const [sleepLog] = usePersistedState<Record<string, number>>("core-saude-sleep", {});
  const [sleepGoal] = usePersistedState<number>("core-saude-sleep-goal", 8);
  const [supplements] = usePersistedState<{ id: string; name: string; stock: number }[]>("core-saude-supplements", []);
  const [supplementLog] = usePersistedState<Record<string, string[]>>("core-saude-supplement-log", {});

  const waterToday = waterLog[today] || 0;
  const waterPct = waterGoal > 0 ? (waterToday / waterGoal) * 100 : 0;
  const sleepToday = sleepLog[today] || 0;
  const sleepOk = sleepToday >= sleepGoal - 1;
  const takenToday = supplementLog[today] || [];
  const medsCount = takenToday.length;
  const medsTotal = supplements.length;

  // Score: water 30%, sleep 30%, meds 40%
  let score = 0;
  score += Math.min(30, (waterPct / 100) * 30);
  score += sleepOk ? 30 : sleepToday > 0 ? (sleepToday / sleepGoal) * 30 : 0;
  score += medsTotal > 0 ? (medsCount / medsTotal) * 40 : 40;
  score = Math.round(Math.min(100, score));

  // Sleep debt for header
  const debtHours = Math.max(0, sleepGoal - sleepToday);

  const [showSOS, setShowSOS] = usePersistedState<boolean>("core-saude-sos-visible", false);

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-foreground hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-black tracking-tight">CORE SAÚDE</h1>
            <p className="text-[11px] text-saude-muted">Performance · Evolução · Controle</p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("saude-sos-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-9 h-9 rounded-xl bg-saude-red/20 hover:bg-saude-red/30 flex items-center justify-center transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-saude-red" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Health Score Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="saude-glass rounded-2xl p-5"
        >
          <HealthScoreRing
            score={score}
            waterPct={waterPct}
            sleepOk={sleepOk}
            medsCount={medsCount}
            medsTotal={medsTotal}
          />

          {/* Quick status badges */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className={`px-3 py-1 rounded-lg text-[11px] font-bold ${debtHours > 0 ? "bg-saude-red/15 text-saude-red" : "bg-saude-green/15 text-saude-green"}`}>
              Sono: {debtHours > 0 ? `Dívida -${debtHours}h` : "OK ✓"}
            </div>
            <div className={`px-3 py-1 rounded-lg text-[11px] font-bold ${waterPct >= 100 ? "bg-saude-green/15 text-saude-green" : "bg-saude-blue/15 text-saude-blue"}`}>
              Hidratação: {waterPct >= 100 ? "OK ✓" : `${Math.round(waterPct)}%`}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="agora" className="w-full">
          <TabsList className="w-full grid grid-cols-4 gap-1 bg-[hsl(var(--saude-card))] p-1 h-auto rounded-xl">
            <TabsTrigger value="agora" className="text-[11px] px-2 py-2 rounded-lg data-[state=active]:bg-saude-green/20 data-[state=active]:text-saude-green font-bold">
              <Zap className="w-3 h-3 mr-1" />Agora
            </TabsTrigger>
            <TabsTrigger value="evolucao" className="text-[11px] px-2 py-2 rounded-lg data-[state=active]:bg-saude-blue/20 data-[state=active]:text-saude-blue font-bold">
              <Scale className="w-3 h-3 mr-1" />Evolução
            </TabsTrigger>
            <TabsTrigger value="log" className="text-[11px] px-2 py-2 rounded-lg data-[state=active]:bg-saude-green/20 data-[state=active]:text-saude-green font-bold">
              <Stethoscope className="w-3 h-3 mr-1" />Log
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-[11px] px-2 py-2 rounded-lg data-[state=active]:bg-saude-yellow/20 data-[state=active]:text-saude-yellow font-bold">
              <Wrench className="w-3 h-3 mr-1" />Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agora" className="space-y-4 mt-4">
            <HydrationTracker />
            <PharmacyChecklist />
            <FastingTimer />
          </TabsContent>

          <TabsContent value="evolucao" className="space-y-4 mt-4">
            <BodyEvolution />
          </TabsContent>

          <TabsContent value="log" className="space-y-4 mt-4">
            <MedicalLog />
          </TabsContent>

          <TabsContent value="tools" className="space-y-4 mt-4" id="saude-sos-section">
            <ToolsEmergency />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Saude;
