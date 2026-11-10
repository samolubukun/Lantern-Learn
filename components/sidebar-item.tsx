"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
};

export const SidebarItem = ({
  label,
  icon,
  href,
  badge,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-xs"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
      )}
    >
      <div className="flex items-center gap-x-3 min-w-0">
        <span
          className={cn(
            "flex-shrink-0 transition-colors",
            active
              ? "text-amber-500 dark:text-amber-400"
              : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
          )}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      {badge !== undefined && (
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            active
              ? "bg-amber-500 text-slate-950 font-black"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};
