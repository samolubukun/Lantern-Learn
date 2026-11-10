"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, LayoutList, Compass } from "lucide-react";

import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { useAuth } from "@/providers/auth-provider";

import { Unit } from "./unit";
import { Header } from "./header";

const LearnPage = () => {
  const { token } = useAuth();
  const [viewMode, setViewMode] = useState<"roadmap" | "path">("roadmap");
  const userProgress = useQuery(api.userProgress.getUserProgress, token ? { token } : {});
  const modules = useQuery(api.modules.getModulesByCourse, token ? { token } : {});
  const userSubscription = useQuery(api.userSubscription.getUserSubscription, token ? { token } : {});

  if (userProgress === undefined || modules === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = userProgress.isPro || !!userSubscription?.isActive;

  // Compute active uncompleted lesson
  let activeLesson: any = undefined;
  for (const mod of modules) {
    for (const les of mod.lessons) {
      if (!les.completed) {
        activeLesson = les;
        break;
      }
    }
    if (activeLesson) break;
  }

  const activeLessonPercentage = activeLesson
    ? activeLesson.challenges?.length
      ? (activeLesson.challenges.filter((c: any) => c.completed).length /
          activeLesson.challenges.length) *
        100
      : 0
    : 100;

  return (
    <div className="flex flex-col xl:flex-row-reverse gap-6 xl:gap-8 w-full min-w-0">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          credits={userProgress.credits}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />

        {/* View Mode Switcher: Syllabus Roadmap vs Waypoint Trail */}
        <div className="flex items-center justify-between mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("roadmap")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === "roadmap"
                ? "bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-100 shadow-xs"
                : "text-neutral-500 dark:text-slate-400 hover:text-neutral-700 dark:hover:text-slate-200"
            }`}
          >
            <LayoutList className="h-3.5 w-3.5 text-amber-500" /> Syllabus Roadmap
          </button>
          <button
            onClick={() => setViewMode("path")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === "path"
                ? "bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-100 shadow-xs"
                : "text-neutral-500 dark:text-slate-400 hover:text-neutral-700 dark:hover:text-slate-200"
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-sky-500" /> Waypoint Trail
          </button>
        </div>

        {modules.map((mod) => (
          <div key={mod._id} className="mb-10">
            <Unit
              id={mod._id}
              order={mod.order}
              description={mod.description}
              title={mod.title}
              lessons={mod.lessons}
              activeLesson={activeLesson}
              activeLessonPercentage={activeLessonPercentage}
              viewMode={viewMode}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
