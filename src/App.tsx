import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/hooks/use-theme";
import { PageTransition } from "@/components/PageTransition";
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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/financas" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/rotina" element={<PageTransition><Rotina /></PageTransition>} />
        <Route path="/desenvolvimento" element={<PageTransition><DesenvolvimentoPessoal /></PageTransition>} />
        <Route path="/saude" element={<PageTransition><Saude /></PageTransition>} />
        <Route path="/casa" element={<PageTransition><Casa /></PageTransition>} />
        <Route path="/estudos" element={<PageTransition><Estudos /></PageTransition>} />
        <Route path="/biblioteca" element={<PageTransition><Biblioteca /></PageTransition>} />
        <Route path="/beleza" element={<PageTransition><Beleza /></PageTransition>} />
        <Route path="/viagens" element={<PageTransition><Viagens /></PageTransition>} />
        <Route path="/carreira" element={<PageTransition><Carreira /></PageTransition>} />
        <Route path="/treino" element={<PageTransition><Treino /></PageTransition>} />
        <Route path="/dieta" element={<PageTransition><Dieta /></PageTransition>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
