"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  BookMarked,
  Trophy,
  Target,
  Sparkles,
  Zap,
  ArrowUpRight,
  LogOut,
  LogIn,
  Loader2,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "./ui/button";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const { user, isLoading, logout } = useAuth();

  // Upgrade banner feature flag (controlled in code / env; disabled by default until payment provider is set up)
  const showProUpgrade = process.env.NEXT_PUBLIC_ENABLE_PRO_UPGRADE === "true";

  return (
    <aside
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 flex-col justify-between bg-white dark:bg-[#0A0D14] z-40 transition-all",
        className
      )}
    >
      {/* Top Header & Brand */}
      <div className="flex flex-col flex-1 min-h-0">
        <Link href="/dashboard" className="px-5 pt-6 pb-5 flex items-center gap-x-3.5 group">
          <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-500/35 flex items-center justify-center p-2 transition-transform group-hover:scale-105 shadow-sm shadow-amber-500/10 flex-shrink-0">
            <Image
              src="/mascot.svg"
              height={40}
              width={40}
              alt="Lantern Beacon"
              className="object-contain drop-shadow-xs"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Lantern
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mt-1">
              Learning Platform
            </span>
          </div>
        </Link>

        {/* Navigation Item List (Zero SVGs, Pure Lucide Vector Icons) */}
        <nav className="px-3 space-y-1.5 flex-1 overflow-y-auto">
          <SidebarItem
            label="Dashboard"
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Course Catalog"
            href="/courses"
            icon={<Compass className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Curriculum"
            href="/learn"
            icon={<BookOpen className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Study Notebook"
            href="/notebook"
            icon={<BookMarked className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Leaderboard"
            href="/leaderboard"
            icon={<Trophy className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Daily Milestones"
            href="/quests"
            icon={<Target className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Shop & Perks"
            href="/shop"
            icon={<Sparkles className="h-5 w-5 stroke-[2.2]" />}
          />
          <SidebarItem
            label="Settings & Profile"
            href="/settings"
            icon={<Settings className="h-5 w-5 stroke-[2.2]" />}
          />
          {user?.isAdmin && (
            <SidebarItem
              label="Admin Studio"
              href="/admin"
              icon={<ShieldCheck className="h-5 w-5 stroke-[2.2]" />}
            />
          )}
        </nav>

        {/* Optional Pro Card (Rendered ONLY when NEXT_PUBLIC_ENABLE_PRO_UPGRADE is set to "true") */}
        {showProUpgrade && (
          <div className="px-3 pt-3 pb-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-4 shadow-md shadow-amber-500/15">
              <div className="flex items-center gap-x-2 mb-2 pr-6">
                <div className="h-7 w-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shadow-xs">
                  <Zap className="h-4 w-4 fill-current" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-950">
                  Lantern Pro
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-950/90 leading-tight">
                Unlimited Focus Energy & Full Video Access
              </p>
              <Link
                href="/shop"
                className="mt-3 w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-950 hover:text-white text-slate-950 dark:text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-x-1.5 shadow-xs"
              >
                <span>Upgrade Now</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* User Account / Sign Out Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        ) : user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <Link
              href="/settings"
              className="flex items-center gap-x-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity group"
              title="Account Settings & Profile"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden border border-amber-500/30 flex-shrink-0 bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 relative">
                {user.imageSrc ? (
                  <Image
                    src={user.imageSrc}
                    alt={user.name || "Avatar"}
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                    unoptimized={user.imageSrc.startsWith("data:")}
                  />
                ) : (
                  <span>{user.name ? user.name.charAt(0).toUpperCase() : "L"}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </Link>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex-shrink-0 ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link href="/login" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-x-2 text-slate-600 dark:text-slate-300"
              size="sm"
            >
              <LogIn className="h-4 w-4 text-amber-500" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
};
