import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "midnight" | "ivory";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "ivory",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("belvo-theme") as Theme | null;
      return saved || "ivory";
    } catch {
      return "ivory";
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "ivory") {
      html.classList.add("ivory");
    } else {
      html.classList.remove("ivory");
    }
    try {
      localStorage.setItem("belvo-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "midnight" ? "ivory" : "midnight"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
