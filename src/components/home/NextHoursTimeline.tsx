import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LifeHubData } from "@/hooks/use-life-hub-data";

interface NextHoursTimelineProps {
  data: LifeHubData;
}

interface PendingItem {
  label: string;
  done: boolean;
  emoji: string;
  priority: number; // lower = more important
  route?: string;
}

export const NextHoursTimeline = ({ data }: NextHoursTimelineProps) => {
  const navigate = useNavigate();
  const items: PendingItem[] = [];

  // Habits
  const pendingHabits = data.habits.filter(h => !h.done);
  const doneHabits = data.habits.filter(h => h.done);
  if (pendingHabits.length > 0) {
    items.push({
      label: pendingHabits.length === 1
        ? `Hábito pendente: ${pendingHabits[0].name}`
        : `${pendingHabits.length} hábitos pendentes`,
      done: false,
      emoji: "✅",
      priority: 1,
      route: "/rotina",
    });
  } else if (doneHabits.length > 0) {
    items.push({
      label: `${doneHabits.length} hábito${doneHabits.length > 1 ? "s" : ""} concluído${doneHabits.length > 1 ? "s" : ""}`,
      done: true,
      emoji: "✅",
      priority: 10,
      route: "/rotina",
    });
  }

  // Workout
  if (data.todayWorkoutGroup) {
    items.push({
      label: data.workoutDone
        ? `Treino de ${data.todayWorkoutGroup} concluído`
        : `Treino de ${data.todayWorkoutGroup} hoje`,
      done: data.workoutDone,
      emoji: "🏋️",
      priority: data.workoutDone ? 11 : 2,
      route: "/treino",
    });
  }

  // Water
  const waterRemaining = data.waterGoal - data.waterGlasses;
  if (waterRemaining > 0) {
    items.push({
      label: `Faltam ${waterRemaining} copo${waterRemaining > 1 ? "s" : ""} de água`,
      done: false,
      emoji: "💧",
      priority: 4,
      route: "/saude",
    });
  } else if (data.waterGoal > 0) {
    items.push({
      label: "Meta de água atingida!",
      done: true,
      emoji: "💧",
      priority: 12,
      route: "/saude",
    });
  }

  // Meals
  if (data.mealsTotal > 0) {
    const remaining = data.mealsTotal - data.mealsLogged;
    if (remaining > 0) {
      items.push({
        label: `${remaining} refeição${remaining > 1 ? "ões" : ""} para registrar`,
        done: false,
        emoji: "🍽️",
        priority: 3,
        route: "/dieta",
      });
    } else {
      items.push({
        label: "Todas as refeições registradas",
        done: true,
        emoji: "🍽️",
        priority: 13,
        route: "/dieta",
      });
    }
  }

  // Supplements
  if (data.supplementsTotal > 0) {
    const remaining = data.supplementsTotal - data.supplementsTaken;
    if (remaining > 0) {
      items.push({
        label: `${remaining} suplemento${remaining > 1 ? "s" : ""} pendente${remaining > 1 ? "s" : ""}`,
        done: false,
        emoji: "💊",
        priority: 5,
        route: "/saude",
      });
    } else {
      items.push({
        label: "Suplementos tomados",
        done: true,
        emoji: "💊",
        priority: 14,
      });
    }
  }

  // Reading
  if (data.currentBook) {
    if (data.readingProgress < 100) {
      items.push({
        label: `Continuar "${data.currentBook}" (${data.readingProgress}%)`,
        done: false,
        emoji: "📖",
        priority: 6,
        route: "/biblioteca",
      });
    }
  }

  // Finances - next bill
  if (data.nextBillName) {
    items.push({
      label: `Conta próxima: ${data.nextBillName}`,
      done: false,
      emoji: "📅",
      priority: 7,
      route: "/financas",
    });
  }

  // Sort by priority
  items.sort((a, b) => a.priority - b.priority);

  // Separate pending and done
  const pending = items.filter(i => !i.done);
  const done = items.filter(i => i.done);

  const allDone = pending.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pendências de hoje</h3>
        </div>
        {!allDone && (
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {pending.length} pendente{pending.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {allDone && done.length === 0 ? (
        <motion.div
          className="flex items-center gap-3 px-3 py-3 rounded-xl bg-card border border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-lg">🎉</span>
          <span className="text-xs font-medium text-muted-foreground">Tudo em dia! Relaxe.</span>
        </motion.div>
      ) : (
        <div className="space-y-1.5">
          {/* Pending items first */}
          {pending.map((item, i) => (
            <motion.button
              key={`p-${i}`}
              onClick={() => item.route && navigate(item.route)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all text-left group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <span className="text-sm">{item.emoji}</span>
              <span className="text-xs font-medium flex-1">{item.label}</span>
              {item.route && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.button>
          ))}

          {/* Done items */}
          {done.length > 0 && (
            <div className="pt-1">
              {done.map((item, i) => (
                <motion.div
                  key={`d-${i}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.05 * (pending.length + i) }}
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-[11px] line-through text-muted-foreground flex-1">{item.label}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">✓</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
