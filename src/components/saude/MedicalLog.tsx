import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Trash2, MapPin, HelpCircle, FileText, TrendingUp, Upload } from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  address: string;
  questions: string;
}

interface ExamFile {
  id: string;
  name: string;
  date: string;
  type: string;
  url: string;
}

interface Biomarker {
  id: string;
  name: string;
  unit: string;
  entries: { date: string; value: number }[];
  refMin: number;
  refMax: number;
}

export const MedicalLog = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = usePersistedState<Appointment[]>("core-saude-appointments", []);
  const [exams, setExams] = usePersistedState<ExamFile[]>("core-saude-exams", []);
  const [biomarkers, setBiomarkers] = usePersistedState<Biomarker[]>("core-saude-biomarkers", []);
  const [showApptForm, setShowApptForm] = useState(false);
  const [showBioForm, setShowBioForm] = useState(false);
  const [expandedAppt, setExpandedAppt] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const examFileRef = useRef<HTMLInputElement>(null);

  const [newAppt, setNewAppt] = useState<Omit<Appointment, "id">>({ doctor: "", specialty: "", date: "", address: "", questions: "" });
  const [newBio, setNewBio] = useState({ name: "", unit: "ng/dL", refMin: "", refMax: "" });

  const addAppointment = () => {
    if (!newAppt.doctor.trim()) return;
    setAppointments(prev => [...prev, { ...newAppt, id: Date.now().toString() }]);
    setNewAppt({ doctor: "", specialty: "", date: "", address: "", questions: "" });
    setShowApptForm(false);
  };

  const uploadExam = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/exams/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("skin-photos").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("skin-photos").getPublicUrl(path);
      setExams(prev => [...prev, {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toISOString().slice(0, 10),
        type: ext?.toUpperCase() || "FILE",
        url: urlData.publicUrl,
      }]);
    } catch (e) {
      console.error("Upload failed", e);
    }
    setUploading(false);
  };

  const addBiomarker = () => {
    if (!newBio.name.trim()) return;
    setBiomarkers(prev => [...prev, {
      id: Date.now().toString(),
      name: newBio.name,
      unit: newBio.unit,
      entries: [],
      refMin: Number(newBio.refMin) || 0,
      refMax: Number(newBio.refMax) || 100,
    }]);
    setNewBio({ name: "", unit: "ng/dL", refMin: "", refMax: "" });
    setShowBioForm(false);
  };

  const addBioEntry = (bioId: string, value: string) => {
    const num = Number(value);
    if (isNaN(num)) return;
    setBiomarkers(prev => prev.map(b =>
      b.id === bioId ? { ...b, entries: [...b.entries, { date: new Date().toISOString().slice(0, 10), value: num }] } : b
    ));
  };

  const upcomingAppts = [...appointments].filter(a => a.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date));
  const pastAppts = [...appointments].filter(a => a.date < new Date().toISOString().slice(0, 10)).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {/* Appointments */}
      <div className="saude-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-saude-green" />
            <span className="text-xs font-bold uppercase tracking-wider">Consultas</span>
          </div>
          <button onClick={() => setShowApptForm(!showApptForm)} className="text-[10px] px-3 py-1.5 rounded-lg bg-saude-green/20 text-saude-green font-bold">
            <Plus className="w-3 h-3 inline mr-1" />Nova
          </button>
        </div>

        <AnimatePresence>
          {showApptForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
              <div className="grid gap-2 p-3 rounded-xl bg-saude-card">
                <Input value={newAppt.doctor} onChange={e => setNewAppt({ ...newAppt, doctor: e.target.value })} placeholder="Nome do médico" className="text-xs h-8 bg-saude-card border-saude-card" />
                <Input value={newAppt.specialty} onChange={e => setNewAppt({ ...newAppt, specialty: e.target.value })} placeholder="Especialidade" className="text-xs h-8 bg-saude-card border-saude-card" />
                <Input type="date" value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} className="text-xs h-8 bg-saude-card border-saude-card" />
                <Input value={newAppt.address} onChange={e => setNewAppt({ ...newAppt, address: e.target.value })} placeholder="Endereço" className="text-xs h-8 bg-saude-card border-saude-card" />
                <Textarea value={newAppt.questions} onChange={e => setNewAppt({ ...newAppt, questions: e.target.value })} placeholder="O que preciso perguntar?" className="text-xs min-h-[60px] bg-saude-card border-saude-card" />
                <button onClick={addAppointment} className="py-2 rounded-xl bg-saude-green/20 text-saude-green text-xs font-bold">Salvar</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {upcomingAppts.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-[10px] text-saude-muted font-bold uppercase tracking-widest">Próximas</p>
            {upcomingAppts.map(a => (
              <div key={a.id} className="p-3 rounded-xl bg-saude-green/5 border border-saude-green/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold">{a.doctor}</p>
                    <p className="text-[11px] text-saude-muted">{a.specialty}</p>
                    <p className="text-[11px] text-saude-green font-medium mt-1">
                      {new Date(a.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {a.address && (
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(a.address)}`} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-saude-card flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-saude-blue" />
                      </a>
                    )}
                    <button onClick={() => setExpandedAppt(expandedAppt === a.id ? null : a.id)}
                      className="w-7 h-7 rounded-lg bg-saude-card flex items-center justify-center">
                      <HelpCircle className="w-3.5 h-3.5 text-saude-yellow" />
                    </button>
                    <button onClick={() => setAppointments(prev => prev.filter(x => x.id !== a.id))}
                      className="w-7 h-7 rounded-lg bg-saude-card flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5 text-saude-muted" />
                    </button>
                  </div>
                </div>
                {expandedAppt === a.id && a.questions && (
                  <div className="mt-2 p-2 rounded-lg bg-saude-card text-xs text-saude-muted">{a.questions}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {pastAppts.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-saude-muted font-bold uppercase tracking-widest">Anteriores</p>
            {pastAppts.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-2 rounded-xl bg-saude-card/50">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{a.doctor} - {a.specialty}</p>
                  <p className="text-[10px] text-saude-muted">{new Date(a.date + "T12:00:00").toLocaleDateString("pt-BR")}</p>
                </div>
                <button onClick={() => setAppointments(prev => prev.filter(x => x.id !== a.id))}>
                  <Trash2 className="w-3 h-3 text-saude-muted" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Vault */}
      <div className="saude-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-saude-blue" />
            <span className="text-xs font-bold uppercase tracking-wider">Cofre de Exames</span>
          </div>
          <button onClick={() => examFileRef.current?.click()} disabled={uploading}
            className="text-[10px] px-3 py-1.5 rounded-lg bg-saude-blue/20 text-saude-blue font-bold">
            <Upload className="w-3 h-3 inline mr-1" />{uploading ? "Enviando..." : "Upload"}
          </button>
        </div>
        <input ref={examFileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadExam(e.target.files[0]); }} />

        {exams.length === 0 ? (
          <p className="text-xs text-saude-muted text-center py-4">Nenhum exame salvo</p>
        ) : (
          <div className="space-y-1.5">
            {exams.sort((a, b) => b.date.localeCompare(a.date)).map(e => (
              <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-saude-card/80">
                <div className="w-8 h-8 rounded-lg bg-saude-blue/20 flex items-center justify-center text-[10px] font-bold text-saude-blue">{e.type}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{e.name}</p>
                  <p className="text-[10px] text-saude-muted">{new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR")}</p>
                </div>
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-saude-blue font-bold">Ver</a>
                <button onClick={() => setExams(prev => prev.filter(x => x.id !== e.id))}>
                  <Trash2 className="w-3 h-3 text-saude-muted" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Biomarkers */}
      <div className="saude-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-saude-green" />
            <span className="text-xs font-bold uppercase tracking-wider">Biomarcadores</span>
          </div>
          <button onClick={() => setShowBioForm(!showBioForm)} className="text-[10px] px-3 py-1.5 rounded-lg bg-saude-green/20 text-saude-green font-bold">
            <Plus className="w-3 h-3 inline mr-1" />Novo
          </button>
        </div>

        <AnimatePresence>
          {showBioForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-saude-card">
                <Input value={newBio.name} onChange={e => setNewBio({ ...newBio, name: e.target.value })} placeholder="Ex: Testosterona" className="col-span-2 text-xs h-8 bg-saude-card border-saude-card" />
                <Input value={newBio.unit} onChange={e => setNewBio({ ...newBio, unit: e.target.value })} placeholder="Unidade" className="text-xs h-8 bg-saude-card border-saude-card" />
                <div className="flex gap-1">
                  <Input value={newBio.refMin} onChange={e => setNewBio({ ...newBio, refMin: e.target.value })} placeholder="Ref Mín" className="text-xs h-8 bg-saude-card border-saude-card" />
                  <Input value={newBio.refMax} onChange={e => setNewBio({ ...newBio, refMax: e.target.value })} placeholder="Ref Máx" className="text-xs h-8 bg-saude-card border-saude-card" />
                </div>
                <button onClick={addBiomarker} className="col-span-2 py-2 rounded-xl bg-saude-green/20 text-saude-green text-xs font-bold">Salvar</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {biomarkers.map(bio => {
          const lastEntry = bio.entries[bio.entries.length - 1];
          const inRange = lastEntry ? lastEntry.value >= bio.refMin && lastEntry.value <= bio.refMax : true;

          return (
            <div key={bio.id} className="mb-3 p-3 rounded-xl bg-saude-card/80">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-bold">{bio.name}</p>
                  <p className="text-[10px] text-saude-muted">Ref: {bio.refMin} - {bio.refMax} {bio.unit}</p>
                </div>
                {lastEntry && (
                  <span className={`text-sm font-black ${inRange ? "text-saude-green" : "text-saude-red"}`}>
                    {lastEntry.value} {bio.unit}
                  </span>
                )}
              </div>

              {/* Mini chart */}
              {bio.entries.length > 0 && (
                <div className="flex items-end gap-1 h-12 mb-2">
                  {bio.entries.slice(-10).map((e, i) => {
                    const range = bio.refMax - bio.refMin || 1;
                    const pct = Math.min(100, Math.max(10, ((e.value - bio.refMin * 0.5) / (range * 1.5)) * 100));
                    const color = e.value >= bio.refMin && e.value <= bio.refMax ? "bg-saude-green" : "bg-saude-red";
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <span className="text-[7px] text-saude-muted">{e.value}</span>
                        <div className={`w-full ${color} rounded-t`} style={{ height: `${pct}%` }} />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Novo valor (${bio.unit})`}
                  className="text-xs h-7 bg-saude-card border-saude-card flex-1"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      addBioEntry(bio.id, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <button onClick={() => setBiomarkers(prev => prev.filter(b => b.id !== bio.id))}>
                  <Trash2 className="w-3 h-3 text-saude-muted" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
