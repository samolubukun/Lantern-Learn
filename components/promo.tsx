import Link from "next/link";
import { Zap, ArrowUpRight } from "lucide-react";

export const Promo = () => {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-sm space-y-3">
      <div className="flex items-center gap-x-2">
        <div className="h-7 w-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shadow-xs">
          <Zap className="h-4 w-4 fill-current" />
        </div>
        <h3 className="font-black text-sm uppercase tracking-wider text-slate-950">
          Lantern Pro
        </h3>
      </div>
      <p className="text-xs font-semibold text-amber-950/90 leading-relaxed">
        Use your starter credits to unlock 30 days of unlimited focus energy and all video masterclasses!
      </p>
      <Link
        href="/shop"
        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-950 hover:text-white text-slate-950 dark:text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-x-1.5 shadow-xs"
      >
        <span>Upgrade with Credits</span>
        <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
      </Link>
    </div>
  );
};
