import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Plus, Trash2, Check, Package } from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Input } from "@/components/ui/input";

interface Supplement {
  id: string;
  name: string;
  time: string;
  stock: number;
  dosesPerDay: number;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export const PharmacyChecklist = () => {
  const today = todayStr();
  const [supplements, setSupplements] = usePersistedState<Supplement[]>("core-saude-supplements", []);
  const [supplementLog, setSupplementLog] = usePersistedState<Record<string, string[]>>("core-saude-supplement-log", {});
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("Manhã");
  const takenToday = supplementLog[today] || [];

  const toggleTaken = (id: string) => {
    const alreadyTaken = takenToday.includes(id);
    const newTaken = alreadyTaken ? takenToday.filter(x => x !== id) : [...takenToday, id];
    setSupplementLog(prev => ({ ...prev, [today]: newTaken }));
    if (!alreadyTaken) {
      setSupplements(prev => prev.map(s => s.id === id ? { ...s, stock: Math.max(0, s.stock - 1) } : s));
    } else {
      setSupplements(prev => prev.map(s => s.id === id ? { ...s, stock: s.stock + 1 } : s));
    }
  };

  const addSupplement = () => {
    if (!newName.trim()) return;
    setSupplements(prev => [...prev, { id: Date.now().toString(), name: newName.trim(), time: newTime, stock: 30, dosesPerDay: 1 }]);
    setNewName("");
  };

  const removeSupplement = (id: string) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
  };

  const timeGroups = ["Manhã", "Tarde", "Noite"];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="w-4 h-4 text-[hsl(var(--saude-green))]" />
        <span className="text-xs font-bold uppercase tracking-wider">Farmácia Digital</span>
        <span className="ml-auto text-[10px] text-muted-foreground">{takenToday.length}/{supplements.length} tomados</span>
      </div>

      {timeGroups.map(time => {
        const items = supplements.filter(s => s.time === time);
        if (items.length === 0) return null;

        return (
          <div key={time} className="mb-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{time}</p>
            <AnimatePresence>
              {items.map(s => {
                const taken = takenToday.includes(s.id);
                const lowStock = s.stock <= 5;
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg mb-1.5 transition-colors border ${taken ? "bg-[hsl(var(--saude-green)/0.08)] border-[hsl(var(--saude-green)/0.15)]" : "bg-muted/30 border-transparent"}`}
                  >
                    <button
                      onClick={() => toggleTaken(s.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${taken ? "bg-[hsl(var(--saude-green))] border-[hsl(var(--saude-green))]" : "border-muted-foreground/30 hover:border-[hsl(var(--saude-green)/0.5)]"}`}
                    >
                      {taken && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${taken ? "line-through text-muted-foreground" : "text-foreground"}`}>{s.name}</p>
                      {lowStock && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Package className="w-3 h-3 text-[hsl(var(--saude-yellow))]" />
                          <span className="text-[10px] text-[hsl(var(--saude-yellow))] font-medium">Estoque: {s.stock} doses</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeSupplement(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Add form */}
      <div className="flex gap-2 mt-3">
        <Input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addSupplement()}
          placeholder="Novo suplemento..."
          className="text-xs h-9"
        />
        <select
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
          className="text-xs h-9 rounded-lg bg-muted border border-input px-2 text-foreground"
        >
          {timeGroups.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          onClick={addSupplement}
          className="h-9 w-9 rounded-lg bg-[hsl(var(--saude-green)/0.15)] hover:bg-[hsl(var(--saude-green)/0.25)] text-[hsl(var(--saude-green))] flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
