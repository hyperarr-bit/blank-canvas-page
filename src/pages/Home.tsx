import { useNavigate } from "react-router-dom";
import { DollarSign, CalendarCheck, ArrowRight, Sparkles, Heart, Home, GraduationCap, BookOpen, Droplets, Plane, Briefcase, Dumbbell, Apple } from "lucide-react";

const HomeCard = ({ onClick, borderColor, gradientFrom, gradientTo, iconBg, iconHoverBg, IconComponent, iconColor, accentColor, title, description, textColor, descColor }: {
  onClick: () => void; borderColor: string; gradientFrom: string; gradientTo: string; iconBg: string; iconHoverBg: string;
  IconComponent: React.ComponentType<{ className?: string }>; iconColor: string; accentColor: string; title: string; description: string; textColor: string; descColor: string;
}) => (
  <button onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${gradientFrom} ${gradientTo} p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]`}>
    <div className={`absolute top-4 right-4 ${iconBg} rounded-xl p-3 group-hover:${iconHoverBg} transition-colors`}>
      <IconComponent className={`w-8 h-8 ${iconColor}`} />
    </div>
    <div className="mb-16">
      <span className={`text-xs font-bold tracking-widest ${accentColor} uppercase`}>Módulo</span>
    </div>
    <h2 className={`text-2xl font-bold ${textColor} mb-2`}>{title}</h2>
    <p className={`text-sm ${descColor} mb-4`}>{description}</p>
    <div className={`flex items-center gap-2 ${accentColor.replace("/70", "")} text-sm font-medium group-hover:gap-3 transition-all`}>
      Acessar <ArrowRight className="w-4 h-4" />
    </div>
  </button>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-5 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-1">CORE</h1>
          <p className="text-sm text-muted-foreground">Seu hub pessoal de organização</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          <HomeCard onClick={() => navigate("/financas")} borderColor="border-card-receitas-border hover:border-amber-400"
            gradientFrom="from-amber-50" gradientTo="to-yellow-50" iconBg="bg-amber-400/20" iconHoverBg="bg-amber-400/30"
            IconComponent={DollarSign} iconColor="text-amber-600" accentColor="text-amber-600/70"
            title="FINANÇAS" description="Dashboard, receitas, despesas, investimentos, metas e simuladores"
            textColor="text-amber-900" descColor="text-amber-700/70" />

          <HomeCard onClick={() => navigate("/treino")} borderColor="border-blue-200 hover:border-blue-400"
            gradientFrom="from-blue-50" gradientTo="to-indigo-50" iconBg="bg-blue-400/20" iconHoverBg="bg-blue-400/30"
            IconComponent={Dumbbell} iconColor="text-blue-600" accentColor="text-blue-600/70"
            title="MEU TREINO" description="Planilha de treinos, timer, recordes pessoais e estatísticas"
            textColor="text-blue-900" descColor="text-blue-700/70" />

          <HomeCard onClick={() => navigate("/dieta")} borderColor="border-green-200 hover:border-green-400"
            gradientFrom="from-green-50" gradientTo="to-emerald-50" iconBg="bg-green-400/20" iconHoverBg="bg-green-400/30"
            IconComponent={Apple} iconColor="text-green-600" accentColor="text-green-600/70"
            title="MINHA DIETA" description="Cardápio semanal, calorias, macros, jejum, receitas e mercado"
            textColor="text-green-900" descColor="text-green-700/70" />

          <HomeCard onClick={() => navigate("/rotina")} borderColor="border-emerald-200 hover:border-emerald-400"
            gradientFrom="from-emerald-50" gradientTo="to-teal-50" iconBg="bg-emerald-400/20" iconHoverBg="bg-emerald-400/30"
            IconComponent={CalendarCheck} iconColor="text-emerald-600" accentColor="text-emerald-600/70"
            title="ROTINA" description="Hábitos, rotina semanal, urgências e organização pessoal"
            textColor="text-emerald-900" descColor="text-emerald-700/70" />

          <HomeCard onClick={() => navigate("/desenvolvimento")} borderColor="border-purple-200 hover:border-purple-400"
            gradientFrom="from-purple-50" gradientTo="to-violet-50" iconBg="bg-purple-400/20" iconHoverBg="bg-purple-400/30"
            IconComponent={Sparkles} iconColor="text-purple-600" accentColor="text-purple-600/70"
            title="DESENVOLVIMENTO" description="Autoconhecimento, metas, roda da vida, leituras e gratidão"
            textColor="text-purple-900" descColor="text-purple-700/70" />

          <HomeCard onClick={() => navigate("/saude")} borderColor="border-red-200 hover:border-red-400"
            gradientFrom="from-red-50" gradientTo="to-rose-50" iconBg="bg-red-400/20" iconHoverBg="bg-red-400/30"
            IconComponent={Heart} iconColor="text-red-600" accentColor="text-red-600/70"
            title="SAÚDE" description="Medidas, suplementos, check-ups, sono e beleza"
            textColor="text-red-900" descColor="text-red-700/70" />

          <HomeCard onClick={() => navigate("/casa")} borderColor="border-cyan-200 hover:border-cyan-400"
            gradientFrom="from-cyan-50" gradientTo="to-teal-50" iconBg="bg-cyan-400/20" iconHoverBg="bg-cyan-400/30"
            IconComponent={Home} iconColor="text-cyan-600" accentColor="text-cyan-600/70"
            title="CASA" description="Lista de mercado, rotina de limpeza, compras e manutenção"
            textColor="text-cyan-900" descColor="text-cyan-700/70" />

          <HomeCard onClick={() => navigate("/estudos")} borderColor="border-indigo-200 hover:border-indigo-400"
            gradientFrom="from-indigo-50" gradientTo="to-blue-50" iconBg="bg-indigo-400/20" iconHoverBg="bg-indigo-400/30"
            IconComponent={GraduationCap} iconColor="text-indigo-600" accentColor="text-indigo-600/70"
            title="ESTUDOS" description="Grade horária, conteúdos, provas, tarefas e Pomodoro"
            textColor="text-indigo-900" descColor="text-indigo-700/70" />

          <HomeCard onClick={() => navigate("/biblioteca")} borderColor="border-orange-200 hover:border-orange-400"
            gradientFrom="from-orange-50" gradientTo="to-amber-50" iconBg="bg-orange-400/20" iconHoverBg="bg-orange-400/30"
            IconComponent={BookOpen} iconColor="text-orange-600" accentColor="text-orange-600/70"
            title="BIBLIOTECA & CINEMA" description="Estante, watchlist, citações, desafio anual e conquistas"
            textColor="text-orange-900" descColor="text-orange-700/70" />

          <HomeCard onClick={() => navigate("/beleza")} borderColor="border-pink-200 hover:border-pink-400"
            gradientFrom="from-pink-50" gradientTo="to-rose-50" iconBg="bg-pink-400/20" iconHoverBg="bg-pink-400/30"
            IconComponent={Droplets} iconColor="text-pink-600" accentColor="text-pink-600/70"
            title="SKINCARE & BELEZA" description="Rotina, cronograma capilar, produtos e diário de pele"
            textColor="text-pink-900" descColor="text-pink-700/70" />

          <HomeCard onClick={() => navigate("/viagens")} borderColor="border-teal-200 hover:border-teal-400"
            gradientFrom="from-teal-50" gradientTo="to-emerald-50" iconBg="bg-teal-400/20" iconHoverBg="bg-teal-400/30"
            IconComponent={Plane} iconColor="text-teal-600" accentColor="text-teal-600/70"
            title="VIAGENS" description="Bucket list, itinerário, mala, budget e diário de viagem"
            textColor="text-teal-900" descColor="text-teal-700/70" />

          <HomeCard onClick={() => navigate("/carreira")} borderColor="border-slate-200 hover:border-slate-400"
            gradientFrom="from-slate-50" gradientTo="to-gray-50" iconBg="bg-slate-400/20" iconHoverBg="bg-slate-400/30"
            IconComponent={Briefcase} iconColor="text-slate-600" accentColor="text-slate-600/70"
            title="CARREIRA" description="Job tracker, portfolio, networking, skills e prep de entrevista"
            textColor="text-slate-900" descColor="text-slate-700/70" />
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        Core © {new Date().getFullYear()} — Organize sua vida
      </footer>
    </div>
  );
};

export default HomePage;
