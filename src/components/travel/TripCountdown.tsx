import { usePersistedState } from "@/hooks/use-persisted-state";
import { TripCountdown as TripCountdownType, genId, daysUntil } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Plane } from "lucide-react";
import { useState } from "react";

export const TripCountdown = () => {
  const [countdowns, setCountdowns] = usePersistedState<TripCountdownType[]>("travel-countdowns", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tripName: "", departureDate: "", photoUrl: "" });

  const add = () => {
    if (!form.tripName || !form.departureDate) return;
    setCountdowns(prev => [...prev, { id: genId(), ...form }]);
    setForm({ tripName: "", departureDate: "", photoUrl: "" });
    setShowForm(false);
  };

  const remove = (id: string) => setCountdowns(prev => prev.filter(c => c.id !== id));

  const upcoming = countdowns
    .filter(c => daysUntil(c.departureDate) > 0)
    .sort((a, b) => daysUntil(a.departureDate) - daysUntil(b.departureDate));

  const past = countdowns.filter(c => daysUntil(c.departureDate) <= 0);

  return (
    <div className="space-y-3">
      {upcoming.map(c => {
        const days = daysUntil(c.departureDate);
        return (
          <div key={c.id} className="relative rounded-2xl overflow-hidden border border-border group">
            {c.photoUrl ? (
              <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${c.photoUrl})` }}>
                <div className="h-full w-full bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="text-lg font-bold">{c.tripName}</p>
                    <p className="text-xs opacity-80">
                      {days === 1 ? "Amanhã! ✈️" : `${days} dias restantes`}
                    </p>
                  </div>
                  <div className="ml-auto text-right text-white">
                    <p className="text-3xl font-black">{days}</p>
                    <p className="text-[9px] opacity-70">dias</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-24 bg-gradient-to-r from-accent/20 to-accent/5 flex items-center px-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">{c.tripName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(c.departureDate).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-accent">{days}</p>
                  <p className="text-[9px] text-muted-foreground">dias</p>
                </div>
              </div>
            )}
            <button
              onClick={() => remove(c.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        );
      })}

      {past.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase">Viagens passadas</p>
          {past.map(c => (
            <div key={c.id} className="rounded-xl border border-border bg-muted/30 px-3 py-2 flex items-center justify-between text-xs opacity-60">
              <span>{c.tripName}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{new Date(c.departureDate).toLocaleDateString("pt-BR")}</span>
                <button onClick={() => remove(c.id)}>
                  <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" className="w-full rounded-xl h-9 text-xs border-dashed" onClick={() => setShowForm(!showForm)}>
        <Plus className="w-3 h-3 mr-1" /> Novo Countdown
      </Button>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <Input placeholder="Nome da viagem" value={form.tripName} onChange={e => setForm(p => ({ ...p, tripName: e.target.value }))} className="h-8 rounded-lg text-xs" />
          <Input type="date" value={form.departureDate} onChange={e => setForm(p => ({ ...p, departureDate: e.target.value }))} className="h-8 rounded-lg text-xs" />
          <Input placeholder="URL da foto (opcional)" value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} className="h-8 rounded-lg text-xs" />
          <Button onClick={add} className="w-full rounded-lg h-7 text-xs">Criar</Button>
        </div>
      )}

      {countdowns.length === 0 && !showForm && (
        <div className="text-center py-8">
          <Plane className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">Contagem regressiva para suas viagens</p>
        </div>
      )}
    </div>
  );
};
