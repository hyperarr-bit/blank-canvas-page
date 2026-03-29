import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface MonthBudget {
  month: string;
  value: number;
  hasNote: boolean;
}

interface MonthlyBudgetProps {
  budgets: MonthBudget[];
  setBudgets: (budgets: MonthBudget[]) => void;
}

export const MonthlyBudget = ({ budgets, setBudgets }: MonthlyBudgetProps) => {
  const updateValue = (index: number, value: string) => {
    const newBudgets = [...budgets];
    newBudgets[index] = { ...newBudgets[index], value: parseFloat(value) || 0 };
    setBudgets(newBudgets);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border animate-fade-in">
      <div className="bg-accent/20 border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="font-bold text-xs tracking-wide text-foreground">ORÇAMENTO MENSAL</span>
        <span>💰</span>
      </div>
      <div className="divide-y divide-border/50">
        {budgets.map((b, i) => (
          <div key={b.month} className="flex items-center px-3 py-1.5 hover:bg-muted/20 transition-colors">
            <span className="text-xs flex-1">{b.month}</span>
            <span className="text-xs text-muted-foreground mr-2">→</span>
            <Input
              type="number"
              value={b.value || ""}
              onChange={(e) => updateValue(i, e.target.value)}
              placeholder="0"
              className="h-6 w-16 text-xs border-0 bg-transparent shadow-none px-0 text-right focus-visible:ring-0"
            />
            <button className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
              <FileText className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
