import { useState } from "react";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Expense {
  id: string;
  description: string;
  category: string;
  value: number;
  date: string;
  paymentMethod: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

const categories = [
  { value: "alimentacao", label: "Alimentação", color: "bg-orange-200 text-orange-800" },
  { value: "transporte", label: "Transporte", color: "bg-blue-200 text-blue-800" },
  { value: "lazer", label: "Lazer", color: "bg-purple-200 text-purple-800" },
  { value: "saude", label: "Saúde", color: "bg-red-200 text-red-800" },
  { value: "educacao", label: "Educação", color: "bg-green-200 text-green-800" },
  { value: "vestuario", label: "Vestuário", color: "bg-pink-200 text-pink-800" },
  { value: "casa", label: "Casa", color: "bg-yellow-200 text-yellow-800" },
  { value: "outros", label: "Outros", color: "bg-gray-200 text-gray-800" },
];

const paymentMethods = [
  "Pix",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Dinheiro",
  "Boleto",
];

export const ExpenseTable = ({ expenses, setExpenses }: ExpenseTableProps) => {
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "",
    value: "",
    date: "",
    paymentMethod: "",
  });

  const addExpense = () => {
    if (newExpense.description && newExpense.value) {
      setExpenses([
        ...expenses,
        {
          id: Date.now().toString(),
          description: newExpense.description,
          category: newExpense.category || "outros",
          value: parseFloat(newExpense.value),
          date: newExpense.date || new Date().toISOString().split("T")[0],
          paymentMethod: newExpense.paymentMethod || "Pix",
        },
      ]);
      setNewExpense({ description: "", category: "", value: "", date: "", paymentMethod: "" });
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const getCategoryStyle = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue)?.color || "bg-gray-200 text-gray-800";
  };

  const getCategoryLabel = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue)?.label || categoryValue;
  };

  const total = expenses.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="bg-expense/30 rounded-xl overflow-hidden animate-fade-in">
      <div className="table-header flex items-center justify-center gap-2 bg-primary">
        <ShoppingBag className="w-5 h-5" />
        CUSTOS VARIÁVEIS
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-expense/50">
              <th className="table-cell text-left font-semibold">Descrição</th>
              <th className="table-cell text-center font-semibold">Categoria</th>
              <th className="table-cell text-right font-semibold">Valor</th>
              <th className="table-cell text-center font-semibold">Data</th>
              <th className="table-cell text-center font-semibold">Pagamento</th>
              <th className="table-cell w-12"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-expense/20 transition-colors">
                <td className="table-cell">{expense.description}</td>
                <td className="table-cell text-center">
                  <span className={`category-badge ${getCategoryStyle(expense.category)}`}>
                    {getCategoryLabel(expense.category)}
                  </span>
                </td>
                <td className="table-cell text-right font-medium text-destructive">
                  R$ {expense.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td className="table-cell text-center text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="table-cell text-center">
                  <span className="category-badge bg-primary/20 text-primary">
                    {expense.paymentMethod}
                  </span>
                </td>
                <td className="table-cell">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExpense(expense.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            <tr className="bg-expense/30">
              <td className="table-cell">
                <Input
                  placeholder="Novo gasto..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="h-8 bg-background/50"
                />
              </td>
              <td className="table-cell">
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger className="h-8 bg-background/50">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="table-cell">
                <Input
                  type="number"
                  placeholder="0,00"
                  value={newExpense.value}
                  onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })}
                  className="h-8 bg-background/50 text-right"
                />
              </td>
              <td className="table-cell">
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="h-8 bg-background/50"
                />
              </td>
              <td className="table-cell">
                <Select
                  value={newExpense.paymentMethod}
                  onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}
                >
                  <SelectTrigger className="h-8 bg-background/50">
                    <SelectValue placeholder="Forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="table-cell">
                <Button size="icon" onClick={addExpense} className="h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-primary/20">
              <td className="table-cell font-bold" colSpan={2}>TOTAL</td>
              <td className="table-cell text-right font-bold text-destructive text-lg" colSpan={4}>
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
