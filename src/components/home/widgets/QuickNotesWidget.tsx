import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

const KEY = "core-home-quick-notes";

export const QuickNotesWidget = () => {
  const [notes, setNotes] = useState(() => localStorage.getItem(KEY) || "");

  useEffect(() => {
    localStorage.setItem(KEY, notes);
  }, [notes]);

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">📝 Notas Rápidas</h4>
      <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Anote algo rápido..."
        className="min-h-[60px] text-xs resize-none border-0 bg-muted/30 focus-visible:ring-1 rounded-xl p-2.5"
      />
    </div>
  );
};
