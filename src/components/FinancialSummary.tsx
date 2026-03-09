import { useState } from "react";
import { DollarSign, ShoppingBag, AlertTriangle, BarChart3, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  totalDebts: number;
  totalInvestments: number;
  onUpdateIncome?: (value: number) => void;
  onUpdateExpenses?: (value: number) => void;
  onUpdateDebts?: (value: number) => void;
  onUpdateInvestments?: (value: number) => void;
}

export const FinancialSummary = ({ 
  totalIncome, 
  totalExpenses, 
  totalDebts, 
  totalInvestments,
  onUpdateIncome,
  onUpdateExpenses,
  onUpdateDebts,
  onUpdateInvestments,
}: FinancialSummaryProps) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (cardId: string, currentValue: number) => {
    setEditing(cardId);
    setEditValue(currentValue.toString());
  };

  const handleSave = (cardId: string) => {
    const value = parseFloat(editValue) || 0;
    switch (cardId) {
      case "receitas":
        onUpdateIncome?.(value);
        break;
      case "despesas":
        onUpdateExpenses?.(value);
        break;
      case "dividas":
        onUpdateDebts?.(value);
        break;
      case "investimentos":
        onUpdateInvestments?.(value);
        break;
    }
    setEditing(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditing(null);
    setEditValue("");
  };

  const cards = [
    {
      id: "receitas",
      title: "RECEITAS",
      value: totalIncome,
      label: "Receita Mensal",
      icon: DollarSign,
      bg: "bg-card-receitas",
      borderColor: "border-card-receitas-border",
      textColor: "text-card-receitas-text",
      iconBg: "bg-card-receitas-border",
      editable: !!onUpdateIncome,
    },
    {
      id: "despesas",
      title: "DESPESAS",
      value: totalExpenses,
      label: "Custo Mensal",
      icon: ShoppingBag,
      bg: "bg-card-despesas",
      borderColor: "border-card-despesas-border",
      textColor: "text-card-despesas-text",
      iconBg: "bg-card-despesas-border",
      editable: !!onUpdateExpenses,
    },
    {
      id: "dividas",
      title: "DÍVIDAS",
      value: totalDebts,
      label: "Total de Dívidas",
      icon: AlertTriangle,
      bg: "bg-card-dividas",
      borderColor: "border-card-dividas-border",
      textColor: "text-card-dividas-text",
      iconBg: "bg-card-dividas-border",
      editable: !!onUpdateDebts,
    },
    {
      id: "investimentos",
      title: "INVESTIMENTOS",
      value: totalInvestments,
      label: "Total Investido",
      icon: BarChart3,
      bg: "bg-card-investimentos",
      borderColor: "border-card-investimentos-border",
      textColor: "text-card-investimentos-text",
      iconBg: "bg-card-investimentos-border",
      editable: !!onUpdateInvestments,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`rounded-lg p-3 border ${card.bg} ${card.borderColor} transition-all hover:shadow-md cursor-pointer group`}
          onClick={() => card.editable && editing !== card.id && handleEdit(card.id, card.value)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold tracking-wide ${card.textColor}`}>{card.title}</span>
            <div className="flex items-center gap-1">
              {card.editable && editing !== card.id && (
                <Pencil className={`w-3 h-3 ${card.textColor} opacity-0 group-hover:opacity-60 transition-opacity`} />
              )}
              <div className={`${card.iconBg} rounded-md p-1.5`}>
                <card.icon className="w-3.5 h-3.5 text-card" />
              </div>
            </div>
          </div>
          
          {editing === card.id ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-6 text-xs flex-1 bg-background/80"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave(card.id);
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <button
                onClick={() => handleSave(card.id)}
                className="p-1 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <p className={`text-xs ${card.textColor} opacity-80`}>
              {card.label} - R$ {card.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
