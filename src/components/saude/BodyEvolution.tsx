import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Plus, Trash2, Camera, ArrowLeftRight } from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Measurement {
  date: string;
  peso: string;
  bf: string;
  cintura: string;
  bracoD: string;
  bracoE: string;
  pernaD: string;
  pernaE: string;
  peito: string;
}

interface BodyPhoto {
  date: string;
  url: string;
}

const sentiments = [
  { emoji: "😊", label: "Contente", color: "bg-[hsl(var(--saude-green)/0.12)] text-[hsl(var(--saude-green))] border-[hsl(var(--saude-green)/0.25)]" },
  { emoji: "✨", label: "Motivado", color: "bg-[hsl(var(--saude-yellow)/0.12)] text-[hsl(var(--saude-yellow))] border-[hsl(var(--saude-yellow)/0.25)]" },
  { emoji: "😞", label: "Descontente", color: "bg-[hsl(var(--saude-red)/0.12)] text-[hsl(var(--saude-red))] border-[hsl(var(--saude-red)/0.25)]" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export const BodyEvolution = () => {
  const { user } = useAuth();
  const today = todayStr();
  const [measurements, setMeasurements] = usePersistedState<Measurement[]>("core-saude-measures", []);
  const [photos, setPhotos] = usePersistedState<BodyPhoto[]>("core-saude-body-photos", []);
  const [sentimentLog, setSentimentLog] = usePersistedState<Record<string, { sentiment: string; note: string }>>("core-saude-sentiment", {});
  const [showForm, setShowForm] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIdx, setCompareIdx] = useState<[number, number]>([0, 1]);
  const [newM, setNewM] = useState<Measurement>({ date: today, peso: "", bf: "", cintura: "", bracoD: "", bracoE: "", pernaD: "", pernaE: "", peito: "" });
  const [sentimentNote, setSentimentNote] = useState(sentimentLog[today]?.note || "");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const saveMeasurement = () => {
    if (!newM.peso && !newM.cintura) return;
    setMeasurements(prev => [...prev, { ...newM }]);
    setNewM({ date: today, peso: "", bf: "", cintura: "", bracoD: "", bracoE: "", pernaD: "", pernaE: "", peito: "" });
    setShowForm(false);
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/body/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("skin-photos").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("skin-photos").getPublicUrl(path);
      setPhotos(prev => [...prev, { date: today, url: urlData.publicUrl }]);
    } catch (e) {
      console.error("Upload failed", e);
    }
    setUploading(false);
  };

  const sorted = [...measurements].sort((a, b) => b.date.localeCompare(a.date));
  const todaySentiment = sentimentLog[today];

  const fields: { key: keyof Measurement; label: string; unit: string }[] = [
    { key: "peso", label: "Peso", unit: "kg" },
    { key: "bf", label: "BF%", unit: "%" },
    { key: "cintura", label: "Cintura", unit: "cm" },
    { key: "bracoD", label: "Braço D", unit: "cm" },
    { key: "bracoE", label: "Braço E", unit: "cm" },
    { key: "pernaD", label: "Perna D", unit: "cm" },
    { key: "pernaE", label: "Perna E", unit: "cm" },
    { key: "peito", label: "Peito", unit: "cm" },
  ];

  return (
    <div className="space-y-4">
      {/* Before & After comparator */}
      {photos.length >= 2 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[hsl(var(--saude-blue))]" />
              <span className="text-xs font-bold uppercase tracking-wider">Antes & Depois</span>
            </div>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`text-[10px] px-3 py-1 rounded-lg font-bold transition-colors ${compareMode ? "bg-[hsl(var(--saude-blue)/0.12)] text-[hsl(var(--saude-blue))]" : "bg-muted text-muted-foreground"}`}
            >
              {compareMode ? "Fechar" : "Comparar"}
            </button>
          </div>
          {compareMode && (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map(slot => (
                <div key={slot}>
                  <select
                    className="w-full text-[10px] mb-2 bg-muted rounded-lg px-2 py-1.5 border border-input text-foreground"
                    value={compareIdx[slot]}
                    onChange={e => {
                      const newIdx = [...compareIdx] as [number, number];
                      newIdx[slot] = Number(e.target.value);
                      setCompareIdx(newIdx);
                    }}
                  >
                    {photos.map((p, i) => (
                      <option key={i} value={i}>{new Date(p.date + "T12:00:00").toLocaleDateString("pt-BR")}</option>
                    ))}
                  </select>
                  <img src={photos[compareIdx[slot]]?.url} alt="Body" className="w-full aspect-[3/4] object-cover rounded-xl" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photo upload */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[hsl(var(--saude-green))]" />
            <span className="text-xs font-bold uppercase tracking-wider">Fotos de Progresso</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{photos.length} fotos</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {photos.slice(-8).map((p, i) => (
            <div key={i} className="relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden group">
              <img src={p.url} alt="Progress" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                <span className="text-[8px] text-white">{new Date(p.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
              </div>
              <button
                onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 w-20 h-28 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-[hsl(var(--saude-green)/0.5)] transition-colors"
          >
            {uploading ? (
              <span className="text-[10px] text-muted-foreground">Enviando...</span>
            ) : (
              <>
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Adicionar</span>
              </>
            )}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }} />
      </div>

      {/* Measurement table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[hsl(var(--saude-blue))]" />
            <span className="text-xs font-bold uppercase tracking-wider">Medidas Corporais</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[10px] px-3 py-1.5 rounded-lg bg-[hsl(var(--saude-green)/0.12)] text-[hsl(var(--saude-green))] font-bold transition-colors hover:bg-[hsl(var(--saude-green)/0.2)] border border-[hsl(var(--saude-green)/0.2)]"
          >
            <Plus className="w-3 h-3 inline mr-1" />Registrar
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-4 mb-3"
            >
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted">
                <Input type="date" value={newM.date} onChange={e => setNewM({ ...newM, date: e.target.value })} className="col-span-2 text-xs h-8" />
                {fields.map(f => (
                  <div key={f.key} className="relative">
                    <Input
                      value={newM[f.key]}
                      onChange={e => setNewM({ ...newM, [f.key]: e.target.value })}
                      placeholder={f.label}
                      className="text-xs h-8 pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{f.unit}</span>
                  </div>
                ))}
                <button
                  onClick={saveMeasurement}
                  className="col-span-2 py-2 rounded-lg bg-[hsl(var(--saude-green)/0.12)] text-[hsl(var(--saude-green))] text-xs font-bold hover:bg-[hsl(var(--saude-green)/0.2)] transition-colors"
                >
                  Salvar Medidas
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Data</th>
                  {fields.map(f => (
                    <th key={f.key} className="text-center px-2 py-2.5 text-muted-foreground font-semibold text-xs uppercase tracking-wider">{f.label}</th>
                  ))}
                  <th className="px-2 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 10).map((m, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium text-foreground">{new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</td>
                    {fields.map(f => (
                      <td key={f.key} className="text-center px-2 py-2.5 text-muted-foreground">{m[f.key] || "—"}</td>
                    ))}
                    <td className="px-2 py-2.5">
                      <button onClick={() => setMeasurements(prev => prev.filter((_, j) => j !== measurements.indexOf(m)))}>
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive transition-colors" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 pb-4 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma medida registrada</p>
            <p className="text-xs text-muted-foreground/70">Clique em "Registrar" para adicionar suas medidas</p>
          </div>
        )}
      </div>

      {/* Sentiment tracker */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-3">😊 Como me sinto com isso hoje</p>
        <div className="flex gap-2 mb-3">
          {sentiments.map(s => (
            <button
              key={s.label}
              onClick={() => setSentimentLog(prev => ({ ...prev, [today]: { sentiment: s.label, note: prev[today]?.note || "" } }))}
              className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${todaySentiment?.sentiment === s.label ? s.color : "bg-muted border-border text-muted-foreground"}`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        {todaySentiment && (
          <Input
            value={sentimentNote}
            onChange={e => setSentimentNote(e.target.value)}
            onBlur={() => setSentimentLog(prev => ({ ...prev, [today]: { ...prev[today], note: sentimentNote } }))}
            placeholder="O que te faz sentir assim? (opcional)"
            className="text-xs h-9"
          />
        )}
      </div>
    </div>
  );
};
