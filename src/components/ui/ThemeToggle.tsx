"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check local storage or system preferences
    const savedTheme = localStorage.getItem("verisight-theme") as "dark" | "light" | null;
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("verisight-theme", nextTheme);

    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-16 h-8 p-1 rounded-full cursor-pointer bg-slate-900/60 dark:bg-slate-950/80 border border-indigo-500/20 hover:border-indigo-400/40 shadow-inner overflow-hidden transition-all duration-300 select-none group"
      aria-label="Toggle visual interface mode"
    >
      {/* Animated Sliding Glow Background */}
      <div
        className={`absolute top-1 bottom-1 w-6 rounded-full transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
          theme === "light"
            ? "left-9 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            : "left-1 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
        }`}
      />

      {/* Moon Icon (Dark Mode Selector) */}
      <div
        className={`z-10 flex items-center justify-center w-6 h-6 transition-all duration-300 ${
          theme === "dark" ? "text-indigo-200" : "text-slate-500 group-hover:text-slate-400"
        }`}
      >
        <Moon className="w-4 h-4" />
      </div>

      {/* Sun Icon (Light Mode Selector) */}
      <div
        className={`z-10 flex items-center justify-center w-6 h-6 transition-all duration-300 ${
          theme === "light" ? "text-amber-900 font-semibold" : "text-slate-500 group-hover:text-slate-400"
        }`}
      >
        <Sun className="w-4 h-4" />
      </div>
    </button>
  );
}
