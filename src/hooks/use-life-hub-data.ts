import { useMemo } from "react";

// Reads localStorage data from all modules to build the hub summary
export interface LifeHubData {
  // Score
  dayScore: number;
  streak: number;

  // Finance
  monthBalance: number;
  nextBillName: string | null;
  nextBillDate: string | null;

  // Workout
  todayWorkoutGroup: string | null;
  workoutDone: boolean;
  workoutTime: string | null;

  // Diet / Calories
  caloriesConsumed: number;
  caloriesGoal: number;
  mealsLogged: number;
  mealsTotal: number;

  // Health
  waterGlasses: number;
  waterGoal: number;
  sleepHours: number | null;
  supplementsTaken: number;
  supplementsTotal: number;

  // Reading
  currentBook: string | null;
  readingProgress: number;
  booksReadThisYear: number;

  // Tasks / Routine
  tasksCompleted: number;
  tasksTotal: number;
  habits: { name: string; done: boolean }[];

  // Greeting
  userName: string;
}

const today = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const dayOfWeek = () => {
  return ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][new Date().getDay()];
};

function safeJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useLifeHubData(): LifeHubData {
  return useMemo(() => {
    // ---- Finance ----
    const incomes = safeJSON<any[]>("core-incomes", []);
    const expenses = safeJSON<any[]>("core-expenses", []);
    const totalIncome = incomes.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
    const totalExpense = expenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
    const monthBalance = totalIncome - totalExpense;

    // Next bill
    const bills = safeJSON<any[]>("core-bills-due", []);
    const todayStr = today();
    const upcoming = bills
      .filter((b: any) => b.date >= todayStr && !b.paid)
      .sort((a: any, b: any) => a.date.localeCompare(b.date));
    const nextBill = upcoming[0] || null;

    // ---- Workout ----
    const workoutConfig = safeJSON<any>("core-treino-config", {});
    const workoutDays = safeJSON<any>("core-treino-active-days", {});
    const dow = dayOfWeek();
    const todayGroup = workoutDays[dow] || null;
    const workoutLog = safeJSON<any>("core-treino-log", {});
    const workoutDone = !!workoutLog[todayStr];

    // ---- Diet ----
    const dietPlan = safeJSON<any>("core-dieta-plan", {});
    const dietMeals = safeJSON<any[]>("core-dieta-meals", []);
    const caloriesGoal = safeJSON<number>("core-dieta-calories-goal", 2000);
    const todayLog = safeJSON<any>("core-dieta-log", {});
    const todayMeals = todayLog[todayStr] || {};
    const mealsTotal = dietMeals.length || 4;
    const mealsLogged = Object.keys(todayMeals).length;
    const caloriesConsumed: number = Object.values(todayMeals).reduce<number>((s, m: any) => s + (Number(m?.calories) || 0), 0);

    // ---- Health ----
    const waterLog = safeJSON<any>("core-saude-water", {});
    const waterGlasses = waterLog[todayStr] || 0;
    const waterGoal = safeJSON<number>("core-saude-water-goal", 8);
    const sleepLog = safeJSON<any>("core-saude-sleep", {});
    const sleepHours = sleepLog[todayStr] || null;
    const supplements = safeJSON<any[]>("core-saude-supplements", []);
    const supplementLog = safeJSON<any>("core-saude-supplement-log", {});
    const todaySups = supplementLog[todayStr] || [];
    const supplementsTaken = Array.isArray(todaySups) ? todaySups.length : 0;
    const supplementsTotal = supplements.length;

    // ---- Library ----
    const books = safeJSON<any[]>("core-biblioteca-books", []);
    const currentBook = books.find((b: any) => b.status === "reading");
    const booksRead = books.filter((b: any) => b.status === "read").length;

    // ---- Tasks / Habits ----
    const habits = safeJSON<any[]>("core-rotina-habits", []);
    const habitLog = safeJSON<any>("core-rotina-habit-log", {});
    const todayHabits = habitLog[todayStr] || {};
    const mappedHabits = habits.slice(0, 5).map((h: any) => ({
      name: typeof h === "string" ? h : h.name || "Hábito",
      done: !!todayHabits[h.id || h.name || h],
    }));
    const tasksTotal = mappedHabits.length;
    const tasksCompleted = mappedHabits.filter(h => h.done).length;

    // ---- Streak ----
    const streakData = safeJSON<any>("core-hub-streak", { count: 0, lastDate: "" });
    let streak = streakData.count || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    if (streakData.lastDate === todayStr) {
      // Already counted today
    } else if (streakData.lastDate === yesterdayStr) {
      streak += 1;
      localStorage.setItem("core-hub-streak", JSON.stringify({ count: streak, lastDate: todayStr }));
    } else if (streakData.lastDate !== todayStr) {
      streak = 1;
      localStorage.setItem("core-hub-streak", JSON.stringify({ count: 1, lastDate: todayStr }));
    }

    // ---- Day Score ----
    let scorePoints = 0;
    let scoreMax = 0;

    // Workout (25 pts)
    scoreMax += 25;
    if (workoutDone) scorePoints += 25;
    else if (!todayGroup) scorePoints += 25; // rest day = full points

    // Habits (25 pts)
    if (tasksTotal > 0) {
      scoreMax += 25;
      scorePoints += Math.round((tasksCompleted / tasksTotal) * 25);
    }

    // Water (15 pts)
    scoreMax += 15;
    scorePoints += Math.min(15, Math.round((waterGlasses / waterGoal) * 15));

    // Diet (20 pts)
    if (mealsTotal > 0) {
      scoreMax += 20;
      scorePoints += Math.round((mealsLogged / mealsTotal) * 20);
    }

    // Reading (15 pts) - just having a current book
    scoreMax += 15;
    if (currentBook) scorePoints += 15;

    const dayScore = scoreMax > 0 ? Math.round((scorePoints / scoreMax) * 100) : 0;

    // User name
    const userName = safeJSON<string>("core-user-name", "");

    return {
      dayScore,
      streak,
      monthBalance,
      nextBillName: nextBill?.name || null,
      nextBillDate: nextBill?.date || null,
      todayWorkoutGroup: todayGroup,
      workoutDone,
      workoutTime: null,
      caloriesConsumed,
      caloriesGoal,
      mealsLogged,
      mealsTotal,
      waterGlasses,
      waterGoal,
      sleepHours,
      supplementsTaken,
      supplementsTotal,
      currentBook: currentBook?.title || null,
      readingProgress: currentBook?.progress || 0,
      booksReadThisYear: booksRead,
      tasksCompleted,
      tasksTotal,
      habits: mappedHabits,
      userName,
    };
  }, []); // Recalculates on mount
}
