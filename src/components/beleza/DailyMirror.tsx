import { usePersistedState } from "@/hooks/use-persisted-state";

const getDateKey = () => new Date().toISOString().slice(0, 10);

const skinOptions = [
  { id: "seca", label: "Seca", emoji: "🌵" },
  { id: "oleosa", label: "Oleosa", emoji: "🛢️" },
  { id: "acne", label: "Acne", emoji: "🔴" },
  { id: "boa", label: "Boa", emoji: "✨" },
  { id: "sensivel", label: "Sensível", emoji: "🍅" },
];

export const DailyMirror = () => {
  const today = getDateKey();
  const [checkins, setCheckins] = usePersistedState<Record<string, string>>("skincare-daily-checkin", {});
  const [morningChecked] = usePersistedState<Record<string, number[]>>("skincare-morning-checked", {});
  const [nightChecked] = usePersistedState<Record<string, number[]>>("skincare-night-checked", {});

  const todaySkin = checkins[today] || "";

  const selectSkin = (id: string) => {
    setCheckins(prev => ({ ...prev, [today]: id }));
  };

  // Streak: count consecutive days with at least one routine done
  const streak = (() => {
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const key = d.toISOString().slice(0, 10);
      const m = morningChecked[key];
      const n = nightChecked[key];
      if ((m && m.length > 0) || (n && n.length > 0)) count++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  // Consistency ring SVG
  const weekDays = 7;
  const pct = Math.min(streak, weekDays) / weekDays;
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="space-y-4">
      {/* Consistency Ring + Check-in */}
      <div className="sk-card rounded-2xl p-4">
        <div className="flex items-center gap-4">
          {/* Ring */}
          <div className="relative shrink-0">
            <svg width="68" height="68" className="transform -rotate-90">
              <circle cx="34" cy="34" r={r} fill="none" stroke="hsla(0,0%,100%,0.08)" strokeWidth="4" />
              <circle cx="34" cy="34" r={r} fill="none" stroke="hsl(120,100%,80%)" strokeWidth="4"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-sk-mint">{Math.min(streak, 7)}</span>
              <span className="text-[8px] text-muted-foreground">/7 dias</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground mb-0.5">Como está sua pele hoje?</p>
            <p className="text-[10px] text-muted-foreground mb-2.5">
              {streak > 0 ? `🔥 ${streak} dias consecutivos de rotina` : "Comece sua sequência hoje!"}
            </p>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {skinOptions.map(s => (
                <button
                  key={s.id}
                  onClick={() => selectSkin(s.id)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-medium transition-all border ${
                    todaySkin === s.id
                      ? "bg-sk-mint/20 border-sk-mint/40 text-sk-mint shadow-[0_0_12px_hsla(120,100%,80%,0.15)]"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {todaySkin === "sensivel" && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-sk-coral/10 border border-sk-coral/20">
            <p className="text-[10px] text-sk-coral font-medium">
              🛑 Pele sensível detectada — ácidos e esfoliantes foram ocultados da rotina noturna. Foco em hidratação!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
