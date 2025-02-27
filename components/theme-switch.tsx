"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only showing the toggle after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className='relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      style={{
        backgroundColor: theme === "dark" ? "#2d3846" : "#d1d5db",
      }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
      <span
        className={`${
          theme === "dark" ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}>
        <span className='sr-only'>
          {theme === "light" ? "Light" : "Dark"} Mode
        </span>
      </span>
      <span className='absolute inset-0 flex items-center justify-between px-1.5'>
        <Sun className='h-3 w-3 text-yellow-500' />
        <Moon className='h-3 w-3 text-black' />
      </span>
    </button>
  );
}
