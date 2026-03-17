import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Destination, genId } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, MapPin, Star } from "lucide-react";

const continents = ["América do Sul", "América do Norte", "Europa", "Ásia", "África", "Oceania"];
const continentEmoji: Record<string, string> = { "América do Sul": "🌎", "América do Norte": "🌎", "Europa": "🌍", "Ásia": "🌏", "África": "🌍", "Oceania": "🌏" };
const priorityConfig: Record<string, { emoji: string; label: string }> = {
  sonho: { emoji: "💭", label: "Sonho" },
  planejando: { emoji: "📋", label: "Planejando" },
  "próximo": { emoji: "🔜", label: "Próximo" },
};

export const BucketList = () => {
  const [destinations, setDestinations] = usePersistedState<Destination[]>("travel-bucket", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Destination>>({ visited: false, priority: "sonho", rating: 0 });
  const [filter, setFilter] = useState<string>("all");

  const save = () => {
    if (!form.name) return;
    setDestinations(prev => [...prev, {
      id: genId(),
      name: form.name || "",
      country: form.country || "",
      continent: form.continent || "Europa",
      notes: form.notes || "",
      visited: form.visited || false,
      rating: form.rating || 0,
      photoUrl: form.photoUrl || "",
      priority: form.priority || "sonho",
    }]);
    setForm({ visited: false, priority: "sonho", rating: 0 });
    setShowForm(false);
  };

  const toggleVisited = (id: string) => setDestinations(prev => prev.map(d => d.id === id ? { ...d, visited: !d.visited } : d));
  const setRating = (id: string, rating: number) => setDestinations(prev => prev.map(d => d.id === id ? { ...d, rating } : d));
  const remove = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));

  const stats = {
    total: destinations.length,
    visited: destinations.filter(d => d.visited).length,
    countries: new Set(destinations.map(d => d.country).filter(Boolean)).size,
  };

  const filtered = filter === "all" ? destinations : destinations.filter(d => d.priority === filter);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Destinos", value: stats.total, emoji: "📍" },
          { label: "Visitados", value: stats.visited, emoji: "✅" },
          { label: "Países", value: stats.countries, emoji: "🌍" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-muted/50 p-3 text-center">
            <span className="text-lg">{s.emoji}</span>
            <p className="text-xl font-black">{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        <button onClick={() => setFilter("all")} className={`shrink-0 rounded-full px-3 py-1 text-[10px] border transition-all ${filter === "all" ? "bg-foreground text-background" : "border-border"}`}>Todos</button>
        {Object.entries(priorityConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)} className={`shrink-0 rounded-full px-3 py-1 text-[10px] border transition-all ${filter === key ? "bg-foreground text-background" : "border-border"}`}>
            {cfg.emoji} {cfg.label}
          </button>
        ))}
      </div>

      <Button variant="outline" className="w-full rounded-xl h-9 text-xs border-dashed" onClick={() => setShowForm(!showForm)}>
        <Plus className="w-3 h-3 mr-1" /> Novo Destino
      </Button>

      {showForm && (
        <div className="rounded-2xl border border-accent/30 bg-card p-4 space-y-3">
          <Input placeholder="Nome do destino" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 rounded-xl text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="País" value={form.country || ""} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="h-9 rounded-xl text-sm" />
            <Select value={form.continent || "Europa"} onValueChange={v => setForm(p => ({ ...p, continent: v }))}>
              <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{continents.map(c => <SelectItem key={c} value={c}>{continentEmoji[c]} {c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Select value={form.priority || "sonho"} onValueChange={v => setForm(p => ({ ...p, priority: v as Destination["priority"] }))}>
            <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(priorityConfig).map(([k, c]) => (
                <SelectItem key={k} value={k}>{c.emoji} {c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="URL da foto (opcional)" value={form.photoUrl || ""} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} className="h-9 rounded-xl text-xs" />
          <Textarea placeholder="Notas..." value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-sm min-h-[50px] rounded-xl" />
          <div className="flex gap-2">
            <Button onClick={save} className="flex-1 rounded-xl h-9 text-xs">Salvar</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl h-9 text-xs">Cancelar</Button>
          </div>
        </div>
      )}

      {/* Destination cards */}
      <div className="space-y-2">
        {filtered.map(d => {
          const pCfg = priorityConfig[d.priority];
          return (
            <div key={d.id} className={`rounded-2xl border overflow-hidden transition-all group ${d.visited ? "opacity-60 border-border" : "border-border hover:shadow-md"}`}>
              {d.photoUrl && (
                <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${d.photoUrl})` }}>
                  <div className="h-full w-full bg-gradient-to-t from-black/70 to-transparent" />
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={d.visited} onCheckedChange={() => toggleVisited(d.id)} className="mt-0.5" />
                    <div>
                      <h4 className={`text-sm font-bold ${d.visited ? "line-through" : ""}`}>{d.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {d.country && <span className="text-[9px] text-muted-foreground">{d.country}</span>}
                        <Badge variant="outline" className="text-[8px] px-1.5 py-0">{pCfg.emoji} {pCfg.label}</Badge>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => remove(d.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
                {d.visited && (
                  <div className="flex gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRating(d.id, s)}>
                        <Star className={`w-3.5 h-3.5 ${s <= d.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                  </div>
                )}
                {d.notes && <p className="text-[9px] text-muted-foreground mt-1.5 line-clamp-2">{d.notes}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !showForm && (
        <div className="text-center py-10">
          <MapPin className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">Comece a sonhar! ✈️</p>
        </div>
      )}
    </div>
  );
};
