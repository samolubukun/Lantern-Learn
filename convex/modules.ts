import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const getModulesByCourse = query({
  args: {
    courseId: v.optional(v.id("courses")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);

    let targetCourseId = args.courseId;

    if (!targetCourseId && userId) {
      const userProgress = await ctx.db
        .query("userProgress")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

      targetCourseId = userProgress?.activeCourseId;
    }

    if (!targetCourseId) {
      return [];
    }

    const modules = await ctx.db
      .query("modules")
      .withIndex("by_course_and_order", (q) => q.eq("courseId", targetCourseId!))
      .collect();

    modules.sort((a, b) => a.order - b.order);

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_module_and_order", (q) => q.eq("moduleId", mod._id))
          .collect();

        lessons.sort((a, b) => a.order - b.order);

        const lessonsWithStatus = await Promise.all(
          lessons.map(async (lesson) => {
            if (!userId) {
              return { ...lesson, completed: false, challenges: [] };
            }

            // Check direct lesson progress (for video/article/practice)
            const directProgress = await ctx.db
              .query("lessonProgress")
              .withIndex("by_user_and_lesson", (q) =>
                q.eq("userId", userId).eq("lessonId", lesson._id)
              )
              .first();

            if (directProgress?.completed) {
              return { ...lesson, completed: true, challenges: [] };
            }

            // For quiz type lessons, inspect challenges and challengeProgress
            const challenges = await ctx.db
              .query("challenges")
              .withIndex("by_lesson_and_order", (q) => q.eq("lessonId", lesson._id))
              .collect();

            if (challenges.length === 0) {
              return { ...lesson, completed: false, challenges: [] };
            }

            const challengeStatuses = await Promise.all(
              challenges.map(async (ch) => {
                const prog = await ctx.db
                  .query("challengeProgress")
                  .withIndex("by_user_and_challenge", (q) =>
                    q.eq("userId", userId).eq("challengeId", ch._id)
                  )
                  .first();
                return prog?.completed ?? false;
              })
            );

            const allChallengesCompleted =
              challengeStatuses.length > 0 &&
              challengeStatuses.every((status) => status === true);

            return {
              ...lesson,
              completed: allChallengesCompleted,
              challenges,
            };
          })
        );

        return {
          ...mod,
          lessons: lessonsWithStatus,
        };
      })
    );

    return modulesWithLessons;
  },
});
