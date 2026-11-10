"use client";

import Link from "next/link";
import {
  Check,
  Lock,
  Play,
  Video,
  BookOpen,
  Sparkles,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type Lesson = {
  _id: string;
  order: number;
  title: string;
  type?: "quiz" | "video" | "article" | "practice";
  estimatedMinutes?: number;
  completed: boolean;
};

type Props = {
  id: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
  activeLesson?: {
    _id: string;
  };
  activeLessonPercentage: number;
  viewMode?: "roadmap" | "path";
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
  viewMode = "roadmap",
}: Props) => {
  const completedCount = lessons.filter((l) => l.completed).length;

  return (
    <div className="space-y-4">
      <UnitBanner
        title={title}
        description={description}
      />

      {viewMode === "roadmap" ? (
        /* Modern LMS Curriculum Roadmap View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
          <div className="pb-3 flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-slate-400">
            <span>Module Syllabus & Learning Track</span>
            <span className="text-amber-700 font-bold bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
              {completedCount} of {lessons.length} Completed
            </span>
          </div>

          <div className="pt-3 space-y-3">
            {lessons.map((lesson, index) => {
              const isCurrent = lesson._id === activeLesson?._id;
              const isLocked = !lesson.completed && !isCurrent;
              const isCompleted = lesson.completed;

              return (
                <div
                  key={lesson._id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border-2 transition-all ${
                    isCurrent
                      ? "border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm"
                      : isCompleted
                      ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-x-3.5 min-w-0">
                    {/* Status Indicator Icon */}
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-sm"
                          : isCurrent
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6 stroke-[3]" />
                      ) : isCurrent ? (
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>

                    {/* Lesson Info & Metadata Pills */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-x-2 flex-wrap gap-y-1">
                        <span className="text-xs font-bold text-neutral-400">
                          {order}.{index + 1}
                        </span>
                        <h4 className="font-bold text-neutral-800 dark:text-slate-100 text-sm md:text-base truncate">
                          {lesson.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-x-2 text-xs flex-wrap gap-y-1">
                        {/* Format Pill */}
                        {lesson.type === "video" ? (
                          <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-700 border border-purple-200/60 dark:border-purple-900/50 text-[11px]">
                            <Video className="h-3 w-3" /> Masterclass
                          </span>
                        ) : lesson.type === "article" ? (
                          <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50 text-[11px]">
                            <BookOpen className="h-3 w-3" /> Architecture Guide
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/30 text-sky-700 border border-sky-200/60 dark:border-sky-900/50 text-[11px]">
                            <Sparkles className="h-3 w-3" /> Interactive Quiz
                          </span>
                        )}

                        {/* Estimated Duration */}
                        <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3" />
                          {lesson.estimatedMinutes ?? 6}m
                        </span>

                        {/* XP Reward */}
                        <span className="text-amber-600 font-semibold flex items-center gap-0.5 text-[11px]">
                          <Zap className="h-3 w-3" />
                          +15 XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="w-full sm:w-auto flex justify-end shrink-0 sm:ml-4">
                    {isCompleted ? (
                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="border-2 text-xs font-bold text-neutral-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Link href={`/lesson/${lesson._id}`}>Review</Link>
                      </Button>
                    ) : isCurrent ? (
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="font-bold shadow-sm"
                      >
                        <Link href={`/lesson/${lesson._id}`} className="flex items-center gap-1">
                          Continue <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant="locked"
                        size="sm"
                        className="text-xs font-semibold cursor-not-allowed"
                      >
                        Locked
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Stepped Path View */
        <div className="flex items-center flex-col relative py-4">
          {lessons.map((lesson, index) => {
            const isCurrent = lesson._id === activeLesson?._id;
            const isLocked = !lesson.completed && !isCurrent;

            return (
              <LessonButton
                key={lesson._id}
                id={lesson._id}
                index={index}
                totalCount={lessons.length - 1}
                current={isCurrent}
                locked={isLocked}
                percentage={activeLessonPercentage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
