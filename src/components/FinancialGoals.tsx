import { useState } from "react";
import { Plus, Trash2, Target, X, Pencil, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

interface Goal {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  deadline?: string;
  image?: string;
}

interface TimeframeBlock {
  id: string;
  label: string;
  items: ActionItem[];
}

interface FinancialGoalsProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  actionBlocks?: TimeframeBlock[];
  setActionBlocks?: (blocks: TimeframeBlock[]) => void;
}

const goalColors = [
  { bg: "bg-violet-100 dark:bg-violet-900/30", border: "border-violet-300 dark:border-violet-700", header: "bg-violet-300 dark:bg-violet-700 text-violet-900 dark:text-violet-100" },
  { bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-yellow-300 dark:border-yellow-700", header: "bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/30", border: "border-emerald-300 dark:border-emerald-700", header: "bg-emerald-300 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100" },
  { bg: "bg-rose-100 dark:bg-rose-900/30", border: "border-rose-300 dark:border-rose-700", header: "bg-rose-300 dark:bg-rose-700 text-rose-900 dark:text-rose-100" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/30", border: "border-cyan-300 dark:border-cyan-700", header: "bg-cyan-300 dark:bg-cyan-700 text-cyan-900 dark:text-cyan-100" },
];

const defaultTimeframes: TimeframeBlock[] = [
  { id: "1d", label: "1 DIA", items: [] },
  { id: "1w", label: "1 SEMANA", items: [] },
  { id: "1m", label: "1 MÊS", items: [] },
  { id: "3m", label: "3 MESES", items: [] },
  { id: "1y", label: "1 ANO", items: [] },
];

const timeframeColors: Record<string, { bg: string; border: string }> = {
  "1d": { bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-200 dark:border-yellow-800" },
  "1w": { bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-200 dark:border-pink-800" },
  "1m": { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
  "3m": { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800" },
  "1y": { bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800" },
};

export const FinancialGoals = ({ goals, setGoals, actionBlocks, setActionBlocks }: FinancialGoalsProps) => {
  const [newGoal, setNewGoal] = useState({ name: "", targetValue: "", currentValue: "", deadline: "" });
  const [showForm, setShowForm] = useState(false);
  const [newItems, setNewItems] = useState<Record<string, string>>({});

  const blocks = actionBlocks || defaultTimeframes;
  const setBlocks = setActionBlocks || (() => {});

  const addGoal = () => {
    if (newGoal.name && newGoal.targetValue) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          name: newGoal.name,
          targetValue: parseFloat(newGoal.targetValue),
          currentValue: parseFloat(newGoal.currentValue) || 0,
          deadline: newGoal.deadline || undefined,
        },
      ]);
      setNewGoal({ name: "", targetValue: "", currentValue: "", deadline: "" });
      setShowForm(false);
    }
  };

  const updateGoalProgress = (id: string, addedValue: number) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, currentValue: Math.min(g.currentValue + addedValue, g.targetValue) } : g
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const addActionItem = (blockId: string) => {
    const text = newItems[blockId];
    if (!text?.trim()) return;
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, items: [...b.items, { id: Date.now().toString(), text, done: false }] } : b));
    setNewItems({ ...newItems, [blockId]: "" });
  };

  const toggleActionItem = (blockId: string, itemId: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, items: b.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) } : b));
  };

  const removeActionItem = (blockId: string, itemId: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, items: b.items.filter(i => i.id !== itemId) } : b));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border">
        <div className="table-header flex items-center justify-center gap-2 bg-warning">
          <Target className="w-5 h-5" />
          METAS FINANCEIRAS
        </div>

        <div className="p-4 space-y-4">
          {/* Goal Cards */}
          <AnimatePresence>
            {goals.map((goal, idx) => {
              const color = goalColors[idx % goalColors.length];
              const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-xl border overflow-hidden ${color.bg} ${color.border}`}
                >
                  {/* Goal Title Header */}
                  <div className={`${color.header} px-4 py-3 text-center`}>
                    <h3 className="font-black text-base tracking-wide uppercase">{goal.name}</h3>
                  </div>

                  {/* Goal Body */}
                  <div className="p-4 space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/50 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>R$ {goal.currentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      <span className="font-bold">{progress.toFixed(0)}%</span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1 text-sm">
                      <p><span className="font-bold">META:</span> R$ {goal.targetValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                      {goal.deadline && (
                        <p className="flex items-center gap-1">
                          <span className="font-bold">Quando quero bater essa meta:</span> {goal.deadline}
                        </p>
                      )}
                    </div>

                    {/* Quick add buttons */}
                    <div className="flex gap-2 pt-1">
                      {[100, 500, 1000].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          onClick={() => updateGoalProgress(goal.id, value)}
                          className="text-xs h-7 flex-1 bg-white/50 dark:bg-white/10"
                          disabled={goal.currentValue >= goal.targetValue}
                        >
                          +R${value}
                        </Button>
                      ))}
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-xs text-destructive/60 hover:text-destructive h-6 px-2"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Remover
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Goal Form */}
          {showForm ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-warning/10 border border-warning/30 space-y-3"
            >
              <Input
                placeholder="Nome da meta (ex: Carro dos Sonhos)"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Valor alvo (R$)"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Valor atual (R$)"
                  value={newGoal.currentValue}
                  onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
                />
              </div>
              <Input
                placeholder="Prazo (ex: Outubro de 2025)"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={addGoal} className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground">
                  Salvar Meta
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="w-full border-dashed border-2 py-6 text-base"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Meta
            </Button>
          )}
        </div>
      </div>

      {/* Action Plan Section */}
      <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border">
        <div className="table-header flex items-center justify-center gap-2 bg-muted">
          <span className="text-foreground font-black text-sm tracking-wider">
            O QUE EU PRECISO FAZER PARA ATINGIR ESSAS METAS EM...
          </span>
        </div>

        <div className="p-4 space-y-4">
          {blocks.map((block) => {
            const colors = timeframeColors[block.id] || { bg: "bg-muted/30", border: "border-border" };
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border-2 ${colors.bg} ${colors.border} overflow-hidden`}
              >
                <div className="px-4 pt-4 pb-2">
                  <h4 className="font-black text-sm tracking-wider">{block.label}</h4>
                </div>
                <div className="px-4 pb-4 space-y-2">
                  {block.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <Checkbox
                        checked={item.done}
                        onCheckedChange={() => toggleActionItem(block.id, item.id)}
                        className="h-4 w-4 rounded-full"
                      />
                      <span className={`flex-1 text-sm ${item.done ? "line-through text-muted-foreground" : ""}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => removeActionItem(block.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox disabled className="h-4 w-4 rounded-full opacity-30" />
                    <Input
                      placeholder="Adicionar uma tarefa..."
                      value={newItems[block.id] || ""}
                      onChange={(e) => setNewItems({ ...newItems, [block.id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addActionItem(block.id)}
                      className="h-7 text-sm border-0 bg-transparent shadow-none px-0 focus-visible:ring-0 text-muted-foreground"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
