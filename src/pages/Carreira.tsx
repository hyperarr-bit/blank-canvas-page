import { useState, useEffect } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { useNavigate } from "react-router-dom";
import { ModuleTip } from "@/components/ModuleTip";
import { ArrowLeft, Briefcase, Award, Users, Plus, Trash2, ExternalLink, Edit2, X, Star, CheckCircle, Clock, XCircle, Send, Trophy, Link2, Target, TrendingUp, BookOpen, Zap, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";


const genId = () => crypto.randomUUID();

// ============= JOB TRACKER =============
type JobApp = { id: string; company: string; role: string; link: string; status: "aplicado" | "entrevista" | "teste" | "oferta" | "rejeitado" | "desistiu"; date: string; salary: string; notes: string; favorite: boolean };

const JobTracker = () => {
  const [jobs, setJobs] = usePersistedState<JobApp[]>("career-jobs", []);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<JobApp>>({ status: "aplicado", favorite: false });
  const [filterStatus, setFilterStatus] = useState("all");

  const statusConfig: Record<string, { label: string; emoji: string; color: string }> = {
    aplicado: { label: "Aplicado", emoji: "📤", color: "bg-blue-500/15 text-blue-700 border-blue-300" },
    entrevista: { label: "Entrevista", emoji: "🎤", color: "bg-purple-500/15 text-purple-700 border-purple-300" },
    teste: { label: "Teste Técnico", emoji: "💻", color: "bg-amber-500/15 text-amber-700 border-amber-300" },
    oferta: { label: "Oferta!", emoji: "🎉", color: "bg-green-500/15 text-green-700 border-green-300" },
    rejeitado: { label: "Rejeitado", emoji: "❌", color: "bg-red-500/15 text-red-700 border-red-300" },
    desistiu: { label: "Desistiu", emoji: "🚪", color: "bg-muted text-muted-foreground border-border" },
  };

  const save = () => {
    if (!form.company || !form.role) return;
    if (editId) { setJobs(prev => prev.map(j => j.id === editId ? { ...j, ...form } as JobApp : j)); }
    else { setJobs(prev => [...prev, { id: genId(), ...form, date: form.date || new Date().toISOString().slice(0, 10) } as JobApp]); }
    setForm({ status: "aplicado", favorite: false }); setEditId(null); setShowForm(false);
  };

  const filtered = filterStatus === "all" ? jobs : jobs.filter(j => j.status === filterStatus);
  const stats = { total: jobs.length, active: jobs.filter(j => !["rejeitado", "desistiu"].includes(j.status)).length, interviews: jobs.filter(j => j.status === "entrevista").length, offers: jobs.filter(j => j.status === "oferta").length };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {[{ label: "Total", value: stats.total, icon: "📊" }, { label: "Ativas", value: stats.active, icon: "🎯" }, { label: "Entrevistas", value: stats.interviews, icon: "🎤" }, { label: "Ofertas", value: stats.offers, icon: "🎉" }].map(s => (
          <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center"><div className="text-lg">{s.icon}</div><div className="text-xl font-bold text-foreground">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {jobs.length > 0 && (
        <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = jobs.filter(j => j.status === key).length; if (count === 0) return null;
            const pct = (count / jobs.length) * 100;
            const bgClass = key === "aplicado" ? "bg-blue-500" : key === "entrevista" ? "bg-purple-500" : key === "teste" ? "bg-amber-500" : key === "oferta" ? "bg-green-500" : key === "rejeitado" ? "bg-red-400" : "bg-muted-foreground/30";
            return <div key={key} className={`${bgClass} transition-all`} style={{ width: `${pct}%` }} title={`${cfg.label}: ${count}`} />;
          })}
        </div>
      )}
      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="flex-1 h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem>{Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.emoji} {v.label}</SelectItem>)}</SelectContent></Select>
        <Button size="sm" className="h-9" onClick={() => { setShowForm(true); setEditId(null); setForm({ status: "aplicado", favorite: false }); }}><Plus className="w-4 h-4" /></Button>
      </div>
      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center"><span className="font-semibold text-sm">{editId ? "Editar" : "Nova"} Candidatura</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button></div>
          <div className="grid grid-cols-2 gap-2"><Input placeholder="Empresa" value={form.company || ""} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="h-9 text-sm" /><Input placeholder="Cargo" value={form.role || ""} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="h-9 text-sm" /></div>
          <Input placeholder="Link da vaga" value={form.link || ""} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="h-9 text-sm" />
          <div className="grid grid-cols-2 gap-2"><Input placeholder="Faixa salarial" value={form.salary || ""} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} className="h-9 text-sm" /><Select value={form.status || "aplicado"} onValueChange={v => setForm(p => ({ ...p, status: v as JobApp["status"] }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.emoji} {v.label}</SelectItem>)}</SelectContent></Select></div>
          <Input type="date" value={form.date || ""} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="h-9 text-sm" />
          <Textarea placeholder="Notas..." value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-sm min-h-[50px]" />
          <Button size="sm" className="w-full" onClick={save}>Salvar</Button>
        </CardContent></Card>
      )}
      <div className="space-y-2">
        {filtered.sort((a, b) => b.date.localeCompare(a.date)).map(job => (
          <Card key={job.id} className="hover:shadow-sm transition-shadow"><CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-lg shrink-0">{statusConfig[job.status]?.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between"><div><h4 className="font-semibold text-sm">{job.role}</h4><p className="text-[11px] text-muted-foreground">{job.company}</p></div><Badge className={`text-[9px] px-1.5 py-0 shrink-0 ${statusConfig[job.status]?.color}`}>{statusConfig[job.status]?.label}</Badge></div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">{job.date && <span className="text-[10px] text-muted-foreground">📅 {job.date}</span>}{job.salary && <span className="text-[10px] text-muted-foreground">💰 {job.salary}</span>}</div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                {job.link && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => window.open(job.link, "_blank")}><ExternalLink className="w-3 h-3" /></Button>}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setForm(job); setEditId(job.id); setShowForm(true); }}><Edit2 className="w-3 h-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setJobs(prev => prev.filter(j => j.id !== job.id))}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhuma candidatura. Boa sorte! 🍀</p>}
    </div>
  );
};

