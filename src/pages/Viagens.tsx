import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { ArrowLeft, Compass, Map, Package, Users, MapPin, DollarSign, BookOpen, Shield, ArrowRightLeft, Timer, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCountdown } from "@/components/travel/TripCountdown";
import { DailyTimeline } from "@/components/travel/DailyTimeline";
import { PackingChecklist } from "@/components/travel/PackingChecklist";
import { BillSplitter } from "@/components/travel/BillSplitter";
import { PlacesBoard } from "@/components/travel/PlacesBoard";
import { SafetyCard } from "@/components/travel/SafetyCard";
import { CurrencyConverter } from "@/components/travel/CurrencyConverter";
import { TravelDiary } from "@/components/travel/TravelDiary";
import { TravelBudget } from "@/components/travel/TravelBudget";
import { BucketList } from "@/components/travel/BucketList";
import { daysUntil } from "@/components/travel/types";
import type { TripCountdown as TripCountdownType } from "@/components/travel/types";

type Section =
  | "countdown"
  | "destinos"
  | "cronograma"
  | "mala"
  | "divisor"
  | "lugares"
  | "budget"
  | "diario"
  | "seguranca"
  | "moeda";

const SECTIONS: { id: Section; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { id: "countdown", label: "Countdown", icon: <Timer className="w-5 h-5" />, description: "Contagem regressiva", color: "from-accent/20 to-accent/5" },
  { id: "destinos", label: "Destinos", icon: <Compass className="w-5 h-5" />, description: "Bucket list", color: "from-blue-500/15 to-blue-500/5" },
  { id: "cronograma", label: "Cronograma", icon: <Map className="w-5 h-5" />, description: "Dia a dia", color: "from-green-500/15 to-green-500/5" },
  { id: "mala", label: "Bagagem", icon: <Package className="w-5 h-5" />, description: "Smart packing", color: "from-orange-500/15 to-orange-500/5" },
  { id: "divisor", label: "Rachar Conta", icon: <Users className="w-5 h-5" />, description: "Splitwise", color: "from-purple-500/15 to-purple-500/5" },
  { id: "lugares", label: "Lugares", icon: <MapPin className="w-5 h-5" />, description: "Para visitar", color: "from-pink-500/15 to-pink-500/5" },
  { id: "budget", label: "Budget", icon: <DollarSign className="w-5 h-5" />, description: "Orçamento", color: "from-emerald-500/15 to-emerald-500/5" },
  { id: "diario", label: "Diário", icon: <BookOpen className="w-5 h-5" />, description: "Memórias", color: "from-yellow-500/15 to-yellow-500/5" },
  { id: "seguranca", label: "Emergência", icon: <Shield className="w-5 h-5" />, description: "Safety card", color: "from-red-500/15 to-red-500/5" },
  { id: "moeda", label: "Câmbio", icon: <ArrowRightLeft className="w-5 h-5" />, description: "Conversor", color: "from-cyan-500/15 to-cyan-500/5" },
];

const Viagens = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [countdowns] = usePersistedState<TripCountdownType[]>("travel-countdowns", []);

  const nextTrip = countdowns
    .filter(c => daysUntil(c.departureDate) > 0)
    .sort((a, b) => daysUntil(a.departureDate) - daysUntil(b.departureDate))[0];

  const renderSection = () => {
    switch (activeSection) {
      case "countdown": return <TripCountdown />;
      case "destinos": return <BucketList />;
      case "cronograma": return <DailyTimeline />;
      case "mala": return <PackingChecklist />;
      case "divisor": return <BillSplitter />;
      case "lugares": return <PlacesBoard />;
      case "budget": return <TravelBudget />;
      case "diario": return <TravelDiary />;
      case "seguranca": return <SafetyCard />;
      case "moeda": return <CurrencyConverter />;
      default: return null;
    }
  };

  const activeMeta = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-background">
      {/* Header — unique gradient style */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl"
            onClick={() => activeSection ? setActiveSection(null) : navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            {activeSection ? (
              <div className="flex items-center gap-2">
                {activeMeta?.icon}
                <div>
                  <h1 className="text-sm font-bold">{activeMeta?.label}</h1>
                  <p className="text-[9px] text-muted-foreground">{activeMeta?.description}</p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Plane className="w-5 h-5 text-accent" />
                  Wanderlust
                </h1>
                <p className="text-[10px] text-muted-foreground">Planeje, viva, eternize</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {activeSection ? (
          renderSection()
        ) : (
          <div className="space-y-5">
            {/* Next trip hero */}
            {nextTrip && (
              <button
                onClick={() => setActiveSection("countdown")}
                className="w-full rounded-3xl overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-5 text-left transition-all hover:shadow-lg hover:shadow-accent/10"
              >
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Próxima Aventura</p>
                <h2 className="text-xl font-black">{nextTrip.tripName}</h2>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(nextTrip.departureDate).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
                  </p>
                  <div className="text-right">
                    <p className="text-4xl font-black text-accent leading-none">{daysUntil(nextTrip.departureDate)}</p>
                    <p className="text-[9px] text-muted-foreground">dias</p>
                  </div>
                </div>
              </button>
            )}

            {/* Module grid — unique card-based navigation */}
            <div className="grid grid-cols-2 gap-3">
              {SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-2xl border border-border bg-gradient-to-br ${section.color} p-4 text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="text-foreground/70 mb-2">{section.icon}</div>
                  <p className="text-xs font-bold">{section.label}</p>
                  <p className="text-[9px] text-muted-foreground">{section.description}</p>
                </button>
              ))}
            </div>

            {/* Quick tips */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">💡 Dicas Rápidas</p>
              <div className="space-y-1.5">
                {[
                  "Use o Countdown para acompanhar suas viagens",
                  "Divida contas com amigos no Rachar Conta",
                  "Salve lugares do Instagram no quadro de Lugares",
                  "Mantenha sua Ficha de Emergência sempre atualizada",
                  "Defina taxas de câmbio e converta offline"
                ].map((tip, i) => (
                  <p key={i} className="text-[10px] text-muted-foreground">• {tip}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Viagens;
