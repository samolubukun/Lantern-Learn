import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const upsertChallengeProgress = mutation({
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

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    const existingProgress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_and_challenge", (q) =>
        q.eq("userId", userId).eq("challengeId", args.challengeId)
      )
      .first();

    const isPractice = !!existingProgress;

    if (userProgress.hearts === 0 && !isPractice && !isSubscriptionActive && !isPro) {
      return { error: "hearts" as const };
    }

    const today = new Date().toISOString().split("T")[0];
    let newStreak = userProgress.streakCount;
    if (userProgress.lastActiveDate !== today) {
      newStreak += 1;
    }

    if (isPractice) {
      await ctx.db.patch(existingProgress._id, {
        completed: true,
      });

      await ctx.db.patch(userProgress._id, {
        hearts: Math.min(userProgress.hearts + 1, 5),
        points: userProgress.points + 10,
        streakCount: newStreak,
        lastActiveDate: today,
      });

      return { success: true, isPractice: true };
    }

    await ctx.db.insert("challengeProgress", {
      userId,
      challengeId: args.challengeId,
      completed: true,
    });

    await ctx.db.patch(userProgress._id, {
      points: userProgress.points + 10,
      streakCount: newStreak,
      lastActiveDate: today,
    });

    return { success: true, isPractice: false };
  },
});
