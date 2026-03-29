import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Settings, Eye, EyeOff } from "lucide-react";
import { useModulePreferences } from "@/hooks/use-module-preferences";
import { useState } from "react";

const modules = [
  { id: "financas", path: "/financas", emoji: "💰", label: "Finanças" },
  { id: "treino", path: "/treino", emoji: "🏋️", label: "Treino" },
  { id: "dieta", path: "/dieta", emoji: "🥗", label: "Dieta" },
  { id: "rotina", path: "/rotina", emoji: "📅", label: "Rotina" },
  { id: "desenvolvimento", path: "/desenvolvimento", emoji: "🧠", label: "Dev. Pessoal" },
  { id: "saude", path: "/saude", emoji: "❤️", label: "Saúde" },
  { id: "casa", path: "/casa", emoji: "🏠", label: "Casa" },
  { id: "estudos", path: "/estudos", emoji: "🎓", label: "Estudos" },
  { id: "biblioteca", path: "/biblioteca", emoji: "📚", label: "Biblioteca" },
  { id: "beleza", path: "/beleza", emoji: "💄", label: "Beleza" },
  { id: "viagens", path: "/viagens", emoji: "✈️", label: "Viagens" },
  { id: "carreira", path: "/carreira", emoji: "💼", label: "Carreira" },
];

export const ModuleDrawer = () => {
  const navigate = useNavigate();
  const { toggleFavorite, toggleHidden, isFavorite, isHidden } = useModulePreferences();
  const [editMode, setEditMode] = useState(false);

  const sorted = [...modules].sort((a, b) => {
    const af = isFavorite(a.id) ? 0 : 1;
    const bf = isFavorite(b.id) ? 0 : 1;
    return af - bf;
  });

  const visible = editMode ? sorted : sorted.filter(m => !isHidden(m.id));
  const hiddenCount = modules.filter(m => isHidden(m.id)).length;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-gray-200 dark:bg-gray-800/50 px-4 py-2 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-gray-200">📂 MÓDULOS</h3>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`p-1.5 rounded-lg transition-colors ${editMode ? "bg-primary text-primary-foreground" : "text-gray-600 dark:text-gray-400 hover:text-foreground"}`}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-950/20 p-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {visible.map((m, i) => (
            <motion.div
              key={m.id}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isHidden(m.id) ? 0.4 : 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              {editMode && (
                <div className="absolute -top-1 -right-1 z-10 flex gap-0.5">
                  <button
                    onClick={() => toggleFavorite(m.id)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isFavorite(m.id) ? "bg-yellow-400 text-white" : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    <Star className={`w-2.5 h-2.5 ${isFavorite(m.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => toggleHidden(m.id)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isHidden(m.id) ? "bg-destructive text-white" : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    {isHidden(m.id) ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                  </button>
                </div>
              )}
              <button
                onClick={() => !editMode && navigate(m.path)}
                className="w-full flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center relative text-xl">
                  {m.emoji}
                  {isFavorite(m.id) && !editMode && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Star className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">{m.label}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {hiddenCount > 0 && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="w-full text-center mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            +{hiddenCount} oculto{hiddenCount > 1 ? "s" : ""} · Editar
          </button>
        )}
      </div>
    </div>
  );
};
