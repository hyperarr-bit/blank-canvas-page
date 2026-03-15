import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, Apple, Droplets, CheckSquare, BookOpen, DollarSign } from "lucide-react";

const actions = [
  { icon: CheckSquare, label: "Marcar hábito", path: "/rotina", color: "bg-emerald-400/20 text-emerald-600" },
  { icon: Dumbbell, label: "Registrar treino", path: "/treino", color: "bg-blue-400/20 text-blue-600" },
  { icon: Apple, label: "Registrar refeição", path: "/dieta", color: "bg-green-400/20 text-green-600" },
  { icon: Droplets, label: "Beber água", path: "/saude", color: "bg-cyan-400/20 text-cyan-600" },
  { icon: DollarSign, label: "Adicionar gasto", path: "/financas", color: "bg-amber-400/20 text-amber-600" },
  { icon: BookOpen, label: "Atualizar leitura", path: "/biblioteca", color: "bg-orange-400/20 text-orange-600" },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {actions.map((a, i) => (
        <motion.button
          key={a.label}
          onClick={() => navigate(a.path)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-colors whitespace-nowrap flex-shrink-0`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${a.color}`}>
            <a.icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium">{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
