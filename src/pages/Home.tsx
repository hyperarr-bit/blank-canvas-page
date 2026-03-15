import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DollarSign, Dumbbell, Apple, Heart, BookOpen, CheckSquare, Droplets } from "lucide-react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { GreetingHeader } from "@/components/home/GreetingHeader";
import { DayScoreRing } from "@/components/home/DayScoreRing";
import { SummaryCard } from "@/components/home/SummaryCard";
import { ProgressBar } from "@/components/home/ProgressBar";
import { QuickActions } from "@/components/home/QuickActions";
import { ModuleDrawer } from "@/components/home/ModuleDrawer";
import { NextHoursTimeline } from "@/components/home/NextHoursTimeline";
import { useLifeHubData } from "@/hooks/use-life-hub-data";

const HomePage = () => {
  const data = useLifeHubData();
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("core-onboarding-done"));

  const handleOnboardingComplete = () => {
    localStorage.setItem("core-onboarding-done", "true");
    setShowOnboarding(false);
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-5 space-y-6">
          {/* Header with greeting */}
          <GreetingHeader data={data} />

          {/* Score Ring */}
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
            <DayScoreRing score={data.dayScore} streak={data.streak} />
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Ações rápidas</h3>
            <QuickActions />
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Finance */}
            <SummaryCard
              icon={<DollarSign className="w-4 h-4 text-amber-600" />}
              title="Finanças"
              path="/financas"
              accentClass="bg-amber-400/20"
              delay={0}
            >
              <p className={`text-sm font-bold ${data.monthBalance >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(data.monthBalance)}
              </p>
              {data.nextBillName && (
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  📅 {data.nextBillName}
                </p>
              )}
            </SummaryCard>

            {/* Workout */}
            <SummaryCard
              icon={<Dumbbell className="w-4 h-4 text-blue-600" />}
              title="Treino"
              path="/treino"
              accentClass="bg-blue-400/20"
              delay={0.05}
            >
              {data.todayWorkoutGroup ? (
                <>
                  <p className="text-sm font-bold">{data.todayWorkoutGroup}</p>
                  <p className={`text-[10px] ${data.workoutDone ? "text-success" : "text-muted-foreground"}`}>
                    {data.workoutDone ? "✓ Concluído" : "Pendente"}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Dia de descanso 😴</p>
              )}
            </SummaryCard>

            {/* Calories */}
            <SummaryCard
              icon={<Apple className="w-4 h-4 text-green-600" />}
              title="Calorias"
              path="/dieta"
              accentClass="bg-green-400/20"
              delay={0.1}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold">{data.caloriesConsumed}</span>
                <span className="text-[10px] text-muted-foreground">/ {data.caloriesGoal} kcal</span>
              </div>
              <ProgressBar value={data.caloriesConsumed} max={data.caloriesGoal} colorClass="bg-green-500" />
            </SummaryCard>

            {/* Health */}
            <SummaryCard
              icon={<Heart className="w-4 h-4 text-red-600" />}
              title="Saúde"
              path="/saude"
              accentClass="bg-red-400/20"
              delay={0.15}
            >
              <div className="flex items-center gap-2">
                <Droplets className="w-3 h-3 text-cyan-500" />
                <span className="text-xs font-medium">{data.waterGlasses}/{data.waterGoal}</span>
              </div>
              <ProgressBar value={data.waterGlasses} max={data.waterGoal} colorClass="bg-cyan-500" />
            </SummaryCard>

            {/* Tasks / Habits */}
            <SummaryCard
              icon={<CheckSquare className="w-4 h-4 text-emerald-600" />}
              title="Hábitos"
              path="/rotina"
              accentClass="bg-emerald-400/20"
              delay={0.2}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold">{data.tasksCompleted}</span>
                <span className="text-[10px] text-muted-foreground">/ {data.tasksTotal} feitos</span>
              </div>
              <ProgressBar value={data.tasksCompleted} max={data.tasksTotal} colorClass="bg-emerald-500" />
            </SummaryCard>

            {/* Reading */}
            <SummaryCard
              icon={<BookOpen className="w-4 h-4 text-orange-600" />}
              title="Leitura"
              path="/biblioteca"
              accentClass="bg-orange-400/20"
              delay={0.25}
            >
              {data.currentBook ? (
                <>
                  <p className="text-xs font-medium truncate">{data.currentBook}</p>
                  <ProgressBar value={data.readingProgress} max={100} colorClass="bg-orange-500" />
                </>
              ) : (
                <p className="text-[10px] text-muted-foreground">Nenhum livro ativo</p>
              )}
            </SummaryCard>
          </div>

          {/* Today's pending items */}
          <NextHoursTimeline data={data} />

          {/* Module Drawer */}
          <ModuleDrawer />

          {/* Footer */}
          <p className="text-center text-[10px] text-muted-foreground py-2">
            Core © {new Date().getFullYear()} — Organize sua vida
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
