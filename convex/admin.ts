import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// =========================================================================
// 1. HIGH-LEVEL PLATFORM OVERVIEW & METRICS
// =========================================================================

export const getAdminOverview = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    const modules = await ctx.db.query("modules").collect();
    const lessons = await ctx.db.query("lessons").collect();
    const challenges = await ctx.db.query("challenges").collect();
    const users = await ctx.db.query("users").collect();
    const progresses = await ctx.db.query("userProgress").collect();

    const totalXp = progresses.reduce((acc, p) => acc + (p.points || 0), 0);
    const totalCreditsGranted = progresses.reduce((acc, p) => acc + (p.credits || 0), 0);
    const adminCount = users.filter((u) => u.isAdmin).length;

    // Build course summaries with lesson counts
    const coursesSummary = courses.map((course) => {
      const courseModules = modules.filter((m) => m.courseId === course._id);
      const moduleIds = courseModules.map((m) => m._id);
      const courseLessons = lessons.filter((l) => moduleIds.includes(l.moduleId));
      return {
        ...course,
        id: course._id,
        modulesCount: courseModules.length,
        lessonsCount: courseLessons.length,
      };
    });

    return {
      metrics: {
        totalLearners: users.length || progresses.length,
        adminCount,
        totalCourses: courses.length,
        totalModules: modules.length,
        totalLessons: lessons.length,
        totalChallenges: challenges.length,
        totalXp,
        totalCreditsGranted,
      },
      courses: coursesSummary,
      recentUsers: users
        .slice(-6)
        .reverse()
        .map((u) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          imageSrc: u.imageSrc || "/mascot.svg",
          isAdmin: !!u.isAdmin,
          createdAt: u.createdAt,
        })),
    };
  },
});

// =========================================================================
// 2. CURRICULUM HIERARCHY (COURSES -> MODULES -> LESSONS -> CHALLENGES)
// =========================================================================

export const getAdminCurriculum = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    const modules = await ctx.db.query("modules").collect();
    const lessons = await ctx.db.query("lessons").collect();
    const challenges = await ctx.db.query("challenges").collect();

    return courses.map((course) => {
      const courseModules = modules
        .filter((m) => m.courseId === course._id)
        .sort((a, b) => a.order - b.order)
        .map((mod) => {
          const modLessons = lessons
            .filter((l) => l.moduleId === mod._id)
            .sort((a, b) => a.order - b.order)
            .map((les) => {
              const lesChallenges = challenges
                .filter((c) => c.lessonId === les._id)
                .sort((a, b) => a.order - b.order);
              return {
                ...les,
                id: les._id,
                challengesCount: lesChallenges.length,
              };
            });

          return {
            ...mod,
            id: mod._id,
            lessons: modLessons,
          };
        });

      return {
        ...course,
        id: course._id,
        modules: courseModules,
      };
    });
  },
});

// =========================================================================
// 3. LEARNERS & ACCOUNTS DIRECTORY
// =========================================================================

export const getAdminLearners = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const progresses = await ctx.db.query("userProgress").collect();

    return users.map((user) => {
      const progress = progresses.find(
        (p) => p.userId === user._id.toString() || p.userId === user.email
      );

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        imageSrc: user.imageSrc || "/mascot.svg",
        isAdmin: !!user.isAdmin,
        createdAt: user.createdAt,
        points: progress?.points ?? 0,
        credits: progress?.credits ?? 100,
        hearts: progress?.hearts ?? 5,
        streakCount: progress?.streakCount ?? 0,
      };
    });
  },
});

// =========================================================================
// 4. CHALLENGE / QUESTION BANK
// =========================================================================

export const getAdminChallengesWithDetails = query({
  handler: async (ctx) => {
    const challenges = await ctx.db.query("challenges").collect();
    const options = await ctx.db.query("challengeOptions").collect();
    const lessons = await ctx.db.query("lessons").collect();

    return challenges.map((ch) => {
      const chOptions = options.filter((o) => o.challengeId === ch._id);
      const lesson = lessons.find((l) => l._id === ch.lessonId);
      return {
        ...ch,
        id: ch._id,
        lessonTitle: lesson?.title || "Unknown Lesson",
        options: chOptions.map((o) => ({ ...o, id: o._id })),
      };
    });
  },
});

