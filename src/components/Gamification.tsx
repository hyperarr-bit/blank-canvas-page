import { useState, useEffect } from "react";
import { Trophy, Flame, Star, Target, CheckCircle, Lock, Gift, TrendingUp, Shield, CreditCard, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/hooks/use-user-data";

interface GamificationProps {
  savingsRate: number;
  billsPaidRate: number;
  goalsProgress: number;
  totalInvestments: number;
  totalDebts: number;
  streakDays: number;
  setStreakDays: (days: number) => void;
  challenge52Weeks: number[];
  setChallenge52Weeks: (weeks: number[]) => void;
}

export const Gamification = ({
  savingsRate,
  billsPaidRate,
  goalsProgress,
  totalInvestments,
  totalDebts,
  streakDays,
  setStreakDays,
  challenge52Weeks,
  setChallenge52Weeks,
}: GamificationProps) => {
  const [lastCheckIn, setLastCheckIn] = useState(() => {
    return localStorage.getItem("finance-lastCheckIn") || "";
  });

  // Badges system
  const badges = [
    { id: "saver", name: "Poupador", description: "Poupar ≥20% por 1 mês", icon: TrendingUp, unlocked: savingsRate >= 20, color: "text-green-400" },
    { id: "bills", name: "Em Dia", description: "100% das contas pagas", icon: CheckCircle, unlocked: billsPaidRate >= 100, color: "text-blue-400" },
    { id: "investor", name: "Investidor", description: "Ter R$ 10.000+ investidos", icon: TrendingUp, unlocked: totalInvestments >= 10000, color: "text-purple-400" },
    { id: "debtFree", name: "Livre de Dívidas", description: "Sem dívidas pendentes", icon: Shield, unlocked: totalDebts <= 0, color: "text-emerald-400" },
    { id: "goals50", name: "Focado", description: "50% das metas concluídas", icon: Target, unlocked: goalsProgress >= 50, color: "text-yellow-400" },
    { id: "goals100", name: "Conquistador", description: "100% das metas concluídas", icon: Trophy, unlocked: goalsProgress >= 100, color: "text-amber-400" },
    { id: "streak7", name: "Consistente", description: "7 dias seguidos de uso", icon: Flame, unlocked: streakDays >= 7, color: "text-orange-400" },
    { id: "streak30", name: "Dedicado", description: "30 dias seguidos de uso", icon: Zap, unlocked: streakDays >= 30, color: "text-red-400" },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  // Daily check-in
  const today = new Date().toISOString().split("T")[0];
  const canCheckIn = lastCheckIn !== today;

  const handleCheckIn = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastCheckIn === yesterdayStr) {
      setStreakDays(streakDays + 1);
    } else if (lastCheckIn !== today) {
      setStreakDays(1);
    }

    setLastCheckIn(today);
    localStorage.setItem("finance-lastCheckIn", today);
  };

  // 52-week challenge
  const currentWeek = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const toggleWeek = (week: number) => {
    if (challenge52Weeks.includes(week)) {
      setChallenge52Weeks(challenge52Weeks.filter((w) => w !== week));
    } else {
      setChallenge52Weeks([...challenge52Weeks, week]);
    }
  };

  const challengeTotal = challenge52Weeks.reduce((sum, week) => sum + week, 0);
  const fullChallengeTotal = Array.from({ length: 52 }, (_, i) => i + 1).reduce((a, b) => a + b, 0); // 1378

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Flame className={`w-8 h-8 mx-auto mb-2 ${streakDays > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
          <p className="text-2xl font-bold">{streakDays}</p>
          <p className="text-xs text-muted-foreground">Dias de streak</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <p className="text-2xl font-bold">{unlockedCount}/{badges.length}</p>
          <p className="text-xs text-muted-foreground">Conquistas</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Gift className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold">R$ {challengeTotal}</p>
          <p className="text-xs text-muted-foreground">Desafio 52 sem.</p>
        </div>
      </div>

      {/* Daily Check-in */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${canCheckIn ? "bg-orange-500/20" : "bg-green-500/20"}`}>
              {canCheckIn ? <Calendar className="w-6 h-6 text-orange-400" /> : <CheckCircle className="w-6 h-6 text-green-400" />}
            </div>
            <div>
              <p className="font-bold text-sm">Check-in Diário</p>
              <p className="text-xs text-muted-foreground">
                {canCheckIn ? "Marque presença para manter seu streak!" : "Você já fez check-in hoje! 🔥"}
              </p>
            </div>
          </div>
          {canCheckIn && (
            <Button onClick={handleCheckIn} className="bg-orange-500 hover:bg-orange-600 text-white">
              Check-in
            </Button>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          CONQUISTAS ({unlockedCount}/{badges.length})
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-lg p-3 text-center transition-all ${
                badge.unlocked
                  ? "bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/30"
                  : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${badge.unlocked ? "bg-yellow-500/20" : "bg-muted"}`}>
                {badge.unlocked ? (
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <p className={`text-xs font-bold ${badge.unlocked ? "" : "text-muted-foreground"}`}>{badge.name}</p>
              <p className="text-[10px] text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 52 Week Challenge */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            DESAFIO DAS 52 SEMANAS
          </h3>
          <span className="text-xs text-muted-foreground">
            R$ {challengeTotal} de R$ {fullChallengeTotal}
          </span>
        </div>
        <Progress value={(challengeTotal / fullChallengeTotal) * 100} className="h-2 mb-3" />
        <p className="text-xs text-muted-foreground mb-3">
          Semana 1 = R$1, Semana 2 = R$2... Semana 52 = R$52. Clique para marcar o que já guardou:
        </p>
        <div className="grid grid-cols-13 gap-1">
          {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => {
            const isCompleted = challenge52Weeks.includes(week);
            const isCurrent = week === currentWeek;
            return (
              <button
                key={week}
                onClick={() => toggleWeek(week)}
                className={`w-full aspect-square rounded text-[8px] font-medium transition-all ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-yellow-500/30 border border-yellow-500 text-yellow-400"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground"
                }`}
                title={`Semana ${week}: R$ ${week}`}
              >
                {week}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" /> Guardado
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500" /> Semana atual
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted/50" /> Pendente
          </span>
        </div>
      </div>

      {/* Tips for Leveling Up */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30 p-4">
        <h4 className="text-xs font-bold mb-2">💡 COMO DESBLOQUEAR MAIS CONQUISTAS</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          {!badges.find((b) => b.id === "saver")?.unlocked && <li>• Poupe pelo menos 20% da sua renda este mês</li>}
          {!badges.find((b) => b.id === "bills")?.unlocked && <li>• Pague todas as contas em dia</li>}
          {!badges.find((b) => b.id === "investor")?.unlocked && <li>• Alcance R$ 10.000 em investimentos</li>}
          {!badges.find((b) => b.id === "streak7")?.unlocked && <li>• Faça check-in por 7 dias seguidos</li>}
          {unlockedCount === badges.length && <li>🎉 Parabéns! Você desbloqueou todas as conquistas!</li>}
        </ul>
      </div>
    </div>
  );
};