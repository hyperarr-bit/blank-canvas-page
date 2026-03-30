import { useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Bill {
  id: string;
  name: string;
  paid: boolean;
}

interface DueDay {
  day: number;
  color: string;
  bills: Bill[];
}

interface BillsDueCardsProps {
  dueDays: DueDay[];
  setDueDays: (days: DueDay[]) => void;
}

const colorPalette = [
  { card: "bg-yellow-50 border-yellow-200", header: "bg-yellow-300 text-yellow-900" },
  { card: "bg-slate-50 border-slate-200", header: "bg-slate-400 text-slate-50" },
  { card: "bg-indigo-50 border-indigo-200", header: "bg-indigo-400 text-indigo-50" },
  { card: "bg-emerald-50 border-emerald-200", header: "bg-emerald-400 text-emerald-50" },
  { card: "bg-rose-50 border-rose-200", header: "bg-rose-400 text-rose-50" },
  { card: "bg-cyan-50 border-cyan-200", header: "bg-cyan-400 text-cyan-50" },
  { card: "bg-orange-50 border-orange-200", header: "bg-orange-400 text-orange-50" },
  { card: "bg-purple-50 border-purple-200", header: "bg-purple-400 text-purple-50" },
];

export const BillsDueCards = ({ dueDays, setDueDays }: BillsDueCardsProps) => {
  const [newBills, setNewBills] = useState<Record<number, string>>({});

  const addBill = (day: number) => {
    const name = newBills[day];
    if (!name?.trim()) return;
    setDueDays(dueDays.map((d) => d.day === day ? { ...d, bills: [...d.bills, { id: Date.now().toString(), name, paid: false }] } : d));
    setNewBills({ ...newBills, [day]: "" });
  };

  const toggleBill = (day: number, billId: string) => {
    setDueDays(dueDays.map((d) => d.day === day ? { ...d, bills: d.bills.map((b) => b.id === billId ? { ...b, paid: !b.paid } : b) } : d));
  };

  const removeBill = (day: number, billId: string) => {
    setDueDays(dueDays.map((d) => d.day === day ? { ...d, bills: d.bills.filter((b) => b.id !== billId) } : d));
  };

  return (
    <div className="animate-fade-in">
      <div className="table-header-dark rounded-t-lg">VENCIMENTOS DAS CONTAS</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-card border border-t-0 border-border rounded-b-lg">
        {dueDays.map((dueDay) => {
          const style = dayStyles[dueDay.day] || { card: "bg-gray-50 border-gray-200", header: "bg-gray-400 text-gray-50" };
          return (
            <div key={dueDay.day} className={`rounded-lg border overflow-hidden ${style.card}`}>
              <div className={`${style.header} px-3 py-2 flex items-center justify-between`}>
                <span className="font-bold text-sm">Dia {dueDay.day}</span>
                <span className="text-xs opacity-75">{dueDay.bills.filter(b => b.paid).length}/{dueDay.bills.length}</span>
              </div>
              <div className="p-3 space-y-1.5">
                {dueDay.bills.map((bill) => (
                  <div key={bill.id} className="flex items-center gap-2 group">
                    <Checkbox checked={bill.paid} onCheckedChange={() => toggleBill(dueDay.day, bill.id)} className="h-3.5 w-3.5 rounded-full" />
                    <span className={`flex-1 text-xs ${bill.paid ? "line-through text-muted-foreground" : ""}`}>{bill.name}</span>
                    <button onClick={() => removeBill(dueDay.day, bill.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-1 pt-1">
                  <Checkbox disabled className="h-3.5 w-3.5 rounded-full opacity-30" />
                  <Input
                    placeholder="Add a task..."
                    value={newBills[dueDay.day] || ""}
                    onChange={(e) => setNewBills({ ...newBills, [dueDay.day]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addBill(dueDay.day)}
                    className="h-6 text-xs border-0 bg-transparent shadow-none px-0 focus-visible:ring-0 text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
