import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLeaderboard = query({
  args: {
    courseId: v.optional(v.id("courses")),
  },
  handler: async (ctx, args) => {
    let usersQuery = ctx.db
      .query("userProgress")
      .withIndex("by_points")
      .order("desc");

    const users = await usersQuery.take(50);

    const filtered = args.courseId
      ? users.filter((u) => u.activeCourseId === args.courseId).slice(0, 10)
      : users.slice(0, 10);

    return filtered.map((user) => ({
      userId: user.userId,
      userName: user.userName,
      userImageSrc: user.userImageSrc,
      points: user.points,
      streakCount: user.streakCount,
      activeCourseId: user.activeCourseId,
    }));
  },
});
