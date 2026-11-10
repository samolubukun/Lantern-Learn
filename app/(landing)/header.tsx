"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#tracks", label: "Tracks" },
  { href: "#who-it-is-for", label: "Who it's for" },
];

export const Header = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-white/80 dark:bg-[#08090C]/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 px-5 sm:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-x-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
        >
          <Image src="/mascot.svg" height={28} width={28} alt="" className="object-contain" />
          <span className="text-[17px] font-bold tracking-tight text-zinc-950 dark:text-white">Lantern</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-x-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-x-2">
          <ThemeToggle />
          <span aria-hidden className="mx-1 h-5 w-px bg-zinc-200 dark:bg-white/10" />
          {user ? (
            <>
              <button
                onClick={() => logout()}
                className="px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Sign out
              </button>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-x-1.5 h-9 px-4 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-semibold transition-colors"
              >
                Dashboard
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-x-1.5 h-9 px-4 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-semibold transition-colors"
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-x-1">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="md:hidden border-t border-zinc-200/70 dark:border-white/[0.06] px-5 pb-6 pt-2">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border-b border-zinc-100 dark:border-white/[0.04]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {user ? (
              <>
                <button
                  onClick={() => logout()}
                  className="h-11 rounded-lg border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Sign out
                </button>
                <Link
                  href="/dashboard"
                  className="h-11 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold flex items-center justify-center"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="h-11 rounded-lg border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-800 dark:text-zinc-200 flex items-center justify-center"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="h-11 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold flex items-center justify-center"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
