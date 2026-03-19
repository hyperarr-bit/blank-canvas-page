import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, FlaskConical, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyMirror } from "@/components/beleza/DailyMirror";
import { SkincareRoutine } from "@/components/beleza/SkincareRoutine";
import { ProductShelf } from "@/components/beleza/ProductShelf";
import { SkinDiary } from "@/components/beleza/SkinDiary";

const Beleza = () => {
  const navigate = useNavigate();

  return (
    <div className="skincare-module min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold tracking-tight">CORE SKINCARE</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Seu ritual de beleza</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Daily Mirror — always visible */}
        <DailyMirror />

        {/* Tabs */}
        <Tabs defaultValue="routine">
          <TabsList className="w-full grid grid-cols-3 bg-card/60 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="routine" className="text-xs data-[state=active]:bg-sk-mint/20 data-[state=active]:text-sk-mint">
              <Sparkles className="w-3.5 h-3.5 mr-1" />Rotina
            </TabsTrigger>
            <TabsTrigger value="shelf" className="text-xs data-[state=active]:bg-sk-lavender/20 data-[state=active]:text-sk-lavender">
              <FlaskConical className="w-3.5 h-3.5 mr-1" />Bancada
            </TabsTrigger>
            <TabsTrigger value="diary" className="text-xs data-[state=active]:bg-sk-coral/20 data-[state=active]:text-sk-coral">
              <Camera className="w-3.5 h-3.5 mr-1" />Diário
            </TabsTrigger>
          </TabsList>
          <TabsContent value="routine"><SkincareRoutine /></TabsContent>
          <TabsContent value="shelf"><ProductShelf /></TabsContent>
          <TabsContent value="diary"><SkinDiary /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Beleza;
