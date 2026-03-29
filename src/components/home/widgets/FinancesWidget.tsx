import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useUserData } from "@/hooks/use-user-data";
import { WidgetSize } from "@/hooks/use-home-widgets";
import { useState } from "react";

export const FinancesWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const { get, set } = useUserData();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickAmount, setQuickAmount] = useState("");

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleQuickExpense = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!quickName || !quickAmount) return;
    const expenses = get<any[]>("core-expenses", []);
    const newExpense = { id: Date.now().toString(), name: quickName, amount: parseFloat(quickAmount), category: "Outros", date: new Date().toISOString().slice(0, 10) };
    set("core-expenses", [...expenses, newExpense]);
    setQuickName(""); setQuickAmount(""); setShowQuickAdd(false);
  };

  const expenses = get<any[]>("core-expenses", []);
  const lastExpenses = expenses.slice(-2).reverse();

  if (size === "small") {
    return (
      <button onClick={() => navigate("/financas")} className="w-full text-left rounded-xl border border-border overflow-hidden">
        <div className="bg-amber-200 dark:bg-amber-800/50 px-3 py-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">💰 FINANÇAS</h3>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 p-3">
          <p className={`text-sm font-bold ${data.monthBalance >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmt(data.monthBalance)}</p>
          {data.nextBillName && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">📅 {data.nextBillName}</p>}
        </div>
      </button>
    );
  }

  return (
    <div className="w-full text-left rounded-xl border border-border overflow-hidden">
      <div className="bg-amber-200 dark:bg-amber-800/50 px-4 py-2 flex items-center justify-between">
        <button onClick={() => navigate("/financas")} className="text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">💰 FINANÇAS</button>
        <button onClick={(e) => { e.stopPropagation(); setShowQuickAdd(!showQuickAdd); }} className="w-6 h-6 rounded-md bg-amber-300/50 dark:bg-amber-700/50 text-amber-800 dark:text-amber-200 flex items-center justify-center">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/20 p-4">
        <p className={`text-xl font-bold ${data.monthBalance >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmt(data.monthBalance)}</p>
        {lastExpenses.length > 0 && (
          <div className="mt-2 space-y-1">
            {lastExpenses.map((exp: any) => (
              <div key={exp.id} className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground truncate flex-1">{exp.name}</span>
                <span className="text-destructive font-medium ml-2">-{fmt(Number(exp.amount) || 0)}</span>
              </div>
            ))}
          </div>
        )}
        {data.nextBillName && <p className="text-[10px] text-muted-foreground mt-2">📅 Próxima: {data.nextBillName}</p>}
        {showQuickAdd && (
          <form onSubmit={handleQuickExpense} className="mt-3 space-y-2 border-t border-amber-200/50 dark:border-amber-800/30 pt-3" onClick={e => e.stopPropagation()}>
            <input value={quickName} onChange={e => setQuickName(e.target.value)} placeholder="Descrição" className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background" />
            <div className="flex gap-2">
              <input value={quickAmount} onChange={e => setQuickAmount(e.target.value)} placeholder="Valor" type="number" step="0.01" className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background" />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Salvar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
