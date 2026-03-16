import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/use-user-data";

export type WidgetId =
  | "week-progress"
  | "budget-remaining"
  | "habit-streaks"
  | "motivational-quote"
  | "quick-notes"
  | "focus-timer"
  | "macro-balance"
  | "sleep-log"
  | "countdown"
  | "week-calendar";

export interface WidgetDef {
  id: WidgetId;
  label: string;
  description: string;
  emoji: string;
  category: "produtividade" | "saúde" | "finanças" | "bem-estar";
}

export const WIDGET_CATALOG: WidgetDef[] = [
  { id: "week-progress", label: "Progresso Semanal", description: "Gráfico do seu score ao longo da semana", emoji: "📊", category: "produtividade" },
  { id: "budget-remaining", label: "Orçamento Restante", description: "Quanto ainda pode gastar este mês", emoji: "💰", category: "finanças" },
  { id: "habit-streaks", label: "Ofensiva de Hábitos", description: "Grid de consistência dos seus hábitos", emoji: "🔥", category: "produtividade" },
  { id: "motivational-quote", label: "Frase do Dia", description: "Motivação diária para manter o foco", emoji: "💡", category: "bem-estar" },
  { id: "quick-notes", label: "Notas Rápidas", description: "Bloco de anotações na tela inicial", emoji: "📝", category: "produtividade" },
  { id: "focus-timer", label: "Timer de Foco", description: "Pomodoro rápido direto da Home", emoji: "⏱️", category: "produtividade" },
  { id: "macro-balance", label: "Macros do Dia", description: "Equilíbrio de proteína, carbs e gordura", emoji: "🥩", category: "saúde" },
  { id: "sleep-log", label: "Sono", description: "Registre horas dormidas rapidamente", emoji: "😴", category: "saúde" },
  { id: "countdown", label: "Contagem Regressiva", description: "Dias restantes até uma meta ou evento", emoji: "🎯", category: "bem-estar" },
  { id: "week-calendar", label: "Visão da Semana", description: "Mini calendário com status de cada dia", emoji: "📅", category: "produtividade" },
];

const KEY = "core-home-widgets";

export function useHomeWidgets() {
  const { get, set: setData } = useUserData();
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>(() => get(KEY, []));

  useEffect(() => {
    setData(KEY, activeWidgets);
  }, [activeWidgets, setData]);

  const addWidget = (id: WidgetId) => {
    setActiveWidgets(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const removeWidget = (id: WidgetId) => {
    setActiveWidgets(prev => prev.filter(w => w !== id));
  };

  const isActive = (id: WidgetId) => activeWidgets.includes(id);

  const reorder = (from: number, to: number) => {
    setActiveWidgets(prev => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  return { activeWidgets, addWidget, removeWidget, isActive, reorder };
}
