import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WIDGET_CATALOG, WidgetId } from "@/hooks/use-home-widgets";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";

interface WidgetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeWidgets: WidgetId[];
  onToggle: (id: WidgetId) => void;
}

const categoryLabels: Record<string, string> = {
  produtividade: "📋 Produtividade",
  saúde: "💪 Saúde",
  finanças: "💰 Finanças",
  "bem-estar": "🧘 Bem-estar",
};

export const WidgetPicker = ({ open, onOpenChange, activeWidgets, onToggle }: WidgetPickerProps) => {
  const categories = [...new Set(WIDGET_CATALOG.map(w => w.category))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Adicionar Widgets</DialogTitle>
          <p className="text-xs text-muted-foreground">Personalize sua Home com informações úteis</p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {categories.map(cat => (
            <div key={cat}>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {categoryLabels[cat] || cat}
              </h4>
              <div className="space-y-1.5">
                {WIDGET_CATALOG.filter(w => w.category === cat).map(widget => {
                  const isActive = activeWidgets.includes(widget.id);
                  return (
                    <motion.button
                      key={widget.id}
                      onClick={() => onToggle(widget.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        isActive
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/50 bg-card hover:bg-muted/50"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{widget.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{widget.label}</p>
                        <p className="text-[10px] text-muted-foreground">{widget.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {isActive ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
