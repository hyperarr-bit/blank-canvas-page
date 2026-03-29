import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/hooks/use-user-data";

interface CountdownItem {
  id: string;
  label: string;
  date: string;
}

const KEY = "core-home-countdowns";

export const CountdownWidget = () => {
  const { get, set: setData } = useUserData();
  const [items, setItems] = useState<CountdownItem[]>(() => get(KEY, []));
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate] = useState("");

  useEffect(() => { setData(KEY, items); }, [items, setData]);

  const addItem = () => {
    if (!newLabel.trim() || !newDate) return;
    setItems(prev => [...prev, { id: Date.now().toString(), label: newLabel.trim(), date: newDate }]);
    setNewLabel(""); setNewDate(""); setAdding(false);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const getDaysLeft = (date: string) => {
    const diff = new Date(date + "T23:59:59").getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-teal-200 dark:bg-teal-800/50 px-4 py-2 flex items-center justify-between">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-teal-900 dark:text-teal-200">🎯 CONTAGEM REGRESSIVA</h4>
        <button onClick={() => setAdding(!adding)} className="w-5 h-5 rounded-md bg-teal-300/50 dark:bg-teal-700/50 flex items-center justify-center">
          <Plus className="w-3 h-3 text-teal-800 dark:text-teal-200" />
        </button>
      </div>
      <div className="bg-teal-50 dark:bg-teal-950/20 p-4">
        {adding && (
          <div className="flex gap-2 mb-3">
            <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Meta ou evento" className="text-xs h-8" onKeyDown={e => e.key === "Enter" && addItem()} />
            <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="text-xs h-8 w-32" />
          </div>
        )}
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">Adicione uma data importante</p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 3).map(item => {
              const days = getDaysLeft(item.date);
              return (
                <motion.div key={item.id} className="flex items-center gap-2" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-sm">🎯</span>
                  <span className="text-xs flex-1 truncate">{item.label}</span>
                  <span className="text-xs font-bold text-primary tabular-nums">{days}d</span>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
