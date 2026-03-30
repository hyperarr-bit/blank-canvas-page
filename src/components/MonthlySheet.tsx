import { usePersistedState } from "@/hooks/use-persisted-state";
import { IncomeTable } from "@/components/IncomeTable";
import { ExpenseTable } from "@/components/ExpenseTable";
import { FixedExpensesTable } from "@/components/FixedExpensesTable";
import { BillsDueCards } from "@/components/BillsDueCards";
import { InstallmentTracker } from "@/components/InstallmentTracker";
import { Notes } from "@/components/Notes";
import { Calculator } from "@/components/Calculator";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthlySheetProps {
  month: string;
  onClose: () => void;
}

export const MonthlySheet = ({ month, onClose }: MonthlySheetProps) => {
  const monthKey = month.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const [incomes, setIncomes] = usePersistedState(`finance-month-${monthKey}-incomes`, [] as any[]);
  const [expenses, setExpenses] = usePersistedState(`finance-month-${monthKey}-expenses`, [] as any[]);
  const [fixedExpenses, setFixedExpenses] = usePersistedState(`finance-month-${monthKey}-fixed`, [] as any[]);
  const [dueDays, setDueDays] = usePersistedState(`finance-month-${monthKey}-dueDays`, [
    { day: 5, color: "yellow", bills: [] as any[] },
    { day: 10, color: "slate", bills: [] as any[] },
    { day: 20, color: "indigo", bills: [] as any[] },
    { day: 30, color: "emerald", bills: [] as any[] },
  ]);
  const [notes, setNotes] = usePersistedState(`finance-month-${monthKey}-notes`, [] as any[]);
  const [installments, setInstallments] = usePersistedState(`finance-month-${monthKey}-installments`, [] as any[]);

  const totalIncome = incomes.reduce((sum: number, i: any) => sum + i.value, 0);
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.value, 0);
  const totalFixed = fixedExpenses.reduce((sum: number, e: any) => sum + e.value, 0);
  const totalDebts = installments.reduce(
    (sum: number, i: any) => sum + (i.totalInstallments - i.paidInstallments) * i.installmentValue, 0
  );
  const balance = totalIncome - totalExpenses - totalFixed - totalDebts;

  return (
    <div className="space-y-5">
      {/* Back button */}
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full py-6 text-base font-bold gap-3 border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
      >
        <ArrowLeft className="w-5 h-5" />
        ← VOLTAR AO FINANCEIRO GERAL
      </Button>

      {/* Month header */}
      <div className="bg-card rounded-lg border border-border p-4 text-center">
        <span className="text-xs text-muted-foreground font-medium">PLANILHA DO MÊS</span>
        <h2 className="text-xl font-bold tracking-tight mt-1">📅 {month.toUpperCase()}</h2>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 border bg-card-receitas border-card-receitas-border">
          <span className="text-[10px] font-bold text-card-receitas-text">RECEITAS</span>
          <p className="text-sm font-bold text-card-receitas-text mt-1">
            R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-lg p-3 border bg-card-despesas border-card-despesas-border">
          <span className="text-[10px] font-bold text-card-despesas-text">DESPESAS</span>
          <p className="text-sm font-bold text-card-despesas-text mt-1">
            R$ {(totalExpenses + totalFixed).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Balance */}
      <div className={`rounded-lg p-3 border text-center ${
        balance >= 0 ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
      }`}>
        <span className="text-[10px] font-bold text-muted-foreground">BALANÇO DO MÊS</span>
        <p className={`text-lg font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
          R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="min-w-0">
        <IncomeTable incomes={incomes} setIncomes={setIncomes} />
      </div>
      <div className="min-w-0">
        <FixedExpensesTable expenses={fixedExpenses} setExpenses={setFixedExpenses} />
      </div>
      <div className="min-w-0">
        <ExpenseTable expenses={expenses} setExpenses={setExpenses} />
      </div>
      <BillsDueCards dueDays={dueDays} setDueDays={setDueDays} />
      <div className="min-w-0">
        <InstallmentTracker installments={installments} setInstallments={setInstallments} />
      </div>
      <Notes notes={notes} setNotes={setNotes} />

      {/* Bottom back button */}
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full py-6 text-base font-bold gap-3 border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
      >
        <ArrowLeft className="w-5 h-5" />
        ← VOLTAR AO FINANCEIRO GERAL
      </Button>
    </div>
  );
};
