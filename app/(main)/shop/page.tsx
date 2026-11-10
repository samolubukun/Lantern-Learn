"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Sparkles } from "lucide-react";

import { Promo } from "@/components/promo";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Quests } from "@/components/quests";
import { Items } from "./items";
import { useAuth } from "@/providers/auth-provider";

const ShopPage = () => {
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
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <div className="h-20 w-20 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-xs">
            <Sparkles className="h-10 w-10 stroke-[2.2]" />
          </div>
          <h1 className="text-center font-bold text-neutral-800 dark:text-slate-100 text-2xl my-6">
            Lantern Store & Credits
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Use credits to unlock Lantern Pro, refill hearts, and accelerate your mastery.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            credits={userProgress.credits}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;