// =========================================================================
// 5. COURSE MUTATIONS
// =========================================================================

export const createAdminCourse = mutation({
  args: {
    title: v.string(),
    imageSrc: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    level: v.optional(
      v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))
    ),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const courses = await ctx.db.query("courses").collect();
    const id = await ctx.db.insert("courses", {
      title: args.title.trim(),
      imageSrc: args.imageSrc.trim() || "/track_engineering.svg",
      description: args.description?.trim() || "",
      category: args.category?.trim().toLowerCase() || "engineering",
      level: args.level || "beginner",
      isPublished: args.isPublished ?? true,
      order: courses.length + 1,
      tags: [args.category?.toLowerCase() || "engineering"],
    });

    return { success: true, id };
  },
});

export const updateAdminCourse = mutation({
  args: {
    id: v.id("courses"),
    title: v.optional(v.string()),
    imageSrc: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    level: v.optional(
      v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))
    ),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return { success: true, id };
  },
});

export const toggleCoursePublished = mutation({
  args: {
    id: v.id("courses"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isPublished: args.isPublished });
    return { success: true };
  },
});

export const deleteAdminCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    // Also cleanup modules, lessons, challenges associated with this course
    const modules = await ctx.db
      .query("modules")
      .withIndex("by_course_and_order", (q) => q.eq("courseId", args.id))
      .collect();

    for (const mod of modules) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_module_and_order", (q) => q.eq("moduleId", mod._id))
        .collect();

      for (const les of lessons) {
        const challenges = await ctx.db
          .query("challenges")
          .withIndex("by_lesson_and_order", (q) => q.eq("lessonId", les._id))
          .collect();

        for (const ch of challenges) {
          const options = await ctx.db
            .query("challengeOptions")
            .withIndex("by_challenge", (q) => q.eq("challengeId", ch._id))
            .collect();
          for (const opt of options) {
            await ctx.db.delete(opt._id);
          }
          await ctx.db.delete(ch._id);
        }
        await ctx.db.delete(les._id);
      }
      await ctx.db.delete(mod._id);
    }

    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

// =========================================================================
// 6. MODULE (UNIT) MUTATIONS
// =========================================================================

export const createAdminModule = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("modules")
      .withIndex("by_course_and_order", (q) => q.eq("courseId", args.courseId))
      .collect();

    const id = await ctx.db.insert("modules", {
      courseId: args.courseId,
      title: args.title.trim(),
      description: args.description.trim(),
      order: existing.length + 1,
    });

    return { success: true, id };
  },
});

