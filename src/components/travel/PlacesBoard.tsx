import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Place, PLACE_CATEGORIES, PLACE_STATUS, genId } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ExternalLink, MapPin, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PlacesBoard = () => {
  const [places, setPlaces] = usePersistedState<Place[]>("travel-places-v2", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Place>>({ category: "comida", status: "quero_ir" });
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const save = () => {
    if (!form.name) return;
    setPlaces(prev => [...prev, {
      id: genId(),
      name: form.name || "",
      category: form.category as Place["category"] || "comida",
      address: form.address || "",
      mapsLink: form.mapsLink || "",
      status: form.status as Place["status"] || "quero_ir",
      notes: form.notes || "",
      city: form.city || "",
    }]);
    setForm({ category: "comida", status: "quero_ir" });
    setShowForm(false);
  };

  const toggleFavorite = (id: string) => {
    setPlaces(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === "favorito" ? "ja_fui" : "favorito" } : p
    ));
  };

  const updateStatus = (id: string, status: Place["status"]) => {
    setPlaces(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const remove = (id: string) => setPlaces(prev => prev.filter(p => p.id !== id));

  const filtered = places.filter(p =>
    (filterCat === "all" || p.category === filterCat) &&
    (filterStatus === "all" || p.status === filterStatus)
  );

  const cities = [...new Set(places.map(p => p.city).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterCat("all")}
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] border transition-all ${
            filterCat === "all" ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/30"
          }`}
        >
          Todos
        </button>
        {Object.entries(PLACE_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilterCat(key)}
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] border transition-all ${
              filterCat === key ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/30"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {Object.entries(PLACE_STATUS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] border transition-all ${
              filterStatus === key ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-accent/30"
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Add button */}
      <Button
        variant="outline"
        className="w-full rounded-xl h-9 text-xs border-dashed"
        onClick={() => setShowForm(!showForm)}
      >
        <Plus className="w-3 h-3 mr-1" /> Novo Lugar
      </Button>

      {showForm && (
        <div className="rounded-2xl border border-accent/30 bg-card p-4 space-y-3">
          <Input placeholder="Nome do lugar" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 rounded-xl text-xs" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Cidade" value={form.city || ""} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="h-9 rounded-xl text-xs" />
            <Select value={form.category || "comida"} onValueChange={v => setForm(p => ({ ...p, category: v as Place["category"] }))}>
              <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PLACE_CATEGORIES).map(([k, c]) => (
                  <SelectItem key={k} value={k}>{c.emoji} {c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Endereço" value={form.address || ""} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-9 rounded-xl text-xs" />
          <Input placeholder="Link Google Maps (opcional)" value={form.mapsLink || ""} onChange={e => setForm(p => ({ ...p, mapsLink: e.target.value }))} className="h-9 rounded-xl text-xs" />
          <Textarea placeholder="Notas..." value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-xs min-h-[50px] rounded-xl" />
          <div className="flex gap-2">
            <Button onClick={save} className="flex-1 rounded-xl h-8 text-xs">Salvar</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl h-8 text-xs">Cancelar</Button>
          </div>
        </div>
      )}

      {/* Places grid */}
      <div className="grid grid-cols-1 gap-2">
        {filtered.map(place => {
          const cat = PLACE_CATEGORIES[place.category];
          const status = PLACE_STATUS[place.status];
          return (
            <div key={place.id} className="rounded-xl border border-border bg-card p-3 group hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold truncate">{place.name}</h4>
                    <Badge variant="outline" className="text-[8px] px-1 py-0 shrink-0">{status.emoji} {status.label}</Badge>
                  </div>
                  {place.city && <p className="text-[9px] text-muted-foreground mt-0.5"><MapPin className="w-2.5 h-2.5 inline" /> {place.city}</p>}
                  {place.notes && <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-2">{place.notes}</p>}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => toggleFavorite(place.id)}>
                    <Heart className={`w-3.5 h-3.5 ${place.status === "favorito" ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>
                  {place.mapsLink && (
                    <a href={place.mapsLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-accent" />
                    </a>
                  )}
                  <button onClick={() => remove(place.id)}>
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
              {/* Quick status change */}
              <div className="flex gap-1 mt-2 pt-2 border-t border-border/50">
                {(Object.entries(PLACE_STATUS) as [Place["status"], typeof PLACE_STATUS["quero_ir"]][]).map(([key, s]) => (
                  <button
                    key={key}
                    onClick={() => updateStatus(place.id, key)}
                    className={`rounded-md px-2 py-0.5 text-[8px] border transition-all ${
                      place.status === key ? "bg-accent/10 border-accent/30 text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !showForm && (
        <div className="text-center py-10">
          <MapPin className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">Salve lugares que quer conhecer!</p>
        </div>
      )}
    </div>
  );
};
