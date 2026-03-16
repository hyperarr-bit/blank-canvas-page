import { useState, useCallback } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Dumbbell, Apple, Heart, BookOpen, CheckSquare, Droplets, Plus, X } from "lucide-react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { GreetingHeader } from "@/components/home/GreetingHeader";
import { DayScoreRing } from "@/components/home/DayScoreRing";
import { SummaryCard } from "@/components/home/SummaryCard";
import { ProgressBar } from "@/components/home/ProgressBar";
import { QuickActions } from "@/components/home/QuickActions";
import { ModuleDrawer } from "@/components/home/ModuleDrawer";
import { NextHoursTimeline } from "@/components/home/NextHoursTimeline";
import { WidgetPicker } from "@/components/home/WidgetPicker";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useHomeWidgets, WidgetId, WIDGET_CATALOG } from "@/hooks/use-home-widgets";

// Widget components
import { WeekProgressWidget } from "@/components/home/widgets/WeekProgressWidget";
import { BudgetRemainingWidget } from "@/components/home/widgets/BudgetRemainingWidget";
import { HabitStreaksWidget } from "@/components/home/widgets/HabitStreaksWidget";
import { MotivationalQuoteWidget } from "@/components/home/widgets/MotivationalQuoteWidget";
import { QuickNotesWidget } from "@/components/home/widgets/QuickNotesWidget";
import { FocusTimerWidget } from "@/components/home/widgets/FocusTimerWidget";
import { MacroBalanceWidget } from "@/components/home/widgets/MacroBalanceWidget";
import { SleepLogWidget } from "@/components/home/widgets/SleepLogWidget";
import { CountdownWidget } from "@/components/home/widgets/CountdownWidget";
import { WeekCalendarWidget } from "@/components/home/widgets/WeekCalendarWidget";

const WIDGET_COMPONENTS: Record<WidgetId, React.FC> = {
  "week-progress": WeekProgressWidget,
  "budget-remaining": BudgetRemainingWidget,
  "habit-streaks": HabitStreaksWidget,
  "motivational-quote": MotivationalQuoteWidget,
  "quick-notes": QuickNotesWidget,
  "focus-timer": FocusTimerWidget,
  "macro-balance": MacroBalanceWidget,
  "sleep-log": SleepLogWidget,
  "countdown": CountdownWidget,
  "week-calendar": WeekCalendarWidget,
};

