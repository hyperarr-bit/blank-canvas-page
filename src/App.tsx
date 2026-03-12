import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Rotina from "./pages/Rotina";
import DesenvolvimentoPessoal from "./pages/DesenvolvimentoPessoal";
import Saude from "./pages/Saude";
import Casa from "./pages/Casa";
import Estudos from "./pages/Estudos";
import Biblioteca from "./pages/Biblioteca";
import Beleza from "./pages/Beleza";
import Viagens from "./pages/Viagens";
import Carreira from "./pages/Carreira";
import Treino from "./pages/Treino";
import Dieta from "./pages/Dieta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/financas" element={<Index />} />
          <Route path="/rotina" element={<Rotina />} />
          <Route path="/desenvolvimento" element={<DesenvolvimentoPessoal />} />
          <Route path="/saude" element={<Saude />} />
          <Route path="/casa" element={<Casa />} />
          <Route path="/estudos" element={<Estudos />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/beleza" element={<Beleza />} />
          <Route path="/viagens" element={<Viagens />} />
          <Route path="/carreira" element={<Carreira />} />
          <Route path="/treino" element={<Treino />} />
          <Route path="/dieta" element={<Dieta />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
