import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { ItineraryDay, TimelineItem, genId, formatCurrency } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, ExternalLink, Pin, Plane, Hotel, Utensils, Target, Car, ShoppingBag, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TYPE_CONFIG = {
  voo: { icon: Plane, label: "Voo", color: "text-blue-500" },
  hotel: { icon: Hotel, label: "Hotel", color: "text-purple-500" },
  restaurante: { icon: Utensils, label: "Restaurante", color: "text-orange-500" },
  atividade: { icon: Target, label: "Atividade", color: "text-green-500" },
  transporte: { icon: Car, label: "Transporte", color: "text-yellow-500" },
  compras: { icon: ShoppingBag, label: "Compras", color: "text-pink-500" },
};

export const DailyTimeline = () => {
  const [days, setDays] = usePersistedState<ItineraryDay[]>("travel-timeline-v2", []);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newDay, setNewDay] = useState({ tripId: "", date: "", dayNumber: 1 });
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemForm, setItemForm] = useState<Partial<TimelineItem>>({ type: "atividade", done: false, pinned: false });

  const addDay = () => {
    if (!newDay.date) return;
    const day: ItineraryDay = {
      id: genId(),
      tripId: newDay.tripId,
      dayNumber: newDay.dayNumber,
      date: newDay.date,
      items: [],
    };
    setDays(prev => [...prev, day]);
    setActiveDay(day.id);
    setNewDay(p => ({ ...p, dayNumber: p.dayNumber + 1, date: "" }));
    setShowAddDay(false);
  };

  const addItem = (dayId: string) => {
    if (!itemForm.title) return;
    const item: TimelineItem = {
      id: genId(),
      time: itemForm.time || "",
      title: itemForm.title || "",
      location: itemForm.location || "",
      mapsLink: itemForm.mapsLink || "",
      estimatedCost: itemForm.estimatedCost || 0,
      type: itemForm.type || "atividade",
      done: false,
      pinned: false,
    };
    setDays(prev => prev.map(d => d.id === dayId ? { ...d, items: [...d.items, item] } : d));
    setItemForm({ type: "atividade", done: false, pinned: false });
    setShowAddItem(false);
  };

  const toggleDone = (dayId: string, itemId: string) => {
    setDays(prev => prev.map(d => d.id === dayId ? {
      ...d,
      items: d.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i),
    } : d));
  };

  const togglePin = (dayId: string, itemId: string) => {
    setDays(prev => prev.map(d => d.id === dayId ? {
      ...d,
      items: d.items.map(i => i.id === itemId ? { ...i, pinned: !i.pinned } : i),
    } : d));
  };

  const removeItem = (dayId: string, itemId: string) => {
    setDays(prev => prev.map(d => d.id === dayId ? {
      ...d,
      items: d.items.filter(i => i.id !== itemId),
    } : d));
  };

  const removeDay = (dayId: string) => {
    setDays(prev => prev.filter(d => d.id !== dayId));
    if (activeDay === dayId) setActiveDay(null);
  };

  const currentDay = days.find(d => d.id === activeDay);
  const sortedItems = currentDay
    ? [...currentDay.items].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return a.time.localeCompare(b.time);
      })
    : [];
  const dayTotal = currentDay?.items.reduce((s, i) => s + i.estimatedCost, 0) || 0;

  // Detect "today" 
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDay = days.find(d => d.date === todayStr);

  return (
    <div className="space-y-4">
      {/* Today highlight */}
      {todayDay && (
        <button
          onClick={() => setActiveDay(todayDay.id)}
          className="w-full rounded-2xl border-2 border-accent/40 bg-accent/5 p-3 text-left transition-all hover:bg-accent/10"
        >
          <p className="text-[10px] font-bold text-accent uppercase tracking-wide">📍 Hoje</p>
          <p className="text-xs font-medium mt-0.5">Dia {todayDay.dayNumber} • {todayDay.items.length} atividades</p>
        </button>
      )}

      {/* Day chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {days.sort((a, b) => a.date.localeCompare(b.date)).map(d => (
          <button
            key={d.id}
            onClick={() => setActiveDay(d.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 border transition-all text-center min-w-[80px] ${
              activeDay === d.id
                ? "border-accent bg-accent/10 shadow-sm"
                : d.date === todayStr
                  ? "border-accent/40 bg-accent/5"
                  : "border-border bg-card hover:border-accent/30"
            }`}
          >
            <p className="text-xs font-bold">Dia {d.dayNumber}</p>
            <p className="text-[9px] text-muted-foreground">{new Date(d.date + "T12:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
          </button>
        ))}
        <button
          onClick={() => setShowAddDay(true)}
          className="shrink-0 rounded-2xl px-4 py-2 border border-dashed border-border hover:border-accent/50 min-w-[80px] flex items-center justify-center text-muted-foreground"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAddDay && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Viagem" value={newDay.tripId} onChange={e => setNewDay(p => ({ ...p, tripId: e.target.value }))} className="h-8 rounded-lg text-xs" />
            <Input type="number" placeholder="Dia nº" value={newDay.dayNumber} onChange={e => setNewDay(p => ({ ...p, dayNumber: Number(e.target.value) }))} className="h-8 rounded-lg text-xs" />
            <Input type="date" value={newDay.date} onChange={e => setNewDay(p => ({ ...p, date: e.target.value }))} className="h-8 rounded-lg text-xs" />
          </div>
          <div className="flex gap-2">
            <Button onClick={addDay} className="flex-1 rounded-lg h-7 text-xs">Criar Dia</Button>
            <Button variant="ghost" onClick={() => setShowAddDay(false)} className="rounded-lg h-7 text-xs">Cancelar</Button>
          </div>
        </div>
      )}

      {/* Day detail */}
      {currentDay && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">Dia {currentDay.dayNumber}</h3>
              <p className="text-[10px] text-muted-foreground">
                {new Date(currentDay.date + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                {dayTotal > 0 && ` • Custo: ${formatCurrency(dayTotal)}`}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive text-xs h-7" onClick={() => removeDay(currentDay.id)}>
              Excluir
            </Button>
          </div>

          {/* Timeline items */}
          <div className="relative pl-6 space-y-1">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

            {sortedItems.map(item => {
              const config = TYPE_CONFIG[item.type];
              const Icon = config.icon;
              return (
                <div
                  key={item.id}
                  className={`relative rounded-xl border p-3 transition-all group ${
                    item.pinned ? "border-accent/40 bg-accent/5" : item.done ? "border-border bg-muted/30 opacity-70" : "border-border bg-card hover:border-accent/20"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[18px] top-4 w-2.5 h-2.5 rounded-full border-2 border-background ${
                    item.done ? "bg-success" : item.pinned ? "bg-accent" : "bg-muted-foreground/30"
                  }`} />

                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.time && <span className="text-[10px] font-mono text-accent font-bold">{item.time}</span>}
                        <h4 className={`text-xs font-medium ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.title}</h4>
                      </div>
                      {item.location && (
                        <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {item.location}
                          {item.mapsLink && (
                            <a href={item.mapsLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              <ExternalLink className="w-2.5 h-2.5 ml-1 text-accent" />
                            </a>
                          )}
                        </p>
                      )}
                      {item.estimatedCost > 0 && (
                        <p className="text-[9px] text-muted-foreground mt-0.5">💰 {formatCurrency(item.estimatedCost)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => togglePin(currentDay.id, item.id)} title="Fixar no topo">
                        <Pin className={`w-3 h-3 ${item.pinned ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                      </button>
                      <button onClick={() => toggleDone(currentDay.id, item.id)}>
                        <Check className={`w-3.5 h-3.5 ${item.done ? "text-success" : "text-muted-foreground"}`} />
                      </button>
                      <button onClick={() => removeItem(currentDay.id, item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add item */}
          <Button
            variant="outline"
            className="w-full rounded-xl h-8 text-xs border-dashed"
            onClick={() => setShowAddItem(!showAddItem)}
          >
            <Plus className="w-3 h-3 mr-1" /> Adicionar Atividade
          </Button>

          {showAddItem && (
            <div className="rounded-xl border border-accent/30 bg-card p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Título" value={itemForm.title || ""} onChange={e => setItemForm(p => ({ ...p, title: e.target.value }))} className="h-8 rounded-lg text-xs" />
                <Input type="time" value={itemForm.time || ""} onChange={e => setItemForm(p => ({ ...p, time: e.target.value }))} className="h-8 rounded-lg text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Local" value={itemForm.location || ""} onChange={e => setItemForm(p => ({ ...p, location: e.target.value }))} className="h-8 rounded-lg text-xs" />
                <Select value={itemForm.type || "atividade"} onValueChange={v => setItemForm(p => ({ ...p, type: v as TimelineItem["type"] }))}>
                  <SelectTrigger className="h-8 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_CONFIG).map(([k, c]) => (
                      <SelectItem key={k} value={k}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Link Maps (opcional)" value={itemForm.mapsLink || ""} onChange={e => setItemForm(p => ({ ...p, mapsLink: e.target.value }))} className="h-8 rounded-lg text-xs" />
                <Input type="number" placeholder="Custo R$" value={itemForm.estimatedCost || ""} onChange={e => setItemForm(p => ({ ...p, estimatedCost: Number(e.target.value) }))} className="h-8 rounded-lg text-xs" />
              </div>
              <Button onClick={() => addItem(currentDay.id)} className="w-full rounded-lg h-7 text-xs">Adicionar</Button>
            </div>
          )}

          {sortedItems.length === 0 && !showAddItem && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">Sem atividades neste dia</p>
            </div>
          )}
        </div>
      )}

      {days.length === 0 && !showAddDay && (
        <div className="text-center py-12">
          <Target className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Planeje dia a dia da viagem</p>
          <p className="text-[10px] text-muted-foreground mt-1">Com horários, locais e custos estimados</p>
        </div>
      )}
    </div>
  );
};
