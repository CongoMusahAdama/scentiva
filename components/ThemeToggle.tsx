"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeMounted } from "@/context/ThemeContext";

type Props = {
  className?: string;
};

const ThemeToggle = ({ className = "" }: Props) => {
  const { theme, toggleTheme, mounted } = useThemeMounted();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 hover:text-parchment transition-colors ${className}`}
      aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mounted && theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {mounted && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
