import { useState, useEffect } from "react";
import { Wallet, Menu } from "lucide-react";
import { IncomeTable } from "@/components/IncomeTable";
import { ExpenseTable } from "@/components/ExpenseTable";
import { BillsDueCards } from "@/components/BillsDueCards";
import { Calculator } from "@/components/Calculator";
import { Notes } from "@/components/Notes";
import { FinancialGoals } from "@/components/FinancialGoals";
import { FinancialSummary } from "@/components/FinancialSummary";
import { InstallmentTracker } from "@/components/InstallmentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem("finance-incomes");
    return saved ? JSON.parse(saved) : [
      { id: "1", description: "Salário", value: 3000, date: "2025-03-06" },
      { id: "2", description: "Freelance", value: 1500, date: "2025-03-15" },
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("finance-expenses");
    return saved ? JSON.parse(saved) : [
      { id: "1", description: "Supermercado", category: "alimentacao", value: 450, date: "2025-03-05", paymentMethod: "Cartão de Débito" },
      { id: "2", description: "Academia", category: "saude", value: 120, date: "2025-03-01", paymentMethod: "Pix" },
    ];
  });

  const [dueDays, setDueDays] = useState(() => {
    const saved = localStorage.getItem("finance-dueDays");
    return saved ? JSON.parse(saved) : [
      { day: 5, color: "yellow", bills: [{ id: "1", name: "Luz", paid: false }, { id: "2", name: "Água", paid: true }] },
      { day: 10, color: "slate", bills: [{ id: "3", name: "Cartão Inter", paid: false }, { id: "4", name: "Cartão Itaú", paid: false }] },
      { day: 20, color: "indigo", bills: [{ id: "5", name: "Academia", paid: false }, { id: "6", name: "Aluguel", paid: false }] },
      { day: 30, color: "emerald", bills: [{ id: "7", name: "Internet", paid: false }] },
    ];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("finance-notes");
    return saved ? JSON.parse(saved) : [
      { id: "1", text: "Diminuir custos fixos e variáveis!" },
      { id: "2", text: "Negociar plano de celular" },
      { id: "3", text: "Guardar pelo menos 20%" },
    ];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("finance-goals");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Reserva de Emergência", targetValue: 10000, currentValue: 3500 },
      { id: "2", name: "Viagem", targetValue: 5000, currentValue: 1200 },
    ];
  });

  const [installments, setInstallments] = useState(() => {
    const saved = localStorage.getItem("finance-installments");
    return saved ? JSON.parse(saved) : [
      { id: "1", description: "iPhone 15", totalValue: 6000, installmentValue: 500, paidInstallments: 3, totalInstallments: 12, cardName: "nubank" },
      { id: "2", description: "Sofá", totalValue: 2400, installmentValue: 200, paidInstallments: 6, totalInstallments: 12, cardName: "inter" },
    ];
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("finance-incomes", JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem("finance-expenses", JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem("finance-dueDays", JSON.stringify(dueDays)); }, [dueDays]);
  useEffect(() => { localStorage.setItem("finance-notes", JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem("finance-goals", JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem("finance-installments", JSON.stringify(installments)); }, [installments]);

  const totalIncome = incomes.reduce((sum: number, i: any) => sum + i.value, 0);
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.value, 0);

  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Finanças em Ordem</h1>
              <p className="text-xs text-muted-foreground capitalize">{currentMonth}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Financial Summary */}
        <FinancialSummary totalIncome={totalIncome} totalExpenses={totalExpenses} />

        {/* Tabs */}
        <Tabs defaultValue="financeiro" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-muted/50 p-1 h-auto">
            <TabsTrigger value="financeiro" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Meu Financeiro
            </TabsTrigger>
            <TabsTrigger value="metas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Metas
            </TabsTrigger>
            <TabsTrigger value="parcelamentos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Parcelamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financeiro" className="space-y-6 mt-6">
            {/* Income and Expenses */}
            <div className="grid lg:grid-cols-2 gap-6">
              <IncomeTable incomes={incomes} setIncomes={setIncomes} />
              <div className="space-y-6">
                <Calculator />
                <Notes notes={notes} setNotes={setNotes} />
              </div>
            </div>

            <ExpenseTable expenses={expenses} setExpenses={setExpenses} />

            {/* Bills Due */}
            <BillsDueCards dueDays={dueDays} setDueDays={setDueDays} />
          </TabsContent>

          <TabsContent value="metas" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <FinancialGoals goals={goals} setGoals={setGoals} />
              <div className="space-y-6">
                <Notes notes={notes} setNotes={setNotes} />
                <Calculator />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parcelamentos" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <InstallmentTracker installments={installments} setInstallments={setInstallments} />
              <div className="space-y-6">
                <Calculator />
                <Notes notes={notes} setNotes={setNotes} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>💰 Organize suas finanças e alcance seus objetivos!</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
