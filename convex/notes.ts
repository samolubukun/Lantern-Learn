import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const getNote = query({
  args: {
    lessonId: v.id("lessons"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) return null;

    return await ctx.db
      .query("userNotes")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();
  },
});

export const saveNote = mutation({
  args: {
    lessonId: v.id("lessons"),
    content: v.string(),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("userNotes")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("userNotes", {
      userId,
      lessonId: args.lessonId,
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const getAllUserNotes = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) return [];

    const notes = await ctx.db.query("userNotes").collect();
    const userNotes = notes.filter((n) => n.userId === userId);

    const enriched = await Promise.all(
      userNotes.map(async (n) => {
        const lesson = await ctx.db.get(n.lessonId);
        let moduleTitle = "";
        let courseTitle = "";
        if (lesson) {
          const mod = await ctx.db.get(lesson.moduleId);
          if (mod) {
            moduleTitle = mod.title;
            const course = await ctx.db.get(mod.courseId);
            if (course) courseTitle = course.title;
          }
        }
        return {
          ...n,
          lessonTitle: lesson?.title || "Lesson",
          moduleTitle,
          courseTitle,
        };
      })
    );

    return enriched.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const deleteNote = mutation({
  args: {
    id: v.id("userNotes"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      throw new Error("Note not found or unauthorized");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
