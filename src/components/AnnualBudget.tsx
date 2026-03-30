import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

interface MonthData {
  month: string;
  receitas: number;
  custosFixos: number;
  custosVariaveis: number;
  dividas: number;
}

interface AnnualBudgetProps {
  data: MonthData[];
  setData: (data: MonthData[]) => void;
}

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const getMonthKey = (month: string) =>
  month.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getMonthlyData = (month: string) => {
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

  return {
    receitas: incomes.reduce((s: number, i: any) => s + (i.value || 0), 0),
    custosFixos: fixed.reduce((s: number, e: any) => s + (e.value || 0), 0),
    custosVariaveis: expenses.reduce((s: number, e: any) => s + (e.value || 0), 0),
    dividas: installments.reduce(
      (s: number, i: any) => s + ((i.totalInstallments - i.paidInstallments) * i.installmentValue || 0), 0
    ),
  };
};

export const AnnualBudget = ({ data, setData }: AnnualBudgetProps) => {
  // Combine: main finance data (manual) + monthly sheet data (auto)
  const computedData = useMemo(() => {
    return data.map((row) => {
      const monthly = getMonthlyData(row.month);
      return {
        month: row.month,
        receitas: row.receitas + monthly.receitas,
        custosFixos: row.custosFixos + monthly.custosFixos,
        custosVariaveis: row.custosVariaveis + monthly.custosVariaveis,
        dividas: row.dividas + monthly.dividas,
        // Keep track of monthly sheet values for display
        hasMonthly: monthly.receitas + monthly.custosFixos + monthly.custosVariaveis + monthly.dividas > 0,
      };
    });
  }, [data]);

  const sumCol = (field: "receitas" | "custosFixos" | "custosVariaveis" | "dividas") =>
    computedData.reduce((s, d) => s + d[field], 0);

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border animate-fade-in">
      <div className="table-header-dark rounded-t-lg">
        ORÇAMENTO E BALANÇO ANUAL
        <span className="text-[9px] font-normal opacity-70 ml-2">(dados manuais + planilhas mensais)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[550px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Mês</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">RECEITAS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">C. FIXOS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">C. VARIÁVEIS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">DÍVIDAS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">BALANÇO</th>
            </tr>
          </thead>
          <tbody>
            {computedData.map((row) => {
              const balance = row.receitas - row.custosFixos - row.custosVariaveis - row.dividas;
              return (
                <tr key={row.month} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-1.5 font-medium">
                    {row.month}
                    {row.hasMonthly && (
                      <span className="ml-1 text-[8px] text-primary" title="Inclui dados da planilha mensal">📄</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row.receitas > 0 ? row.receitas.toLocaleString("pt-BR") : ""}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row.custosFixos > 0 ? row.custosFixos.toLocaleString("pt-BR") : ""}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row.custosVariaveis > 0 ? row.custosVariaveis.toLocaleString("pt-BR") : ""}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row.dividas > 0 ? row.dividas.toLocaleString("pt-BR") : ""}
                  </td>
                  <td className={`px-3 py-1.5 text-right font-medium tabular-nums ${balance >= 0 ? "text-success" : "text-destructive"}`}>
                    {balance !== 0 ? `${balance >= 0 ? "+" : ""}${balance.toLocaleString("pt-BR")}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="px-3 py-2 font-medium text-muted-foreground">TOTAL</td>
              <td className="px-3 py-2 text-right font-bold tabular-nums">{sumCol("receitas").toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2 text-right font-bold tabular-nums">{sumCol("custosFixos").toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2 text-right font-bold tabular-nums">{sumCol("custosVariaveis").toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2 text-right font-bold tabular-nums">{sumCol("dividas").toLocaleString("pt-BR")}</td>
              <td className={`px-3 py-2 text-right font-bold tabular-nums ${(sumCol("receitas") - sumCol("custosFixos") - sumCol("custosVariaveis") - sumCol("dividas")) >= 0 ? "text-success" : "text-destructive"}`}>
                {(sumCol("receitas") - sumCol("custosFixos") - sumCol("custosVariaveis") - sumCol("dividas")).toLocaleString("pt-BR")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
