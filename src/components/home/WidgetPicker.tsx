import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WIDGET_CATALOG, WidgetId, ActiveWidget } from "@/hooks/use-home-widgets";
import { motion } from "framer-motion";
import { Plus, Check, Maximize2, Minimize2 } from "lucide-react";

interface WidgetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeWidgets: ActiveWidget[];
  onToggle: (id: WidgetId) => void;
  onToggleSize: (id: WidgetId) => void;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  produtividade: { label: "📋 PRODUTIVIDADE", color: "bg-slate-200 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200" },
  saúde: { label: "💪 SAÚDE", color: "bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-200" },
  finanças: { label: "💰 FINANÇAS", color: "bg-amber-200 dark:bg-amber-800/50 text-amber-900 dark:text-amber-200" },
  "bem-estar": { label: "🧘 BEM-ESTAR", color: "bg-purple-200 dark:bg-purple-800/50 text-purple-900 dark:text-purple-200" },
};

export const WidgetPicker = ({ open, onOpenChange, activeWidgets, onToggle, onToggleSize }: WidgetPickerProps) => {
  const categories = [...new Set(WIDGET_CATALOG.map(w => w.category))];
  const getActive = (id: WidgetId) => activeWidgets.find(w => w.id === id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-black">Adicionar Widgets</DialogTitle>
          <p className="text-xs text-muted-foreground">Personalize sua Home com informações úteis</p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {categories.map(cat => {
            const catInfo = categoryLabels[cat] || { label: cat, color: "bg-muted text-foreground" };
            return (
              <div key={cat} className="rounded-xl border border-border overflow-hidden">
                <div className={`px-4 py-2 ${catInfo.color}`}>
                  <h4 className="text-[11px] font-black uppercase tracking-wider">{catInfo.label}</h4>
                </div>
                <div className="p-2 space-y-1">
                  {WIDGET_CATALOG.filter(w => w.category === cat).map(widget => {
                    const active = getActive(widget.id);
                    const isActive = !!active;
                    return (
                      <motion.div
                        key={widget.id}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button onClick={() => onToggle(widget.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                          <span className="text-lg">{widget.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold">{widget.label}</p>
                            <p className="text-[10px] text-muted-foreground">{widget.description}</p>
                          </div>
                        </button>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isActive && (
                            <button
                              onClick={() => onToggleSize(widget.id)}
                              className="w-6 h-6 rounded-md flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                              title={active.size === "small" ? "Expandir" : "Reduzir"}
                            >
                              {active.size === "small" ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                            </button>
                          )}
                          <button
                            onClick={() => onToggle(widget.id)}
                            className={`w-6 h-6 rounded-md flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          >
                            {isActive ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
