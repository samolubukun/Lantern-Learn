"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-wide light/dark theme. Sets the `dark` class on <html>, which Tailwind's
 * `dark:` variant (darkMode: "class") and the `.dark` CSS variables in globals.css
 * both key off. The choice persists in localStorage and is applied before paint.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    storageKey="lantern-theme"
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
