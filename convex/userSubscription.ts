import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const getUserSubscription = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      return null;
    }

    const sub = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!sub) {
      return null;
    }

    const DAY_IN_MS = 86_400_000;
    const isActive =
      sub.status === "active" &&
      sub.stripePriceId &&
      sub.stripeCurrentPeriodEnd &&
      sub.stripeCurrentPeriodEnd + DAY_IN_MS > Date.now();

    return {
      ...sub,
      isActive: !!isActive,
    };
  },
});

export const getSubscriptionByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!sub) return null;

    const DAY_IN_MS = 86_400_000;
    const isActive =
      sub.status === "active" &&
      sub.stripePriceId &&
      sub.stripeCurrentPeriodEnd &&
      sub.stripeCurrentPeriodEnd + DAY_IN_MS > Date.now();

    return {
      ...sub,
      isActive: !!isActive,
    };
  },
});

export const syncSubscription = mutation({
  args: {
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripePriceId: args.stripePriceId,
        stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
        status: args.status,
      });
      return existing._id;
    }

    return await ctx.db.insert("userSubscriptions", args);
  },
});
