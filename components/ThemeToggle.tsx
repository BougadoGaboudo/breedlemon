"use client";

import { useThemeStore } from "@/stores/themeStore";
import SecondaryButton from "./SecondaryButton";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <SecondaryButton onClick={toggleTheme} className="border-none">
      {theme === "dark" ? <Sun /> : <Moon />}
    </SecondaryButton>
  );
}
