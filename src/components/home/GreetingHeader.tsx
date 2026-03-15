import { motion } from "framer-motion";
import { LogOut, Sun, Moon, CloudSun, Sunset } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { LifeHubData } from "@/hooks/use-life-hub-data";

interface GreetingHeaderProps {
  data: LifeHubData;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6) return { text: "Boa madrugada", Icon: Moon };
  if (h < 12) return { text: "Bom dia", Icon: Sun };
  if (h < 18) return { text: "Boa tarde", Icon: CloudSun };
  return { text: "Boa noite", Icon: Sunset };
};

const getMotivationalQuote = () => {
  const quotes = [
    "Disciplina é liberdade.",
    "Pequenos passos, grandes mudanças.",
    "Consistência supera intensidade.",
    "Hoje é o dia que importa.",
    "Invista em você todos os dias.",
    "Progresso, não perfeição.",
    "Cada dia é uma nova chance.",
    "O melhor projeto é você.",
    "Foco no que importa.",
    "Sua rotina define seu futuro.",
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
};

export const GreetingHeader = ({ data }: GreetingHeaderProps) => {
  const { signOut, user } = useAuth();
  const { text: greeting, Icon: GreetingIcon } = getGreeting();
  const quote = getMotivationalQuote();

  const contextHints: string[] = [];
  if (data.tasksTotal > 0 && data.tasksCompleted < data.tasksTotal) {
    contextHints.push(`${data.tasksTotal - data.tasksCompleted} hábito${data.tasksTotal - data.tasksCompleted > 1 ? "s" : ""} pendente${data.tasksTotal - data.tasksCompleted > 1 ? "s" : ""}`);
  }
  if (data.todayWorkoutGroup && !data.workoutDone) {
    contextHints.push(`treino de ${data.todayWorkoutGroup} hoje`);
  }
  if (data.nextBillName) {
    contextHints.push(`conta ${data.nextBillName} próxima`);
  }

  const displayName = data.userName || user?.email?.split("@")[0] || "";

  return (
    <motion.div
      className="flex items-start justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <GreetingIcon className="w-4 h-4 text-warning" />
          <h1 className="text-lg font-bold truncate">
            {greeting}{displayName ? `, ${displayName}` : ""} 👋
          </h1>
        </div>
        {contextHints.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {contextHints.join(" · ")}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">"{quote}"</p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <ThemeToggle showPalette />
        <motion.button
          onClick={signOut}
          className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
          whileTap={{ scale: 0.9 }}
          aria-label="Sair"
        >
          <LogOut className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
