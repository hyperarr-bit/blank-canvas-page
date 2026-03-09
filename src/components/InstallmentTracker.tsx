import { useState } from "react";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Installment {
  id: string;
  description: string;
  totalValue: number;
  installmentValue: number;
  paidInstallments: number;
  totalInstallments: number;
  cardName: string;
}

interface InstallmentTrackerProps {
  installments: Installment[];
  setInstallments: (installments: Installment[]) => void;
}

const cardColors: Record<string, string> = {
  nubank: "bg-purple-500",
  inter: "bg-orange-500",
  itau: "bg-blue-600",
  bradesco: "bg-red-600",
  outro: "bg-gray-500",
};

export const InstallmentTracker = ({ installments, setInstallments }: InstallmentTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newInstallment, setNewInstallment] = useState({
    description: "",
    totalValue: "",
    totalInstallments: "",
    paidInstallments: "",
    cardName: "",
  });

  const addInstallment = () => {
    if (newInstallment.description && newInstallment.totalValue && newInstallment.totalInstallments) {
      const totalValue = parseFloat(newInstallment.totalValue);
      const totalInstallments = parseInt(newInstallment.totalInstallments);
      setInstallments([
        ...installments,
        {
          id: Date.now().toString(),
          description: newInstallment.description,
          totalValue,
          installmentValue: totalValue / totalInstallments,
          paidInstallments: parseInt(newInstallment.paidInstallments) || 0,
          totalInstallments,
          cardName: newInstallment.cardName || "outro",
        },
      ]);
      setNewInstallment({ description: "", totalValue: "", totalInstallments: "", paidInstallments: "", cardName: "" });
      setShowForm(false);
    }
  };

  const payInstallment = (id: string) => {
    setInstallments(
      installments.map((i) =>
        i.id === id && i.paidInstallments < i.totalInstallments
          ? { ...i, paidInstallments: i.paidInstallments + 1 }
          : i
      )
    );
  };

  const deleteInstallment = (id: string) => {
    setInstallments(installments.filter((i) => i.id !== id));
  };

  const totalPending = installments.reduce(
    (sum, i) => sum + (i.totalInstallments - i.paidInstallments) * i.installmentValue,
    0
  );

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border animate-fade-in">
      <div className="table-header flex items-center justify-center gap-2 bg-slate-600">
        <CreditCard className="w-5 h-5" />
        PARCELAMENTOS EM ABERTO
      </div>

      <div className="p-4 space-y-4">
        <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <span className="text-sm text-muted-foreground">Total a pagar:</span>
          <div className="text-2xl font-bold text-destructive">
            R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {installments.map((inst) => {
          const progress = (inst.paidInstallments / inst.totalInstallments) * 100;
          const remaining = (inst.totalInstallments - inst.paidInstallments) * inst.installmentValue;
          
          return (
            <div key={inst.id} className="p-3 rounded-lg bg-muted/30 group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cardColors[inst.cardName] || cardColors.outro}`} />
                  <span className="font-medium">{inst.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteInstallment(inst.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {inst.paidInstallments}/{inst.totalInstallments} parcelas
                </span>
                <span className="font-medium">
                  R$ {inst.installmentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                </span>
              </div>

              <Progress value={progress} className="h-2 mb-2" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Falta: R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                {inst.paidInstallments < inst.totalInstallments && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => payInstallment(inst.id)}
                    className="h-7 text-xs"
                  >
                    Pagar parcela
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {showForm ? (
          <div className="p-3 rounded-lg bg-primary/10 space-y-2">
            <Input
              placeholder="Descrição (ex: iPhone 15)"
              value={newInstallment.description}
              onChange={(e) => setNewInstallment({ ...newInstallment, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Valor total"
                value={newInstallment.totalValue}
                onChange={(e) => setNewInstallment({ ...newInstallment, totalValue: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Nº parcelas"
                value={newInstallment.totalInstallments}
                onChange={(e) => setNewInstallment({ ...newInstallment, totalInstallments: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Parcelas pagas"
                value={newInstallment.paidInstallments}
                onChange={(e) => setNewInstallment({ ...newInstallment, paidInstallments: e.target.value })}
              />
              <Input
                placeholder="Cartão (nubank, inter...)"
                value={newInstallment.cardName}
                onChange={(e) => setNewInstallment({ ...newInstallment, cardName: e.target.value.toLowerCase() })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addInstallment} className="flex-1">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Parcelamento
          </Button>
        )}
      </div>
    </div>
  );
};
