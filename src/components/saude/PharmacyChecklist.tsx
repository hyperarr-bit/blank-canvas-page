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

    // Discount from stock if marking as taken
    if (!alreadyTaken) {
      setSupplements(prev => prev.map(s => s.id === id ? { ...s, stock: Math.max(0, s.stock - 1) } : s));
    } else {
      setSupplements(prev => prev.map(s => s.id === id ? { ...s, stock: s.stock + 1 } : s));
    }
  };

  const addSupplement = () => {
    if (!newName.trim()) return;
    setSupplements(prev => [...prev, {
      id: Date.now().toString(),
      name: newName.trim(),
      time: newTime,
      stock: 30,
      dosesPerDay: 1,
    }]);
    setNewName("");
  };

  const removeSupplement = (id: string) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
  };

  const timeGroups = ["Manhã", "Tarde", "Noite"];

  return (
    <div className="saude-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="w-4 h-4 text-saude-green" />
        <span className="text-xs font-bold uppercase tracking-wider">Farmácia Digital</span>
        <span className="ml-auto text-[10px] text-saude-muted">
          {takenToday.length}/{supplements.length} tomados
        </span>
      </div>

      {timeGroups.map(time => {
        const items = supplements.filter(s => s.time === time);
        if (items.length === 0) return null;

        return (
          <div key={time} className="mb-3">
            <p className="text-[10px] font-bold text-saude-muted uppercase tracking-widest mb-1.5">{time}</p>
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
                    className={`flex items-center gap-3 p-2.5 rounded-xl mb-1.5 transition-colors ${taken ? "bg-saude-green/10" : "bg-saude-card/80"}`}
                  >
                    <button
                      onClick={() => toggleTaken(s.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${taken ? "bg-saude-green border-saude-green" : "border-saude-muted/30 hover:border-saude-green/50"}`}
                    >
                      {taken && <Check className="w-3.5 h-3.5 text-black" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${taken ? "line-through text-saude-muted" : ""}`}>{s.name}</p>
                      {lowStock && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Package className="w-3 h-3 text-saude-yellow" />
                          <span className="text-[10px] text-saude-yellow font-medium">Estoque: {s.stock} doses</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeSupplement(s.id)} className="text-saude-muted hover:text-saude-red transition-colors">
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
          className="text-xs h-9 bg-saude-card border-saude-card"
        />
        <select
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
          className="text-xs h-9 rounded-lg bg-saude-card border border-saude-card px-2 text-foreground"
        >
          {timeGroups.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          onClick={addSupplement}
          className="h-9 w-9 rounded-lg bg-saude-green/20 hover:bg-saude-green/30 text-saude-green flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
