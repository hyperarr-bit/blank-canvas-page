import { useState, useEffect } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight, Copy, Sparkles, Calendar } from "lucide-react";

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const getMonthKey = (month: string) =>
  month.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getMonthData = (month: string) => {
  const key = getMonthKey(month);
  const parse = (k: string) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };
  const incomes = parse(`finance-month-${key}-incomes`);
  const expenses = parse(`finance-month-${key}-expenses`);
  const fixed = parse(`finance-month-${key}-fixed`);
  const installments = parse(`finance-month-${key}-installments`);
  const dueDays = parse(`finance-month-${key}-dueDays`);

  const totalIncome = incomes.reduce((s: number, i: any) => s + (i.value || 0), 0);
  const totalFixed = fixed.reduce((s: number, e: any) => s + (e.value || 0), 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.value || 0), 0);
  const totalDebts = installments.reduce(
    (s: number, i: any) => s + ((i.totalInstallments - i.paidInstallments) * i.installmentValue || 0), 0
  );
  const allBills = dueDays.flatMap((d: any) => d.bills || []);
  const billsPaid = allBills.filter((b: any) => b.paid).length;

  return {
    totalIncome, totalFixed, totalExpenses, totalDebts,
    balance: totalIncome - totalFixed - totalExpenses - totalDebts,
    billsPaid, totalBills: allBills.length,
    hasData: totalIncome + totalFixed + totalExpenses > 0,
    fixed, dueDays, incomes,
  };
};

const copyToMonth = (fromMonth: string, toMonth: string, options: { fixed: boolean; bills: boolean }) => {
  const fromKey = getMonthKey(fromMonth);
  const toKey = getMonthKey(toMonth);

  if (options.fixed) {
    const fixed = localStorage.getItem(`finance-month-${fromKey}-fixed`);
    if (fixed) {
      const items = JSON.parse(fixed).map((i: any) => ({ ...i, id: Date.now().toString() + Math.random() }));
      localStorage.setItem(`finance-month-${toKey}-fixed`, JSON.stringify(items));
    }
  }

  if (options.bills) {
    const dueDays = localStorage.getItem(`finance-month-${fromKey}-dueDays`);
    if (dueDays) {
      const days = JSON.parse(dueDays).map((d: any) => ({
        ...d,
        bills: d.bills.map((b: any) => ({ ...b, id: Date.now().toString() + Math.random(), paid: false })),
      }));
      localStorage.setItem(`finance-month-${toKey}-dueDays`, JSON.stringify(days));
    }
  }
};

interface MonthTurnoverProps {
  onOpenMonth?: (month: string) => void;
}

