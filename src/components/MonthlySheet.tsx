import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { IncomeTable } from "@/components/IncomeTable";
import { ExpenseTable } from "@/components/ExpenseTable";
import { FixedExpensesTable } from "@/components/FixedExpensesTable";
import { BillsDueCards } from "@/components/BillsDueCards";
import { InstallmentTracker } from "@/components/InstallmentTracker";
import { Notes } from "@/components/Notes";
import { Calculator } from "@/components/Calculator";
import { FinancialSummary } from "@/components/FinancialSummary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

interface MonthlySheetProps {
  month: string;
  open: boolean;
  onClose: () => void;
}

export const MonthlySheet = ({ month, open, onClose }: MonthlySheetProps) => {
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="hover:bg-muted rounded-md p-1 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <DialogTitle className="text-base font-bold tracking-tight">
              📅 {month.toUpperCase()} — MEU FINANCEIRO
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-4 py-5 space-y-5">
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

          {/* Balanço */}
          <div className={`rounded-lg p-3 border text-center ${
            totalIncome - totalExpenses - totalFixed - totalDebts >= 0 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-red-500/10 border-red-500/30"
          }`}>
            <span className="text-[10px] font-bold text-muted-foreground">BALANÇO DO MÊS</span>
            <p className={`text-lg font-bold ${
              totalIncome - totalExpenses - totalFixed - totalDebts >= 0 
                ? "text-green-500" 
                : "text-destructive"
            }`}>
              R$ {(totalIncome - totalExpenses - totalFixed - totalDebts).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
