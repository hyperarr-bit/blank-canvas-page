import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeMode = "light" | "dark";
type ThemePalette = "default" | "midnight" | "ocean" | "rose" | "forest";

interface ThemeContextType {
  mode: ThemeMode;
  palette: ThemePalette;
  toggleMode: () => void;
  setPalette: (p: ThemePalette) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  palette: "default",
  toggleMode: () => {},
  setPalette: () => {},
});

export const palettes: Record<ThemePalette, { name: string; preview: string[]; accent: string }> = {
  default: { name: "Original", preview: ["#f5f0e8", "#1a1a1a", "#d6336c", "#f59f00"], accent: "330 65% 50%" },
  midnight: { name: "Midnight", preview: ["#0f172a", "#e2e8f0", "#818cf8", "#6366f1"], accent: "239 84% 67%" },
  ocean: { name: "Ocean", preview: ["#f0f9ff", "#0c4a6e", "#0ea5e9", "#06b6d4"], accent: "199 89% 48%" },
  rose: { name: "Rosé", preview: ["#fff1f2", "#881337", "#f43f5e", "#fb7185"], accent: "350 89% 60%" },
  forest: { name: "Forest", preview: ["#f0fdf4", "#14532d", "#22c55e", "#16a34a"], accent: "142 71% 45%" },
};

const paletteVars: Record<ThemePalette, Record<string, Record<string, string>>> = {
  default: {
    light: { "--accent": "330 65% 50%", "--chart-1": "330 65% 50%" },
    dark: { "--accent": "330 65% 55%", "--chart-1": "330 65% 55%" },
  },
  midnight: {
    light: { "--accent": "239 84% 67%", "--chart-1": "239 84% 67%", "--primary": "239 84% 30%", "--primary-foreground": "0 0% 100%" },
    dark: { "--accent": "239 84% 67%", "--chart-1": "239 84% 67%", "--primary": "239 84% 80%", "--primary-foreground": "0 0% 10%" },
  },
  ocean: {
    light: { "--accent": "199 89% 48%", "--chart-1": "199 89% 48%", "--primary": "199 89% 25%", "--primary-foreground": "0 0% 100%" },
    dark: { "--accent": "199 89% 55%", "--chart-1": "199 89% 55%", "--primary": "199 89% 80%", "--primary-foreground": "0 0% 10%" },
  },
  rose: {
    light: { "--accent": "350 89% 60%", "--chart-1": "350 89% 60%", "--primary": "350 89% 30%", "--primary-foreground": "0 0% 100%" },
    dark: { "--accent": "350 89% 60%", "--chart-1": "350 89% 60%", "--primary": "350 89% 80%", "--primary-foreground": "0 0% 10%" },
  },
  forest: {
    light: { "--accent": "142 71% 45%", "--chart-1": "142 71% 45%", "--primary": "142 71% 20%", "--primary-foreground": "0 0% 100%" },
    dark: { "--accent": "142 71% 50%", "--chart-1": "142 71% 50%", "--primary": "142 71% 80%", "--primary-foreground": "0 0% 10%" },
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("core-theme-mode");
    return (saved as ThemeMode) || "light";
  });
  const [palette, setPaletteState] = useState<ThemePalette>(() => {
    const saved = localStorage.getItem("core-theme-palette");
    return (saved as ThemePalette) || "default";
  });

  const toggleMode = () => setMode(m => (m === "light" ? "dark" : "light"));
  const setPalette = (p: ThemePalette) => setPaletteState(p);

  useEffect(() => {
    localStorage.setItem("core-theme-mode", mode);
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("core-theme-palette", palette);
    const root = document.documentElement;
    const vars = paletteVars[palette]?.[mode] || {};
    // Reset to defaults first by removing custom properties
    Object.keys(paletteVars.midnight.light).forEach(key => {
      root.style.removeProperty(key);
    });
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [palette, mode]);

  return (
    <ThemeContext.Provider value={{ mode, palette, toggleMode, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
