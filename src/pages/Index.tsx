import { useState, useEffect } from "react";
import { IncomeTable } from "@/components/IncomeTable";
import { ExpenseTable } from "@/components/ExpenseTable";
import { BillsDueCards } from "@/components/BillsDueCards";
import { Calculator } from "@/components/Calculator";
import { Notes } from "@/components/Notes";
import { FinancialGoals } from "@/components/FinancialGoals";
import { FinancialSummary } from "@/components/FinancialSummary";
import { InstallmentTracker } from "@/components/InstallmentTracker";
import { AnnualBudget } from "@/components/AnnualBudget";
import { MonthlyBudget } from "@/components/MonthlyBudget";
import { WishlistItems } from "@/components/WishlistItems";
import { InvestmentsTracker } from "@/components/InvestmentsTracker";
import { FinancialHealth } from "@/components/FinancialHealth";
import { TravelPlanner } from "@/components/TravelPlanner";

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const usePersistedState = <T,>(key: string, initial: T): [T, (v: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("financeiro");

  const [incomes, setIncomes] = usePersistedState("finance-incomes", [
    { id: "1", description: "Salário", value: 3000, date: "2025-03-06" },
    { id: "2", description: "Renda Extra", value: 1300, date: "2025-03-15" },
    { id: "3", description: "Renda Extra 2", value: 500, date: "2025-03-15" },
  ]);

  const [expenses, setExpenses] = usePersistedState("finance-expenses", [
    { id: "1", description: "Tênis", category: "vestuario", value: 389.9, date: "2025-03-06", paymentMethod: "Cartão de Crédito" },
    { id: "2", description: "Janta fora", category: "restaurante", value: 477, date: "2025-03-16", paymentMethod: "Cartão de Crédito" },
    { id: "3", description: "Livro", category: "educacao", value: 97, date: "2025-03-05", paymentMethod: "Pix" },
    { id: "4", description: "Presente dia das crianças", category: "presente", value: 280, date: "2025-03-10", paymentMethod: "Cartão de Crédito" },
    { id: "5", description: "Show", category: "lazer", value: 260, date: "2025-03-14", paymentMethod: "Cartão de Crédito" },
    { id: "6", description: "Cafeteira", category: "eletrodomesticos", value: 890, date: "2025-03-02", paymentMethod: "Cartão de Crédito" },
  ]);

  const [dueDays, setDueDays] = usePersistedState("finance-dueDays", [
    { day: 5, color: "yellow", bills: [{ id: "1", name: "Luz", paid: true }, { id: "2", name: "Água", paid: true }, { id: "3", name: "Cartão Nubank", paid: true }] },
    { day: 10, color: "slate", bills: [{ id: "4", name: "Cartão Inter", paid: false }, { id: "5", name: "Cartão Itaú", paid: false }, { id: "6", name: "Curso", paid: false }, { id: "7", name: "Escolinha João", paid: false }] },
    { day: 20, color: "indigo", bills: [{ id: "8", name: "Academia", paid: false }, { id: "9", name: "Aluguel", paid: false }, { id: "10", name: "Condomínio", paid: false }] },
    { day: 30, color: "emerald", bills: [{ id: "11", name: "Imposto", paid: false }] },
  ]);

  const [notes, setNotes] = usePersistedState("finance-notes", [
    { id: "1", text: "Diminuir meus custos fixos e variáveis!" },
    { id: "2", text: "Negociar plano de celular" },
    { id: "3", text: "Ver um plano de saúde mais em conta" },
    { id: "4", text: "Guardar pelo menos 20%" },
  ]);

  const [goals, setGoals] = usePersistedState("finance-goals", [
    { id: "1", name: "Reserva de Emergência", targetValue: 10000, currentValue: 3500 },
    { id: "2", name: "Viagem", targetValue: 5000, currentValue: 1200 },
  ]);

  const [installments, setInstallments] = usePersistedState("finance-installments", [
    { id: "1", description: "iPhone 15", totalValue: 6000, installmentValue: 500, paidInstallments: 3, totalInstallments: 12, cardName: "nubank" },
    { id: "2", description: "Sofá", totalValue: 2400, installmentValue: 200, paidInstallments: 6, totalInstallments: 12, cardName: "inter" },
  ]);

  const [annualData, setAnnualData] = usePersistedState("finance-annual", 
    months.map((m, i) => ({
      month: m,
      receitas: i < 5 ? [13000, 14000, 13000, 14000, 15000][i] : 0,
      custosFixos: i < 5 ? [7500, 7981, 7347, 7200, 7550][i] : 0,
      custosVariaveis: i < 5 ? [3690, 4521, 5754, 4258, 4963][i] : 0,
      dividas: i < 5 ? [850, 850, 850, 500, 500][i] : 0,
    }))
  );

  const [monthlyBudgets, setMonthlyBudgets] = usePersistedState("finance-monthly-budgets",
    months.map((m) => ({ month: m, value: 0, hasNote: false }))
  );

  const [wishlistItems, setWishlistItems] = usePersistedState("finance-wishlist", [
    { id: "1", name: "MacBook Pro M3", price: 15000, savedAmount: 3000, priority: "alta" as const, category: "Eletrônicos" },
    { id: "2", name: "Viagem para Europa", price: 20000, savedAmount: 5000, priority: "media" as const, category: "Viagem" },
  ]);

  const [investments, setInvestments] = usePersistedState("finance-investments", [
    { id: "1", name: "Tesouro IPCA+ 2029", type: "renda_fixa" as const, investedAmount: 5000, currentValue: 5350, monthlyContribution: 500, startDate: "2024-01-15", broker: "XP" },
    { id: "2", name: "IVVB11", type: "renda_variavel" as const, investedAmount: 3000, currentValue: 3450, monthlyContribution: 300, startDate: "2024-03-01", broker: "Clear" },
    { id: "3", name: "Bitcoin", type: "cripto" as const, investedAmount: 2000, currentValue: 2800, monthlyContribution: 100, startDate: "2024-06-01", broker: "Binance" },
  ]);

  const [trips, setTrips] = usePersistedState("finance-trips", [
    {
      id: "1",
      destination: "Gramado - RS",
      startDate: "2025-07-15",
      endDate: "2025-07-20",
      budget: 5000,
      savedAmount: 2500,
      expenses: [
        { id: "1", category: "passagem" as const, description: "Passagem aérea", estimatedCost: 1200, paid: false },
        { id: "2", category: "hospedagem" as const, description: "Hotel 5 noites", estimatedCost: 1500, paid: false },
        { id: "3", category: "alimentacao" as const, description: "Alimentação estimada", estimatedCost: 800, paid: false },
        { id: "4", category: "passeios" as const, description: "Snowland + Mini Mundo", estimatedCost: 400, paid: false },
      ],
    },
  ]);

  const totalIncome = incomes.reduce((sum: number, i: any) => sum + i.value, 0);
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.value, 0);
  const totalDebts = installments.reduce((sum: number, i: any) => sum + (i.totalInstallments - i.paidInstallments) * i.installmentValue, 0);
  const totalInvestments = investments.reduce((sum: number, i: any) => sum + i.currentValue, 0);
  const emergencyFund = goals.find((g: any) => g.name.toLowerCase().includes("emergência"))?.currentValue || 0;
  const emergencyFundGoal = goals.find((g: any) => g.name.toLowerCase().includes("emergência"))?.targetValue || totalExpenses * 6;

  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const tabs = [
    { id: "financeiro", label: "MEU FINANCEIRO" },
    { id: "investimentos", label: "INVESTIMENTOS" },
    { id: "metas", label: "METAS FINANCEIRAS" },
    { id: "itens", label: "ITENS DE DESEJO" },
    { id: "viagem", label: "VIAGEM - CUSTOS" },
    { id: "saude", label: "SAÚDE FINANCEIRA" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-lg">≡</span>
          <h1 className="text-base font-bold tracking-tight">FINANÇAS EM ORDEM</h1>
          <span className="text-muted-foreground text-xs ml-auto capitalize">{currentMonth}</span>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`notion-tab whitespace-nowrap text-xs ${activeTab === tab.id ? "notion-tab-active" : "hover:bg-muted"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-5 space-y-5">
        {/* 4 Summary Cards - always visible and editable */}
        <FinancialSummary
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          totalDebts={totalDebts}
          totalInvestments={totalInvestments}
          onUpdateIncome={(value) => {
            if (incomes.length > 0) {
              const othersSum = incomes.slice(1).reduce((s: number, i: any) => s + i.value, 0);
              const newFirst = Math.max(0, value - othersSum);
              setIncomes(incomes.map((inc: any, idx: number) => idx === 0 ? { ...inc, value: newFirst } : inc));
            }
          }}
          onUpdateExpenses={(value) => {
            if (expenses.length > 0) {
              const othersSum = expenses.slice(1).reduce((s: number, e: any) => s + e.value, 0);
              const newFirst = Math.max(0, value - othersSum);
              setExpenses(expenses.map((exp: any, idx: number) => idx === 0 ? { ...exp, value: newFirst } : exp));
            }
          }}
          onUpdateDebts={(value) => {
            if (installments.length > 0) {
              const othersDebt = installments.slice(1).reduce((s: number, i: any) => s + (i.totalInstallments - i.paidInstallments) * i.installmentValue, 0);
              const firstRemaining = installments[0].totalInstallments - installments[0].paidInstallments;
              const newInstallmentValue = firstRemaining > 0 ? Math.max(0, value - othersDebt) / firstRemaining : 0;
              setInstallments(installments.map((inst: any, idx: number) => 
                idx === 0 ? { ...inst, installmentValue: newInstallmentValue } : inst
              ));
            }
          }}
          onUpdateInvestments={(value) => {
            if (investments.length > 0) {
              const othersSum = investments.slice(1).reduce((s: number, i: any) => s + i.currentValue, 0);
              const newFirst = Math.max(0, value - othersSum);
              setInvestments(investments.map((inv: any, idx: number) => 
                idx === 0 ? { ...inv, currentValue: newFirst } : inv
              ));
            }
          }}
        />

        {activeTab === "financeiro" && (
          <>
            {/* Annual Budget + Monthly Budget + Calculator row */}
            <div className="grid lg:grid-cols-[1fr_200px_auto] gap-4">
              <AnnualBudget data={annualData} setData={setAnnualData} />
              <MonthlyBudget budgets={monthlyBudgets} setBudgets={setMonthlyBudgets} />
              <div className="space-y-4">
                <Calculator />
              </div>
            </div>

            {/* Income table + Notes */}
            <div className="grid lg:grid-cols-[1fr_280px] gap-4">
              <IncomeTable incomes={incomes} setIncomes={setIncomes} />
              <Notes notes={notes} setNotes={setNotes} />
            </div>

            {/* Expenses */}
            <ExpenseTable expenses={expenses} setExpenses={setExpenses} />

            {/* Bills Due */}
            <BillsDueCards dueDays={dueDays} setDueDays={setDueDays} />

            {/* Installments */}
            <InstallmentTracker installments={installments} setInstallments={setInstallments} />
          </>
        )}

        {activeTab === "investimentos" && (
          <InvestmentsTracker investments={investments} setInvestments={setInvestments} />
        )}

        {activeTab === "metas" && (
          <div className="grid lg:grid-cols-2 gap-4">
            <FinancialGoals goals={goals} setGoals={setGoals} />
            <div className="space-y-4">
              <Notes notes={notes} setNotes={setNotes} />
              <Calculator />
            </div>
          </div>
        )}

        {activeTab === "itens" && (
          <WishlistItems 
            items={wishlistItems} 
            setItems={setWishlistItems} 
            monthlyBudget={totalIncome}
          />
        )}

        {activeTab === "viagem" && (
          <TravelPlanner trips={trips} setTrips={setTrips} />
        )}

        {activeTab === "saude" && (
          <FinancialHealth
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            totalDebts={totalDebts}
            totalInvestments={totalInvestments}
            emergencyFund={emergencyFund}
            emergencyFundGoal={emergencyFundGoal}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
