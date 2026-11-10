"use client";

import Link from "next/link";
import { Check, Crown, Star, Sparkles } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number | string;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage
}: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) {
    indentationLevel = cycleIndex;
  } else if (cycleIndex <= 4) {
    indentationLevel = 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    indentationLevel = 4 - cycleIndex;
  } else {
    indentationLevel = cycleIndex - 8;
  }

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  const Icon = isCompleted ? Check : isLast ? Crown : Star;

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link 
      href={href} 
      aria-disabled={locked} 
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[104px] w-[104px] relative flex items-center justify-center">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white rounded-full text-[11px] font-black tracking-wider uppercase shadow-md shadow-amber-500/25 flex items-center gap-1.5 whitespace-nowrap z-10 animate-pulse">
              <Sparkles className="h-3 w-3" /> Start
              <div
                className="absolute left-1/2 -bottom-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-500 transform -translate-x-1/2"
              />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: {
                  stroke: "#f59e0b",
                  strokeWidth: 6,
                },
                trail: {
                  stroke: "#e2e8f0",
                  strokeWidth: 6,
                },
              }}
            >
              <Button
                variant={locked ? "locked" : "secondary"}
                className="h-[72px] w-[72px] rounded-2xl border-b-[6px] shadow-sm"
              >
                <Icon
                  className={cn(
                    "h-9 w-9",
                    locked
                    ? "fill-neutral-400 dark:fill-slate-500 text-neutral-400 stroke-neutral-400 dark:stroke-slate-500"
                    : "fill-white text-white",
                    isCompleted && "fill-none stroke-[3.5]"
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button
            variant={locked ? "locked" : "secondary"}
            className="h-[72px] w-[72px] rounded-2xl border-b-[6px] shadow-sm"
          >
            <Icon
              className={cn(
                "h-9 w-9",
                locked
                ? "fill-neutral-400 dark:fill-slate-500 text-neutral-400 stroke-neutral-400 dark:stroke-slate-500"
                : "fill-white text-white",
                isCompleted && "fill-none stroke-[3.5]"
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
