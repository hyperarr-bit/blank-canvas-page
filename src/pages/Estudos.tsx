import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Trash2, Check, GraduationCap, BookOpen, ClipboardList,
  Calendar, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const weekDays = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA"];
const dayColors: Record<string, string> = {
  SEGUNDA: "bg-blue-100 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30",
  TERÇA: "bg-indigo-100 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30",
  QUARTA: "bg-green-100 dark:bg-green-500/10 border-green-300 dark:border-green-500/30",
  QUINTA: "bg-yellow-100 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/30",
  SEXTA: "bg-pink-100 dark:bg-pink-500/10 border-pink-300 dark:border-pink-500/30",
};
const dayTopColors: Record<string, string> = {
  SEGUNDA: "bg-blue-500", TERÇA: "bg-indigo-500", QUARTA: "bg-green-500",
  QUINTA: "bg-yellow-500", SEXTA: "bg-pink-500",
};

const defaultScheduleHours = ["7h30", "8h", "9h", "10h", "11h", "12h", "13h", "14h"];

const Estudos = () => {
  const navigate = useNavigate();

  // CONTEÚDO TRACKER
  const [subjects, setSubjects] = usePersistedState<{id: string; name: string; leitura: boolean; resumo: boolean; exercicio: boolean; revisao: boolean}[]>("estudos-subjects", []);
  const [newSubject, setNewSubject] = useState("");

  // PROVAS E ENTREGAS
  const [exams, setExams] = usePersistedState<{id: string; title: string; date: string; time: string; color: string; done: boolean}[]>("estudos-exams", []);
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [newExamTime, setNewExamTime] = useState("");

  // GRADE HORÁRIA
  const [schedule, setSchedule] = usePersistedState<Record<string, Record<string, string>>>("estudos-schedule", {
    "7h30": { SEGUNDA: "Ética e Responsabilidade Social", TERÇA: "", QUARTA: "", QUINTA: "", SEXTA: "Administração Mercadológica" },
    "8h": { SEGUNDA: "Ética e Responsabilidade Social", TERÇA: "", QUARTA: "Gestão de Projetos", QUINTA: "Contabilidade", SEXTA: "" },
    "9h": { SEGUNDA: "Teoria Geral da Administração", TERÇA: "", QUARTA: "Microeconomia", QUINTA: "Administração Mercadológica", SEXTA: "" },
    "10h": { SEGUNDA: "Teoria Geral da Administração", TERÇA: "", QUARTA: "Microeconomia", QUINTA: "", SEXTA: "" },
    "11h": { SEGUNDA: "", TERÇA: "", QUARTA: "", QUINTA: "", SEXTA: "" },
    "12h": { SEGUNDA: "", TERÇA: "", QUARTA: "", QUINTA: "", SEXTA: "" },
  });
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editCellValue, setEditCellValue] = useState("");

  // TAREFAS DA SEMANA
  const [weekTasks, setWeekTasks] = usePersistedState<Record<string, {text: string; done: boolean}[]>>("estudos-week-tasks", {
    SEGUNDA: [{ text: "Assistir aulas atrasadas", done: true }, { text: "Ler livro de G. Projetos", done: false }],
    TERÇA: [{ text: "Enviar trabalho para correção", done: true }, { text: "", done: false }],
    QUARTA: [{ text: "Aulas atrasadas", done: false }],
    QUINTA: [{ text: "Entregar trabalho final", done: false }],
    SEXTA: [],
  });
  const [newWeekTask, setNewWeekTask] = useState<Record<string, string>>({});

  // CADERNO / ANOTAÇÕES
  const [notebooks, setNotebooks] = usePersistedState<{id: string; title: string; content: string; date: string}[]>("estudos-notebooks", []);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");

  // LIVROS / MATERIAIS
  const [studyBooks, setStudyBooks] = usePersistedState<{id: string; title: string; subject: string; status: string}[]>("estudos-books", []);
  const [newBookTitle, setNewBookTitle] = useState("");

  // POMODORO ESTUDOS
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = usePersistedState("estudos-pomodoro-count", 0);

  useEffect(() => {
    if (!pomodoroRunning || pomodoroTime <= 0) return;
    const t = setTimeout(() => setPomodoroTime(prev => prev - 1), 1000);
    if (pomodoroTime === 1) { setPomodoroRunning(false); setPomodoroCount(pomodoroCount + 1); setPomodoroTime(25 * 60); }
    return () => clearTimeout(t);
  }, [pomodoroRunning, pomodoroTime]);

  const startEditCell = (hour: string, day: string) => {
    setEditingCell(`${hour}-${day}`);
    setEditCellValue(schedule[hour]?.[day] || "");
  };
  const saveCell = (hour: string, day: string) => {
    setSchedule({ ...schedule, [hour]: { ...schedule[hour], [day]: editCellValue } });
    setEditingCell(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-500" /> ESTUDOS EM ORDEM</h1>
            <p className="text-xs text-muted-foreground">Grade, conteúdos, provas, tarefas e anotações</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Tabs defaultValue="estudos" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            {[
              { v: "estudos", l: "ESTUDOS" }, { v: "grade", l: "GRADE" },
              { v: "tarefas", l: "TAREFAS" }, { v: "caderno", l: "CADERNO" },
              { v: "livros", l: "LIVROS" }, { v: "pomodoro", l: "POMODORO" },
            ].map(t => <TabsTrigger key={t.v} value={t.v} className="text-xs px-3 py-1.5">{t.l}</TabsTrigger>)}
          </TabsList>

          {/* ========== ESTUDOS / CONTEÚDO ========== */}
          <TabsContent value="estudos" className="space-y-4">
            {/* Conteúdo Tracker */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">📚 CONTEÚDO</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">Conteúdo</th>
                      <th className="text-center p-2">Leitura</th>
                      <th className="text-center p-2">Resumo</th>
                      <th className="text-center p-2">Exercício</th>
                      <th className="text-center p-2">Revisão</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s, i) => (
                      <tr key={s.id} className="border-b border-border/50">
                        <td className="p-2 font-medium">{s.name}</td>
                        {(["leitura", "resumo", "exercicio", "revisao"] as const).map(field => (
                          <td key={field} className="text-center p-2">
                            <button onClick={() => { const u = [...subjects]; u[i] = { ...s, [field]: !s[field] }; setSubjects(u); }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto ${s[field] ? "bg-blue-500 border-blue-500" : "border-muted-foreground/30"}`}>
                              {s[field] && <Check className="w-3 h-3 text-white" />}
                            </button>
                          </td>
                        ))}
                        <td className="p-2"><button onClick={() => setSubjects(subjects.filter(x => x.id !== s.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 mt-3">
                <Input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Novo conteúdo..." className="text-xs h-8"
                  onKeyDown={e => { if (e.key === "Enter" && newSubject.trim()) { setSubjects([...subjects, { id: Date.now().toString(), name: newSubject.trim(), leitura: false, resumo: false, exercicio: false, revisao: false }]); setNewSubject(""); }}} />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newSubject.trim()) { setSubjects([...subjects, { id: Date.now().toString(), name: newSubject.trim(), leitura: false, resumo: false, exercicio: false, revisao: false }]); setNewSubject(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>

            {/* Provas e Entregas */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3">📝 PROVAS, TRABALHOS E ENTREGAS</h3>
              <div className="space-y-2 mb-3">
                {exams.sort((a, b) => a.date.localeCompare(b.date)).map((ex, i) => (
                  <div key={ex.id} className={`rounded-lg p-3 border ${ex.color} flex items-center gap-3`}>
                    <button onClick={() => { const u = [...exams]; u[i] = { ...ex, done: !ex.done }; setExams(u); }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${ex.done ? "bg-green-500 border-green-500" : "border-muted-foreground/30"}`}>
                      {ex.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${ex.done ? "line-through text-muted-foreground" : ""}`}>{ex.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ex.date + "T12:00:00").toLocaleDateString("pt-BR")} · {ex.time}</p>
                    </div>
                    <button onClick={() => setExams(exams.filter(x => x.id !== ex.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="Título" className="text-xs h-8 flex-1" />
                <Input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} className="text-xs h-8 w-32" />
                <Input value={newExamTime} onChange={e => setNewExamTime(e.target.value)} placeholder="Hora" className="text-xs h-8 w-16" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newExamTitle.trim()) {
                    const colors = ["bg-indigo-200 dark:bg-indigo-500/20 border-indigo-300", "bg-purple-200 dark:bg-purple-500/20 border-purple-300", "bg-yellow-200 dark:bg-yellow-500/20 border-yellow-300", "bg-green-200 dark:bg-green-500/20 border-green-300"];
                    setExams([...exams, { id: Date.now().toString(), title: newExamTitle.trim(), date: newExamDate, time: newExamTime, color: colors[exams.length % colors.length], done: false }]);
                    setNewExamTitle(""); setNewExamDate(""); setNewExamTime("");
                  }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          </TabsContent>

          {/* ========== GRADE HORÁRIA ========== */}
          <TabsContent value="grade" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">🎓 GRADE HORÁRIA</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 w-16">Horário</th>
                      {weekDays.map(d => <th key={d} className="text-center p-2 font-bold">{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(schedule).map(hour => (
                      <tr key={hour} className="border-b border-border/50">
                        <td className="p-2 font-bold text-muted-foreground">{hour}</td>
                        {weekDays.map(day => {
                          const key = `${hour}-${day}`;
                          const val = schedule[hour]?.[day] || "";
                          const isEditing = editingCell === key;
                          return (
                            <td key={day} className="p-1">
                              {isEditing ? (
                                <div className="flex gap-1">
                                  <Input value={editCellValue} onChange={e => setEditCellValue(e.target.value)} className="text-[10px] h-6 min-w-[80px]"
                                    onKeyDown={e => e.key === "Enter" && saveCell(hour, day)} autoFocus />
                                  <button onClick={() => saveCell(hour, day)}><Check className="w-3 h-3" /></button>
                                </div>
                              ) : (
                                <div onClick={() => startEditCell(hour, day)}
                                  className={`rounded p-1.5 text-[10px] min-h-[28px] cursor-pointer hover:bg-muted/50 ${val ? "bg-muted/30" : ""}`}>
                                  {val || "—"}
                                </div>
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
          </TabsContent>

          {/* ========== TAREFAS DA SEMANA ========== */}
          <TabsContent value="tarefas" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weekDays.map(day => {
                const tasks = weekTasks[day] || [];
                return (
                  <div key={day} className={`rounded-xl border p-3 ${dayColors[day]}`}>
                    <div className={`${dayTopColors[day]} text-white rounded-t-lg -m-3 mb-2 p-2`}>
                      <h3 className="text-xs font-bold text-center">{day}</h3>
                    </div>
                    <div className="space-y-1 mt-2">
                      {tasks.filter(t => t.text).map((task, ti) => (
                        <div key={ti} className="flex items-center gap-2 group">
                          <button onClick={() => {
                            const u = { ...weekTasks }; u[day] = tasks.map((t, j) => j === ti ? { ...t, done: !t.done } : t); setWeekTasks(u);
                          }} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${task.done ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                            {task.done && <Check className="w-3 h-3 text-primary-foreground" />}
                          </button>
                          <span className={`text-xs flex-1 ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.text}</span>
                          <button onClick={() => {
                            const u = { ...weekTasks }; u[day] = tasks.filter((_, j) => j !== ti); setWeekTasks(u);
                          }} className="opacity-0 group-hover:opacity-100"><X className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Input value={newWeekTask[day] || ""} onChange={e => setNewWeekTask({ ...newWeekTask, [day]: e.target.value })}
                        placeholder="Nova tarefa..." className="text-xs h-6 bg-white/50 dark:bg-background/50" onKeyDown={e => {
                          if (e.key === "Enter" && newWeekTask[day]?.trim()) {
                            setWeekTasks({ ...weekTasks, [day]: [...tasks, { text: newWeekTask[day].trim(), done: false }] });
                            setNewWeekTask({ ...newWeekTask, [day]: "" });
                          }
                        }} />
                      <Button size="sm" className="h-6 px-2" onClick={() => {
                        if (newWeekTask[day]?.trim()) {
                          setWeekTasks({ ...weekTasks, [day]: [...tasks, { text: newWeekTask[day].trim(), done: false }] });
                          setNewWeekTask({ ...newWeekTask, [day]: "" });
                        }
                      }}><Plus className="w-3 h-3" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ========== CADERNO ========== */}
          <TabsContent value="caderno" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> MEU CADERNO</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newNotebookTitle} onChange={e => setNewNotebookTitle(e.target.value)} placeholder="Título da anotação" className="text-xs h-8 flex-1" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newNotebookTitle.trim()) { setNotebooks([{ id: Date.now().toString(), title: newNotebookTitle.trim(), content: "", date: new Date().toISOString().split("T")[0] }, ...notebooks]); setNewNotebookTitle(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              {notebooks.map((n, i) => (
                <div key={n.id} className="bg-muted/30 rounded-lg p-3 border border-border mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div><p className="text-sm font-bold">{n.title}</p><p className="text-[10px] text-muted-foreground">{new Date(n.date + "T12:00:00").toLocaleDateString("pt-BR")}</p></div>
                    <button onClick={() => setNotebooks(notebooks.filter(x => x.id !== n.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                  <Textarea value={n.content} onChange={e => { const u = [...notebooks]; u[i] = { ...n, content: e.target.value }; setNotebooks(u); }}
                    placeholder="Suas anotações aqui..." className="text-xs min-h-[80px]" />
                </div>
              ))}
              {notebooks.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Comece a anotar suas aulas 📝</p>}
            </div>
          </TabsContent>

          {/* ========== LIVROS/MATERIAIS ========== */}
          <TabsContent value="livros" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">📖 LIVROS E MATERIAIS</h3>
              <div className="flex gap-2 mb-3">
                <Input value={newBookTitle} onChange={e => setNewBookTitle(e.target.value)} placeholder="Título do livro/material" className="text-xs h-8 flex-1" />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newBookTitle.trim()) { setStudyBooks([...studyBooks, { id: Date.now().toString(), title: newBookTitle.trim(), subject: "", status: "pendente" }]); setNewBookTitle(""); }
                }}><Plus className="w-3 h-3" /></Button>
              </div>
              {studyBooks.map((b, i) => (
                <div key={b.id} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 border border-border mb-1">
                  <div className="flex-1">
                    <p className="text-xs font-bold">{b.title}</p>
                    <Input value={b.subject} onChange={e => { const u = [...studyBooks]; u[i] = { ...b, subject: e.target.value }; setStudyBooks(u); }}
                      placeholder="Matéria..." className="text-[10px] h-6 mt-1 border-none bg-transparent p-0" />
                  </div>
                  <select value={b.status} onChange={e => { const u = [...studyBooks]; u[i] = { ...b, status: e.target.value }; setStudyBooks(u); }}
                    className="text-xs bg-background border border-border rounded px-2 py-1">
                    <option value="pendente">Pendente</option><option value="lendo">Lendo</option><option value="lido">Lido</option>
                  </select>
                  <button onClick={() => setStudyBooks(studyBooks.filter(x => x.id !== b.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
              {studyBooks.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Adicione seus materiais de estudo 📚</p>}
            </div>
          </TabsContent>

          {/* ========== POMODORO ========== */}
          <TabsContent value="pomodoro" className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30 p-6 text-center">
              <h3 className="text-xs font-bold mb-4 flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> POMODORO DE ESTUDOS</h3>
              <div className="w-40 h-40 mx-auto rounded-full border-8 border-blue-200 dark:border-blue-500/30 flex items-center justify-center mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono">{Math.floor(pomodoroTime / 60).toString().padStart(2, "0")}:{(pomodoroTime % 60).toString().padStart(2, "0")}</p>
                  <p className="text-xs text-muted-foreground">minutos</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {!pomodoroRunning ? (
                  <Button onClick={() => setPomodoroRunning(true)} className="bg-blue-500 hover:bg-blue-600 text-white">▶ Iniciar</Button>
                ) : (
                  <Button variant="outline" onClick={() => setPomodoroRunning(false)}>⏸ Pausar</Button>
                )}
                <Button variant="ghost" onClick={() => { setPomodoroRunning(false); setPomodoroTime(25 * 60); }}>🔄 Resetar</Button>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {[15, 25, 45, 60].map(m => (
                  <button key={m} onClick={() => { setPomodoroRunning(false); setPomodoroTime(m * 60); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${pomodoroTime === m * 60 && !pomodoroRunning ? "bg-blue-500 text-white border-blue-500" : "border-border"}`}>{m}min</button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">🍅 Pomodoros concluídos hoje: <span className="font-bold">{pomodoroCount}</span></p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Estudos;
