import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const DEFAULT_WELCOME_CREDITS = 100;

export const getUserCredits = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) return null;

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const credits = userProgress?.credits ?? DEFAULT_WELCOME_CREDITS;

    const transactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(15);

    return {
      credits,
      isPro: (userProgress?.proExpiresAt ?? 0) > Date.now(),
      proExpiresAt: userProgress?.proExpiresAt,
      transactions,
    };
  },
});

export const addCredits = mutation({
  args: {
    userId: v.optional(v.string()),
    token: v.optional(v.string()),
    amount: v.number(),
    description: v.string(),
    provider: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("grant"),
        v.literal("purchase"),
        v.literal("spend"),
        v.literal("bonus")
      )
    ),
  },
  handler: async (ctx, args) => {
    let targetUserId = args.userId;
    if (!targetUserId) {
      const resolvedId = await getAuthUserId(ctx, args.token);
      if (!resolvedId) throw new Error("Unauthorized");
      targetUserId = resolvedId;
    }

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId!))
      .first();

    const currentCredits = userProgress?.credits ?? DEFAULT_WELCOME_CREDITS;
    const newCredits = currentCredits + args.amount;

    if (userProgress) {
      await ctx.db.patch(userProgress._id, {
        credits: newCredits,
      });
    }

    await ctx.db.insert("creditTransactions", {
      userId: targetUserId,
      amount: args.amount,
      type: args.type || "purchase",
      description: args.description,
      provider: args.provider || "credit_adapter",
      createdAt: Date.now(),
    });

    return { success: true, newBalance: newCredits };
  },
});

export const spendCreditsForHearts = mutation({
  args: {
    costInCredits: v.optional(v.number()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) throw new Error("Unauthorized");

    const cost = args.costInCredits ?? 10;

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userProgress) throw new Error("User progress not found");

    const currentCredits = userProgress.credits ?? DEFAULT_WELCOME_CREDITS;
    if (currentCredits < cost) {
      throw new Error(`Insufficient credits. You need ${cost} credits.`);
    }

    await ctx.db.patch(userProgress._id, {
      hearts: 5,
      credits: currentCredits - cost,
    });

    await ctx.db.insert("creditTransactions", {
      userId,
      amount: -cost,
      type: "spend",
      description: "Refilled hearts to full (5)",
      provider: "internal_credits",
      createdAt: Date.now(),
    });

    return { success: true, remainingCredits: currentCredits - cost };
  },
});

export const unlockProWithCredits = mutation({
  args: {
    durationDays: v.optional(v.number()),
    costInCredits: v.optional(v.number()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) throw new Error("Unauthorized");

    const days = args.durationDays ?? 30;
    const cost = args.costInCredits ?? 50; // 50 credits for 30 days of Pro

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userProgress) throw new Error("User progress not found");

    const currentCredits = userProgress.credits ?? DEFAULT_WELCOME_CREDITS;
    if (currentCredits < cost) {
      throw new Error(`Insufficient credits. You need ${cost} credits for Lantern Pro.`);
    }

    const currentProExpiry = userProgress.proExpiresAt ?? Date.now();
    const baseTime = currentProExpiry > Date.now() ? currentProExpiry : Date.now();
    const newExpiry = baseTime + days * 24 * 60 * 60 * 1000;

    await ctx.db.patch(userProgress._id, {
      credits: currentCredits - cost,
      proExpiresAt: newExpiry,
    });

    await ctx.db.insert("creditTransactions", {
      userId,
      amount: -cost,
      type: "spend",
      description: `Unlocked Lantern Pro for ${days} days`,
      provider: "internal_credits",
      createdAt: Date.now(),
    });

    return { success: true, proExpiresAt: newExpiry, remainingCredits: currentCredits - cost };
  },
});
