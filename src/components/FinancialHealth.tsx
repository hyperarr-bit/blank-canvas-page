import { AlertTriangle, CheckCircle, TrendingUp, Shield, Target, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FinancialHealthProps {
  totalIncome: number;
  totalExpenses: number;
  totalDebts: number;
  totalInvestments: number;
  emergencyFund: number;
  emergencyFundGoal: number;
}

export const FinancialHealth = ({
  totalIncome,
  totalExpenses,
  totalDebts,
  totalInvestments,
  emergencyFund,
  emergencyFundGoal,
}: FinancialHealthProps) => {
  // Calculate financial health score (0-100)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const debtToIncome = totalIncome > 0 ? (totalDebts / (totalIncome * 12)) * 100 : 0;
  const emergencyProgress = emergencyFundGoal > 0 ? (emergencyFund / emergencyFundGoal) * 100 : 0;
  const investmentRate = totalIncome > 0 ? (totalInvestments / (totalIncome * 12)) * 100 : 0;

  // Score calculation
  let score = 50; // Base score
  score += Math.min(savingsRate * 0.8, 20); // Up to 20 points for savings
  score -= Math.min(debtToIncome * 0.3, 20); // Minus up to 20 points for debt
  score += Math.min(emergencyProgress * 0.15, 15); // Up to 15 points for emergency fund
  score += Math.min(investmentRate * 0.5, 15); // Up to 15 points for investments
  score = Math.max(0, Math.min(100, score));

  const getScoreColor = () => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Precisa Melhorar";
  };

  const tips: { icon: typeof AlertTriangle; text: string; type: "warning" | "success" | "info" }[] = [];

  if (savingsRate < 20) {
    tips.push({
      icon: AlertTriangle,
      text: `Sua taxa de poupança é ${savingsRate.toFixed(1)}%. Tente poupar pelo menos 20% da renda.`,
      type: "warning",
    });
  } else {
    tips.push({
      icon: CheckCircle,
      text: `Ótimo! Você está poupando ${savingsRate.toFixed(1)}% da sua renda.`,
      type: "success",
    });
  }

  if (debtToIncome > 30) {
    tips.push({
      icon: AlertTriangle,
      text: `Suas dívidas representam ${debtToIncome.toFixed(1)}% da renda anual. Priorize quitá-las.`,
      type: "warning",
    });
  }

  if (emergencyProgress < 100) {
    tips.push({
      icon: Shield,
      text: `Reserva de emergência: ${emergencyProgress.toFixed(0)}% completa. Meta: 6 meses de despesas.`,
      type: "info",
    });
  }

  if (investmentRate < 10) {
    tips.push({
      icon: TrendingUp,
      text: "Considere investir pelo menos 10% da sua renda para o futuro.",
      type: "info",
    });
  }

  const monthlyBalance = totalIncome - totalExpenses;
  const yearlyProjection = monthlyBalance * 12;

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Target className="w-4 h-4" />
            SCORE FINANCEIRO
          </h3>
          <span className={`text-2xl font-bold ${getScoreColor()}`}>{score.toFixed(0)}/100</span>
        </div>
        <Progress value={score} className="h-3 mb-2" />
        <p className={`text-sm text-center ${getScoreColor()}`}>{getScoreLabel()}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-[10px] text-muted-foreground mb-1">Taxa de Poupança</p>
          <p className={`text-lg font-bold ${savingsRate >= 20 ? "text-green-400" : "text-orange-400"}`}>
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-[10px] text-muted-foreground">Meta: ≥20%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-[10px] text-muted-foreground mb-1">Dívida/Renda Anual</p>
          <p className={`text-lg font-bold ${debtToIncome <= 30 ? "text-green-400" : "text-red-400"}`}>
            {debtToIncome.toFixed(1)}%
          </p>
          <p className="text-[10px] text-muted-foreground">Meta: ≤30%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-[10px] text-muted-foreground mb-1">Saldo Mensal</p>
          <p className={`text-lg font-bold ${monthlyBalance >= 0 ? "text-green-400" : "text-red-400"}`}>
            {monthlyBalance >= 0 ? "+" : ""}R$ {monthlyBalance.toLocaleString("pt-BR")}
          </p>
          <p className="text-[10px] text-muted-foreground">Receitas - Despesas</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-[10px] text-muted-foreground mb-1">Projeção Anual</p>
          <p className={`text-lg font-bold ${yearlyProjection >= 0 ? "text-green-400" : "text-red-400"}`}>
            {yearlyProjection >= 0 ? "+" : ""}R$ {yearlyProjection.toLocaleString("pt-BR")}
          </p>
          <p className="text-[10px] text-muted-foreground">Economia em 12 meses</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          DICAS PERSONALIZADAS
        </h4>
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 rounded ${
                tip.type === "warning"
                  ? "bg-orange-500/10 border border-orange-500/20"
                  : tip.type === "success"
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-blue-500/10 border border-blue-500/20"
              }`}
            >
              <tip.icon
                className={`w-4 h-4 mt-0.5 ${
                  tip.type === "warning"
                    ? "text-orange-400"
                    : tip.type === "success"
                    ? "text-green-400"
                    : "text-blue-400"
                }`}
              />
              <p className="text-xs">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg border border-green-500/30 p-3 cursor-pointer hover:border-green-500/50 transition-colors">
          <p className="text-xs font-bold text-green-400 mb-1">🎯 Regra 50/30/20</p>
          <p className="text-[10px] text-muted-foreground">50% necessidades, 30% desejos, 20% poupança</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30 p-3 cursor-pointer hover:border-blue-500/50 transition-colors">
          <p className="text-xs font-bold text-blue-400 mb-1">💰 Reserva de Emergência</p>
          <p className="text-[10px] text-muted-foreground">Tenha 6 meses de despesas guardados</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/30 p-3 cursor-pointer hover:border-purple-500/50 transition-colors">
          <p className="text-xs font-bold text-purple-400 mb-1">📈 Juros Compostos</p>
          <p className="text-[10px] text-muted-foreground">Invista cedo e deixe o tempo trabalhar</p>
        </div>
      </div>
    </div>
  );
};