// ============= PORTFOLIO =============
type PortfolioItem = { id: string; title: string; description: string; link: string; category: string; date: string; highlight: boolean };
const Portfolio = () => {
  const [items, setItems] = usePersistedState<PortfolioItem[]>("career-portfolio", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<PortfolioItem>>({ category: "projeto", highlight: false });
  const categories = ["projeto", "conquista", "certificado", "artigo", "link"];
  const catEmoji: Record<string, string> = { projeto: "🚀", conquista: "🏆", certificado: "📜", artigo: "📝", link: "🔗" };

  const save = () => {
    if (!form.title) return;
    setItems(prev => [...prev, { id: genId(), title: form.title || "", description: form.description || "", link: form.link || "", category: form.category || "projeto", date: form.date || new Date().toISOString().slice(0, 10), highlight: form.highlight || false }]);
    setForm({ category: "projeto", highlight: false }); setShowForm(false);
  };

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthItems = items.filter(i => i.date.startsWith(thisMonth));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><div><h3 className="font-semibold text-sm">Portfolio & Conquistas</h3><p className="text-[10px] text-muted-foreground">{items.length} itens</p></div><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Novo</Button></div>
      {monthItems.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><Trophy className="w-4 h-4 text-primary" /><span className="font-semibold text-sm">Conquistas do Mês</span><Badge variant="secondary" className="text-[10px]">{monthItems.length}</Badge></div>
          <div className="space-y-1">{monthItems.slice(0, 3).map(i => <div key={i.id} className="flex items-center gap-2"><span className="text-sm">{catEmoji[i.category]}</span><span className="text-xs">{i.title}</span></div>)}</div>
        </CardContent></Card>
      )}
      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <Input placeholder="Título" value={form.title || ""} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" />
          <Textarea placeholder="Descrição..." value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="text-sm min-h-[50px]" />
          <div className="grid grid-cols-2 gap-2"><Select value={form.category || "projeto"} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent></Select><Input type="date" value={form.date || ""} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="h-9 text-sm" /></div>
          <Input placeholder="Link (opcional)" value={form.link || ""} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="h-9 text-sm" />
          <Button size="sm" className="w-full" onClick={save}>Salvar</Button>
        </CardContent></Card>
      )}
      <div className="space-y-2">
        {items.sort((a, b) => b.date.localeCompare(a.date)).map(item => (
          <Card key={item.id}><CardContent className="p-3 flex items-start gap-3">
            <span className="text-xl">{catEmoji[item.category]}</span>
            <div className="flex-1 min-w-0"><h4 className="font-semibold text-sm">{item.title}</h4>{item.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>}<div className="flex items-center gap-2 mt-1"><span className="text-[10px] text-muted-foreground">{item.date}</span><Badge variant="outline" className="text-[9px] px-1 py-0">{item.category}</Badge></div></div>
            <div className="flex flex-col gap-1 shrink-0">{item.link && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => window.open(item.link, "_blank")}><ExternalLink className="w-3 h-3" /></Button>}<Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}><Trash2 className="w-3 h-3" /></Button></div>
          </CardContent></Card>
        ))}
      </div>
      {items.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Registre suas conquistas! 🏆</p>}
    </div>
  );
};

