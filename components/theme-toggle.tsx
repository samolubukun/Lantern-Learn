"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sun/moon button that flips between light and dark.
 * Icons swap via the `dark:` variant, so they render correctly before hydration;
 * the label waits for mount because the stored theme is only known client-side.
 */
export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60",
        className
      )}
    >
      <Sun className="h-[18px] w-[18px] transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[18px] w-[18px] transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
};
