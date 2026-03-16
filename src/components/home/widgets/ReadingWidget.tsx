import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const ReadingWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();

  if (size === "small") {
    return (
      <button onClick={() => navigate("/biblioteca")} className="w-full text-left bg-card rounded-2xl p-4 shadow-sm hover:shadow-md border border-border/50 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-400/20">
            <BookOpen className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Leitura</h3>
            {data.currentBook ? (
              <>
                <p className="text-xs font-medium truncate">{data.currentBook}</p>
                <ProgressBar value={data.readingProgress} max={100} colorClass="bg-orange-500" />
              </>
            ) : (
              <p className="text-[10px] text-muted-foreground">Nenhum livro ativo</p>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button onClick={() => navigate("/biblioteca")} className="w-full text-left bg-card rounded-2xl p-4 shadow-sm hover:shadow-md border border-border/50 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-400/20">
          <BookOpen className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Leitura</h3>
      </div>
      {data.currentBook ? (
        <>
          <p className="text-sm font-bold truncate">{data.currentBook}</p>
          <div className="mt-2">
            <ProgressBar value={data.readingProgress} max={100} colorClass="bg-orange-500" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{data.readingProgress}% concluído</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum livro ativo</p>
      )}
    </button>
  );
};