// ============= NETWORKING =============
type Contact = { id: string; name: string; company: string; role: string; linkedin: string; email: string; phone: string; notes: string; lastContact: string; category: string };
const Networking = () => {
  const [contacts, setContacts] = usePersistedState<Contact[]>("career-contacts", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Contact>>({ category: "profissional" });
  const categories = ["profissional", "mentor", "recrutador", "colega", "cliente"];
  const catEmoji: Record<string, string> = { profissional: "👔", mentor: "🧠", recrutador: "🎯", colega: "🤝", cliente: "💼" };

  const save = () => {
    if (!form.name) return;
    setContacts(prev => [...prev, { id: genId(), name: form.name || "", company: form.company || "", role: form.role || "", linkedin: form.linkedin || "", email: form.email || "", phone: form.phone || "", notes: form.notes || "", lastContact: form.lastContact || "", category: form.category || "profissional" }]);
    setForm({ category: "profissional" }); setShowForm(false);
  };
  const needsFollowUp = contacts.filter(c => { if (!c.lastContact) return true; return (Date.now() - new Date(c.lastContact).getTime()) / (1000 * 60 * 60 * 24) > 30; });

  return (
    <div className="space-y-4">
      {needsFollowUp.length > 0 && (
        <Card className="bg-amber-500/5 border-amber-300"><CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-amber-600" /><span className="font-semibold text-xs text-amber-800">Follow-up pendente</span><Badge variant="secondary" className="text-[10px]">{needsFollowUp.length}</Badge></div>
          <div className="space-y-1">{needsFollowUp.slice(0, 3).map(c => <div key={c.id} className="flex items-center justify-between"><span className="text-xs">{catEmoji[c.category]} {c.name}</span><Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => setContacts(prev => prev.map(x => x.id === c.id ? { ...x, lastContact: new Date().toISOString().slice(0, 10) } : x))}>Contatei ✓</Button></div>)}</div>
        </CardContent></Card>
      )}
      <div className="flex justify-between items-center"><div><h3 className="font-semibold text-sm">Rede de Contatos</h3><p className="text-[10px] text-muted-foreground">{contacts.length} conexões</p></div><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Novo</Button></div>
      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <Input placeholder="Nome" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" />
          <div className="grid grid-cols-2 gap-2"><Input placeholder="Empresa" value={form.company || ""} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="h-9 text-sm" /><Input placeholder="Cargo" value={form.role || ""} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="h-9 text-sm" /></div>
          <Select value={form.category || "profissional"} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent></Select>
          <Input placeholder="LinkedIn URL" value={form.linkedin || ""} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} className="h-9 text-sm" />
          <div className="grid grid-cols-2 gap-2"><Input placeholder="Email" value={form.email || ""} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-9 text-sm" /><Input placeholder="Telefone" value={form.phone || ""} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-9 text-sm" /></div>
          <Textarea placeholder="Notas..." value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-sm min-h-[50px]" />
          <Button size="sm" className="w-full" onClick={save}>Salvar</Button>
        </CardContent></Card>
      )}
      <div className="space-y-2">
        {contacts.map(c => (
          <Card key={c.id}><CardContent className="p-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-lg shrink-0">{catEmoji[c.category]}</div>
            <div className="flex-1 min-w-0"><h4 className="font-semibold text-sm">{c.name}</h4><p className="text-[10px] text-muted-foreground">{c.role} {c.company ? `@ ${c.company}` : ""}</p><div className="flex items-center gap-2 mt-1"><Badge variant="outline" className="text-[9px] px-1 py-0">{c.category}</Badge>{c.lastContact && <span className="text-[9px] text-muted-foreground">Último: {c.lastContact}</span>}</div></div>
            <div className="flex flex-col gap-1 shrink-0">{c.linkedin && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => window.open(c.linkedin, "_blank")}><Link2 className="w-3 h-3" /></Button>}<Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setContacts(prev => prev.filter(x => x.id !== c.id))}><Trash2 className="w-3 h-3" /></Button></div>
          </CardContent></Card>
        ))}
      </div>
      {contacts.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Construa sua rede! 🤝</p>}
    </div>
  );
};

