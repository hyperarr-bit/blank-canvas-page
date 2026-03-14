import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Plane, Luggage, Plus, Trash2, Check, X, Globe, Hotel, Calendar, Star, Edit2, CheckCircle, DollarSign, BookOpen, Clock, Heart, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const genId = () => crypto.randomUUID();

// ============= BUCKET LIST =============
type Destination = { id: string; name: string; country: string; continent: string; notes: string; visited: boolean; rating: number; photoUrl: string; priority: "sonho" | "planejando" | "próximo" };

const BucketList = () => {
  const [destinations, setDestinations] = usePersistedState<Destination[]>("travel-bucket", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Destination>>({ visited: false, priority: "sonho", rating: 0 });
  const continents = ["América do Sul", "América do Norte", "Europa", "Ásia", "África", "Oceania"];
  const continentEmoji: Record<string, string> = { "América do Sul": "🌎", "América do Norte": "🌎", "Europa": "🌍", "Ásia": "🌏", "África": "🌍", "Oceania": "🌏" };
  const priorityColors: Record<string, string> = { sonho: "bg-purple-500/15 text-purple-700 border-purple-300", planejando: "bg-blue-500/15 text-blue-700 border-blue-300", "próximo": "bg-green-500/15 text-green-700 border-green-300" };

  const save = () => {
    if (!form.name) return;
    setDestinations(prev => [...prev, { id: genId(), name: form.name || "", country: form.country || "", continent: form.continent || "Europa", notes: form.notes || "", visited: form.visited || false, rating: form.rating || 0, photoUrl: form.photoUrl || "", priority: form.priority || "sonho" }]);
    setForm({ visited: false, priority: "sonho", rating: 0 }); setShowForm(false);
  };
  const toggleVisited = (id: string) => setDestinations(prev => prev.map(d => d.id === id ? { ...d, visited: !d.visited } : d));
  const remove = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));
  const stats = { total: destinations.length, visited: destinations.filter(d => d.visited).length, countries: new Set(destinations.map(d => d.country).filter(Boolean)).size };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[{ label: "Destinos", value: stats.total, icon: "📍" }, { label: "Visitados", value: stats.visited, icon: "✅" }, { label: "Países", value: stats.countries, icon: "🌍" }].map(s => (
          <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center"><div className="text-lg">{s.icon}</div><div className="text-xl font-bold text-foreground">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      <div className="flex justify-between items-center"><h3 className="font-semibold text-sm">Destinos dos Sonhos</h3><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Novo</Button></div>
      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <Input placeholder="Nome do destino" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="País" value={form.country || ""} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="h-9 text-sm" />
            <Select value={form.continent || "Europa"} onValueChange={v => setForm(p => ({ ...p, continent: v }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{continents.map(c => <SelectItem key={c} value={c}>{continentEmoji[c]} {c}</SelectItem>)}</SelectContent></Select>
          </div>
          <Select value={form.priority || "sonho"} onValueChange={v => setForm(p => ({ ...p, priority: v as Destination["priority"] }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sonho">💭 Sonho</SelectItem><SelectItem value="planejando">📋 Planejando</SelectItem><SelectItem value="próximo">🔜 Próximo</SelectItem></SelectContent></Select>
          <Textarea placeholder="Notas..." value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-sm min-h-[50px]" />
          <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={save}>Salvar</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
        </CardContent></Card>
      )}
      <div className="space-y-2">
        {destinations.map(d => (
          <Card key={d.id} className={`overflow-hidden transition-all ${d.visited ? "opacity-70" : ""}`}><CardContent className="p-3 flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
              {d.photoUrl ? <img src={d.photoUrl} alt={d.name} className="w-full h-full object-cover" /> : <MapPin className="w-5 h-5 text-primary/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between"><h4 className={`font-semibold text-sm ${d.visited ? "line-through" : ""}`}>{d.name}</h4><Checkbox checked={d.visited} onCheckedChange={() => toggleVisited(d.id)} /></div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {d.country && <span className="text-[10px] text-muted-foreground">{d.country}</span>}
                <Badge className={`text-[9px] px-1.5 py-0 ${priorityColors[d.priority]}`}>{d.priority === "sonho" ? "💭 Sonho" : d.priority === "planejando" ? "📋 Planejando" : "🔜 Próximo"}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive shrink-0" onClick={() => remove(d.id)}><Trash2 className="w-3 h-3" /></Button>
          </CardContent></Card>
        ))}
      </div>
      {destinations.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Comece a sonhar! ✈️</p>}
    </div>
  );
};

// ============= ITINERÁRIO =============
type ItineraryItem = { id: string; tripName: string; date: string; time: string; type: "voo" | "hotel" | "reserva" | "atividade" | "transporte"; title: string; details: string; confirmed: boolean };

const Itinerary = () => {
  const [items, setItems] = usePersistedState<ItineraryItem[]>("travel-itinerary", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ItineraryItem>>({ type: "voo", confirmed: false });
  const [tripFilter, setTripFilter] = useState("all");
  const typeEmoji: Record<string, string> = { voo: "✈️", hotel: "🏨", reserva: "🍽️", atividade: "🎯", transporte: "🚗" };
  const trips = [...new Set(items.map(i => i.tripName).filter(Boolean))];

  const save = () => {
    if (!form.title) return;
    setItems(prev => [...prev, { id: genId(), tripName: form.tripName || "", date: form.date || "", time: form.time || "", type: form.type || "atividade", title: form.title || "", details: form.details || "", confirmed: form.confirmed || false }]);
    setForm({ type: "voo", confirmed: false }); setShowForm(false);
  };
  const filtered = tripFilter === "all" ? items : items.filter(i => i.tripName === tripFilter);
  const sorted = [...filtered].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-semibold text-sm">Itinerário</h3><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Novo</Button></div>
      {trips.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Badge variant={tripFilter === "all" ? "default" : "outline"} className="cursor-pointer text-xs shrink-0" onClick={() => setTripFilter("all")}>Todas</Badge>
          {trips.map(t => <Badge key={t} variant={tripFilter === t ? "default" : "outline"} className="cursor-pointer text-xs shrink-0" onClick={() => setTripFilter(t)}>{t}</Badge>)}
        </div>
      )}
      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <Input placeholder="Nome da viagem" value={form.tripName || ""} onChange={e => setForm(p => ({ ...p, tripName: e.target.value }))} className="h-9 text-sm" />
          <Input placeholder="Título" value={form.title || ""} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <Input type="date" value={form.date || ""} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="h-9 text-sm" />
            <Input type="time" value={form.time || ""} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="h-9 text-sm" />
            <Select value={form.type || "voo"} onValueChange={v => setForm(p => ({ ...p, type: v as ItineraryItem["type"] }))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="voo">✈️ Voo</SelectItem><SelectItem value="hotel">🏨 Hotel</SelectItem><SelectItem value="reserva">🍽️ Reserva</SelectItem><SelectItem value="atividade">🎯 Atividade</SelectItem><SelectItem value="transporte">🚗 Transporte</SelectItem></SelectContent></Select>
          </div>
          <Input placeholder="Detalhes" value={form.details || ""} onChange={e => setForm(p => ({ ...p, details: e.target.value }))} className="h-9 text-sm" />
          <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={save}>Salvar</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
        </CardContent></Card>
      )}
      <div className="space-y-2">
        {sorted.map(item => (
          <Card key={item.id}><CardContent className="p-3 flex items-center gap-3">
            <div className="text-xl">{typeEmoji[item.type]}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <div className="flex items-center gap-2 mt-0.5">{item.date && <span className="text-[10px] text-muted-foreground">📅 {item.date}</span>}{item.time && <span className="text-[10px] text-muted-foreground">🕐 {item.time}</span>}</div>
              {item.details && <p className="text-[10px] text-muted-foreground mt-0.5">{item.details}</p>}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, confirmed: !i.confirmed } : i))}><CheckCircle className={`w-4 h-4 ${item.confirmed ? "text-green-600 fill-green-100" : "text-muted-foreground"}`} /></Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      {sorted.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhum item. ✈️</p>}
    </div>
  );
};

// ============= PACKING LIST =============
type PackingCategory = { id: string; name: string; climate: string; items: { id: string; name: string; packed: boolean }[] };
const PackingList = () => {
  const defaultCategories: PackingCategory[] = [
    { id: "1", name: "Roupas - Praia", climate: "praia", items: [] },
    { id: "2", name: "Roupas - Frio", climate: "frio", items: [] },
    { id: "3", name: "Essenciais", climate: "geral", items: [] },
  ];
  const [categories, setCategories] = usePersistedState<PackingCategory[]>("packing-list", defaultCategories);
  const [newItemMap, setNewItemMap] = useState<Record<string, string>>({});
  const [climateFilter, setClimateFilter] = useState("all");

  const togglePacked = (catId: string, itemId: string) => setCategories(prev => prev.map(c => c.id === catId ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, packed: !i.packed } : i) } : c));
  const addItem = (catId: string) => { const text = newItemMap[catId]?.trim(); if (!text) return; setCategories(prev => prev.map(c => c.id === catId ? { ...c, items: [...c.items, { id: genId(), name: text, packed: false }] } : c)); setNewItemMap(prev => ({ ...prev, [catId]: "" })); };
  const removeItem = (catId: string, itemId: string) => setCategories(prev => prev.map(c => c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c));

  const filtered = climateFilter === "all" ? categories : categories.filter(c => c.climate === climateFilter);
  const totalItems = categories.reduce((s, c) => s + c.items.length, 0);
  const packedItems = categories.reduce((s, c) => s + c.items.filter(i => i.packed).length, 0);
  const climateEmoji: Record<string, string> = { praia: "🏖️", frio: "❄️", geral: "🎒" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div><h3 className="font-semibold text-sm">Packing List</h3><p className="text-[10px] text-muted-foreground">{packedItems}/{totalItems} empacotados</p></div><div className="h-2 w-24 bg-muted rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${totalItems > 0 ? (packedItems / totalItems) * 100 : 0}%` }} /></div></div>
      <div className="flex gap-2">{["all", "praia", "frio", "geral"].map(c => <Badge key={c} variant={climateFilter === c ? "default" : "outline"} className="cursor-pointer text-xs" onClick={() => setClimateFilter(c)}>{c === "all" ? "Todos" : `${climateEmoji[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`}</Badge>)}</div>
      {filtered.map(cat => (
        <Card key={cat.id}><CardHeader className="p-4 pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm flex items-center gap-1.5">{climateEmoji[cat.climate]} {cat.name}</CardTitle><Badge variant="secondary" className="text-[10px]">{cat.items.filter(i => i.packed).length}/{cat.items.length}</Badge></div></CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            {cat.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 group"><Checkbox checked={item.packed} onCheckedChange={() => togglePacked(cat.id, item.id)} /><span className={`text-sm flex-1 ${item.packed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span><Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => removeItem(cat.id, item.id)}><X className="w-3 h-3" /></Button></div>
            ))}
            <div className="flex gap-2 mt-2"><Input placeholder="Novo item..." value={newItemMap[cat.id] || ""} onChange={e => setNewItemMap(prev => ({ ...prev, [cat.id]: e.target.value }))} className="h-8 text-xs" onKeyDown={e => { if (e.key === "Enter") addItem(cat.id); }} /><Button size="sm" className="h-8" onClick={() => addItem(cat.id)}><Plus className="w-3 h-3" /></Button></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ============= TRAVEL BUDGET =============
const TravelBudget = () => {
  type Expense = { id: string; trip: string; category: string; description: string; amount: number; currency: string; date: string };
  const [expenses, setExpenses] = usePersistedState<Expense[]>("travel-expenses", []);
  const [budget, setBudget] = usePersistedState("travel-budget-total", 5000);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Expense>>({ category: "hospedagem", currency: "BRL" });
  const [tripFilter, setTripFilter] = useState("all");

  const expenseCategories = ["hospedagem", "transporte", "alimentação", "passeios", "compras", "outros"];
  const catEmoji: Record<string, string> = { hospedagem: "🏨", transporte: "🚗", "alimentação": "🍽️", passeios: "🎯", compras: "🛍️", outros: "📦" };
  const trips = [...new Set(expenses.map(e => e.trip).filter(Boolean))];
  const filtered = tripFilter === "all" ? expenses : expenses.filter(e => e.trip === tripFilter);
  const totalSpent = filtered.reduce((s, e) => s + e.amount, 0);

  const save = () => {
    if (!form.description || !form.amount) return;
    setExpenses(prev => [...prev, { id: genId(), trip: form.trip || "", category: form.category || "outros", description: form.description || "", amount: form.amount || 0, currency: form.currency || "BRL", date: form.date || new Date().toISOString().slice(0, 10) }]);
    setForm({ category: "hospedagem", currency: "BRL" }); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl border border-green-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> ORÇAMENTO</h3>
          <Input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-24 h-7 text-xs text-right" />
        </div>
        <div className="flex items-center justify-between mb-1"><span className="text-xs">Gasto: R$ {totalSpent.toFixed(2)}</span><span className="text-xs text-muted-foreground">Restante: R$ {(budget - totalSpent).toFixed(2)}</span></div>
        <Progress value={Math.min((totalSpent / budget) * 100, 100)} className="h-2" />
        {totalSpent > budget && <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ Acima do orçamento!</p>}
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {expenseCategories.map(cat => {
          const catTotal = filtered.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
          if (catTotal === 0) return null;
          return (
            <div key={cat} className="bg-muted/50 rounded-lg p-2 text-center">
              <span className="text-lg">{catEmoji[cat]}</span>
              <p className="text-xs font-bold">R$ {catTotal.toFixed(0)}</p>
              <p className="text-[9px] text-muted-foreground">{cat}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center"><h3 className="font-semibold text-sm">Gastos</h3><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Novo</Button></div>

      {trips.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Badge variant={tripFilter === "all" ? "default" : "outline"} className="cursor-pointer text-xs shrink-0" onClick={() => setTripFilter("all")}>Todas</Badge>
          {trips.map(t => <Badge key={t} variant={tripFilter === t ? "default" : "outline"} className="cursor-pointer text-xs shrink-0" onClick={() => setTripFilter(t)}>{t}</Badge>)}
        </div>
      )}

      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <Input placeholder="Viagem" value={form.trip || ""} onChange={e => setForm(p => ({...p, trip: e.target.value}))} className="h-9 text-sm" />
          <Input placeholder="Descrição" value={form.description || ""} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="h-9 text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <Input type="number" placeholder="Valor" value={form.amount || ""} onChange={e => setForm(p => ({...p, amount: Number(e.target.value)}))} className="h-9 text-sm" />
            <Select value={form.category || "hospedagem"} onValueChange={v => setForm(p => ({...p, category: v}))}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{expenseCategories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent></Select>
            <Input type="date" value={form.date || ""} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="h-9 text-sm" />
          </div>
          <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={save}>Salvar</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
        </CardContent></Card>
      )}

      <div className="space-y-1">
        {filtered.sort((a, b) => b.date.localeCompare(a.date)).map(e => (
          <div key={e.id} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2 text-xs border border-border">
            <div className="flex items-center gap-2"><span>{catEmoji[e.category]}</span><span className="font-medium">{e.description}</span></div>
            <div className="flex items-center gap-2"><span className="font-bold">R$ {e.amount.toFixed(2)}</span><button onClick={() => setExpenses(prev => prev.filter(x => x.id !== e.id))}><Trash2 className="w-3 h-3 text-muted-foreground" /></button></div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">Nenhum gasto registrado.</p>}
    </div>
  );
};

// ============= TRAVEL JOURNAL =============
const TravelJournal = () => {
  const [entries, setEntries] = usePersistedState<{id: string; trip: string; date: string; title: string; text: string; mood: string; highlight: boolean}[]>("travel-journal", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ trip: "", date: new Date().toISOString().slice(0, 10), title: "", text: "", mood: "🤩" });
  const moods = ["🤩", "😊", "😌", "😐", "😢", "🥳", "😴"];

  const save = () => {
    if (!form.text) return;
    setEntries(prev => [{ id: genId(), ...form, highlight: false }, ...prev]);
    setForm({ trip: "", date: new Date().toISOString().slice(0, 10), title: "", text: "", mood: "🤩" }); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><div><h3 className="font-semibold text-sm">Diário de Viagem</h3><p className="text-[10px] text-muted-foreground">{entries.length} memórias</p></div><Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Nova</Button></div>

      {showForm && (
        <Card className="border-primary/30"><CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Viagem" value={form.trip} onChange={e => setForm(p => ({...p, trip: e.target.value}))} className="h-9 text-sm" />
            <Input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="h-9 text-sm" />
          </div>
          <Input placeholder="Título da memória" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="h-9 text-sm" />
          <div className="flex gap-2 items-center"><span className="text-xs">Humor:</span>{moods.map(m => <button key={m} onClick={() => setForm(p => ({...p, mood: m}))} className={`text-lg p-0.5 rounded ${form.mood === m ? "bg-primary/10 scale-110" : ""}`}>{m}</button>)}</div>
          <Textarea placeholder="Conte sobre esse momento..." value={form.text} onChange={e => setForm(p => ({...p, text: e.target.value}))} className="text-sm min-h-[80px]" />
          <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={save}>Salvar</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
        </CardContent></Card>
      )}

      <div className="space-y-2">
        {entries.map(e => (
          <Card key={e.id}><CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2"><span className="text-lg">{e.mood}</span><h4 className="font-semibold text-sm">{e.title || "Sem título"}</h4></div>
                <div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] text-muted-foreground">{e.date}</span>{e.trip && <Badge variant="outline" className="text-[9px] px-1 py-0">{e.trip}</Badge>}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEntries(prev => prev.map(x => x.id === e.id ? {...x, highlight: !x.highlight} : x))}><Heart className={`w-3.5 h-3.5 ${e.highlight ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setEntries(prev => prev.filter(x => x.id !== e.id))}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
            <p className="text-xs mt-2 whitespace-pre-line">{e.text}</p>
          </CardContent></Card>
        ))}
      </div>
      {entries.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Suas memórias de viagem começam aqui! 📝</p>}
    </div>
  );
};

// ============= MAIN =============
const Viagens = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4" /></Button>
          <div><h1 className="text-lg font-bold tracking-tight">✈️ The Wanderlust</h1><p className="text-[11px] text-muted-foreground">Planeje e eternize suas viagens</p></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="bucket">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="bucket" className="text-[10px]"><MapPin className="w-3 h-3 mr-0.5" />Destinos</TabsTrigger>
            <TabsTrigger value="itinerary" className="text-[10px]"><Calendar className="w-3 h-3 mr-0.5" />Itinerário</TabsTrigger>
            <TabsTrigger value="packing" className="text-[10px]"><Luggage className="w-3 h-3 mr-0.5" />Mala</TabsTrigger>
            <TabsTrigger value="budget" className="text-[10px]"><DollarSign className="w-3 h-3 mr-0.5" />Budget</TabsTrigger>
            <TabsTrigger value="journal" className="text-[10px]"><BookOpen className="w-3 h-3 mr-0.5" />Diário</TabsTrigger>
          </TabsList>
          <TabsContent value="bucket"><BucketList /></TabsContent>
          <TabsContent value="itinerary"><Itinerary /></TabsContent>
          <TabsContent value="packing"><PackingList /></TabsContent>
          <TabsContent value="budget"><TravelBudget /></TabsContent>
          <TabsContent value="journal"><TravelJournal /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Viagens;
