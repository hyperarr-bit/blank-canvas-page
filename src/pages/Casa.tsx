import { useNavigate } from "react-router-dom";
import { ModuleTip } from "@/components/ModuleTip";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CleaningRadar from "@/components/casa/CleaningRadar";
import SmartPantry from "@/components/casa/SmartPantry";
import MealPlanner from "@/components/casa/MealPlanner";
import MaintenanceLog from "@/components/casa/MaintenanceLog";
import PlantsAndPets from "@/components/casa/PlantsAndPets";
import ChoreRotation from "@/components/casa/ChoreRotation";
import SafetyChecks from "@/components/casa/SafetyChecks";
import HomeUtilities from "@/components/casa/HomeUtilities";

const tabs = [
  { v: "radar", l: "LIMPEZA" },
  { v: "despensa", l: "DESPENSA" },
  { v: "cardapio", l: "CARDÁPIO" },
  { v: "manutencao", l: "MANUTENÇÃO" },
  { v: "plantas", l: "VIDA" },
  { v: "coop", l: "CO-OP" },
  { v: "seguranca", l: "SEGURANÇA" },
  { v: "utilidades", l: "UTILIDADES" },
];

const Casa = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2"><Home className="w-5 h-5 text-cyan-500" /> CASA EM ORDEM</h1>
            <p className="text-xs text-muted-foreground">Limpeza, despensa, cardápio, manutenção e mais</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <ModuleTip
          moduleId="casa"
          tips={[
            "O Radar de Limpeza mostra a 'saúde' de cada tarefa — quanto mais vermelha a barra, mais urgente!",
            "Na Despensa, mude um produto para 'Acabou' e ele vai direto pra Lista de Compras",
            "Use o Cardápio para planejar as refeições da semana e nunca mais ouvir 'o que tem pra jantar?'",
            "Cadastre plantas e pets para nunca esquecer de regar ou dar remédio",
          ]}
        />
        <Tabs defaultValue="radar" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-muted/50 p-1 mb-4 h-auto flex-wrap">
            {tabs.map(t => <TabsTrigger key={t.v} value={t.v} className="text-xs px-3 py-1.5">{t.l}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="radar"><CleaningRadar /></TabsContent>
          <TabsContent value="despensa"><SmartPantry /></TabsContent>
          <TabsContent value="cardapio"><MealPlanner /></TabsContent>
          <TabsContent value="manutencao"><MaintenanceLog /></TabsContent>
          <TabsContent value="plantas"><PlantsAndPets /></TabsContent>
          <TabsContent value="coop"><ChoreRotation /></TabsContent>
          <TabsContent value="seguranca"><SafetyChecks /></TabsContent>
          <TabsContent value="utilidades"><HomeUtilities /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Casa;
