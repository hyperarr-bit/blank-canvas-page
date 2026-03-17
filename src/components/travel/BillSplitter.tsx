import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { BillSplitData, BillEntry, calculateSettlement, genId, formatCurrency } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, ArrowRight, Receipt } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const BillSplitter = () => {
  const [data, setData] = usePersistedState<BillSplitData>("travel-bill-split", {
    tripName: "",
    people: [],
    entries: [],
  });
  const [newPerson, setNewPerson] = useState("");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [form, setForm] = useState<Partial<BillEntry>>({ splitBetween: [] });

  const addPerson = () => {
    if (!newPerson.trim() || data.people.includes(newPerson.trim())) return;
    setData(prev => ({ ...prev, people: [...prev.people, newPerson.trim()] }));
    setNewPerson("");
  };

  const removePerson = (name: string) => {
    setData(prev => ({
      ...prev,
      people: prev.people.filter(p => p !== name),
      entries: prev.entries.filter(e => e.paidBy !== name).map(e => ({ ...e, splitBetween: e.splitBetween.filter(p => p !== name) })),
    }));
  };

  const addEntry = () => {
    if (!form.description || !form.amount || !form.paidBy || !form.splitBetween?.length) return;
    const entry: BillEntry = {
      id: genId(),
      description: form.description,
      amount: form.amount,
      paidBy: form.paidBy,
      splitBetween: form.splitBetween,
      date: form.date || new Date().toISOString().slice(0, 10),
    };
    setData(prev => ({ ...prev, entries: [...prev.entries, entry] }));
    setForm({ splitBetween: [] });
    setShowExpenseForm(false);
  };

  const removeEntry = (id: string) => {
    setData(prev => ({ ...prev, entries: prev.entries.filter(e => e.id !== id) }));
  };

  const toggleSplit = (person: string) => {
    setForm(prev => ({
      ...prev,
      splitBetween: prev.splitBetween?.includes(person)
        ? prev.splitBetween.filter(p => p !== person)
        : [...(prev.splitBetween || []), person],
    }));
  };

  const settlements = calculateSettlement(data);
  const totalSpent = data.entries.reduce((s, e) => s + e.amount, 0);

  // Per-person spending
  const personSpending = data.people.map(p => ({
    name: p,
    paid: data.entries.filter(e => e.paidBy === p).reduce((s, e) => s + e.amount, 0),
    owes: data.entries.reduce((s, e) => e.splitBetween.includes(p) ? s + e.amount / e.splitBetween.length : s, 0),
  }));

  return (
    <div className="space-y-4">
      {/* People */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold">Participantes</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.people.map(p => (
            <Badge key={p} variant="secondary" className="text-xs px-2 py-1 gap-1 rounded-lg">
              {p}
              <button onClick={() => removePerson(p)}>
                <Trash2 className="w-2.5 h-2.5 text-muted-foreground hover:text-destructive" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Nome..."
            value={newPerson}
            onChange={e => setNewPerson(e.target.value)}
            className="h-8 rounded-xl text-xs"
            onKeyDown={e => { if (e.key === "Enter") addPerson(); }}
          />
          <Button size="sm" onClick={addPerson} className="rounded-xl h-8 text-xs">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {data.people.length >= 2 && (
        <>
          {/* Add expense */}
          <Button
            variant="outline"
            className="w-full rounded-xl h-9 text-xs border-dashed"
            onClick={() => setShowExpenseForm(!showExpenseForm)}
          >
            <Receipt className="w-3 h-3 mr-1" /> Adicionar Despesa
          </Button>

          {showExpenseForm && (
            <div className="rounded-2xl border border-accent/30 bg-card p-4 space-y-3">
              <Input
                placeholder="Descrição (ex: Jantar)"
                value={form.description || ""}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="h-9 rounded-xl text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Valor R$"
                  value={form.amount || ""}
                  onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                  className="h-9 rounded-xl text-xs"
                />
                <Input
                  type="date"
                  value={form.date || ""}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5">Quem pagou?</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.people.map(p => (
                    <button
                      key={p}
                      onClick={() => setForm(prev => ({ ...prev, paidBy: p }))}
                      className={`rounded-lg px-3 py-1 text-xs border transition-all ${
                        form.paidBy === p
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5">Dividir entre:</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.people.map(p => (
                    <label key={p} className="flex items-center gap-1.5 rounded-lg px-2 py-1 border border-border text-xs cursor-pointer hover:border-accent/30">
                      <Checkbox
                        checked={form.splitBetween?.includes(p)}
                        onCheckedChange={() => toggleSplit(p)}
                        className="h-3 w-3"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addEntry} className="flex-1 rounded-xl h-8 text-xs">Adicionar</Button>
                <Button variant="ghost" onClick={() => setShowExpenseForm(false)} className="rounded-xl h-8 text-xs">Cancelar</Button>
              </div>
            </div>
          )}

          {/* Entries */}
          {data.entries.length > 0 && (
            <div className="space-y-1.5">
              {data.entries.map(e => (
                <div key={e.id} className="flex items-center justify-between rounded-xl bg-muted/30 border border-border px-3 py-2">
                  <div>
                    <p className="text-xs font-medium">{e.description}</p>
                    <p className="text-[9px] text-muted-foreground">
                      Pago por <span className="font-medium text-foreground">{e.paidBy}</span> • dividido entre {e.splitBetween.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{formatCurrency(e.amount)}</span>
                    <button onClick={() => removeEntry(e.id)}>
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Per-person summary */}
          {data.entries.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-xs font-semibold">Resumo por Pessoa</p>
              <div className="space-y-2">
                {personSpending.map(p => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium">{p.name}</span>
                    <div className="text-right">
                      <span className="text-success">Pagou {formatCurrency(p.paid)}</span>
                      <span className="text-muted-foreground mx-1">•</span>
                      <span className="text-accent">Deve {formatCurrency(p.owes)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right text-xs text-muted-foreground border-t border-border pt-2">
                Total: <span className="font-bold text-foreground">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          )}

          {/* Settlement */}
          {settlements.length > 0 && (
            <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-4 space-y-2">
              <p className="text-xs font-bold text-accent">💰 Acerto Final</p>
              {settlements.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="font-medium">{s.from}</span>
                  <ArrowRight className="w-3 h-3 text-accent" />
                  <span className="font-medium">{s.to}</span>
                  <span className="ml-auto font-bold text-accent">{formatCurrency(s.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {data.people.length < 2 && (
        <p className="text-center text-[10px] text-muted-foreground py-4">Adicione pelo menos 2 pessoas para dividir contas</p>
      )}
    </div>
  );
};