const HomePage = () => {
  const [data, setDataTrigger] = useState(0);
  const lifeData = useLifeHubData();
  const { activeWidgets, addWidget, removeWidget, isActive } = useHomeWidgets();
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("core-onboarding-done"));
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [editingWidgets, setEditingWidgets] = useState(false);

  const handleOnboardingComplete = () => {
    localStorage.setItem("core-onboarding-done", "true");
    setShowOnboarding(false);
  };

  const handleNameChange = useCallback(() => {
    setDataTrigger(d => d + 1);
  }, []);

  const handleWidgetToggle = (id: WidgetId) => {
    if (isActive(id)) removeWidget(id);
    else addWidget(id);
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
          <GreetingHeader data={lifeData} onNameChange={handleNameChange} />

          {/* Score Ring */}
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
            <DayScoreRing score={lifeData.dayScore} streak={lifeData.streak} />
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Ações rápidas</h3>
            <QuickActions />
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              icon={<DollarSign className="w-4 h-4 text-amber-600" />}
              title="Finanças"
              path="/financas"
              accentClass="bg-amber-400/20"
              delay={0}
            >
              <p className={`text-sm font-bold ${lifeData.monthBalance >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                {formatCurrency(lifeData.monthBalance)}
              </p>
              {lifeData.nextBillName && (
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  📅 {lifeData.nextBillName}
                </p>
              )}
            </SummaryCard>

            <SummaryCard
              icon={<Dumbbell className="w-4 h-4 text-blue-600" />}
              title="Treino"
              path="/treino"
              accentClass="bg-blue-400/20"
              delay={0.05}
            >
              {lifeData.todayWorkoutGroup ? (
                <>
                  <p className="text-sm font-bold">{lifeData.todayWorkoutGroup}</p>
                  <p className={`text-[10px] ${lifeData.workoutDone ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {lifeData.workoutDone ? "✓ Concluído" : "Pendente"}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Dia de descanso 😴</p>
              )}
            </SummaryCard>

            <SummaryCard
              icon={<Apple className="w-4 h-4 text-emerald-600" />}
              title="Calorias"
              path="/dieta"
              accentClass="bg-emerald-400/20"
              delay={0.1}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold">{lifeData.caloriesConsumed}</span>
                <span className="text-[10px] text-muted-foreground">/ {lifeData.caloriesGoal} kcal</span>
              </div>
              <ProgressBar value={lifeData.caloriesConsumed} max={lifeData.caloriesGoal} colorClass="bg-emerald-500" />
            </SummaryCard>

            <SummaryCard
              icon={<Heart className="w-4 h-4 text-red-600" />}
              title="Saúde"
              path="/saude"
              accentClass="bg-red-400/20"
              delay={0.15}
            >
              <div className="flex items-center gap-2">
                <Droplets className="w-3 h-3 text-cyan-500" />
                <span className="text-xs font-medium">{lifeData.waterGlasses}/{lifeData.waterGoal}</span>
              </div>
              <ProgressBar value={lifeData.waterGlasses} max={lifeData.waterGoal} colorClass="bg-cyan-500" />
            </SummaryCard>

            <SummaryCard
              icon={<CheckSquare className="w-4 h-4 text-emerald-600" />}
              title="Hábitos"
              path="/rotina"
              accentClass="bg-emerald-400/20"
              delay={0.2}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold">{lifeData.tasksCompleted}</span>
                <span className="text-[10px] text-muted-foreground">/ {lifeData.tasksTotal} feitos</span>
              </div>
              <ProgressBar value={lifeData.tasksCompleted} max={lifeData.tasksTotal} colorClass="bg-emerald-500" />
            </SummaryCard>

            <SummaryCard
              icon={<BookOpen className="w-4 h-4 text-orange-600" />}
              title="Leitura"
              path="/biblioteca"
              accentClass="bg-orange-400/20"
              delay={0.25}
            >
              {lifeData.currentBook ? (
                <>
                  <p className="text-xs font-medium truncate">{lifeData.currentBook}</p>
                  <ProgressBar value={lifeData.readingProgress} max={100} colorClass="bg-orange-500" />
                </>
              ) : (
                <p className="text-[10px] text-muted-foreground">Nenhum livro ativo</p>
              )}
            </SummaryCard>
          </div>

          {/* Custom Widgets */}
          {activeWidgets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Meus Widgets</h3>
                <button
                  onClick={() => setEditingWidgets(!editingWidgets)}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                    editingWidgets ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {editingWidgets ? "Pronto" : "Editar"}
                </button>
              </div>
              <AnimatePresence>
                {activeWidgets.map((widgetId, i) => {
                  const Component = WIDGET_COMPONENTS[widgetId];
                  if (!Component) return null;
                  return (
                    <motion.div
                      key={widgetId}
                      className="relative"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {editingWidgets && (
                        <button
                          onClick={() => removeWidget(widgetId)}
                          className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <Component />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Add Widget Button */}
          <motion.button
            onClick={() => setShowWidgetPicker(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">Adicionar widget</span>
          </motion.button>

          {/* Today's pending items */}
          <NextHoursTimeline data={lifeData} />

          {/* Module Drawer */}
          <ModuleDrawer />

          {/* Footer */}
          <p className="text-center text-[10px] text-muted-foreground py-2">
            Core © {new Date().getFullYear()} — Organize sua vida
          </p>
        </div>
      </div>

      {/* Widget Picker Dialog */}
      <WidgetPicker
        open={showWidgetPicker}
        onOpenChange={setShowWidgetPicker}
        activeWidgets={activeWidgets}
        onToggle={handleWidgetToggle}
      />
    </>
  );
};

export default HomePage;
