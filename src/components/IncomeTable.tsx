import { useState } from "react";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Income {
  id: string;
  description: string;
  value: number;
  date: string;
}

interface IncomeTableProps {
  incomes: Income[];
  setIncomes: (incomes: Income[]) => void;
}

export const IncomeTable = ({ incomes, setIncomes }: IncomeTableProps) => {
  const [newIncome, setNewIncome] = useState({ description: "", value: "", date: "" });

  const addIncome = () => {
    if (newIncome.description && newIncome.value) {
      setIncomes([
        ...incomes,
        {
          id: Date.now().toString(),
          description: newIncome.description,
          value: parseFloat(newIncome.value),
          date: newIncome.date || new Date().toISOString().split("T")[0],
        },
      ]);
      setNewIncome({ description: "", value: "", date: "" });
    }
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter((i) => i.id !== id));
  };

  const total = incomes.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="bg-income/30 rounded-xl overflow-hidden animate-fade-in">
      <div className="table-header flex items-center justify-center gap-2 bg-success">
        <DollarSign className="w-5 h-5" />
        RECEITAS
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-income/50">
              <th className="table-cell text-left font-semibold">Descrição</th>
              <th className="table-cell text-right font-semibold">Valor</th>
              <th className="table-cell text-center font-semibold">Data</th>
              <th className="table-cell w-12"></th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id} className="hover:bg-income/20 transition-colors">
                <td className="table-cell">{income.description}</td>
                <td className="table-cell text-right font-medium text-success">
                  R$ {income.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td className="table-cell text-center text-muted-foreground">
                  {new Date(income.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="table-cell">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteIncome(income.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            <tr className="bg-income/30">
              <td className="table-cell">
                <Input
                  placeholder="Nova receita..."
                  value={newIncome.description}
                  onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                  className="h-8 bg-background/50"
                />
              </td>
              <td className="table-cell">
                <Input
                  type="number"
                  placeholder="0,00"
                  value={newIncome.value}
                  onChange={(e) => setNewIncome({ ...newIncome, value: e.target.value })}
                  className="h-8 bg-background/50 text-right"
                />
              </td>
              <td className="table-cell">
                <Input
                  type="date"
                  value={newIncome.date}
                  onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                  className="h-8 bg-background/50"
                />
              </td>
              <td className="table-cell">
                <Button size="icon" onClick={addIncome} className="h-8 w-8 bg-success hover:bg-success/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-success/20">
              <td className="table-cell font-bold">TOTAL</td>
              <td className="table-cell text-right font-bold text-success text-lg" colSpan={3}>
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
