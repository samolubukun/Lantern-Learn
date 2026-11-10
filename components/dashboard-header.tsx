"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Zap,
  Flame,
  Heart,
  Coins,
  InfinityIcon,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const DashboardHeader = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const userProgress = useQuery(
    api.userProgress.getUserProgress,
    token ? { token } : {}
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const points = userProgress?.points ?? 0;
  const streak = userProgress?.streakCount ?? 0;
  const hearts = userProgress?.hearts ?? 5;
  const credits = userProgress?.credits ?? 100;
  const isPro = userProgress?.isPro ?? false;

  return (
    <header className="hidden lg:flex sticky top-0 z-30 h-16 sm:h-20 bg-white/80 dark:bg-[#0A0D14]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 items-center justify-between gap-x-4 transition-all">
      {/* 1. Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a course, lesson, or topic..."
            className="w-full pl-10 pr-12 py-2 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-900/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700">
            ↵
          </kbd>
        </div>
      </form>

      {/* 2. Top Metric Capsules (Filko Header Design) */}
      <div className="flex items-center gap-x-2 sm:gap-x-3">
        {/* Total XP Capsule */}
        <Link
          href="/leaderboard"
          className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs font-black text-amber-700 dark:text-amber-400 hover:scale-105 transition-transform shadow-2xs"
          title="Total Knowledge Score"
        >
          <div className="h-4 w-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
            <Zap className="h-2.5 w-2.5 fill-current" />
          </div>
          <span>{points.toLocaleString()} XP</span>
        </Link>

        {/* Streak Capsule */}
        <Link
          href="/dashboard"
          className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 text-xs font-black text-orange-700 dark:text-orange-400 hover:scale-105 transition-transform shadow-2xs"
          title="Daily Momentum Streak"
        >
          <div className="h-4 w-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
            <Flame className="h-2.5 w-2.5 fill-current" />
          </div>
          <span>{streak} {streak === 1 ? "day" : "days"}</span>
        </Link>

        {/* Focus Energy Capsule */}
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs font-black text-rose-700 dark:text-rose-400 hover:scale-105 transition-transform shadow-2xs"
          title="Focus Energy"
        >
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
          <span>
            {isPro ? (
              <InfinityIcon className="h-3.5 w-3.5 inline stroke-[3]" />
            ) : (
              `${hearts}/5`
            )}
          </span>
        </Link>

        {/* Credits Token Capsule */}
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs font-black text-amber-700 dark:text-amber-400 hover:scale-105 transition-transform shadow-2xs"
          title="Starter & Purchased Credits"
        >
          <Coins className="h-3.5 w-3.5 text-amber-500" />
          <span>{credits}</span>
        </Link>

        <ThemeToggle />

        {/* User Avatar Circle */}
        <Link
          href="/settings"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs hover:scale-105 transition-transform relative"
          title="Account Settings & Profile"
        >
          {user?.imageSrc ? (
            <Image
              src={user.imageSrc}
              alt={user.name || "Avatar"}
              width={36}
              height={36}
              className="h-full w-full object-contain"
              unoptimized={user.imageSrc.startsWith("data:")}
            />
          ) : (
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : "L"}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

