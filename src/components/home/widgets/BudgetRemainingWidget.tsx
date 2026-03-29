import { motion } from "framer-motion";
import { useUserData } from "@/hooks/use-user-data";

export const BudgetRemainingWidget = () => {
  const { get } = useUserData();
  const incomes = get<any[]>("core-incomes", []);
  const expenses = get<any[]>("core-expenses", []);
  const totalIncome = incomes.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
  const totalExpense = expenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
  const remaining = totalIncome - totalExpense;
  const pct = totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();
  const dailyBudget = daysLeft > 0 ? remaining / daysLeft : 0;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-emerald-200 dark:bg-emerald-800/50 px-4 py-2">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">💰 ORÇAMENTO RESTANTE</h4>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-lg font-bold ${remaining >= 0 ? "text-emerald-600" : "text-destructive"}`}>
            {remaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div
            className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : pct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          {daysLeft > 0 ? `≈ ${dailyBudget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/dia por ${daysLeft} dias` : "Último dia do mês"}
        </p>
      </div>
    </div>
  );
};
