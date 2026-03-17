import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plane, Compass, Map, Package, Users, MapPin, DollarSign, BookOpen, Shield, ArrowRightLeft, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleTip } from "@/components/ModuleTip";
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
import { useState } from "react";

const TABS = [
  { value: "destinos", label: "Destinos", icon: Compass },
  { value: "cronograma", label: "Roteiro", icon: Map },
  { value: "mala", label: "Mala", icon: Package },
  { value: "budget", label: "Budget", icon: DollarSign },
  { value: "divisor", label: "Rachar", icon: Users },
  { value: "lugares", label: "Lugares", icon: MapPin },
  { value: "diario", label: "Diário", icon: BookOpen },
  { value: "moeda", label: "Câmbio", icon: ArrowRightLeft },
  { value: "seguranca", label: "SOS", icon: Shield },
  { value: "countdown", label: "Timer", icon: Timer },
];

const Viagens = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">✈️ Viagens</h1>
            <p className="text-[11px] text-muted-foreground">Planeje, viva e eternize suas viagens</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <ModuleTip
          moduleId="viagens"
          tips={[
            "Adicione destinos dos seus sonhos na bucket list",
            "Monte roteiros dia a dia com horários e custos",
            "Divida contas com amigos no Rachar Conta",
            "Salve lugares do Instagram no quadro de Lugares",
            "Defina taxas de câmbio e converta offline"
          ]}
        />
        <Tabs defaultValue="destinos">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <TabsList className="inline-flex w-auto min-w-full">
              {TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-[10px] gap-0.5 px-2">
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="destinos"><BucketList /></TabsContent>
          <TabsContent value="cronograma"><DailyTimeline /></TabsContent>
          <TabsContent value="mala"><PackingChecklist /></TabsContent>
          <TabsContent value="budget"><TravelBudget /></TabsContent>
          <TabsContent value="divisor"><BillSplitter /></TabsContent>
          <TabsContent value="lugares"><PlacesBoard /></TabsContent>
          <TabsContent value="diario"><TravelDiary /></TabsContent>
          <TabsContent value="moeda"><CurrencyConverter /></TabsContent>
          <TabsContent value="seguranca"><SafetyCard /></TabsContent>
          <TabsContent value="countdown"><TripCountdown /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Viagens;