export const updateAdminModule = mutation({
  args: {
    id: v.id("modules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return { success: true, id };
  },
});

export const deleteAdminModule = mutation({
  args: { id: v.id("modules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

// =========================================================================
// 7. LESSON MUTATIONS
// =========================================================================

export const createAdminLesson = mutation({
  args: {
    moduleId: v.id("modules"),
    title: v.string(),
    type: v.union(
      v.literal("quiz"),
      v.literal("video"),
      v.literal("article"),
      v.literal("practice")
    ),
    estimatedMinutes: v.number(),
    markdown: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("lessons")
      .withIndex("by_module_and_order", (q) => q.eq("moduleId", args.moduleId))
      .collect();

    const id = await ctx.db.insert("lessons", {
      moduleId: args.moduleId,
      title: args.title.trim(),
      type: args.type,
      estimatedMinutes: args.estimatedMinutes || 5,
      order: existing.length + 1,
      content: {
        markdown: args.markdown || "",
        videoUrl: args.videoUrl || "",
      },
    });

    return { success: true, id };
  },
});

export const updateAdminLesson = mutation({
  args: {
    id: v.id("lessons"),
    title: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("quiz"),
        v.literal("video"),
        v.literal("article"),
        v.literal("practice")
      )
    ),
    estimatedMinutes: v.optional(v.number()),
    markdown: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.id);
    if (!lesson) return { success: false, error: "Lesson not found" };

    const patch: any = {};
    if (args.title) patch.title = args.title.trim();
    if (args.type) patch.type = args.type;
    if (args.estimatedMinutes !== undefined) patch.estimatedMinutes = args.estimatedMinutes;

    if (args.markdown !== undefined || args.videoUrl !== undefined) {
      patch.content = {
        ...lesson.content,
        markdown: args.markdown !== undefined ? args.markdown : lesson.content?.markdown,
        videoUrl: args.videoUrl !== undefined ? args.videoUrl : lesson.content?.videoUrl,
      };
    }

    await ctx.db.patch(args.id, patch);
    return { success: true, id: args.id };
  },
});

export const deleteAdminLesson = mutation({
  args: { id: v.id("lessons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

// =========================================================================
// 8. CHALLENGE & OPTION MUTATIONS
// =========================================================================

export const createAdminChallenge = mutation({
  args: {
    lessonId: v.id("lessons"),
    question: v.string(),
    type: v.union(v.literal("SELECT"), v.literal("ASSIST")),
    options: v.array(
      v.object({
        text: v.string(),
        correct: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("challenges")
      .withIndex("by_lesson_and_order", (q) => q.eq("lessonId", args.lessonId))
      .collect();

    const challengeId = await ctx.db.insert("challenges", {
      lessonId: args.lessonId,
      question: args.question.trim(),
      type: args.type,
      order: existing.length + 1,
    });

    for (const opt of args.options) {
      await ctx.db.insert("challengeOptions", {
        challengeId,
        text: opt.text.trim(),
        correct: opt.correct,
      });
    }

    return { success: true, id: challengeId };
  },
});

export const deleteAdminChallenge = mutation({
  args: { id: v.id("challenges") },
  handler: async (ctx, args) => {
    const options = await ctx.db
      .query("challengeOptions")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.id))
      .collect();

    for (const opt of options) {
      await ctx.db.delete(opt._id);
    }

    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

// =========================================================================
// 9. LEARNER ADMIN MUTATIONS
// =========================================================================

export const toggleUserAdminRole = mutation({
  args: {
    userId: v.string(),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    const allUsers = await ctx.db.query("users").collect();
    const user = allUsers.find((u) => u._id.toString() === args.userId || u.email === args.userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await ctx.db.patch(user._id, { isAdmin: args.isAdmin });
    return { success: true, isAdmin: args.isAdmin };
  },
});

export const grantLearnerCredits = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!progress) {
      return { success: false, error: "Learner progress not found" };
    }

    const newCredits = (progress.credits || 0) + args.amount;
    await ctx.db.patch(progress._id, { credits: newCredits });

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      amount: args.amount,
      type: "grant",
      description: `Admin manual grant of ${args.amount} credits`,
      createdAt: Date.now(),
    });

    return { success: true, credits: newCredits };
  },
});

// Backward compatibility queries for REST if needed
export const getAdminCourses = query({
  handler: async (ctx) => {
    const list = await ctx.db.query("courses").collect();
    return list.map((c) => ({ ...c, id: c._id }));
  },
});

export const getAdminCourseById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) return null;
    return { ...course, id: course._id };
  },
});

export const getAdminUnits = query({
  handler: async (ctx) => {
    const list = await ctx.db.query("modules").collect();
    return list.map((m) => ({ ...m, id: m._id }));
  },
});

export const getAdminLessons = query({
  handler: async (ctx) => {
    const list = await ctx.db.query("lessons").collect();
    return list.map((l) => ({ ...l, id: l._id }));
  },
});

export const getAdminChallenges = query({
  handler: async (ctx) => {
    const list = await ctx.db.query("challenges").collect();
    return list.map((ch) => ({ ...ch, id: ch._id }));
  },
});

export const getAdminChallengeOptions = query({
  handler: async (ctx) => {
    const list = await ctx.db.query("challengeOptions").collect();
    return list.map((co) => ({ ...co, id: co._id }));
  },
});
