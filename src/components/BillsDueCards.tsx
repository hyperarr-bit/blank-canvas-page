import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const dayColors: Record<number, string> = {
  5: "bg-yellow-100 border-yellow-300",
  10: "bg-slate-100 border-slate-300",
  20: "bg-indigo-100 border-indigo-300",
  30: "bg-emerald-100 border-emerald-300",
};

const headerColors: Record<number, string> = {
  5: "bg-yellow-400",
  10: "bg-slate-400",
  20: "bg-indigo-400",
  30: "bg-emerald-400",
};

export const BillsDueCards = ({ dueDays, setDueDays }: BillsDueCardsProps) => {
  const [newBills, setNewBills] = useState<Record<number, string>>({});

  const addBill = (day: number) => {
    const billName = newBills[day];
    if (!billName?.trim()) return;

    setDueDays(
      dueDays.map((d) =>
        d.day === day
          ? { ...d, bills: [...d.bills, { id: Date.now().toString(), name: billName, paid: false }] }
          : d
      )
    );
    setNewBills({ ...newBills, [day]: "" });
  };

  const toggleBill = (day: number, billId: string) => {
    setDueDays(
      dueDays.map((d) =>
        d.day === day
          ? {
              ...d,
              bills: d.bills.map((b) => (b.id === billId ? { ...b, paid: !b.paid } : b)),
            }
          : d
      )
    );
  };

  const removeBill = (day: number, billId: string) => {
    setDueDays(
      dueDays.map((d) =>
        d.day === day
          ? { ...d, bills: d.bills.filter((b) => b.id !== billId) }
          : d
      )
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="table-header bg-slate-600 rounded-t-xl">
        VENCIMENTOS DAS CONTAS
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-card rounded-b-xl">
        {dueDays.map((dueDay) => (
          <div
            key={dueDay.day}
            className={`due-card ${dayColors[dueDay.day] || "bg-gray-100"}`}
          >
            <div className={`${headerColors[dueDay.day] || "bg-gray-400"} -mx-4 -mt-4 mb-4 px-4 py-2 rounded-t-xl flex items-center justify-between`}>
              <span className="font-bold text-white">Dia {dueDay.day}</span>
              <span className="text-xs text-white/80">
                {dueDay.bills.filter((b) => b.paid).length}/{dueDay.bills.length}
              </span>
            </div>

            <div className="space-y-2">
              {dueDay.bills.map((bill) => (
                <div key={bill.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={bill.paid}
                    onCheckedChange={() => toggleBill(dueDay.day, bill.id)}
                    className="data-[state=checked]:bg-success"
                  />
                  <span className={`flex-1 text-sm ${bill.paid ? "line-through text-muted-foreground" : ""}`}>
                    {bill.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBill(dueDay.day, bill.id)}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-1 mt-3">
                <Input
                  placeholder="Add conta..."
                  value={newBills[dueDay.day] || ""}
                  onChange={(e) => setNewBills({ ...newBills, [dueDay.day]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addBill(dueDay.day)}
                  className="h-7 text-xs bg-background/50"
                />
                <Button size="icon" onClick={() => addBill(dueDay.day)} className="h-7 w-7">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
