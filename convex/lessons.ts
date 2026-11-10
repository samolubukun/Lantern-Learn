import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const getLesson = query({
  args: {
    lessonId: v.optional(v.id("lessons")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);

    let lessonId = args.lessonId;

    // If lessonId not provided, find the first uncompleted lesson in the user's active course
    if (!lessonId && userId) {
      const userProgress = await ctx.db
        .query("userProgress")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

      if (!userProgress?.activeCourseId) {
        return null;
      }

      const modules = await ctx.db
        .query("modules")
        .withIndex("by_course_and_order", (q) =>
          q.eq("courseId", userProgress.activeCourseId!)
        )
        .collect();

      modules.sort((a, b) => a.order - b.order);

      for (const mod of modules) {
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_module_and_order", (q) => q.eq("moduleId", mod._id))
          .collect();

        lessons.sort((a, b) => a.order - b.order);

        for (const les of lessons) {
          // Check direct progress first (from lessonProgress table)
          const directProgress = await ctx.db
            .query("lessonProgress")
            .withIndex("by_user_and_lesson", (q) =>
              q.eq("userId", userId).eq("lessonId", les._id)
            )
            .first();

          if (directProgress?.completed) {
            continue;
          }

          const challenges = await ctx.db
            .query("challenges")
            .withIndex("by_lesson_and_order", (q) => q.eq("lessonId", les._id))
            .collect();

          if (challenges.length === 0) {
            // Uncompleted article or video lesson
            lessonId = les._id;
            break;
          }

          let allCompleted = true;
          for (const ch of challenges) {
            const progress = await ctx.db
              .query("challengeProgress")
              .withIndex("by_user_and_challenge", (q) =>
                q.eq("userId", userId).eq("challengeId", ch._id)
              )
              .first();
            if (!progress?.completed) {
              allCompleted = false;
              break;
            }
          }

          if (!allCompleted) {
            lessonId = les._id;
            break;
          }
        }
        if (lessonId) break;
      }
    }

    if (!lessonId) {
      return null;
    }

    const lesson = await ctx.db.get(lessonId);
    if (!lesson) {
      return null;
    }

    // Find next and prev lessons in the same module
    const siblingLessons = await ctx.db
      .query("lessons")
      .withIndex("by_module_and_order", (q) => q.eq("moduleId", lesson.moduleId))
      .collect();
    siblingLessons.sort((a, b) => a.order - b.order);

    const currentIndex = siblingLessons.findIndex((l) => l._id === lesson._id);
    const nextLessonId =
      currentIndex >= 0 && currentIndex < siblingLessons.length - 1
        ? siblingLessons[currentIndex + 1]._id
        : null;
    const prevLessonId =
      currentIndex > 0 ? siblingLessons[currentIndex - 1]._id : null;

    const challenges = await ctx.db
      .query("challenges")
      .withIndex("by_lesson_and_order", (q) => q.eq("lessonId", lesson._id))
      .collect();

    challenges.sort((a, b) => a.order - b.order);

    const challengesWithOptions = await Promise.all(
      challenges.map(async (challenge) => {
        const options = await ctx.db
          .query("challengeOptions")
          .withIndex("by_challenge", (q) => q.eq("challengeId", challenge._id))
          .collect();

        let completed = false;
        if (userId) {
          const prog = await ctx.db
            .query("challengeProgress")
            .withIndex("by_user_and_challenge", (q) =>
              q.eq("userId", userId).eq("challengeId", challenge._id)
            )
            .first();
          completed = prog?.completed ?? false;
        }

        return {
          ...challenge,
          challengeOptions: options,
          completed,
        };
      })
    );

    let allCompleted = false;
    if (userId) {
      const directProgress = await ctx.db
        .query("lessonProgress")
        .withIndex("by_user_and_lesson", (q) =>
          q.eq("userId", userId).eq("lessonId", lesson._id)
        )
        .first();

      if (directProgress?.completed) {
        allCompleted = true;
      } else if (challengesWithOptions.length > 0) {
        allCompleted = challengesWithOptions.every((c) => c.completed);
      }
    } else if (challengesWithOptions.length > 0) {
      allCompleted = challengesWithOptions.every((c) => c.completed);
    }

    return {
      ...lesson,
      challenges: challengesWithOptions,
      completed: allCompleted,
      nextLessonId,
      prevLessonId,
    };
  },
});

export const completeLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    score: v.optional(v.number()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    const pointsEarned = 15;

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: true,
        score: args.score,
        completedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("lessonProgress", {
        userId,
        lessonId: args.lessonId,
        completed: true,
        score: args.score,
        completedAt: Date.now(),
      });
    }

    // Update user points and streak
    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (userProgress) {
      const today = new Date().toISOString().split("T")[0];
      let newStreak = userProgress.streakCount;
      if (userProgress.lastActiveDate !== today) {
        newStreak += 1;
      }

      await ctx.db.patch(userProgress._id, {
        points: userProgress.points + pointsEarned,
        streakCount: newStreak,
        lastActiveDate: today,
      });
    }

    return { success: true, pointsAwarded: pointsEarned };
  },
});
