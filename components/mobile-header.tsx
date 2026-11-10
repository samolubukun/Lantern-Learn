"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Flame } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/providers/auth-provider";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";

export const MobileHeader = () => {
  const { user, token } = useAuth();
  const userProgress = useQuery(
    api.userProgress.getUserProgress,
    token ? { token } : {}
  );

  const points = userProgress?.points ?? 0;
  const streak = userProgress?.streakCount ?? 0;

  return (
    <nav className="lg:hidden px-3.5 h-14 flex items-center justify-between bg-white/95 dark:bg-[#0A0D14]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white sticky top-0 w-full z-50">
      <div className="flex items-center gap-x-2.5">
        <MobileSidebar />
        <Link href="/dashboard" className="flex items-center gap-x-2">
          <div className="relative h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 shadow-xs flex-shrink-0">
            <Image
              src="/mascot.svg"
              height={26}
              width={26}
              alt="Lantern Logo"
              className="object-contain"
            />
          </div>
          <span className="font-black text-base tracking-tight">Lantern</span>
        </Link>
      </div>

      {/* Mobile Live User Metrics & Profile */}
      <div className="flex items-center gap-x-1.5 sm:gap-x-2">
        <Link
          href="/leaderboard"
          className="flex items-center gap-x-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-[11px] font-black text-amber-700 dark:text-amber-400"
          title="Knowledge XP"
        >
          <Zap className="h-3 w-3 fill-current text-amber-500" />
          <span>{points.toLocaleString()}</span>
        </Link>

        {streak > 0 && (
          <Link
            href="/dashboard"
            className="hidden xs:flex items-center gap-x-1 px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 text-[11px] font-black text-orange-700 dark:text-orange-400"
            title="Streak"
          >
            <Flame className="h-3 w-3 fill-current text-orange-500" />
            <span>{streak}d</span>
          </Link>
        )}

        <ThemeToggle className="h-8 w-8" />

        <Link
          href="/settings"
          className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border border-white dark:border-slate-800 shadow-xs ml-0.5 relative"
          title="Account Settings & Profile"
        >
          {user?.imageSrc ? (
            <Image
              src={user.imageSrc}
              alt={user.name || "Avatar"}
              width={28}
              height={28}
              className="h-full w-full object-contain"
              unoptimized={user.imageSrc.startsWith("data:")}
            />
          ) : (
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : "L"}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};
