import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { CurrencyRate, genId, convertCurrency } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowRightLeft, RefreshCw } from "lucide-react";

const COMMON_CURRENCIES = [
  { from: "USD", to: "BRL", label: "Dólar → Real" },
  { from: "EUR", to: "BRL", label: "Euro → Real" },
  { from: "GBP", to: "BRL", label: "Libra → Real" },
  { from: "ARS", to: "BRL", label: "Peso Arg. → Real" },
];

export const CurrencyConverter = () => {
  const [rates, setRates] = usePersistedState<CurrencyRate[]>("travel-currency-rates", []);
  const [amount, setAmount] = useState("");
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRate, setNewRate] = useState({ from: "", to: "BRL", rate: "" });

  const addRate = () => {
    if (!newRate.from || !newRate.rate) return;
    setRates(prev => [...prev, { id: genId(), fromCurrency: newRate.from.toUpperCase(), toCurrency: newRate.to.toUpperCase(), rate: Number(newRate.rate) }]);
    setNewRate({ from: "", to: "BRL", rate: "" });
    setShowAdd(false);
  };

  const addCommon = (c: typeof COMMON_CURRENCIES[0]) => {
    if (rates.some(r => r.fromCurrency === c.from && r.toCurrency === c.to)) return;
    setRates(prev => [...prev, { id: genId(), fromCurrency: c.from, toCurrency: c.to, rate: 0 }]);
  };

  const updateRate = (id: string, rate: number) => {
    setRates(prev => prev.map(r => r.id === id ? { ...r, rate } : r));
  };

  const removeRate = (id: string) => {
    setRates(prev => prev.filter(r => r.id !== id));
    if (selectedRate === id) setSelectedRate(null);
  };

  const active = rates.find(r => r.id === selectedRate);

  return (
    <div className="space-y-4">
      {/* Quick add common currencies */}
      <div className="flex gap-1.5 flex-wrap">
        {COMMON_CURRENCIES.map(c => {
          const exists = rates.some(r => r.fromCurrency === c.from && r.toCurrency === c.to);
          return (
            <button
              key={c.from}
              onClick={() => !exists && addCommon(c)}
              className={`rounded-full px-3 py-1.5 text-[10px] border transition-all ${
                exists
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-border hover:border-accent/30 text-muted-foreground"
              }`}
            >
              {c.label} {exists ? "✓" : "+"}
            </button>
          );
        })}
      </div>

      {/* Rates list */}
      <div className="space-y-2">
        {rates.map(r => (
          <div
            key={r.id}
            className={`rounded-xl border p-3 transition-all cursor-pointer ${
              selectedRate === r.id ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/30"
            }`}
            onClick={() => setSelectedRate(r.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{r.fromCurrency}</span>
                <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-bold">{r.toCurrency}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={r.rate || ""}
                  onChange={e => { e.stopPropagation(); updateRate(r.id, Number(e.target.value)); }}
                  onClick={e => e.stopPropagation()}
                  placeholder="Taxa"
                  className="w-20 h-7 text-xs text-right rounded-lg"
                  step="0.01"
                />
                <button onClick={e => { e.stopPropagation(); removeRate(r.id); }}>
                  <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Converter */}
      {active && active.rate > 0 && (
        <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-4 space-y-3">
          <p className="text-xs font-semibold text-center">
            {active.fromCurrency} → {active.toCurrency} (Taxa: {active.rate})
          </p>
          <Input
            type="number"
            placeholder={`Valor em ${active.fromCurrency}`}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="h-10 rounded-xl text-center text-sm font-bold"
          />
          {amount && (
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {convertCurrency(Number(amount), active.rate).toLocaleString("pt-BR", { style: "currency", currency: active.toCurrency === "BRL" ? "BRL" : "USD" })}
              </p>
              <p className="text-[9px] text-muted-foreground mt-1">
                {Number(amount).toLocaleString()} {active.fromCurrency} × {active.rate} = {convertCurrency(Number(amount), active.rate).toLocaleString()} {active.toCurrency}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add custom */}
      <Button
        variant="outline"
        className="w-full rounded-xl h-8 text-xs border-dashed"
        onClick={() => setShowAdd(!showAdd)}
      >
        <Plus className="w-3 h-3 mr-1" /> Moeda Personalizada
      </Button>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="De (USD)" value={newRate.from} onChange={e => setNewRate(p => ({ ...p, from: e.target.value }))} className="h-8 rounded-lg text-xs" />
            <Input placeholder="Para (BRL)" value={newRate.to} onChange={e => setNewRate(p => ({ ...p, to: e.target.value }))} className="h-8 rounded-lg text-xs" />
            <Input type="number" placeholder="Taxa" value={newRate.rate} onChange={e => setNewRate(p => ({ ...p, rate: e.target.value }))} className="h-8 rounded-lg text-xs" step="0.01" />
          </div>
          <Button onClick={addRate} className="w-full rounded-lg h-7 text-xs">Adicionar</Button>
        </div>
      )}

      {rates.length === 0 && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">Defina taxas de câmbio fixas</p>
          <p className="text-[9px] text-muted-foreground">Funciona 100% offline!</p>
        </div>
      )}
    </div>
  );
};
