import { useNavigate } from "react-router-dom";
import { DollarSign, CalendarCheck, ArrowRight, Sparkles, Heart, Home, GraduationCap, BookOpen, Droplets, Plane, Briefcase, Dumbbell, Apple, Star, Eye, EyeOff, Settings } from "lucide-react";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/PageTransition";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useModulePreferences } from "@/hooks/use-module-preferences";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/OnboardingWizard";

const modules = [
  { id: "financas", path: "/financas", borderColor: "border-amber-200 hover:border-amber-400", gradientFrom: "from-amber-50", gradientTo: "to-yellow-50", darkGradientFrom: "dark:from-amber-500/10", darkGradientTo: "dark:to-yellow-500/10", iconBg: "bg-amber-400/20", IconComponent: DollarSign, iconColor: "text-amber-600", accentColor: "text-amber-600/70", title: "FINANÇAS", description: "Dashboard, receitas, despesas, investimentos e metas", textColor: "text-amber-900 dark:text-amber-300", descColor: "text-amber-700/70 dark:text-amber-400/60" },
  { id: "treino", path: "/treino", borderColor: "border-blue-200 hover:border-blue-400", gradientFrom: "from-blue-50", gradientTo: "to-indigo-50", darkGradientFrom: "dark:from-blue-500/10", darkGradientTo: "dark:to-indigo-500/10", iconBg: "bg-blue-400/20", IconComponent: Dumbbell, iconColor: "text-blue-600", accentColor: "text-blue-600/70", title: "MEU TREINO", description: "Planilha de treinos, timer e recordes pessoais", textColor: "text-blue-900 dark:text-blue-300", descColor: "text-blue-700/70 dark:text-blue-400/60" },
  { id: "dieta", path: "/dieta", borderColor: "border-green-200 hover:border-green-400", gradientFrom: "from-green-50", gradientTo: "to-emerald-50", darkGradientFrom: "dark:from-green-500/10", darkGradientTo: "dark:to-emerald-500/10", iconBg: "bg-green-400/20", IconComponent: Apple, iconColor: "text-green-600", accentColor: "text-green-600/70", title: "MINHA DIETA", description: "Cardápio semanal, calorias, macros e receitas", textColor: "text-green-900 dark:text-green-300", descColor: "text-green-700/70 dark:text-green-400/60" },
  { id: "rotina", path: "/rotina", borderColor: "border-emerald-200 hover:border-emerald-400", gradientFrom: "from-emerald-50", gradientTo: "to-teal-50", darkGradientFrom: "dark:from-emerald-500/10", darkGradientTo: "dark:to-teal-500/10", iconBg: "bg-emerald-400/20", IconComponent: CalendarCheck, iconColor: "text-emerald-600", accentColor: "text-emerald-600/70", title: "ROTINA", description: "Hábitos, rotina semanal e organização pessoal", textColor: "text-emerald-900 dark:text-emerald-300", descColor: "text-emerald-700/70 dark:text-emerald-400/60" },
  { id: "desenvolvimento", path: "/desenvolvimento", borderColor: "border-purple-200 hover:border-purple-400", gradientFrom: "from-purple-50", gradientTo: "to-violet-50", darkGradientFrom: "dark:from-purple-500/10", darkGradientTo: "dark:to-violet-500/10", iconBg: "bg-purple-400/20", IconComponent: Sparkles, iconColor: "text-purple-600", accentColor: "text-purple-600/70", title: "DESENVOLVIMENTO", description: "Autoconhecimento, metas, roda da vida e gratidão", textColor: "text-purple-900 dark:text-purple-300", descColor: "text-purple-700/70 dark:text-purple-400/60" },
  { id: "saude", path: "/saude", borderColor: "border-red-200 hover:border-red-400", gradientFrom: "from-red-50", gradientTo: "to-rose-50", darkGradientFrom: "dark:from-red-500/10", darkGradientTo: "dark:to-rose-500/10", iconBg: "bg-red-400/20", IconComponent: Heart, iconColor: "text-red-600", accentColor: "text-red-600/70", title: "SAÚDE", description: "Medidas, suplementos, check-ups e sono", textColor: "text-red-900 dark:text-red-300", descColor: "text-red-700/70 dark:text-red-400/60" },
  { id: "casa", path: "/casa", borderColor: "border-cyan-200 hover:border-cyan-400", gradientFrom: "from-cyan-50", gradientTo: "to-teal-50", darkGradientFrom: "dark:from-cyan-500/10", darkGradientTo: "dark:to-teal-500/10", iconBg: "bg-cyan-400/20", IconComponent: Home, iconColor: "text-cyan-600", accentColor: "text-cyan-600/70", title: "CASA", description: "Lista de mercado, limpeza e manutenção", textColor: "text-cyan-900 dark:text-cyan-300", descColor: "text-cyan-700/70 dark:text-cyan-400/60" },
  { id: "estudos", path: "/estudos", borderColor: "border-indigo-200 hover:border-indigo-400", gradientFrom: "from-indigo-50", gradientTo: "to-blue-50", darkGradientFrom: "dark:from-indigo-500/10", darkGradientTo: "dark:to-blue-500/10", iconBg: "bg-indigo-400/20", IconComponent: GraduationCap, iconColor: "text-indigo-600", accentColor: "text-indigo-600/70", title: "ESTUDOS", description: "Grade horária, conteúdos, provas e Pomodoro", textColor: "text-indigo-900 dark:text-indigo-300", descColor: "text-indigo-700/70 dark:text-indigo-400/60" },
  { id: "biblioteca", path: "/biblioteca", borderColor: "border-orange-200 hover:border-orange-400", gradientFrom: "from-orange-50", gradientTo: "to-amber-50", darkGradientFrom: "dark:from-orange-500/10", darkGradientTo: "dark:to-amber-500/10", iconBg: "bg-orange-400/20", IconComponent: BookOpen, iconColor: "text-orange-600", accentColor: "text-orange-600/70", title: "BIBLIOTECA & CINEMA", description: "Estante, watchlist, citações e desafio anual", textColor: "text-orange-900 dark:text-orange-300", descColor: "text-orange-700/70 dark:text-orange-400/60" },
  { id: "beleza", path: "/beleza", borderColor: "border-pink-200 hover:border-pink-400", gradientFrom: "from-pink-50", gradientTo: "to-rose-50", darkGradientFrom: "dark:from-pink-500/10", darkGradientTo: "dark:to-rose-500/10", iconBg: "bg-pink-400/20", IconComponent: Droplets, iconColor: "text-pink-600", accentColor: "text-pink-600/70", title: "SKINCARE & BELEZA", description: "Rotina, cronograma capilar e diário de pele", textColor: "text-pink-900 dark:text-pink-300", descColor: "text-pink-700/70 dark:text-pink-400/60" },
  { id: "viagens", path: "/viagens", borderColor: "border-teal-200 hover:border-teal-400", gradientFrom: "from-teal-50", gradientTo: "to-emerald-50", darkGradientFrom: "dark:from-teal-500/10", darkGradientTo: "dark:to-emerald-500/10", iconBg: "bg-teal-400/20", IconComponent: Plane, iconColor: "text-teal-600", accentColor: "text-teal-600/70", title: "VIAGENS", description: "Bucket list, itinerário, mala e diário", textColor: "text-teal-900 dark:text-teal-300", descColor: "text-teal-700/70 dark:text-teal-400/60" },
  { id: "carreira", path: "/carreira", borderColor: "border-slate-200 hover:border-slate-400", gradientFrom: "from-slate-50", gradientTo: "to-gray-50", darkGradientFrom: "dark:from-slate-500/10", darkGradientTo: "dark:to-gray-500/10", iconBg: "bg-slate-400/20", IconComponent: Briefcase, iconColor: "text-slate-600", accentColor: "text-slate-600/70", title: "CARREIRA", description: "Job tracker, portfolio, networking e skills", textColor: "text-slate-900 dark:text-slate-300", descColor: "text-slate-700/70 dark:text-slate-400/60" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { toggleFavorite, toggleHidden, isFavorite, isHidden, prefs } = useModulePreferences();
  const [editMode, setEditMode] = useState(false);

  // Sort: favorites first, then rest; filter hidden
  const sortedModules = [...modules].sort((a, b) => {
    const aFav = isFavorite(a.id) ? 0 : 1;
    const bFav = isFavorite(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  const visibleModules = editMode ? sortedModules : sortedModules.filter(m => !isHidden(m.id));
  const hiddenCount = modules.filter(m => isHidden(m.id)).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <motion.header
        className="border-b border-border bg-card"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-1">CORE</h1>
            <p className="text-sm text-muted-foreground">Seu hub pessoal de organização</p>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={() => setEditMode(!editMode)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${editMode ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
              whileTap={{ scale: 0.9 }}
              aria-label="Edit modules"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
            <ThemeToggle showPalette />
          </div>
        </div>
      </motion.header>

      {/* Edit mode banner */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary/5 border-b border-primary/20 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Modo edição — ⭐ Favoritar · 👁️ Ocultar módulos</span>
              </div>
              <button onClick={() => setEditMode(false)} className="text-xs text-primary font-bold hover:underline">
                Concluir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full">
          <AnimatePresence mode="popLayout">
            {visibleModules.map(mod => (
              <StaggerItem key={mod.id}>
                <motion.div
                  layout
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isHidden(mod.id) ? 0.4 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Edit overlay */}
                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-2 right-2 z-10 flex gap-1"
                    >
                      <motion.button
                        onClick={() => toggleFavorite(mod.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors ${
                          isFavorite(mod.id) ? "bg-yellow-400/90 text-white" : "bg-card/80 border border-border text-muted-foreground hover:text-yellow-500"
                        }`}
                        whileTap={{ scale: 0.85 }}
                      >
                        <Star className={`w-4 h-4 ${isFavorite(mod.id) ? "fill-current" : ""}`} />
                      </motion.button>
                      <motion.button
                        onClick={() => toggleHidden(mod.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors ${
                          isHidden(mod.id) ? "bg-red-400/90 text-white" : "bg-card/80 border border-border text-muted-foreground hover:text-red-500"
                        }`}
                        whileTap={{ scale: 0.85 }}
                      >
                        {isHidden(mod.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={() => !editMode && navigate(mod.path)}
                    className={`group relative w-full overflow-hidden rounded-2xl border-2 ${mod.borderColor} bg-gradient-to-br ${mod.gradientFrom} ${mod.gradientTo} ${mod.darkGradientFrom} ${mod.darkGradientTo} p-7 text-left transition-all ${
                      editMode ? "cursor-default" : "hover:shadow-xl active:scale-[0.98]"
                    }`}
                    whileHover={editMode ? {} : { scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Favorite badge */}
                    {isFavorite(mod.id) && !editMode && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-yellow-400/90 flex items-center justify-center"
                      >
                        <Star className="w-3 h-3 text-white fill-white" />
                      </motion.div>
                    )}

                    <div className={`${!isFavorite(mod.id) || editMode ? "" : "mr-8"}`}>
                      <div className={`${mod.iconBg} rounded-xl p-3 w-fit mb-4`}>
                        <mod.IconComponent className={`w-7 h-7 ${mod.iconColor}`} />
                      </div>
                      <div className="mb-1">
                        <span className={`text-[10px] font-bold tracking-widest ${mod.accentColor} uppercase`}>Módulo</span>
                      </div>
                      <h2 className={`text-xl font-bold ${mod.textColor} mb-1.5`}>{mod.title}</h2>
                      <p className={`text-xs ${mod.descColor} mb-3 leading-relaxed`}>{mod.description}</p>
                      {!editMode && (
                        <div className={`flex items-center gap-2 ${mod.accentColor.replace("/70", "")} text-xs font-medium`}>
                          Acessar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>
      </main>

      {/* Hidden modules count */}
      {hiddenCount > 0 && !editMode && (
        <FadeIn className="text-center pb-2">
          <button
            onClick={() => setEditMode(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {hiddenCount} módulo{hiddenCount > 1 ? "s" : ""} oculto{hiddenCount > 1 ? "s" : ""} · Editar
          </button>
        </FadeIn>
      )}

      <motion.footer
        className="text-center py-4 text-xs text-muted-foreground border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Core © {new Date().getFullYear()} — Organize sua vida
      </motion.footer>
    </div>
  );
};

export default HomePage;
