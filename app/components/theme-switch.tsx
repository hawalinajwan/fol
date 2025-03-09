"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { FaCircleHalfStroke } from "react-icons/fa6";

const storageKey = "theme-preference";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
}

export const ThemeSwitch: React.FC = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  // Pastikan selalu menggunakan light mode pertama kali
  const getColorPreference = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      const storedPreference = localStorage.getItem(storageKey);
      if (storedPreference) {
        return storedPreference as "light" | "dark";
      }
      // Set default light jika belum ada preferensi
      localStorage.setItem(storageKey, "light");
      return "light";
    }
    return "light";
  };

  const reflectPreference = (theme: "light" | "dark") => {
    document.documentElement.classList.remove("bg-light", "bg-dark");
    document.documentElement.classList.add(`bg-${theme}`);
    setCurrentTheme(theme);
    setTheme(theme);
  };

  React.useEffect(() => {
    setMounted(true);
    const initTheme = getColorPreference();
    reflectPreference(initTheme);
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem(storageKey, newTheme);
    reflectPreference(newTheme);
  };

  if (!mounted) {
    return (
      <FaCircleHalfStroke
        className="h-[14px] w-[14px] text-[#1c1c1c]"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      id="theme-toggle"
      aria-label={`${currentTheme} mode`}
      onClick={toggleTheme}
      className="flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
    >
      <FaCircleHalfStroke
        className={`h-[14px] w-[14px] ${
          currentTheme === "dark" ? "text-[#D4D4D4]" : "text-[#1c1c1c]"
        }`}
      />
    </button>
  );
};
