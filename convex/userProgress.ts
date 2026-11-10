import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const DEFAULT_WELCOME_CREDITS = 100;

export const getUserProgress = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      return null;
    }

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!progress) {
      return null;
    }

    let activeCourse = null;
    if (progress.activeCourseId) {
      activeCourse = await ctx.db.get(progress.activeCourseId);
    }

    const isPro = (progress.proExpiresAt ?? 0) > Date.now();

    return {
      ...progress,
      credits: progress.credits ?? DEFAULT_WELCOME_CREDITS,
      isPro,
      activeCourse,
    };
  },
});

export const upsertUserProgress = mutation({
  args: {
    courseId: v.id("courses"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Try finding user metadata
    let userName = "Learner";
    let userImageSrc = "/mascot.svg";

    const allUsers = await ctx.db.query("users").collect();
    const userDoc = allUsers.find((u) => u._id.toString() === userId);
    if (userDoc) {
      userName = userDoc.name;
      userImageSrc = userDoc.imageSrc || "/mascot.svg";
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const existingProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const today = new Date().toISOString().split("T")[0];

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        activeCourseId: args.courseId,
        userName: userDoc?.name ?? existingProgress.userName,
        userImageSrc: userDoc?.imageSrc ?? existingProgress.userImageSrc,
        credits: existingProgress.credits ?? DEFAULT_WELCOME_CREDITS,
      });
      return existingProgress._id;
    }

    const newProgressId = await ctx.db.insert("userProgress", {
      userId,
      userName,
      userImageSrc,
      activeCourseId: args.courseId,
      hearts: 5,
      points: 0,
      credits: DEFAULT_WELCOME_CREDITS,
      streakCount: 0,
      lastActiveDate: today,
    });

    // Record welcome bonus credits transaction
    await ctx.db.insert("creditTransactions", {
      userId,
      amount: DEFAULT_WELCOME_CREDITS,
      type: "grant",
      description: "Welcome bonus: 100 free Lantern credits",
      provider: "system_welcome",
      createdAt: Date.now(),
    });

    return newProgressId;
  },
});

export const reduceHearts = mutation({
  args: {
    challengeId: v.id("challenges"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userProgress) {
      throw new Error("User progress not found");
    }

    const isPro = (userProgress.proExpiresAt ?? 0) > Date.now();

    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const isSubscriptionActive =
      subscription &&
      subscription.status === "active" &&
      subscription.stripeCurrentPeriodEnd &&
      subscription.stripeCurrentPeriodEnd > Date.now();

    if (isPro || isSubscriptionActive) {
      return { error: "subscription" as const };
    }

    const existingProgress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_and_challenge", (q) =>
        q.eq("userId", userId).eq("challengeId", args.challengeId)
      )
      .first();

    const isPractice = !!existingProgress;
    if (isPractice) {
      return { error: "practice" as const };
    }

    if (userProgress.hearts === 0) {
      return { error: "hearts" as const };
    }

    await ctx.db.patch(userProgress._id, {
      hearts: Math.max(userProgress.hearts - 1, 0),
    });

    return { success: true };
  },
});

export const refillHearts = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args?.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userProgress) {
      throw new Error("User progress not found");
    }

    if (userProgress.hearts === 5) {
      throw new Error("Hearts are already full");
    }

    const POINTS_TO_REFILL = 10;

    if (userProgress.points < POINTS_TO_REFILL) {
      throw new Error("Not enough points");
    }

    await ctx.db.patch(userProgress._id, {
      hearts: 5,
      points: userProgress.points - POINTS_TO_REFILL,
    });

    return { success: true };
  },
});
