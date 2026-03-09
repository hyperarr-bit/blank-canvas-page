import { useState } from "react";
import { Plus, Trash2, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
}

interface FinancialGoalsProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

export const FinancialGoals = ({ goals, setGoals }: FinancialGoalsProps) => {
  const [newGoal, setNewGoal] = useState({ name: "", targetValue: "", currentValue: "" });
  const [showForm, setShowForm] = useState(false);

  const addGoal = () => {
    if (newGoal.name && newGoal.targetValue) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          name: newGoal.name,
          targetValue: parseFloat(newGoal.targetValue),
          currentValue: parseFloat(newGoal.currentValue) || 0,
        },
      ]);
      setNewGoal({ name: "", targetValue: "", currentValue: "" });
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

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border animate-fade-in">
      <div className="table-header flex items-center justify-center gap-2 bg-warning">
        <Target className="w-5 h-5" />
        METAS FINANCEIRAS
      </div>

      <div className="p-4 space-y-4">
        {goals.map((goal) => {
          const progress = (goal.currentValue / goal.targetValue) * 100;
          return (
            <div key={goal.id} className="p-3 rounded-lg bg-muted/30 group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{goal.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteGoal(goal.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <Progress value={progress} className="h-3 mb-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  R$ {goal.currentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <span className="font-semibold text-warning">
                  R$ {goal.targetValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                {[50, 100, 500].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => updateGoalProgress(goal.id, value)}
                    className="text-xs h-7"
                    disabled={goal.currentValue >= goal.targetValue}
                  >
                    +R${value}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}

        {showForm ? (
          <div className="p-3 rounded-lg bg-warning/10 space-y-2">
            <Input
              placeholder="Nome da meta"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Valor alvo"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Valor atual"
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addGoal} className="flex-1 bg-warning hover:bg-warning/90">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        )}
      </div>
    </div>
  );
};
