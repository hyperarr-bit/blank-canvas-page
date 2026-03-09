import { DollarSign, ShoppingBag, AlertTriangle, BarChart3 } from "lucide-react";

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  totalDebts: number;
  totalInvestments: number;
}

export const FinancialSummary = ({ totalIncome, totalExpenses, totalDebts, totalInvestments }: FinancialSummaryProps) => {
  const cards = [
    {
      title: "RECEITAS",
      subtitle: `Receita Mensal - R$ ${totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      bg: "bg-card-receitas",
      borderColor: "border-card-receitas-border",
      textColor: "text-card-receitas-text",
      iconBg: "bg-card-receitas-border",
    },
    {
      title: "DESPESAS",
      subtitle: `Custo Mensal - R$ ${totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: ShoppingBag,
      bg: "bg-card-despesas",
      borderColor: "border-card-despesas-border",
      textColor: "text-card-despesas-text",
      iconBg: "bg-card-despesas-border",
    },
    {
      title: "DÍVIDAS",
      subtitle: `Total de Dívidas - R$ ${totalDebts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: AlertTriangle,
      bg: "bg-card-dividas",
      borderColor: "border-card-dividas-border",
      textColor: "text-card-dividas-text",
      iconBg: "bg-card-dividas-border",
    },
    {
      title: "INVESTIMENTOS",
      subtitle: `Total Investido - R$ ${totalInvestments.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: BarChart3,
      bg: "bg-card-investimentos",
      borderColor: "border-card-investimentos-border",
      textColor: "text-card-investimentos-text",
      iconBg: "bg-card-investimentos-border",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg p-3 border ${card.bg} ${card.borderColor} transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold tracking-wide ${card.textColor}`}>{card.title}</span>
            <div className={`${card.iconBg} rounded-md p-1.5`}>
              <card.icon className="w-3.5 h-3.5 text-card" />
            </div>
          </div>
          <p className={`text-xs ${card.textColor} opacity-80`}>{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
