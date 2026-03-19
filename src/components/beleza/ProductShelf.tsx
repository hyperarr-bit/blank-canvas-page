import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, X, ShoppingCart, Package, AlertTriangle, Ban } from "lucide-react";
import { type Product, calculateCostPerDose, getExpiryProgress } from "./utils";

const genId = () => crypto.randomUUID();

const categories = ["Skincare", "Cabelo", "Corpo", "Outro"];
const catEmoji: Record<string, string> = { Skincare: "🧴", Cabelo: "💇", Corpo: "🧼", Outro: "✨" };
const paoOptions = [3, 6, 9, 12, 18, 24];
const statusOptions = ["em_uso", "fechado", "acabou"] as const;
const statusLabels: Record<string, { label: string; color: string }> = {
  em_uso: { label: "Em Uso", color: "text-sk-mint" },
  fechado: { label: "Fechado", color: "text-sk-lavender" },
  acabou: { label: "Acabou", color: "text-sk-coral" },
};

const emptyProduct: Partial<Product> = {
  category: "Skincare", opened: false, rating: 0, repurchase: false,
  price: 0, sizeMl: 0, paoMonths: 12, frequency: "Diário",
  finished: false, photoUrl: "", openedDate: "", brand: "", name: "", notes: "",
};

export const ProductShelf = () => {
  const [products, setProducts] = usePersistedState<Product[]>("beauty-products", []);
  const [shoppingList, setShoppingList] = usePersistedState<Product[]>("beauty-shopping-list", []);
  const [triggers, setTriggers] = usePersistedState<string[]>("skincare-triggers", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ ...emptyProduct });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showShopping, setShowShopping] = useState(false);
  const [showTriggers, setShowTriggers] = useState(false);
  const [newTrigger, setNewTrigger] = useState("");

  const activeProducts = products.filter(p => !p.finished);
  const expiringSoon = activeProducts.filter(p => {
    if (!p.openedDate || !p.paoMonths) return false;
    const { daysLeft } = getExpiryProgress(p.openedDate, p.paoMonths);
    return daysLeft > 0 && daysLeft < 30;
  });

  const save = () => {
    if (!form.name) return;
    const product: Product = {
      id: genId(), name: form.name || "", category: form.category || "Outro", brand: form.brand || "",
      opened: !!form.openedDate, openedDate: form.openedDate || "", paoMonths: form.paoMonths || 12,
      expiry: "", notes: form.notes || "", rating: 0, repurchase: form.repurchase || false,
      price: form.price || 0, sizeMl: form.sizeMl || 0, photoUrl: form.photoUrl || "",
      frequency: form.frequency || "Diário", finished: false,
    };
    setProducts(prev => [...prev, product]);
    setForm({ ...emptyProduct });
    setShowForm(false);
  };

  const markFinished = (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, finished: true } : x));
    setShoppingList(prev => [...prev, { ...p, id: genId(), finished: false }]);
  };

  const buyFromList = (id: string) => {
    const item = shoppingList.find(x => x.id === id);
    if (item) {
      setProducts(prev => [...prev, { ...item, id: genId(), finished: false, openedDate: "", opened: false }]);
    }
    setShoppingList(prev => prev.filter(x => x.id !== id));
  };

  const costPerDose = (p: Product) => p.price && p.sizeMl ? calculateCostPerDose(p.price, p.sizeMl, p.category) : null;

  return (
    <div className="space-y-4 mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm text-foreground">Bancada Virtual</h3>
          <p className="text-[10px] text-muted-foreground">{activeProducts.length} produtos ativos</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowTriggers(true)} className="text-sk-coral/70 hover:text-sk-coral">
            <Ban className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowShopping(true)} className="relative text-muted-foreground">
            <ShoppingCart className="w-4 h-4" />
            {shoppingList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-sk-coral text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {shoppingList.length}
              </span>
            )}
          </Button>
          <Button size="sm" className="bg-sk-mint/20 text-sk-mint hover:bg-sk-mint/30 border-0" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Novo
          </Button>
        </div>
      </div>

      {/* Expiring alerts */}
      {expiringSoon.length > 0 && (
        <div className="sk-glass rounded-xl p-3 border-sk-coral/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-sk-coral" />
            <p className="text-[11px] font-bold text-sk-coral">Vencendo em breve</p>
          </div>
          {expiringSoon.map(p => {
            const { daysLeft } = getExpiryProgress(p.openedDate, p.paoMonths);
            return <p key={p.id} className="text-[10px] text-sk-coral/70 pl-5">⏰ {p.name} — {daysLeft} dias. Hora de repor!</p>;
          })}
        </div>
      )}

      {/* Triggers banner */}
      {triggers.length > 0 && (
        <div className="px-3 py-2 rounded-xl bg-sk-coral/10 border border-sk-coral/20">
          <p className="text-[9px] text-sk-coral font-bold">🚫 Lembrete: Evite produtos com {triggers.join(", ")}</p>
        </div>
      )}

      {/* Category summary */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => {
          const count = activeProducts.filter(p => p.category === c).length;
          if (!count) return null;
          return (
            <div key={c} className="px-2.5 py-1 rounded-lg bg-muted/30 border border-border/50 text-[10px] font-medium text-muted-foreground">
              {catEmoji[c]} {c}: {count}
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="sk-glass rounded-2xl p-4 space-y-3">
          <Input placeholder="Nome do produto" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="h-9 text-sm bg-muted/30 border-border/50" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Marca" value={form.brand || ""} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
              className="h-9 text-sm bg-muted/30 border-border/50" />
            <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
              <SelectTrigger className="h-9 text-xs bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{catEmoji[c]} {c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-muted-foreground">Preço (R$)</label>
              <Input type="number" placeholder="0" value={form.price || ""} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                className="h-9 text-sm bg-muted/30 border-border/50" />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground">Tamanho (ml/g)</label>
              <Input type="number" placeholder="0" value={form.sizeMl || ""} onChange={e => setForm(p => ({ ...p, sizeMl: parseFloat(e.target.value) || 0 }))}
                className="h-9 text-sm bg-muted/30 border-border/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-muted-foreground">Data de Abertura</label>
              <Input type="date" value={form.openedDate || ""} onChange={e => setForm(p => ({ ...p, openedDate: e.target.value }))}
                className="h-9 text-sm bg-muted/30 border-border/50" />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground">PAO (meses)</label>
              <Select value={String(form.paoMonths || 12)} onValueChange={v => setForm(p => ({ ...p, paoMonths: parseInt(v) }))}>
                <SelectTrigger className="h-9 text-xs bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>{paoOptions.map(m => <SelectItem key={m} value={String(m)}>{m}M</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Textarea placeholder="Notas (ingredientes, resultados...)" value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            className="text-sm min-h-[50px] bg-muted/30 border-border/50" />
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Checkbox checked={form.repurchase} onCheckedChange={v => setForm(p => ({ ...p, repurchase: !!v }))} /> Recomprar quando acabar
          </label>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-sk-mint/20 text-sk-mint hover:bg-sk-mint/30 border-0" onClick={save}>Salvar</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-2">
        {activeProducts.map(p => {
          const cpd = costPerDose(p);
          const expiry = p.openedDate && p.paoMonths ? getExpiryProgress(p.openedDate, p.paoMonths) : null;
          return (
            <div key={p.id} className="sk-glass rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => setSelectedProduct(p)}>
              <span className="text-xl w-8 text-center shrink-0">{catEmoji[p.category] || "✨"}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{p.name}</h4>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  {p.brand && <span className="text-[9px] text-muted-foreground">{p.brand}</span>}
                  {cpd !== null && <span className="text-[9px] text-sk-mint">R${cpd.toFixed(2)}/dose</span>}
                  {p.repurchase && <span className="text-[8px] text-sk-mint">🔄</span>}
                </div>
                {expiry && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-muted rounded-full overflow-hidden w-full max-w-[100px]">
                      <div className={`h-full rounded-full transition-all ${
                        expiry.daysLeft < 15 ? "bg-sk-coral" : expiry.daysLeft < 30 ? "bg-warning" : "bg-sk-mint"
                      }`} style={{ width: `${Math.min(100, expiry.percent)}%` }} />
                    </div>
                    <span className="text-[8px] text-muted-foreground">{expiry.expired ? "Vencido!" : `${expiry.daysLeft}d`}</span>
                  </div>
                )}
              </div>
              <button onClick={e => { e.stopPropagation(); markFinished(p); }} className="text-muted-foreground hover:text-sk-coral shrink-0">
                <Package className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      {activeProducts.length === 0 && !showForm && (
        <p className="text-center text-muted-foreground text-sm py-8">Cadastre seus produtos de skincare 🧴</p>
      )}

      {/* Product detail dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-sm skincare-module">
          {selectedProduct && (() => {
            const p = selectedProduct;
            const cpd = costPerDose(p);
            const expiry = p.openedDate && p.paoMonths ? getExpiryProgress(p.openedDate, p.paoMonths) : null;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><span>{catEmoji[p.category]}</span> {p.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground text-[10px]">Marca</span><p className="font-medium">{p.brand || "—"}</p></div>
                    <div><span className="text-muted-foreground text-[10px]">Preço</span><p className="font-medium">{p.price ? `R$ ${p.price.toFixed(2)}` : "—"}</p></div>
                    <div><span className="text-muted-foreground text-[10px]">Tamanho</span><p className="font-medium">{p.sizeMl ? `${p.sizeMl} ml` : "—"}</p></div>
                    {cpd !== null && <div><span className="text-muted-foreground text-[10px]">Custo/dose</span><p className="font-medium text-sk-mint">R$ {cpd.toFixed(2)}</p></div>}
                  </div>
                  {expiry && (
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Validade PAO {p.paoMonths}M</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${expiry.daysLeft < 15 ? "bg-sk-coral" : expiry.daysLeft < 30 ? "bg-warning" : "bg-sk-mint"}`}
                          style={{ width: `${Math.min(100, expiry.percent)}%` }} />
                      </div>
                      <p className="text-[9px] mt-1 text-muted-foreground">{expiry.expired ? "⚠️ Vencido!" : `${expiry.daysLeft} dias restantes`}</p>
                    </div>
                  )}
                  {p.notes && <p className="text-xs text-muted-foreground">{p.notes}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { markFinished(p); setSelectedProduct(null); }}>
                      <Package className="w-3.5 h-3.5 mr-1" /> Acabou
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => { setProducts(prev => prev.filter(x => x.id !== p.id)); setSelectedProduct(null); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Shopping list dialog */}
      <Dialog open={showShopping} onOpenChange={setShowShopping}>
        <DialogContent className="max-w-sm skincare-module">
          <DialogHeader><DialogTitle>🛒 Lista de Compras</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {shoppingList.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Lista vazia</p>}
            {shoppingList.map(p => (
              <div key={p.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-border/50">
                <Checkbox onCheckedChange={() => buyFromList(p.id)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[9px] text-muted-foreground">{p.brand} • {p.price ? `R$ ${p.price.toFixed(2)}` : ""}</p>
                </div>
              </div>
            ))}
            {shoppingList.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">Total: <span className="font-bold text-foreground">R$ {shoppingList.reduce((s, p) => s + (p.price || 0), 0).toFixed(2)}</span></p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Triggers dialog */}
      <Dialog open={showTriggers} onOpenChange={setShowTriggers}>
        <DialogContent className="max-w-sm skincare-module">
          <DialogHeader><DialogTitle>🚫 Ingredientes a Evitar</DialogTitle></DialogHeader>
          <p className="text-[11px] text-muted-foreground">Adicione ingredientes que causam reação na sua pele. Um alerta ficará visível na Lista de Compras.</p>
          <div className="space-y-2">
            {triggers.map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sk-coral/10 border border-sk-coral/20">
                <span className="text-xs flex-1 text-sk-coral font-medium">{t}</span>
                <button onClick={() => setTriggers(prev => prev.filter((_, j) => j !== i))} className="text-sk-coral/50 hover:text-sk-coral">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input placeholder="Ex: Ácido Salicílico" value={newTrigger} onChange={e => setNewTrigger(e.target.value)}
                className="h-8 text-xs bg-muted/30 border-border/50"
                onKeyDown={e => { if (e.key === "Enter" && newTrigger.trim()) { setTriggers(prev => [...prev, newTrigger.trim()]); setNewTrigger(""); } }} />
              <Button size="sm" className="h-8" onClick={() => { if (newTrigger.trim()) { setTriggers(prev => [...prev, newTrigger.trim()]); setNewTrigger(""); } }}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
