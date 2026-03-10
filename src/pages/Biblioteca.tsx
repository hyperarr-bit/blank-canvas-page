import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Film, Quote, Star, Plus, Trash2, Search, Eye, CheckCircle, Clock, Edit2, X, Heart, Bookmark, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

type Book = { id: string; title: string; author: string; cover: string; status: "lendo" | "lido" | "quero-ler"; rating: number; genre: string; pages: number; currentPage: number; notes: string; startDate: string; endDate: string };
type Media = { id: string; title: string; type: "filme" | "serie" | "anime" | "documentario"; status: "assistido" | "assistindo" | "quero-ver"; rating: number; review: string; genre: string; year: string; favorite: boolean };
type QuoteItem = { id: string; text: string; source: string; author: string; category: string; favorite: boolean; date: string };

const genId = () => crypto.randomUUID();
const starColors = ["text-muted-foreground", "text-yellow-500"];

const StarRating = ({ value, onChange, size = "w-5 h-5" }: { value: number; onChange?: (v: number) => void; size?: string }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`${size} cursor-pointer transition-colors ${i <= value ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
        onClick={() => onChange?.(i)} />
    ))}
  </div>
);

const statusColors: Record<string, string> = {
  "lendo": "bg-blue-500/20 text-blue-700 border-blue-300",
  "lido": "bg-green-500/20 text-green-700 border-green-300",
  "quero-ler": "bg-amber-500/20 text-amber-700 border-amber-300",
  "assistido": "bg-green-500/20 text-green-700 border-green-300",
  "assistindo": "bg-blue-500/20 text-blue-700 border-blue-300",
  "quero-ver": "bg-amber-500/20 text-amber-700 border-amber-300",
};

const statusLabels: Record<string, string> = {
  "lendo": "📖 Lendo", "lido": "✅ Lido", "quero-ler": "📋 Quero Ler",
  "assistido": "✅ Assistido", "assistindo": "📺 Assistindo", "quero-ver": "📋 Quero Ver",
};

const bookGenres = ["Ficção", "Não-Ficção", "Fantasia", "Romance", "Sci-Fi", "Terror", "Autoajuda", "Negócios", "Biografia", "Técnico", "HQ/Mangá", "Outro"];
const mediaGenres = ["Ação", "Comédia", "Drama", "Ficção Científica", "Terror", "Romance", "Documentário", "Animação", "Suspense", "Fantasia", "Outro"];

// ============= BOOKSHELF =============
const Bookshelf = () => {
  const [books, setBooks] = usePersistedState<Book[]>("lib-books", []);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Book>>({ status: "quero-ler", rating: 0, pages: 0, currentPage: 0, genre: "Ficção" });

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: books.length,
    lendo: books.filter(b => b.status === "lendo").length,
    lido: books.filter(b => b.status === "lido").length,
    pagesRead: books.reduce((s, b) => s + (b.status === "lido" ? b.pages : b.currentPage), 0),
  };

  const save = () => {
    if (!form.title) return;
    if (editId) {
      setBooks(prev => prev.map(b => b.id === editId ? { ...b, ...form } as Book : b));
    } else {
      setBooks(prev => [...prev, { id: genId(), title: form.title || "", author: form.author || "", cover: form.cover || "", status: form.status || "quero-ler", rating: form.rating || 0, genre: form.genre || "", pages: form.pages || 0, currentPage: form.currentPage || 0, notes: form.notes || "", startDate: form.startDate || "", endDate: form.endDate || "" } as Book]);
    }
    setForm({ status: "quero-ler", rating: 0, pages: 0, currentPage: 0, genre: "Ficção" });
    setEditId(null);
    setShowForm(false);
  };

  const edit = (b: Book) => { setForm(b); setEditId(b.id); setShowForm(true); };
  const remove = (id: string) => setBooks(prev => prev.filter(b => b.id !== id));

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total", value: stats.total, icon: "📚" },
          { label: "Lendo", value: stats.lendo, icon: "📖" },
          { label: "Lidos", value: stats.lido, icon: "✅" },
          { label: "Páginas", value: stats.pagesRead, icon: "📄" },
        ].map(s => (
          <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
            <div className="text-lg">{s.icon}</div>
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar livro..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="lendo">Lendo</SelectItem>
            <SelectItem value="lido">Lidos</SelectItem>
            <SelectItem value="quero-ler">Quero Ler</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="h-9" onClick={() => { setShowForm(true); setEditId(null); setForm({ status: "quero-ler", rating: 0, pages: 0, currentPage: 0, genre: "Ficção" }); }}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">{editId ? "Editar" : "Novo"} Livro</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
            </div>
            <Input placeholder="Título" value={form.title || ""} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" />
            <Input placeholder="Autor" value={form.author || ""} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} className="h-9 text-sm" />
            <Input placeholder="URL da capa (opcional)" value={form.cover || ""} onChange={e => setForm(p => ({ ...p, cover: e.target.value }))} className="h-9 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Select value={form.genre || "Ficção"} onValueChange={v => setForm(p => ({ ...p, genre: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{bookGenres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.status || "quero-ler"} onValueChange={v => setForm(p => ({ ...p, status: v as Book["status"] }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quero-ler">Quero Ler</SelectItem>
                  <SelectItem value="lendo">Lendo</SelectItem>
                  <SelectItem value="lido">Lido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Total de páginas" value={form.pages || ""} onChange={e => setForm(p => ({ ...p, pages: +e.target.value }))} className="h-9 text-sm" />
              <Input type="number" placeholder="Página atual" value={form.currentPage || ""} onChange={e => setForm(p => ({ ...p, currentPage: +e.target.value }))} className="h-9 text-sm" />
            </div>
            <Textarea placeholder="Anotações..." value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="text-sm min-h-[60px]" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Nota:</span>
              <StarRating value={form.rating || 0} onChange={v => setForm(p => ({ ...p, rating: v }))} size="w-5 h-5" />
            </div>
            <Button size="sm" className="w-full" onClick={save}>Salvar</Button>
          </CardContent>
        </Card>
      )}

      {/* Book Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(book => (
          <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[2/3] bg-gradient-to-br from-primary/10 to-primary/5 relative flex items-center justify-center">
              {book.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-10 h-10 text-primary/30" />
              )}
              <Badge className={`absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0 ${statusColors[book.status]}`}>
                {statusLabels[book.status]}
              </Badge>
            </div>
            <CardContent className="p-2.5 space-y-1">
              <h4 className="font-semibold text-xs leading-tight line-clamp-2">{book.title}</h4>
              <p className="text-[10px] text-muted-foreground">{book.author}</p>
              {book.status === "lendo" && book.pages > 0 && (
                <div className="space-y-0.5">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (book.currentPage / book.pages) * 100)}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground text-right">{book.currentPage}/{book.pages}</p>
                </div>
              )}
              {book.rating > 0 && <StarRating value={book.rating} size="w-3 h-3" />}
              <div className="flex gap-1 pt-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => edit(book)}><Edit2 className="w-3 h-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(book.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhum livro encontrado. Adicione seu primeiro! 📚</p>}
    </div>
  );
};

// ============= WATCHLIST =============
const Watchlist = () => {
  const [items, setItems] = usePersistedState<Media[]>("lib-media", []);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Media>>({ type: "filme", status: "quero-ver", rating: 0, favorite: false });

  const filtered = items.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || m.type === filterType;
    return matchSearch && matchType;
  });

  const save = () => {
    if (!form.title) return;
    if (editId) {
      setItems(prev => prev.map(m => m.id === editId ? { ...m, ...form } as Media : m));
    } else {
      setItems(prev => [...prev, { id: genId(), ...form } as Media]);
    }
    setForm({ type: "filme", status: "quero-ver", rating: 0, favorite: false });
    setEditId(null);
    setShowForm(false);
  };

  const toggleFav = (id: string) => setItems(prev => prev.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
  const remove = (id: string) => setItems(prev => prev.filter(m => m.id !== id));

  const typeEmoji: Record<string, string> = { filme: "🎬", serie: "📺", anime: "🎌", documentario: "🎥" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total", value: items.length },
          { label: "Assistidos", value: items.filter(m => m.status === "assistido").length },
          { label: "Favoritos", value: items.filter(m => m.favorite).length },
          { label: "Média ⭐", value: items.filter(m => m.rating > 0).length > 0 ? (items.reduce((s, m) => s + m.rating, 0) / items.filter(m => m.rating > 0).length).toFixed(1) : "—" },
        ].map(s => (
          <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="filme">Filmes</SelectItem>
            <SelectItem value="serie">Séries</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
            <SelectItem value="documentario">Docs</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="h-9" onClick={() => { setShowForm(true); setEditId(null); }}><Plus className="w-4 h-4" /></Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">{editId ? "Editar" : "Novo"}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
            </div>
            <Input placeholder="Título" value={form.title || ""} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Select value={form.type || "filme"} onValueChange={v => setForm(p => ({ ...p, type: v as Media["type"] }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="filme">🎬 Filme</SelectItem>
                  <SelectItem value="serie">📺 Série</SelectItem>
                  <SelectItem value="anime">🎌 Anime</SelectItem>
                  <SelectItem value="documentario">🎥 Doc</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.status || "quero-ver"} onValueChange={v => setForm(p => ({ ...p, status: v as Media["status"] }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quero-ver">Quero Ver</SelectItem>
                  <SelectItem value="assistindo">Assistindo</SelectItem>
                  <SelectItem value="assistido">Assistido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={form.genre || "Ação"} onValueChange={v => setForm(p => ({ ...p, genre: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{mediaGenres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Ano" value={form.year || ""} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="h-9 text-sm" />
            </div>
            <Textarea placeholder="Mini resenha..." value={form.review || ""} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} className="text-sm min-h-[60px]" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Nota:</span>
              <StarRating value={form.rating || 0} onChange={v => setForm(p => ({ ...p, rating: v }))} />
            </div>
            <Button size="sm" className="w-full" onClick={save}>Salvar</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.map(m => (
          <Card key={m.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-3 flex items-start gap-3">
              <div className="text-2xl">{typeEmoji[m.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-semibold text-sm leading-tight">{m.title}</h4>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => toggleFav(m.id)}>
                    <Heart className={`w-3.5 h-3.5 ${m.favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className={`text-[9px] px-1.5 py-0 ${statusColors[m.status]}`}>{statusLabels[m.status]}</Badge>
                  {m.genre && <span className="text-[10px] text-muted-foreground">{m.genre}</span>}
                  {m.year && <span className="text-[10px] text-muted-foreground">{m.year}</span>}
                </div>
                {m.rating > 0 && <StarRating value={m.rating} size="w-3 h-3" />}
                {m.review && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic">"{m.review}"</p>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive shrink-0" onClick={() => remove(m.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhuma mídia. Adicione seu primeiro! 🎬</p>}
    </div>
  );
};

// ============= QUOTES WALL =============
const QuotesWall = () => {
  const [quotes, setQuotes] = usePersistedState<QuoteItem[]>("lib-quotes", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<QuoteItem>>({ category: "livro" });

  const categories = ["livro", "filme", "série", "música", "pessoal", "outro"];
  const catEmoji: Record<string, string> = { livro: "📖", filme: "🎬", série: "📺", música: "🎵", pessoal: "💭", outro: "✨" };
  const catColors = ["bg-amber-500/10 border-amber-300", "bg-red-500/10 border-red-300", "bg-blue-500/10 border-blue-300", "bg-purple-500/10 border-purple-300", "bg-green-500/10 border-green-300", "bg-muted/50 border-border"];

  const save = () => {
    if (!form.text) return;
    setQuotes(prev => [...prev, { id: genId(), text: form.text || "", source: form.source || "", author: form.author || "", category: form.category || "outro", favorite: false, date: new Date().toISOString().slice(0, 10) }]);
    setForm({ category: "livro" });
    setShowForm(false);
  };

  const toggleFav = (id: string) => setQuotes(prev => prev.map(q => q.id === id ? { ...q, favorite: !q.favorite } : q));
  const remove = (id: string) => setQuotes(prev => prev.filter(q => q.id !== id));

  const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;

  return (
    <div className="space-y-4">
      {/* Quote of the day */}
      {randomQuote && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 text-center space-y-2">
            <Sparkles className="w-5 h-5 mx-auto text-primary/60" />
            <p className="text-sm italic font-medium text-foreground">"{randomQuote.text}"</p>
            <p className="text-xs text-muted-foreground">— {randomQuote.author || randomQuote.source || "Desconhecido"}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">{quotes.length} citações salvas</span>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" /> Nova</Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Textarea placeholder="A citação..." value={form.text || ""} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} className="text-sm min-h-[80px]" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Autor" value={form.author || ""} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} className="h-9 text-sm" />
              <Input placeholder="Fonte (livro, filme...)" value={form.source || ""} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className="h-9 text-sm" />
            </div>
            <Select value={form.category || "livro"} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={save}>Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {quotes.sort((a, b) => b.favorite ? 1 : -1).map((q, i) => (
          <Card key={q.id} className={`border ${catColors[categories.indexOf(q.category)] || catColors[5]}`}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 mt-0.5">{catEmoji[q.category] || "✨"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm italic text-foreground">"{q.text}"</p>
                  <div className="flex items-center gap-2 mt-1">
                    {q.author && <span className="text-[10px] text-muted-foreground">— {q.author}</span>}
                    {q.source && <span className="text-[10px] text-muted-foreground">({q.source})</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleFav(q.id)}>
                    <Bookmark className={`w-3.5 h-3.5 ${q.favorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(q.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {quotes.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhuma citação salva ainda. ✨</p>}
    </div>
  );
};

// ============= MAIN =============
const Biblioteca = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">📚 Biblioteca & Cinema</h1>
            <p className="text-[11px] text-muted-foreground">Seu log de mídia pessoal</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="books">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="books" className="text-xs"><BookOpen className="w-3.5 h-3.5 mr-1" />Estante</TabsTrigger>
            <TabsTrigger value="watchlist" className="text-xs"><Film className="w-3.5 h-3.5 mr-1" />Watchlist</TabsTrigger>
            <TabsTrigger value="quotes" className="text-xs"><Quote className="w-3.5 h-3.5 mr-1" />Citações</TabsTrigger>
          </TabsList>
          <TabsContent value="books"><Bookshelf /></TabsContent>
          <TabsContent value="watchlist"><Watchlist /></TabsContent>
          <TabsContent value="quotes"><QuotesWall /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Biblioteca;