// ============= SKILLS TRACKER =============
const SkillsTracker = () => {
  type Skill = { id: string; name: string; category: string; level: number; targetLevel: number; notes: string };
  const [skills, setSkills] = usePersistedState<Skill[]>("career-skills", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Skill>>({ category: "técnica", level: 1, targetLevel: 5 });
  const categories = ["técnica", "soft skill", "idioma", "ferramenta", "certificação"];
  const catEmoji: Record<string, string> = { "técnica": "💻", "soft skill": "🗣️", "idioma": "🌍", "ferramenta": "🔧", "certificação": "📜" };
  const levels = ["Iniciante", "Básico", "Intermediário", "Avançado", "Expert"];

  const save = () => {
    if (!form.name) return;
    setSkills(prev => [...prev, { id: genId(), name: form.name || "", category: form.category || "técnica", level: form.level || 1, targetLevel: form.targetLevel || 5, notes: form.notes || "" }]);
    setForm({ category: "técnica", level: 1, targetLevel: 5 }); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><div><h3 className="font-semibold text-sm">Skills & Competências</h3><p className="text-[10px] text-muted-foreground">{skills.length} habilidades</p></div><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Nova</Button></div>

      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <Input placeholder="Nome da skill" value={form.name || ""} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="h-9 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <Select value={form.category || "técnica"} onValueChange={v => setForm(p => ({...p, category: v}))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent></Select>
            <div className="flex items-center gap-2"><span className="text-xs">Nível:</span>
              <Select value={String(form.level || 1)} onValueChange={v => setForm(p => ({...p, level: Number(v)}))}><SelectTrigger className="h-9 text-xs flex-1"><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5].map(l => <SelectItem key={l} value={String(l)}>{l} - {levels[l-1]}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <Textarea placeholder="Notas (cursos planejados, recursos...)" value={form.notes || ""} onChange={e => setForm(p => ({...p, notes: e.target.value}))} className="text-sm min-h-[40px]" />
          <Button size="sm" className="w-full" onClick={save}>Salvar</Button>
        </CardContent></Card>
      )}

      {/* Skills by category */}
      {categories.map(cat => {
        const catSkills = skills.filter(s => s.category === cat);
        if (catSkills.length === 0) return null;
        return (
          <div key={cat}>
            <p className="text-xs font-bold text-muted-foreground mb-2">{catEmoji[cat]} {cat.toUpperCase()}</p>
            <div className="space-y-2">
              {catSkills.map(skill => (
                <Card key={skill.id}><CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{skill.name}</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-[9px]">{levels[skill.level - 1]}</Badge>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSkills(prev => prev.map(s => s.id === skill.id ? {...s, level: Math.min(s.level + 1, 5)} : s))}><TrendingUp className="w-3 h-3 text-green-500" /></Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => setSkills(prev => prev.filter(s => s.id !== skill.id))}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(l => (
                      <div key={l} className={`h-1.5 flex-1 rounded-full ${l <= skill.level ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                  {skill.notes && <p className="text-[10px] text-muted-foreground mt-1">{skill.notes}</p>}
                </CardContent></Card>
              ))}
            </div>
          </div>
        );
      })}
      {skills.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Adicione suas habilidades! 💪</p>}
    </div>
  );
};

// ============= INTERVIEW PREP =============
const InterviewPrep = () => {
  const [questions, setQuestions] = usePersistedState<{id: string; question: string; answer: string; category: string; practiced: boolean}[]>("career-interview-prep", [
    { id: "1", question: "Fale sobre você", answer: "", category: "geral", practiced: false },
    { id: "2", question: "Por que você quer trabalhar aqui?", answer: "", category: "geral", practiced: false },
    { id: "3", question: "Qual seu maior defeito?", answer: "", category: "comportamental", practiced: false },
    { id: "4", question: "Conte sobre um desafio que superou", answer: "", category: "comportamental", practiced: false },
    { id: "5", question: "Onde você se vê em 5 anos?", answer: "", category: "geral", practiced: false },
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  const practiced = questions.filter(q => q.practiced).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="font-semibold text-sm">Prep de Entrevista</h3><p className="text-[10px] text-muted-foreground">{practiced}/{questions.length} praticadas</p></div>
        <Progress value={(practiced / Math.max(questions.length, 1)) * 100} className="h-2 w-24" />
      </div>

      <div className="flex gap-2">
        <Input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Nova pergunta..." className="h-8 text-xs" />
        <Button size="sm" className="h-8" onClick={() => {
          if (newQuestion.trim()) { setQuestions(prev => [...prev, { id: genId(), question: newQuestion.trim(), answer: "", category: "geral", practiced: false }]); setNewQuestion(""); }
        }}><Plus className="w-3 h-3" /></Button>
      </div>

      <div className="space-y-2">
        {questions.map((q, i) => (
          <Card key={q.id} className={q.practiced ? "border-green-200 bg-green-50/50" : ""}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Checkbox checked={q.practiced} onCheckedChange={() => setQuestions(prev => prev.map(x => x.id === q.id ? {...x, practiced: !x.practiced} : x))} className="mt-0.5" />
                  <p className={`text-sm font-medium ${q.practiced ? "line-through text-muted-foreground" : ""}`}>{q.question}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive shrink-0" onClick={() => setQuestions(prev => prev.filter(x => x.id !== q.id))}><Trash2 className="w-3 h-3" /></Button>
              </div>
              <Textarea value={q.answer} onChange={e => { const u = [...questions]; u[i] = {...q, answer: e.target.value}; setQuestions(u); }}
                placeholder="Sua resposta preparada..." className="text-xs min-h-[40px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============= MAIN =============
const Carreira = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4" /></Button>
          <div><h1 className="text-lg font-bold tracking-tight">💼 Carreira & Networking</h1><p className="text-[11px] text-muted-foreground">Gerencie sua jornada profissional</p></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="jobs">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="jobs" className="text-[10px]"><Briefcase className="w-3 h-3 mr-0.5" />Vagas</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-[10px]"><Award className="w-3 h-3 mr-0.5" />Portfolio</TabsTrigger>
            <TabsTrigger value="network" className="text-[10px]"><Users className="w-3 h-3 mr-0.5" />Rede</TabsTrigger>
            <TabsTrigger value="skills" className="text-[10px]"><Zap className="w-3 h-3 mr-0.5" />Skills</TabsTrigger>
            <TabsTrigger value="interview" className="text-[10px]"><BookOpen className="w-3 h-3 mr-0.5" />Prep</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs"><JobTracker /></TabsContent>
          <TabsContent value="portfolio"><Portfolio /></TabsContent>
          <TabsContent value="network"><Networking /></TabsContent>
          <TabsContent value="skills"><SkillsTracker /></TabsContent>
          <TabsContent value="interview"><InterviewPrep /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Carreira;
