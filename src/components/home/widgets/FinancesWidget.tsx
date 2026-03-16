import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const FinancesWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (size === "small") {
    return (
      <button onClick={() => navigate("/financas")} className="w-full text-left bg-card rounded-2xl p-4 shadow-sm hover:shadow-md border border-border/50 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-400/20">
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Finanças</h3>
            <p className={`text-sm font-bold ${data.monthBalance >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmt(data.monthBalance)}</p>
            {data.nextBillName && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">📅 {data.nextBillName}</p>}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button onClick={() => navigate("/financas")} className="w-full text-left bg-card rounded-2xl p-4 shadow-sm hover:shadow-md border border-border/50 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-400/20">
          <DollarSign className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Finanças</h3>
      </div>
      <p className={`text-xl font-bold ${data.monthBalance >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmt(data.monthBalance)}</p>
      {data.nextBillName && <p className="text-xs text-muted-foreground mt-1">📅 Próxima: {data.nextBillName}</p>}
    </button>
  );
};
