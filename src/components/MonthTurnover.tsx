import { useState, useEffect } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight, Copy, Sparkles, Calendar, Wallet, Receipt, FileText, CreditCard, StickyNote } from "lucide-react";
import { getMonthTotals, getFinanceStorageKeys, getCurrentMonthName, getMonthKey } from "@/components/finance/storage-keys";

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

interface CopyOptions {
  fixed: boolean;
  bills: boolean;
  incomes: boolean;
  installments: boolean;
  notes: boolean;
}

const getItemCount = (storageKey: string): number => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    // For dueDays, count total bills
    if (Array.isArray(parsed) && parsed[0]?.bills) {
      return parsed.flatMap((d: any) => d.bills || []).length;
    }
    return 0;
  } catch { return 0; }
};

const copyToMonth = (fromMonth: string, toMonth: string, options: CopyOptions) => {
  const fromKeys = getFinanceStorageKeys(fromMonth);
  const toKeys = getFinanceStorageKeys(toMonth);

  if (options.fixed) {
    const fixed = localStorage.getItem(fromKeys.fixed);
    if (fixed) {
      const items = JSON.parse(fixed).map((i: any) => ({ ...i, id: Date.now().toString() + Math.random() }));
      localStorage.setItem(toKeys.fixed, JSON.stringify(items));
    }
  }

  if (options.bills) {
    const dueDays = localStorage.getItem(fromKeys.dueDays);
    if (dueDays) {
      const days = JSON.parse(dueDays).map((d: any) => ({
        ...d,
        bills: d.bills.map((b: any) => ({ ...b, id: Date.now().toString() + Math.random(), paid: false })),
      }));
      localStorage.setItem(toKeys.dueDays, JSON.stringify(days));
    }
  }

  if (options.incomes) {
    const incomes = localStorage.getItem(fromKeys.incomes);
    if (incomes) {
      const items = JSON.parse(incomes).map((i: any) => ({ ...i, id: Date.now().toString() + Math.random() }));
      localStorage.setItem(toKeys.incomes, JSON.stringify(items));
    }
  }

  if (options.installments) {
    const installments = localStorage.getItem(fromKeys.installments);
    if (installments) {
      const items = JSON.parse(installments).map((i: any) => ({
        ...i,
        id: Date.now().toString() + Math.random(),
        paidInstallments: Math.min((i.paidInstallments || 0) + 1, i.totalInstallments || 0),
      }));
      localStorage.setItem(toKeys.installments, JSON.stringify(items));
    }
  }

  if (options.notes) {
    const notes = localStorage.getItem(fromKeys.notes);
    if (notes) {
      const items = JSON.parse(notes).map((i: any) => ({ ...i, id: Date.now().toString() + Math.random() }));
      localStorage.setItem(toKeys.notes, JSON.stringify(items));
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
  const [copyIncomes, setCopyIncomes] = useState(true);
  const [copyInstallments, setCopyInstallments] = useState(true);
  const [copyNotes, setCopyNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentMonth = getCurrentMonthName();
  const currentMonthIdx = months.indexOf(currentMonth);
  const prevMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1;
  const prevMonth = months[prevMonthIdx];

  const prevData = getMonthTotals(prevMonth);
  const prevHasData = prevData.receitas + prevData.custosFixos + prevData.custosVariaveis > 0;

  const prevKeys = getFinanceStorageKeys(prevMonth);
  const prevFixedCount = getItemCount(prevKeys.fixed);
  const prevIncomesCount = getItemCount(prevKeys.incomes);
  const prevInstallmentsCount = getItemCount(prevKeys.installments);
  const prevNotesCount = getItemCount(prevKeys.notes);

  // Count bills
  const prevBillsInfo = (() => {
    try {
      const raw = localStorage.getItem(prevKeys.dueDays);
      if (!raw) return { total: 0, paid: 0 };
      const days = JSON.parse(raw);
      const allBills = days.flatMap((d: any) => d.bills || []);
      return { total: allBills.length, paid: allBills.filter((b: any) => b.paid).length };
    } catch { return { total: 0, paid: 0 }; }
  })();

  const prevBalance = prevData.receitas - prevData.custosFixos - prevData.custosVariaveis - prevData.dividas;

  useEffect(() => {
    const currentKey = `${currentMonth}-${new Date().getFullYear()}`;
    if (lastSeenMonth && lastSeenMonth !== currentKey && prevHasData) {
      setShowRecap(true);
    }
    if (!lastSeenMonth || lastSeenMonth !== currentKey) {
      setLastSeenMonth(currentKey);
    }
  }, []);

  const savingsRate = prevData.receitas > 0
    ? ((prevData.receitas - prevData.custosVariaveis - prevData.custosFixos) / prevData.receitas) * 100
    : 0;

  const getMessage = () => {
    if (prevBalance > 0 && savingsRate >= 30) {
      return { emoji: "🏆", text: `Incrível! Você economizou ${savingsRate.toFixed(0)}% da renda em ${prevMonth}. Continue assim!` };
    }
    if (prevBalance > 0) {
      return { emoji: "✅", text: `Bom trabalho! Você fechou ${prevMonth} no positivo. Vamos manter o ritmo!` };
    }
    if (prevBalance === 0) {
      return { emoji: "⚖️", text: `${prevMonth} ficou no zero a zero. Que tal traçar uma meta de economia para ${currentMonth}?` };
    }
    return { emoji: "💪", text: `${prevMonth} foi desafiador, mas você está no controle. Vamos planejar ${currentMonth} melhor!` };
  };

  const message = getMessage();

  const handleCopy = () => {
    copyToMonth(prevMonth, currentMonth, {
      fixed: copyFixed,
      bills: copyBills,
      incomes: copyIncomes,
      installments: copyInstallments,
      notes: copyNotes,
    });
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

  const triggerRecap = () => {
    setStep("recap");
    setShowRecap(true);
  };

  const anyCopySelected = copyFixed || copyBills || copyIncomes || copyInstallments || copyNotes;

  return (
    <>
      {prevHasData && (
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

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-3 bg-card-receitas border border-card-receitas-border">
                    <span className="text-[10px] text-card-receitas-text font-medium">Receitas</span>
                    <p className="text-sm font-bold text-card-receitas-text">
                      R$ {prevData.receitas.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 bg-card-despesas border border-card-despesas-border">
                    <span className="text-[10px] text-card-despesas-text font-medium">Despesas</span>
                    <p className="text-sm font-bold text-card-despesas-text">
                      R$ {(prevData.custosVariaveis + prevData.custosFixos).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className={`rounded-lg p-3 text-center border ${
                  prevBalance >= 0 ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {prevBalance >= 0
                      ? <TrendingUp className="w-4 h-4 text-success" />
                      : <TrendingDown className="w-4 h-4 text-destructive" />
                    }
                    <span className="text-[10px] font-bold text-muted-foreground">SALDO</span>
                  </div>
                  <p className={`text-xl font-bold ${prevBalance >= 0 ? "text-success" : "text-destructive"}`}>
                    R$ {prevBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {prevBillsInfo.total > 0 && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Contas pagas</span>
                    <span className="text-xs font-bold">
                      {prevBillsInfo.paid}/{prevBillsInfo.total} ({Math.round((prevBillsInfo.paid / prevBillsInfo.total) * 100)}%)
                    </span>
                  </div>
                )}

                <div className="rounded-lg p-3 bg-primary/5 border border-primary/20">
                  <p className="text-xs text-center">{message.text}</p>
                </div>

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

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyFixed} onCheckedChange={(v) => setCopyFixed(!!v)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">Custos Fixos</p>
                      <p className="text-[10px] text-muted-foreground">
                        Aluguel, contas, assinaturas ({prevFixedCount} itens)
                      </p>
                    </div>
                    <Receipt className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyBills} onCheckedChange={(v) => setCopyBills(!!v)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">Vencimentos</p>
                      <p className="text-[10px] text-muted-foreground">
                        Contas por dia ({prevBillsInfo.total} contas, marcadas como não pagas)
                      </p>
                    </div>
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyIncomes} onCheckedChange={(v) => setCopyIncomes(!!v)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">Receitas</p>
                      <p className="text-[10px] text-muted-foreground">
                        Salário, freelance, extras ({prevIncomesCount} itens)
                      </p>
                    </div>
                    <Wallet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyInstallments} onCheckedChange={(v) => setCopyInstallments(!!v)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">Parcelas</p>
                      <p className="text-[10px] text-muted-foreground">
                        Cartões e financiamentos ({prevInstallmentsCount} itens, +1 parcela paga)
                      </p>
                    </div>
                    <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox checked={copyNotes} onCheckedChange={(v) => setCopyNotes(!!v)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">Notas</p>
                      <p className="text-[10px] text-muted-foreground">
                        Lembretes e anotações ({prevNotesCount} itens)
                      </p>
                    </div>
                    <StickyNote className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </label>
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
                      disabled={!anyCopySelected}
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
