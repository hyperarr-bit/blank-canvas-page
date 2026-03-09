import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpenses: number;
}

export const FinancialSummary = ({ totalIncome, totalExpenses }: FinancialSummaryProps) => {
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Receitas",
      value: totalIncome,
      icon: TrendingUp,
      color: "bg-success/10 text-success border-success/30",
      iconBg: "bg-success",
    },
    {
      title: "Despesas",
      value: totalExpenses,
      icon: TrendingDown,
      color: "bg-destructive/10 text-destructive border-destructive/30",
      iconBg: "bg-destructive",
    },
    {
      title: "Saldo",
      value: balance,
      icon: Wallet,
      color: balance >= 0 
        ? "bg-success/10 text-success border-success/30" 
        : "bg-destructive/10 text-destructive border-destructive/30",
      iconBg: balance >= 0 ? "bg-success" : "bg-destructive",
    },
    {
      title: "Taxa de Economia",
      value: savingsRate,
      icon: PiggyBank,
      color: "bg-warning/10 text-warning border-warning/30",
      iconBg: "bg-warning",
      isPercentage: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl p-4 border-2 ${card.color} transition-all hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium opacity-80">{card.title}</span>
            <div className={`${card.iconBg} rounded-full p-2`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {card.isPercentage ? (
              <>{card.value}%</>
            ) : (
              <>R$ {(card.value as number).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
