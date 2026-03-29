import { useState } from "react";
import { Plus, Trash2, ShoppingCart, TrendingUp, Calendar, Star, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  savedAmount: number;
  priority: "alta" | "media" | "baixa";
  category: string;
  link?: string;
  targetDate?: string;
}

interface WishlistItemsProps {
  items: WishlistItem[];
  setItems: (items: WishlistItem[]) => void;
  monthlyBudget: number;
  totalExpenses: number;
  totalDebts: number;
  monthlyInstallments: number;
}

const priorityColors = {
  alta: "bg-red-500/20 text-red-400 border-red-500/30",
  media: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  baixa: "bg-green-500/20 text-green-400 border-green-500/30",
};

const categories = ["Eletrônicos", "Vestuário", "Casa", "Lazer", "Viagem", "Educação", "Saúde", "Outros"];

export const WishlistItems = ({ items, setItems, monthlyBudget, totalExpenses, totalDebts, monthlyInstallments }: WishlistItemsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({
    priority: "media",
    category: "Outros",
    savedAmount: 0,
  });

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: newItem.price,
      savedAmount: newItem.savedAmount || 0,
      priority: newItem.priority || "media",
      category: newItem.category || "Outros",
      link: newItem.link,
      targetDate: newItem.targetDate,
    };
    setItems([...items, item]);
    setNewItem({ priority: "media", category: "Outros", savedAmount: 0 });
    setShowForm(false);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateSavedAmount = (id: string, amount: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, savedAmount: Math.min(amount, i.price) } : i)));
  };

  const totalWishlistValue = items.reduce((sum, i) => sum + i.price, 0);
  const totalSaved = items.reduce((sum, i) => sum + i.savedAmount, 0);
  const remainingToSave = totalWishlistValue - totalSaved;
  
  // Real available money = income - expenses - installments
  const realAvailable = Math.max(0, monthlyBudget - totalExpenses - monthlyInstallments);
  const savingsForWishlist = realAvailable * 0.3; // 30% of available for wishes
  const monthsToComplete = savingsForWishlist > 0 ? Math.ceil(remainingToSave / savingsForWishlist) : 0;
  
  // Impact metrics
  const budgetImpactPercent = monthlyBudget > 0 ? (totalWishlistValue / monthlyBudget) * 100 : 0;
  const canAffordWithoutDebt = realAvailable > 0;

  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { alta: 0, media: 1, baixa: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-muted-foreground">Total de Desejos</span>
          </div>
          <p className="text-lg font-bold">R$ {totalWishlistValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-muted-foreground">Já Guardado</span>
          </div>
          <p className="text-lg font-bold text-green-400">R$ {totalSaved.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground">Falta Guardar</span>
          </div>
          <p className="text-lg font-bold text-orange-400">R$ {remainingToSave.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground">Tempo Estimado</span>
          </div>
          <p className="text-lg font-bold text-blue-400">{monthsToComplete > 0 ? `${monthsToComplete} meses` : "—"}</p>
          <p className="text-[10px] text-muted-foreground">30% do saldo livre</p>
        </div>
      </div>

      {/* Financial Impact Alert */}
      <div className={`rounded-lg p-3 border ${!canAffordWithoutDebt ? "bg-red-500/10 border-red-500/30" : remainingToSave > monthlyBudget * 2 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-green-500/10 border-green-500/30"}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className={`w-4 h-4 mt-0.5 ${!canAffordWithoutDebt ? "text-red-400" : remainingToSave > monthlyBudget * 2 ? "text-yellow-400" : "text-green-400"}`} />
          <div className="text-xs space-y-1">
            <p className="font-bold">
              {!canAffordWithoutDebt 
                ? "⚠️ Suas despesas + parcelas superam sua renda. Foque em quitar dívidas primeiro."
                : remainingToSave > monthlyBudget * 2 
                  ? `⚠️ Seus desejos valem ${budgetImpactPercent.toFixed(0)}% da sua renda. Priorize os itens de alta prioridade.`
                  : "✅ Seus desejos estão compatíveis com seu orçamento!"}
            </p>
            <p className="text-muted-foreground">
              Saldo livre mensal: R$ {realAvailable.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
              {savingsForWishlist > 0 && ` → R$ ${savingsForWishlist.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês para desejos`}
            </p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-card rounded-lg border border-border">
        <div className="table-header-dark flex items-center justify-between">
          <span className="text-xs font-bold">LISTA DE DESEJOS</span>
          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>

        {showForm && (
          <div className="p-3 border-b border-border bg-muted/30 space-y-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <Input placeholder="Nome do item" value={newItem.name || ""} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="h-8 text-xs" />
              <Input type="number" placeholder="Preço (R$)" value={newItem.price || ""} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })} className="h-8 text-xs" />
              <select value={newItem.priority} onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })} className="h-8 text-xs rounded-md border border-input bg-background px-2">
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Média</option>
                <option value="baixa">🟢 Baixa</option>
              </select>
              <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="h-8 text-xs rounded-md border border-input bg-background px-2">
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Link (opcional)" value={newItem.link || ""} onChange={(e) => setNewItem({ ...newItem, link: e.target.value })} className="h-8 text-xs" />
              <Input type="date" placeholder="Data alvo" value={newItem.targetDate || ""} onChange={(e) => setNewItem({ ...newItem, targetDate: e.target.value })} className="h-8 text-xs" />
            </div>
            <Button size="sm" onClick={addItem} className="h-7 text-xs">Salvar Item</Button>
          </div>
        )}

        <div className="divide-y divide-border">
          {sortedItems.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum item na lista de desejos</p>
            </div>
          ) : (
            sortedItems.map((item) => {
              const progress = (item.savedAmount / item.price) * 100;
              const remaining = item.price - item.savedAmount;
              const monthsForItem = savingsForWishlist > 0 ? Math.ceil(remaining / savingsForWishlist) : 0;
              return (
                <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityColors[item.priority]}`}>{item.priority.toUpperCase()}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.category}</span>
                        {item.link && (<a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">🔗 Link</a>)}
                      </div>
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        {monthsForItem > 0 && <span className="text-[10px] text-blue-400">~{monthsForItem} meses</span>}
                        {item.targetDate && (<span className="text-[10px] text-muted-foreground">📅 {new Date(item.targetDate).toLocaleDateString("pt-BR")}</span>)}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Progresso: {progress.toFixed(0)}%</span>
                      <span className="text-green-400">Guardado: R$ {item.savedAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" placeholder="Atualizar valor guardado" className="h-6 text-[10px] flex-1" onBlur={(e) => updateSavedAmount(item.id, parseFloat(e.target.value) || 0)} defaultValue={item.savedAmount} />
                      <span className="text-[10px] text-orange-400 whitespace-nowrap">Falta: R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};