export const MonthTurnover = ({ onOpenMonth }: MonthTurnoverProps) => {
  const [lastSeenMonth, setLastSeenMonth] = usePersistedState<string>("finance-last-seen-month", "");
  const [showRecap, setShowRecap] = useState(false);
  const [step, setStep] = useState<"recap" | "copy">("recap");
  const [copyFixed, setCopyFixed] = useState(true);
  const [copyBills, setCopyBills] = useState(true);
  const [copied, setCopied] = useState(false);

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentMonth = months[currentMonthIdx];
  const prevMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1;
  const prevMonth = months[prevMonthIdx];

  useEffect(() => {
    const currentKey = `${currentMonth}-${now.getFullYear()}`;
    if (lastSeenMonth && lastSeenMonth !== currentKey) {
      const prevData = getMonthData(prevMonth);
      if (prevData.hasData) {
        setShowRecap(true);
      }
    }
    if (!lastSeenMonth || lastSeenMonth !== currentKey) {
      setLastSeenMonth(currentKey);
    }
  }, []);

  const prevData = getMonthData(prevMonth);
  const savingsRate = prevData.totalIncome > 0
    ? ((prevData.totalIncome - prevData.totalExpenses - prevData.totalFixed) / prevData.totalIncome) * 100
    : 0;

  const getMessage = () => {
    if (prevData.balance > 0 && savingsRate >= 30) {
      return { emoji: "🏆", text: `Incrível! Você economizou ${savingsRate.toFixed(0)}% da renda em ${prevMonth}. Continue assim!`, tone: "success" as const };
    }
    if (prevData.balance > 0) {
      return { emoji: "✅", text: `Bom trabalho! Você fechou ${prevMonth} no positivo. Vamos manter o ritmo!`, tone: "success" as const };
    }
    if (prevData.balance === 0) {
      return { emoji: "⚖️", text: `${prevMonth} ficou no zero a zero. Que tal traçar uma meta de economia para ${currentMonth}?`, tone: "neutral" as const };
    }
    return { emoji: "💪", text: `${prevMonth} foi desafiador, mas você está no controle. Vamos planejar ${currentMonth} melhor!`, tone: "warning" as const };
  };

  const message = getMessage();

  const handleCopy = () => {
    copyToMonth(prevMonth, currentMonth, { fixed: copyFixed, bills: copyBills });
    setCopied(true);
    setTimeout(() => {
      setShowRecap(false);
      setStep("recap");
      setCopied(false);
    }, 1500);
  };

  const handleClose = () => {
    setShowRecap(false);
    setStep("recap");
  };

  // Button to manually trigger recap (for testing / re-viewing)
  const triggerRecap = () => {
    setStep("recap");
    setShowRecap(true);
  };

  return (
    <>
      {/* Recap trigger banner - shows at start of new month */}
      {prevData.hasData && (
        <button
          onClick={triggerRecap}
          className="w-full bg-card rounded-lg border border-border p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold">Resumo de {prevMonth}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              Toque para ver como foi seu mês e preparar {currentMonth}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      )}

      <Dialog open={showRecap} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-md w-[92vw] p-0 gap-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === "recap" && (
              <motion.div
                key="recap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 space-y-5"
              >
                {/* Header */}
                <div className="text-center space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-4xl"
                  >
                    {message.emoji}
                  </motion.div>
                  <h2 className="text-lg font-bold">{prevMonth} acabou!</h2>
                  <p className="text-xs text-muted-foreground">Aqui está seu resumo financeiro</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-3 bg-card-receitas border border-card-receitas-border">
                    <span className="text-[10px] text-card-receitas-text font-medium">Receitas</span>
                    <p className="text-sm font-bold text-card-receitas-text">
                      R$ {prevData.totalIncome.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 bg-card-despesas border border-card-despesas-border">
                    <span className="text-[10px] text-card-despesas-text font-medium">Despesas</span>
                    <p className="text-sm font-bold text-card-despesas-text">
                      R$ {(prevData.totalExpenses + prevData.totalFixed).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Balance */}
                <div className={`rounded-lg p-3 text-center border ${
                  prevData.balance >= 0 ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {prevData.balance >= 0
                      ? <TrendingUp className="w-4 h-4 text-success" />
                      : <TrendingDown className="w-4 h-4 text-destructive" />
                    }
                    <span className="text-[10px] font-bold text-muted-foreground">SALDO</span>
                  </div>
                  <p className={`text-xl font-bold ${prevData.balance >= 0 ? "text-success" : "text-destructive"}`}>
                    R$ {prevData.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Bills */}
                {prevData.totalBills > 0 && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Contas pagas</span>
                    <span className="text-xs font-bold">
                      {prevData.billsPaid}/{prevData.totalBills} ({prevData.totalBills > 0 ? Math.round((prevData.billsPaid / prevData.totalBills) * 100) : 0}%)
                    </span>
                  </div>
                )}

                {/* Motivational message */}
                <div className="rounded-lg p-3 bg-primary/5 border border-primary/20">
                  <p className="text-xs text-center">{message.text}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      handleClose();
                      onOpenMonth?.(prevMonth);
                    }}
                  >
                    Ver detalhes
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs gap-1"
                    onClick={() => setStep("copy")}
                  >
                    <Sparkles className="w-3 h-3" />
                    Preparar {currentMonth}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "copy" && (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 space-y-5"
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">📋</div>
                  <h2 className="text-lg font-bold">Preparar {currentMonth}</h2>
                  <p className="text-xs text-muted-foreground">
                    Copiar dados de {prevMonth} para {currentMonth}?
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyFixed} onCheckedChange={(v) => setCopyFixed(!!v)} />
                    <div className="flex-1">
                      <p className="text-xs font-bold">Custos Fixos</p>
                      <p className="text-[10px] text-muted-foreground">
                        Aluguel, contas, assinaturas ({prevData.fixed.length} itens)
                      </p>
                    </div>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyBills} onCheckedChange={(v) => setCopyBills(!!v)} />
                    <div className="flex-1">
                      <p className="text-xs font-bold">Vencimentos</p>
                      <p className="text-[10px] text-muted-foreground">
                        Contas por dia de vencimento (marcadas como não pagas)
                      </p>
                    </div>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </label>
                </div>

                <div className="rounded-lg p-2 bg-muted/30">
                  <p className="text-[10px] text-muted-foreground text-center">
                    💡 Receitas não são copiadas — valores podem variar entre meses
                  </p>
                </div>

                {copied ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-center py-3"
                  >
                    <p className="text-sm font-bold text-success">✅ Dados copiados com sucesso!</p>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={handleClose}
                    >
                      Pular
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs gap-1"
                      onClick={handleCopy}
                      disabled={!copyFixed && !copyBills}
                    >
                      <Copy className="w-3 h-3" />
                      Copiar para {currentMonth}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};
