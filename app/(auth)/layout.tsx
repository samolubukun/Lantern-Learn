import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-amber-500/10 via-slate-50 to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-950">
      {/* Auth Header */}
      <header className="p-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-x-3 group">
          <div className="relative h-10 w-10 transition-transform group-hover:scale-105">
            <Image
              src="/mascot.svg"
              alt="Lantern"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black text-amber-500 tracking-wide">
            Lantern
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="p-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Lantern Platform. Secure Email & Password Authentication.</p>
      </footer>
    </div>
  );
}

