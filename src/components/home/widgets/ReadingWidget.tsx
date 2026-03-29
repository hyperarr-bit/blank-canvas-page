import { useNavigate } from "react-router-dom";
import { useLifeHubData } from "@/hooks/use-life-hub-data";
import { useUserData } from "@/hooks/use-user-data";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WidgetSize } from "@/hooks/use-home-widgets";

export const ReadingWidget = ({ size = "small" }: { size?: WidgetSize }) => {
  const navigate = useNavigate();
  const data = useLifeHubData();
  const { get, set } = useUserData();

  const updateProgress = (newProgress: number, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    const books = get<any[]>("lib-books", []);
    const updated = books.map((b: any) => b.status === "lendo" ? { ...b, progress: Math.min(100, Math.max(0, newProgress)) } : b);
    set("lib-books", updated);
  };

  if (size === "small") {
    return (
      <button onClick={() => navigate("/biblioteca")} className="w-full text-left rounded-xl border border-border overflow-hidden">
        <div className="bg-orange-200 dark:bg-orange-800/50 px-3 py-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-orange-900 dark:text-orange-200">📚 LEITURA</h3>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/20 p-3">
          {data.currentBook ? (
            <>
              <p className="text-xs font-medium truncate">{data.currentBook}</p>
              <ProgressBar value={data.readingProgress} max={100} colorClass="bg-orange-500" />
            </>
          ) : (
            <p className="text-[10px] text-muted-foreground">Nenhum livro ativo</p>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="w-full text-left rounded-xl border border-border overflow-hidden">
      <div className="bg-orange-200 dark:bg-orange-800/50 px-4 py-2">
        <button onClick={() => navigate("/biblioteca")} className="text-[11px] font-black uppercase tracking-wider text-orange-900 dark:text-orange-200">📚 LEITURA</button>
      </div>
      <div className="bg-orange-50 dark:bg-orange-950/20 p-4">
        {data.currentBook ? (
          <>
            <p className="text-sm font-bold truncate">{data.currentBook}</p>
            <div className="mt-2"><ProgressBar value={data.readingProgress} max={100} colorClass="bg-orange-500" /></div>
            <div className="mt-3 flex items-center gap-3" onClick={e => e.stopPropagation()}>
              <input type="range" min={0} max={100} value={data.readingProgress} onChange={(e) => updateProgress(parseInt(e.target.value), e)} className="flex-1 h-1.5 accent-orange-500 cursor-pointer" />
              <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">{data.readingProgress}%</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum livro ativo</p>
        )}
      </div>
    </div>
  );
};
