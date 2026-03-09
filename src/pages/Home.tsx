import { useNavigate } from "react-router-dom";
import { DollarSign, CalendarCheck, ArrowRight, Sparkles, Heart } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-5 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-1">CORE</h1>
          <p className="text-sm text-muted-foreground">Seu hub pessoal de organização</p>
        </div>
      </header>

      {/* Cards */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          {/* Finanças Card */}
          <button
            onClick={() => navigate("/financas")}
            className="group relative overflow-hidden rounded-2xl border-2 border-card-receitas-border bg-gradient-to-br from-amber-50 to-yellow-50 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] hover:border-amber-400 active:scale-[0.99]"
          >
            <div className="absolute top-4 right-4 bg-amber-400/20 rounded-xl p-3 group-hover:bg-amber-400/30 transition-colors">
              <DollarSign className="w-8 h-8 text-amber-600" />
            </div>
            <div className="mb-16">
              <span className="text-xs font-bold tracking-widest text-amber-600/70 uppercase">Módulo</span>
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">FINANÇAS</h2>
            <p className="text-sm text-amber-700/70 mb-4">
              Dashboard, receitas, despesas, investimentos, metas, simuladores e mais
            </p>
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium group-hover:gap-3 transition-all">
              Acessar <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Rotina Card */}
          <button
            onClick={() => navigate("/rotina")}
            className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] hover:border-green-400 active:scale-[0.99]"
          >
            <div className="absolute top-4 right-4 bg-green-400/20 rounded-xl p-3 group-hover:bg-green-400/30 transition-colors">
              <CalendarCheck className="w-8 h-8 text-green-600" />
            </div>
            <div className="mb-16">
              <span className="text-xs font-bold tracking-widest text-green-600/70 uppercase">Módulo</span>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">ROTINA</h2>
            <p className="text-sm text-green-700/70 mb-4">
              Hábitos diários, rotina semanal, urgências e organização pessoal
            </p>
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium group-hover:gap-3 transition-all">
              Acessar <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        Core © {new Date().getFullYear()} — Organize sua vida
      </footer>
    </div>
  );
};

export default Home;