import { useState, useRef } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Camera, ImagePlus, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

const genId = () => crypto.randomUUID();
const getDateKey = () => new Date().toISOString().slice(0, 10);

interface DiaryEntry {
  id: string;
  date: string;
  photoUrl: string;
  notes: string;
  skinStatus: string;
  mood: string;
}

const moods = ["😊", "😐", "😔", "🤩", "😴"];
const skinStatuses = [
  { id: "boa", emoji: "✨", label: "Boa" },
  { id: "oleosa", emoji: "🛢️", label: "Oleosa" },
  { id: "seca", emoji: "🌵", label: "Seca" },
  { id: "acne", emoji: "🔴", label: "Acne" },
  { id: "sensivel", emoji: "🍅", label: "Sensível" },
];

export const SkinDiary = () => {
  const { user } = useAuth();
  const [entries, setEntries] = usePersistedState<DiaryEntry[]>("skincare-diary", []);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ notes: "", skinStatus: "boa", mood: "😊", photoUrl: "" });
  const [compareMode, setCompareMode] = useState(false);
  const [compareEntries, setCompareEntries] = useState<[DiaryEntry | null, DiaryEntry | null]>([null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = getDateKey();
  const todayEntry = entries.find(e => e.date === today);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${genId()}.${ext}`;
      const { error } = await supabase.storage.from("skin-photos").upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("skin-photos").getPublicUrl(path);
      setForm(prev => ({ ...prev, photoUrl: urlData.publicUrl }));
      toast.success("Foto carregada!");
    } catch (err: any) {
      toast.error("Erro ao carregar foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    if (!form.photoUrl && !form.notes) {
      toast.error("Adicione uma foto ou observação");
      return;
    }
    setEntries(prev => [{ id: genId(), date: today, ...form }, ...prev]);
    setForm({ notes: "", skinStatus: "boa", mood: "😊", photoUrl: "" });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(x => x.id !== id));
  };

  const toggleCompare = (entry: DiaryEntry) => {
    if (compareEntries[0]?.id === entry.id) {
      setCompareEntries([null, compareEntries[1]]);
    } else if (compareEntries[1]?.id === entry.id) {
      setCompareEntries([compareEntries[0], null]);
    } else if (!compareEntries[0]) {
      setCompareEntries([entry, compareEntries[1]]);
    } else if (!compareEntries[1]) {
      setCompareEntries([compareEntries[0], entry]);
    }
  };

  const photosEntries = entries.filter(e => e.photoUrl);

  return (
    <div className="space-y-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Câmera do Tempo</h3>
          <p className="text-[10px] text-muted-foreground">{entries.length} registros • {photosEntries.length} fotos</p>
        </div>
        <div className="flex gap-2">
          {photosEntries.length >= 2 && (
            <Button size="sm" variant="ghost" onClick={() => setCompareMode(!compareMode)}
              className={compareMode ? "text-sk-mint" : "text-muted-foreground"}>
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Comparar
            </Button>
          )}
          {!todayEntry && (
            <Button size="sm" className="bg-sk-mint/20 text-sk-mint hover:bg-sk-mint/30 border-0" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Hoje
            </Button>
          )}
        </div>
      </div>

      {/* Today done */}
      {todayEntry && (
        <div className="sk-glass rounded-xl p-3 border-sk-mint/20">
          <p className="text-xs font-bold text-sk-mint">✅ Registro de hoje feito!</p>
          <p className="text-[10px] text-muted-foreground">
            {skinStatuses.find(s => s.id === todayEntry.skinStatus)?.emoji} {todayEntry.skinStatus} • {todayEntry.mood}
          </p>
        </div>
      )}

      {/* Compare mode */}
      {compareMode && (
        <div className="sk-glass rounded-2xl p-4">
          <p className="text-xs font-bold text-sk-mint mb-3">📸 Selecione 2 fotos para comparar</p>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map(i => (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center overflow-hidden">
                {compareEntries[i] ? (
                  <div className="relative w-full h-full">
                    <img src={compareEntries[i]!.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute bottom-1 left-1 right-1">
                      <span className="text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {new Date(compareEntries[i]!.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground">Foto {i + 1}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="sk-glass rounded-2xl p-4 space-y-3">
          {/* Photo upload */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

          {form.photoUrl ? (
            <div className="relative">
              <img src={form.photoUrl} alt="" className="w-full h-48 object-cover rounded-xl" />
              <button onClick={() => setForm(p => ({ ...p, photoUrl: "" }))}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-32 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-sk-mint/30 hover:text-sk-mint transition-colors"
            >
              {uploading ? (
                <p className="text-xs">Carregando...</p>
              ) : (
                <>
                  <ImagePlus className="w-6 h-6" />
                  <p className="text-xs font-medium">Tirar foto ou escolher da galeria</p>
                </>
              )}
            </button>
          )}

          {/* Skin status */}
          <div>
            <p className="text-xs font-medium mb-1.5">Pele hoje</p>
            <div className="flex gap-1.5 flex-wrap">
              {skinStatuses.map(s => (
                <button key={s.id} onClick={() => setForm(p => ({ ...p, skinStatus: s.id }))}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-medium border transition-all ${
                    form.skinStatus === s.id
                      ? "bg-sk-mint/20 border-sk-mint/40 text-sk-mint"
                      : "border-border/50 text-muted-foreground"
                  }`}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <p className="text-xs font-medium mb-1.5">Humor</p>
            <div className="flex gap-2">
              {moods.map(m => (
                <button key={m} onClick={() => setForm(p => ({ ...p, mood: m }))}
                  className={`text-xl p-1.5 rounded-xl border transition-all ${
                    form.mood === m ? "border-sk-lavender bg-sk-lavender/10 scale-110" : "border-transparent"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Observações (irritações, melhorias, produtos usados...)"
            className="text-xs min-h-[60px] bg-muted/30 border-border/50" />

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-sk-mint/20 text-sk-mint hover:bg-sk-mint/30 border-0" onClick={save}>Salvar Registro</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-2">
        {entries.slice(0, 30).map(e => {
          const isSelected = compareEntries[0]?.id === e.id || compareEntries[1]?.id === e.id;
          return (
            <div key={e.id}
              className={`sk-glass rounded-xl p-3 flex items-start gap-3 transition-all ${
                compareMode && e.photoUrl ? "cursor-pointer hover:bg-muted/10" : ""
              } ${isSelected ? "ring-1 ring-sk-mint" : ""}`}
              onClick={() => compareMode && e.photoUrl && toggleCompare(e)}
            >
              {e.photoUrl ? (
                <img src={e.photoUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <span className="text-2xl w-12 text-center shrink-0">
                  {skinStatuses.find(s => s.id === e.skinStatus)?.emoji || "✨"}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    {new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                    {skinStatuses.find(s => s.id === e.skinStatus)?.emoji} {e.skinStatus}
                  </span>
                  <span className="text-sm">{e.mood}</span>
                </div>
                {e.notes && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{e.notes}</p>}
              </div>
              {!compareMode && (
                <button onClick={() => deleteEntry(e.id)} className="text-muted-foreground hover:text-sk-coral shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      {entries.length === 0 && !showForm && (
        <div className="text-center py-10">
          <Camera className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Registre sua primeira foto!</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Tire uma selfie por semana para acompanhar a evolução da sua pele</p>
        </div>
      )}
    </div>
  );
};
