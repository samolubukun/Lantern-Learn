"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Target, Zap } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";
import { useAuth } from "@/providers/auth-provider";

const QuestsPage = () => {
  const { token } = useAuth();
  const userProgress = useQuery(api.userProgress.getUserProgress, token ? { token } : {});
  const userSubscription = useQuery(api.userSubscription.getUserSubscription, token ? { token } : {});

  if (userProgress === undefined) {
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
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <div className="h-20 w-20 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-xs">
            <Target className="h-10 w-10 stroke-[2.2]" />
          </div>
          <h1 className="text-center font-black text-slate-900 dark:text-slate-100 text-2xl my-4 tracking-tight">
            Daily Milestones & Challenges
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm sm:text-base mb-6 max-w-md">
            Earn knowledge XP across quizzes, reading guides, and interactive masterclasses to claim milestone rewards.
          </p>
          <div className="w-full space-y-4">
            {quests.map((quest) => {
              const progress = Math.min((userProgress.points / quest.value) * 100, 100);

              return (
                <div
                  className="flex items-center w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-x-4 shadow-xs"
                  key={quest.title}
                >
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 fill-current" />
                  </div>
                  <div className="flex flex-col gap-y-2 w-full min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-900 dark:text-slate-100 text-base font-bold truncate">
                        {quest.title}
                      </p>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 ml-2">
                        {Math.min(userProgress.points, quest.value)} / {quest.value} XP
                      </span>
                    </div>
                    <Progress value={progress} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
