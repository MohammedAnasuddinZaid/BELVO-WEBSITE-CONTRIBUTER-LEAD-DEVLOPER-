import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "midnight" | "ivory";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "midnight",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("belvo-theme") as Theme) || "midnight";
    } catch {
      return "midnight";
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
