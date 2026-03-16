import { useState, useCallback } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, Maximize2, Minimize2 } from "lucide-react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { GreetingHeader } from "@/components/home/GreetingHeader";
import { DayScoreRing } from "@/components/home/DayScoreRing";
import { QuickActions } from "@/components/home/QuickActions";
import { ModuleDrawer } from "@/components/home/ModuleDrawer";
import { NextHoursTimeline } from "@/components/home/NextHoursTimeline";
import { WidgetPicker } from "@/components/home/WidgetPicker";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useHomeWidgets, WidgetId, ActiveWidget } from "@/hooks/use-home-widgets";

// Widget components
import { FinancesWidget } from "@/components/home/widgets/FinancesWidget";
import { WorkoutWidget } from "@/components/home/widgets/WorkoutWidget";
import { CaloriesWidget } from "@/components/home/widgets/CaloriesWidget";
import { HealthWidget } from "@/components/home/widgets/HealthWidget";
import { HabitsWidget } from "@/components/home/widgets/HabitsWidget";
import { ReadingWidget } from "@/components/home/widgets/ReadingWidget";
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

type WidgetComponent = React.FC<{ size?: "small" | "large" }>;

const WIDGET_COMPONENTS: Record<WidgetId, WidgetComponent> = {
  finances: FinancesWidget,
  workout: WorkoutWidget,
  calories: CaloriesWidget,
  health: HealthWidget,
  habits: HabitsWidget,
  reading: ReadingWidget,
  "week-progress": WeekProgressWidget as WidgetComponent,
  "budget-remaining": BudgetRemainingWidget as WidgetComponent,
  "habit-streaks": HabitStreaksWidget as WidgetComponent,
  "motivational-quote": MotivationalQuoteWidget as WidgetComponent,
  "quick-notes": QuickNotesWidget as WidgetComponent,
  "focus-timer": FocusTimerWidget as WidgetComponent,
  "macro-balance": MacroBalanceWidget as WidgetComponent,
  "sleep-log": SleepLogWidget as WidgetComponent,
  countdown: CountdownWidget as WidgetComponent,
  "week-calendar": WeekCalendarWidget as WidgetComponent,
};

const HomePage = () => {
  const [data, setDataTrigger] = useState(0);
  const lifeData = useLifeHubData();
  const { activeWidgets, addWidget, removeWidget, isActive, toggleSize } = useHomeWidgets();
  const { get, set: setData } = useUserData();
  const [showOnboarding, setShowOnboarding] = useState(() => !get<string>("core-onboarding-done", ""));
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [editingWidgets, setEditingWidgets] = useState(false);

  const handleOnboardingComplete = () => {
    setData("core-onboarding-done", "true");
    setShowOnboarding(false);
  };

  const handleNameChange = useCallback(() => {
    setDataTrigger(d => d + 1);
  }, []);

  const handleWidgetToggle = (id: WidgetId) => {
    if (isActive(id)) removeWidget(id);
    else addWidget(id);
  };

  // Group widgets into rows: small widgets pair up, large widgets take full width
  const buildWidgetRows = () => {
    const rows: ActiveWidget[][] = [];
    let smallBuffer: ActiveWidget[] = [];

    activeWidgets.forEach(widget => {
      if (widget.size === "small") {
        smallBuffer.push(widget);
        if (smallBuffer.length === 2) {
          rows.push([...smallBuffer]);
          smallBuffer = [];
        }
      } else {
        if (smallBuffer.length > 0) {
          rows.push([...smallBuffer]);
          smallBuffer = [];
        }
        rows.push([widget]);
      }
    });

    if (smallBuffer.length > 0) {
      rows.push([...smallBuffer]);
    }

    return rows;
  };

  const widgetRows = buildWidgetRows();

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

          {/* Unified Widgets Section */}
          {activeWidgets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-end">
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
                {widgetRows.map((row, rowIndex) => (
                  <motion.div
                    key={row.map(w => w.id).join("-")}
                    className={`grid gap-3 ${row.length === 2 && row.every(w => w.size === "small") ? "grid-cols-2" : "grid-cols-1"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: rowIndex * 0.03 }}
                  >
                    {row.map(widget => {
                      const Component = WIDGET_COMPONENTS[widget.id];
                      if (!Component) return null;
                      return (
                        <div key={widget.id} className="relative">
                          {editingWidgets && (
                            <div className="absolute -top-1.5 -right-1.5 z-10 flex gap-1">
                              <button
                                onClick={() => toggleSize(widget.id)}
                                className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center shadow-sm border border-border/50"
                                title={widget.size === "small" ? "Expandir" : "Reduzir"}
                              >
                                {widget.size === "small" ? <Maximize2 className="w-2.5 h-2.5" /> : <Minimize2 className="w-2.5 h-2.5" />}
                              </button>
                              <button
                                onClick={() => removeWidget(widget.id)}
                                className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <Component size={widget.size} />
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
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
        onToggleSize={toggleSize}
      />
    </>
  );
};

export default HomePage;
