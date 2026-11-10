import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const getCourses = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("courses")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();
    }
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});

export const getAllCoursesAdmin = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const getCourseById = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) return null;

    const modules = await ctx.db
      .query("modules")
      .withIndex("by_course_and_order", (q) => q.eq("courseId", args.courseId))
      .collect();

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_module_and_order", (q) => q.eq("moduleId", mod._id))
          .collect();
        return {
          ...mod,
          lessons,
        };
      })
    );

    return {
      ...course,
      modules: modulesWithLessons,
    };
  },
});

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    imageSrc: v.string(),
    category: v.string(),
    level: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    isPublished: v.boolean(),
    order: v.number(),
    tags: v.array(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { token, ...courseData } = args;
    return await ctx.db.insert("courses", courseData);
  },
});

