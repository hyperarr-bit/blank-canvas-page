import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const days = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
const defaultHabits = ["Acordar 6am", "Devocional", "Exercício Físico", "Ler 10 páginas", "Tomar 2L de água"];

const hours = [
  "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "19:30"
];

const defaultSchedule: Record<string, Record<string, string>> = {
  "6:00": { Segunda: "Acordar", Terça: "Acordar", Quarta: "Acordar", Quinta: "Acordar", Sexta: "Acordar", Sábado: "", Domingo: "" },
  "7:00": { Segunda: "Café e devocional", Terça: "Café e devocional", Quarta: "Café e devocional", Quinta: "Café e devocional", Sexta: "Café e devocional", Sábado: "", Domingo: "" },
  "8:00": { Segunda: "Treino", Terça: "Cardio", Quarta: "Treino", Quinta: "Cardio", Sexta: "Treino", Sábado: "", Domingo: "" },
  "9:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "Trabalhar", Sábado: "Aula de Bike", Domingo: "" },
  "10:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "Trabalhar", Sábado: "", Domingo: "" },
  "11:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "Trabalhar", Sábado: "", Domingo: "" },
  "12:00": { Segunda: "Almoço", Terça: "Almoço", Quarta: "Almoço", Quinta: "Almoço", Sexta: "Almoço", Sábado: "", Domingo: "" },
  "13:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "Trabalhar", Sábado: "", Domingo: "Churrasco em família" },
  "14:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "Trabalhar", Sábado: "", Domingo: "" },
  "15:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "Trabalhar", Sábado: "", Domingo: "" },
  "16:00": { Segunda: "Trabalhar", Terça: "Trabalhar", Quarta: "Trabalhar", Quinta: "Trabalhar", Sexta: "", Sábado: "Manicure", Domingo: "" },
  "17:00": { Segunda: "", Terça: "", Quarta: "", Quinta: "", Sexta: "", Sábado: "Manicure", Domingo: "" },
  "18:00": { Segunda: "BC grupo", Terça: "", Quarta: "", Quinta: "", Sexta: "Experiência do lar", Sábado: "", Domingo: "" },
  "19:00": { Segunda: "", Terça: "Faculdade", Quarta: "", Quinta: "Faculdade", Sexta: "Jantar", Sábado: "", Domingo: "Culto" },
  "19:30": { Segunda: "", Terça: "Faculdade", Quarta: "Faculdade", Quinta: "Faculdade", Sexta: "", Sábado: "", Domingo: "" },
};

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const Rotina = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("semana");

  // Habits state: habits[dayIndex][habitIndex] = checked
  const [habits, setHabits] = usePersistedState<string[]>("rotina-habits", defaultHabits);
  const [habitsChecked, setHabitsChecked] = usePersistedState<Record<string, boolean[]>>(
    "rotina-habits-checked",
    Object.fromEntries(days.map(d => [d, defaultHabits.map(() => false)]))
  );

  // Schedule state
  const [schedule, setSchedule] = usePersistedState<Record<string, Record<string, string>>>(
    "rotina-schedule",
    defaultSchedule
  );

  // Urgencies
  const [urgencies, setUrgencies] = usePersistedState<{ id: string; text: string; done: boolean }[]>("rotina-urgencies", [
    { id: "1", text: "Ir na costureira pro vestido", done: false },
    { id: "2", text: "Resolver o problema chip celular", done: false },
    { id: "3", text: "Revisão projeto faculdade", done: false },
  ]);
  const [newUrgency, setNewUrgency] = useState("");

  // New habit input
  const [newHabit, setNewHabit] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Editing schedule cell
  const [editingCell, setEditingCell] = useState<{ hour: string; day: string } | null>(null);
  const [editCellValue, setEditCellValue] = useState("");

  const toggleHabit = (day: string, habitIndex: number) => {
    const newChecked = { ...habitsChecked };
    if (!newChecked[day]) newChecked[day] = habits.map(() => false);
    newChecked[day] = [...newChecked[day]];
    newChecked[day][habitIndex] = !newChecked[day][habitIndex];
    setHabitsChecked(newChecked);
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits([...habits, newHabit.trim()]);
    // Extend all days' checked arrays
    const newChecked = { ...habitsChecked };
    days.forEach(d => {
      if (!newChecked[d]) newChecked[d] = habits.map(() => false);
      newChecked[d] = [...newChecked[d], false];
    });
    setHabitsChecked(newChecked);
    setNewHabit("");
    setShowAddHabit(false);
  };

  const removeHabit = (index: number) => {
    const newHabits = habits.filter((_, i) => i !== index);
    setHabits(newHabits);
    const newChecked = { ...habitsChecked };
    days.forEach(d => {
      if (newChecked[d]) {
        newChecked[d] = newChecked[d].filter((_, i) => i !== index);
      }
    });
    setHabitsChecked(newChecked);
  };

  const updateScheduleCell = (hour: string, day: string, value: string) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[hour]) newSchedule[hour] = {};
    newSchedule[hour] = { ...newSchedule[hour], [day]: value };
    setSchedule(newSchedule);
  };

  const startEditCell = (hour: string, day: string) => {
    setEditingCell({ hour, day });
    setEditCellValue(schedule[hour]?.[day] || "");
  };

  const saveEditCell = () => {
    if (editingCell) {
      updateScheduleCell(editingCell.hour, editingCell.day, editCellValue);
      setEditingCell(null);
    }
  };

  const addUrgency = () => {
    if (!newUrgency.trim()) return;
    setUrgencies([...urgencies, { id: Date.now().toString(), text: newUrgency.trim(), done: false }]);
    setNewUrgency("");
  };

  const toggleUrgency = (id: string) => {
    setUrgencies(urgencies.map(u => u.id === id ? { ...u, done: !u.done } : u));
  };

  const removeUrgency = (id: string) => {
    setUrgencies(urgencies.filter(u => u.id !== id));
  };

  const scheduleDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const tabs = [
    { id: "semana", label: "MINHA SEMANA" },
    { id: "mes", label: "MEU MÊS" },
    { id: "agenda", label: "MINHA AGENDA" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="hover:bg-muted rounded-md p-1 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">≡</span>
          <h1 className="text-base font-bold tracking-tight">CORE — ROTINA</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`notion-tab whitespace-nowrap text-[11px] ${activeTab === tab.id ? "notion-tab-active" : "hover:bg-muted"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-5 space-y-5">
        {activeTab === "semana" && (
          <>
            {/* Hábitos Diários */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="bg-green-100 border-b border-green-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-green-900">HÁBITOS DIÁRIOS</span>
                  <span>✅</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-green-700"
                  onClick={() => setShowAddHabit(!showAddHabit)}
                >
                  <Plus className="w-3 h-3 mr-1" /> Hábito
                </Button>
              </div>

              {showAddHabit && (
                <div className="p-3 bg-green-50 border-b border-green-200 flex gap-2">
                  <Input
                    placeholder="Nome do hábito..."
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHabit()}
                    className="h-8 text-xs flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={addHabit} className="h-8 text-xs bg-green-600 hover:bg-green-700">Adicionar</Button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-green-50/50">
                      <th className="text-left px-3 py-2 font-bold text-green-900 border-r border-green-100 w-24">DIA</th>
                      {habits.map((habit, i) => (
                        <th key={i} className="px-2 py-2 font-medium text-green-800 border-r border-green-100 min-w-[100px] group">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-center text-[11px]">{habit}</span>
                            <button
                              onClick={() => removeHabit(i)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day} className="border-t border-green-100 hover:bg-green-50/30">
                        <td className="px-3 py-2 font-bold text-[11px] border-r border-green-100 text-foreground">{day}</td>
                        {habits.map((_, hi) => (
                          <td key={hi} className="text-center px-2 py-2 border-r border-green-100">
                            <Checkbox
                              checked={habitsChecked[day]?.[hi] || false}
                              onCheckedChange={() => toggleHabit(day, hi)}
                              className="h-4 w-4 border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grid: Rotina Semanal + Right Column */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-4">
              {/* Rotina Semanal */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-pink-300 to-pink-400 px-4 py-3 flex items-center justify-between">
                  <span className="font-bold text-sm text-white">ROTINA SEMANAL</span>
                  <span>🍎</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-pink-50">
                        <th className="text-left px-2 py-2 font-bold border-r border-pink-100 w-16 text-pink-900">Horário</th>
                        {scheduleDays.map((day) => (
                          <th key={day} className="px-2 py-2 font-medium text-pink-800 border-r border-pink-100 min-w-[90px]">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((hour) => (
                        <tr key={hour} className="border-t border-border/30 hover:bg-muted/20">
                          <td className="px-2 py-1.5 font-mono font-bold text-muted-foreground border-r border-border/30 bg-pink-50/30">{hour}</td>
                          {scheduleDays.map((day) => {
                            const isEditing = editingCell?.hour === hour && editingCell?.day === day;
                            const value = schedule[hour]?.[day] || "";
                            return (
                              <td
                                key={day}
                                className="px-1 py-1 border-r border-border/20 cursor-pointer hover:bg-pink-50/50 transition-colors"
                                onClick={() => !isEditing && startEditCell(hour, day)}
                              >
                                {isEditing ? (
                                  <Input
                                    value={editCellValue}
                                    onChange={(e) => setEditCellValue(e.target.value)}
                                    onBlur={saveEditCell}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEditCell();
                                      if (e.key === "Escape") setEditingCell(null);
                                    }}
                                    className="h-5 text-[10px] border-0 bg-white shadow-sm px-1"
                                    autoFocus
                                  />
                                ) : (
                                  <span className={`text-[10px] ${value ? "text-foreground" : "text-transparent"}`}>
                                    {value || "—"}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Motivational Quote */}
                <div className="bg-card rounded-lg border border-border p-6 text-center">
                  <p className="text-2xl font-black leading-tight tracking-tight">
                    CUMPRA<br />O QUE<br />VOCÊ SE<br />PROMETEU
                  </p>
                </div>

                {/* Urgências */}
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 overflow-hidden">
                  <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
                    <span className="font-bold text-xs text-yellow-900">URGÊNCIAS</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="p-3 space-y-2">
                    {urgencies.map((u) => (
                      <div key={u.id} className="flex items-center gap-2 group">
                        <Checkbox
                          checked={u.done}
                          onCheckedChange={() => toggleUrgency(u.id)}
                          className="h-3.5 w-3.5"
                        />
                        <span className={`flex-1 text-xs ${u.done ? "line-through text-muted-foreground" : "text-yellow-900"}`}>
                          {u.text}
                        </span>
                        <button
                          onClick={() => removeUrgency(u.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox disabled className="h-3.5 w-3.5 opacity-30" />
                      <Input
                        placeholder="Nova urgência..."
                        value={newUrgency}
                        onChange={(e) => setNewUrgency(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addUrgency()}
                        className="h-6 text-xs border-0 bg-transparent shadow-none px-0 focus-visible:ring-0 text-yellow-800 placeholder:text-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "mes" && (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">🚧 Planejamento mensal — em breve!</p>
          </div>
        )}

        {activeTab === "agenda" && (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">🚧 Agenda pessoal — em breve!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rotina;