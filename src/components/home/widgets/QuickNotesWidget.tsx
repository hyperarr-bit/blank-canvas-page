import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/use-user-data";

const KEY = "core-home-quick-notes";

export const QuickNotesWidget = () => {
  const { get, set: setData } = useUserData();
  const [notes, setNotes] = useState(() => get<string>(KEY, ""));

  useEffect(() => { setData(KEY, notes); }, [notes, setData]);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-yellow-200 dark:bg-yellow-800/50 px-4 py-2">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-yellow-900 dark:text-yellow-200">📝 NOTAS RÁPIDAS</h4>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4">
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Anote algo rápido..."
          className="min-h-[60px] text-xs resize-none border-0 bg-white/50 dark:bg-white/5 focus-visible:ring-1 rounded-lg p-2.5"
        />
      </div>
    </div>
  );
};
