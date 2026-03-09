import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
  { value: "alimentacao", label: "Alimentação", color: "bg-orange-100 text-orange-700" },
  { value: "restaurante", label: "Restaurante", color: "bg-amber-100 text-amber-700" },
  { value: "transporte", label: "Transporte", color: "bg-blue-100 text-blue-700" },
  { value: "lazer", label: "Lazer", color: "bg-purple-100 text-purple-700" },
  { value: "saude", label: "Saúde", color: "bg-red-100 text-red-700" },
  { value: "educacao", label: "Educação", color: "bg-green-100 text-green-700" },
  { value: "vestuario", label: "Vestuário", color: "bg-pink-100 text-pink-700" },
  { value: "eletrodomesticos", label: "Eletrodomésticos", color: "bg-slate-100 text-slate-700" },
  { value: "presente", label: "Presente", color: "bg-rose-100 text-rose-700" },
  { value: "casa", label: "Casa", color: "bg-yellow-100 text-yellow-700" },
  { value: "outros", label: "Outros", color: "bg-gray-100 text-gray-700" },
];

const paymentMethods = ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Boleto"];

export const ExpenseTable = ({ expenses, setExpenses }: ExpenseTableProps) => {
  const [newExpense, setNewExpense] = useState({
    description: "", category: "", value: "", date: "", paymentMethod: "",
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

  const getCategoryStyle = (v: string) => categories.find((c) => c.value === v)?.color || "bg-gray-100 text-gray-700";
  const getCategoryLabel = (v: string) => categories.find((c) => c.value === v)?.label || v;

  const total = expenses.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border animate-fade-in">
      <div className="bg-income py-2 px-4">
        <span className="font-bold text-sm text-income-foreground tracking-wide">CUSTOS VARIÁVEIS</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Descrição</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground text-xs">Categoria</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground text-xs">Valor</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground text-xs">Data</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground text-xs">Forma de Pagamento</th>
              <th className="px-3 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2">{expense.description}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`category-badge ${getCategoryStyle(expense.category)}`}>
                    {getCategoryLabel(expense.category)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{expense.value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</td>
                <td className="px-3 py-2 text-center text-muted-foreground text-xs">
                  {new Date(expense.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="category-badge bg-accent/15 text-accent">{expense.paymentMethod}</span>
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => deleteExpense(expense.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-muted/20">
              <td className="px-3 py-2">
                <Input placeholder="+ New" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} className="h-7 text-xs border-0 bg-transparent shadow-none px-0 focus-visible:ring-0" />
              </td>
              <td className="px-3 py-2">
                <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                  <SelectTrigger className="h-7 text-xs border-0 bg-transparent shadow-none"><SelectValue placeholder="Categoria" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </td>
              <td className="px-3 py-2">
                <Input type="number" placeholder="0" value={newExpense.value} onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })} className="h-7 text-xs border-0 bg-transparent shadow-none px-0 text-right focus-visible:ring-0" />
              </td>
              <td className="px-3 py-2">
                <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="h-7 text-xs border-0 bg-transparent shadow-none px-0 focus-visible:ring-0" />
              </td>
              <td className="px-3 py-2">
                <Select value={newExpense.paymentMethod} onValueChange={(v) => setNewExpense({ ...newExpense, paymentMethod: v })}>
                  <SelectTrigger className="h-7 text-xs border-0 bg-transparent shadow-none"><SelectValue placeholder="Forma" /></SelectTrigger>
                  <SelectContent>{paymentMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </td>
              <td className="px-3 py-2">
                <button onClick={addExpense} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td className="px-3 py-2 text-xs text-muted-foreground" colSpan={2}>SUM</td>
              <td className="px-3 py-2 text-right font-bold tabular-nums" colSpan={4}>
                {total.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
