"use client";

import { useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Globe, BookOpen, Trophy } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { useAuth } from "@/providers/auth-provider";

const LeaderboardPage = () => {
  const { token } = useAuth();
  const [viewMode, setViewMode] = useState<"global" | "course">("global");
  const userProgress = useQuery(api.userProgress.getUserProgress, token ? { token } : {});
  const userSubscription = useQuery(api.userSubscription.getUserSubscription, token ? { token } : {});

  const leaderboard = useQuery(api.leaderboard.getLeaderboard, {
    courseId: viewMode === "course" ? userProgress?.activeCourseId : undefined,
  });

  if (userProgress === undefined || leaderboard === undefined) {
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
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <div className="h-20 w-20 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-xs">
            <Trophy className="h-10 w-10 stroke-[2.2]" />
          </div>
          <h1 className="text-center font-black text-slate-900 dark:text-slate-100 text-2xl my-4 tracking-tight">
            Learner Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6 max-w-md">
            Compete with fellow learners across Lantern or see who is topping your current track.
          </p>

          {/* Global vs Course Filter Pills */}
          <div className="flex items-center gap-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button
              onClick={() => setViewMode("global")}
              className={`flex items-center gap-x-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === "global"
                  ? "bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-100 shadow-xs"
                  : "text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-100"
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-sky-500" /> Global Platform
            </button>
            <button
              onClick={() => setViewMode("course")}
              className={`flex items-center gap-x-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === "course"
                  ? "bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-100 shadow-xs"
                  : "text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-100"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-500" /> {userProgress.activeCourse.title} Track
            </button>
          </div>

          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboard.map((item, index) => (
            <div
              key={item.userId}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50 dark:hover:bg-slate-800/50"
            >
              <p className="font-bold text-amber-600 mr-4">{index + 1}</p>
              <Avatar className="border bg-amber-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage className="object-cover" src={item.userImageSrc} />
              </Avatar>
              <p className="font-bold text-neutral-800 dark:text-slate-100 flex-1">
                {item.userName}
              </p>
              <p className="text-muted-foreground">{item.points} XP</p>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <p className="text-muted-foreground text-sm py-4">
              Be the first to complete a lesson in this track and lead the ranks!
            </p>
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
