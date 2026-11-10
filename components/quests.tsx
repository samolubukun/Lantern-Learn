import Link from "next/link";
import { Zap } from "lucide-react";
import { quests } from "@/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Props = {
  points: number;
};

export const Quests = ({ points }: Props) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-4 space-y-4 shadow-xs">
      <div className="flex items-center justify-between w-full">
        <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-x-2">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
          Daily Milestones
        </h3>
        <Link href="/quests">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline p-0 h-auto"
          >
            View all →
          </Button>
        </Link>
      </div>
      <div className="w-full space-y-3.5">
        {quests.slice(0, 3).map((quest) => {
          const progress = Math.min((points / quest.value) * 100, 100);

          return (
            <div
              className="flex items-center w-full gap-x-3"
              key={quest.title}
            >
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Zap className="h-3.5 w-3.5 fill-current" />
              </div>
              <div className="flex flex-col gap-y-1 w-full min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <p className="text-slate-800 dark:text-slate-200 font-bold truncate">
                    {quest.title}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 ml-2">
                    {Math.min(points, quest.value)}/{quest.value}
                  </span>
                </div>
                <Progress value={progress} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
