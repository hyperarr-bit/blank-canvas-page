import { useState } from "react";
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

export const AnnualBudget = ({ data, setData }: AnnualBudgetProps) => {
  const updateField = (index: number, field: keyof Omit<MonthData, "month">, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: parseFloat(value) || 0 };
    setData(newData);
  };

  const sumCol = (field: keyof Omit<MonthData, "month">) => data.reduce((s, d) => s + d[field], 0);

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border animate-fade-in">
      <div className="table-header-dark rounded-t-lg">ORÇAMENTO E BALANÇO ANUAL</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Mês</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total RECEITAS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total CUSTOS FIXOS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total CUSTOS VARIÁ...</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total DÍVIDAS</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">BALANÇO</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const balance = row.receitas - row.custosFixos - row.custosVariaveis - row.dividas;
              return (
                <tr key={row.month} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-1.5 font-medium">{row.month}</td>
                  <td className="px-3 py-1.5">
                    <Input type="number" value={row.receitas || ""} onChange={(e) => updateField(i, "receitas", e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent shadow-none px-0 text-right focus-visible:ring-0 w-20 ml-auto" placeholder="0" />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input type="number" value={row.custosFixos || ""} onChange={(e) => updateField(i, "custosFixos", e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent shadow-none px-0 text-right focus-visible:ring-0 w-20 ml-auto" placeholder="0" />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input type="number" value={row.custosVariaveis || ""} onChange={(e) => updateField(i, "custosVariaveis", e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent shadow-none px-0 text-right focus-visible:ring-0 w-20 ml-auto" placeholder="0" />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input type="number" value={row.dividas || ""} onChange={(e) => updateField(i, "dividas", e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent shadow-none px-0 text-right focus-visible:ring-0 w-20 ml-auto" placeholder="0" />
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
              <td className="px-3 py-2 font-medium text-muted-foreground">SUM</td>
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
