import { useNavigate } from "react-router-dom";
import { ModuleTip } from "@/components/ModuleTip";
import { ArrowLeft, Sparkles, Package, TrendingUp, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusHeader } from "@/components/beleza/StatusHeader";
import { SkincareRoutine } from "@/components/beleza/SkincareRoutine";
import { ProductInventory } from "@/components/beleza/ProductInventory";
import { SkinAnalysis } from "@/components/beleza/SkinAnalysis";
import { CronogramaCapilar } from "@/components/beleza/CronogramaCapilar";

const Beleza = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">💆 Skincare & Self-Care</h1>
            <p className="text-[11px] text-muted-foreground">Seu ritual de beleza e cuidado pessoal</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <ModuleTip
          moduleId="beleza"
          tips={[
            "Monte sua rotina de skincare com ícones e detecção de conflitos de ativos",
            "Gerencie seu inventário com validade, custo por dose e lista de compras",
            "Faça o teste de porosidade para um cronograma capilar personalizado",
            "Registre a evolução da sua pele com fotos no Diário"
          ]}
        />

        <StatusHeader />

        <Tabs defaultValue="routine">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="routine" className="text-xs"><Sparkles className="w-3.5 h-3.5 mr-1" />Rotina</TabsTrigger>
            <TabsTrigger value="products" className="text-xs"><Package className="w-3.5 h-3.5 mr-1" />Inventário</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs"><TrendingUp className="w-3.5 h-3.5 mr-1" />Análise</TabsTrigger>
            <TabsTrigger value="capilar" className="text-xs"><Droplets className="w-3.5 h-3.5 mr-1" />Capilar</TabsTrigger>
          </TabsList>
          <TabsContent value="routine"><SkincareRoutine /></TabsContent>
          <TabsContent value="products"><ProductInventory /></TabsContent>
          <TabsContent value="analysis"><SkinAnalysis /></TabsContent>
          <TabsContent value="capilar"><CronogramaCapilar /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Beleza;
