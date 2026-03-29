import { motion } from "framer-motion";

const quotes = [
  { text: "Disciplina é liberdade.", author: "Jocko Willink" },
  { text: "Pequenos passos, grandes mudanças.", author: "James Clear" },
  { text: "Consistência supera intensidade.", author: "Provérbio" },
  { text: "Hoje é o dia que importa.", author: "Marcus Aurelius" },
  { text: "Invista em você todos os dias.", author: "Warren Buffett" },
  { text: "Progresso, não perfeição.", author: "Provérbio" },
  { text: "Cada dia é uma nova chance.", author: "Provérbio" },
  { text: "O melhor projeto é você.", author: "Provérbio" },
  { text: "Foco no que importa.", author: "Greg McKeown" },
  { text: "Sua rotina define seu futuro.", author: "Hal Elrod" },
  { text: "Seja a mudança que quer ver.", author: "Gandhi" },
  { text: "A excelência é um hábito.", author: "Aristóteles" },
  { text: "Comece antes de estar pronto.", author: "Steven Pressfield" },
  { text: "O segredo é começar.", author: "Mark Twain" },
];

export const MotivationalQuoteWidget = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = quotes[dayOfYear % quotes.length];

  return (
    <motion.div className="rounded-xl border border-border overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="bg-purple-200 dark:bg-purple-800/50 px-4 py-2">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-purple-900 dark:text-purple-200">💬 FRASE DO DIA</h4>
      </div>
      <div className="bg-purple-50 dark:bg-purple-950/20 p-4">
        <p className="text-sm font-medium italic leading-relaxed">"{quote.text}"</p>
        <p className="text-[10px] text-muted-foreground mt-1">— {quote.author}</p>
      </div>
    </motion.div>
  );
};
