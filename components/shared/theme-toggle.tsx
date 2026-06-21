"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/store/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } =
    useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border p-2"
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}