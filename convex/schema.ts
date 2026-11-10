import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Native Email & Password Authentication
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    imageSrc: v.string(),
    createdAt: v.number(),
    isAdmin: v.optional(v.boolean()),
    role: v.optional(v.string()),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    token: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  // 1. Courses Catalog (Languages, Tech, Business, etc.)
  courses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageSrc: v.string(),
    category: v.string(), // "languages", "technology", "business", etc.
    level: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    isPublished: v.boolean(),
    order: v.number(),
    tags: v.array(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"]),

  // 2. Course Modules / Units
  modules: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  }).index("by_course_and_order", ["courseId", "order"]),

  // 3. Multi-Modal Lessons
  lessons: defineTable({
    moduleId: v.id("modules"),
    title: v.string(),
    order: v.number(),
    type: v.union(
      v.literal("quiz"),
      v.literal("video"),
      v.literal("article"),
      v.literal("practice")
    ),
    estimatedMinutes: v.number(),
    content: v.optional(
      v.object({
        videoUrl: v.optional(v.string()),
        audioUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        markdown: v.optional(v.string()),
        transcript: v.optional(v.string()),
        resources: v.optional(
          v.array(
            v.object({
              title: v.string(),
              url: v.string(),
              type: v.string(),
            })
          )
        ),
      })
    ),
  }).index("by_module_and_order", ["moduleId", "order"]),

  // 4. Challenges & Interactive Questions
  challenges: defineTable({
    lessonId: v.id("lessons"),
    type: v.union(v.literal("SELECT"), v.literal("ASSIST")),
    question: v.string(),
    order: v.number(),
  }).index("by_lesson_and_order", ["lessonId", "order"]),

  // 5. Challenge Options
  challengeOptions: defineTable({
    challengeId: v.id("challenges"),
    text: v.string(),
    correct: v.boolean(),
    imageSrc: v.optional(v.string()),
    audioSrc: v.optional(v.string()),
  }).index("by_challenge", ["challengeId"]),

  // 6. User Profile & Universal Gamification Progress + Credits
  userProgress: defineTable({
    userId: v.string(), // User Account ID or Session Identifier
    userName: v.string(),
    userImageSrc: v.string(),
    activeCourseId: v.optional(v.id("courses")),
    hearts: v.number(),
    points: v.number(),
    credits: v.optional(v.number()), // Credit-based balance (default seeded on start)
    proExpiresAt: v.optional(v.number()), // Timestamp for Pro membership access
    streakCount: v.number(),
    lastActiveDate: v.string(), // YYYY-MM-DD
  })
    .index("by_userId", ["userId"])
    .index("by_points", ["points"]),

  // 7. Credit Ledger / Transactions
  creditTransactions: defineTable({
    userId: v.string(),
    amount: v.number(), // positive for addition/bonus, negative for spent
    type: v.union(
      v.literal("grant"),
      v.literal("purchase"),
      v.literal("spend"),
      v.literal("bonus")
    ),
    description: v.string(),
    provider: v.optional(v.string()), // "credits_system", "stripe", "manual_promo", etc.
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // 8. Lesson Completion & Progress (Video timestamp, article read, etc.)
  lessonProgress: defineTable({
    userId: v.string(),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    lastPositionSeconds: v.optional(v.number()),
    score: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_user_and_lesson", ["userId", "lessonId"])
    .index("by_user", ["userId"]),

  // 9. Challenge Progress
  challengeProgress: defineTable({
    userId: v.string(),
    challengeId: v.id("challenges"),
    completed: v.boolean(),
  })
    .index("by_user_and_challenge", ["userId", "challengeId"])
    .index("by_user", ["userId"]),

  // 10. LXP Skill Matrix & Competency Tracking
  skills: defineTable({
    title: v.string(),
    category: v.string(),
    icon: v.optional(v.string()),
  }),

  userSkills: defineTable({
    userId: v.string(),
    skillId: v.id("skills"),
    level: v.number(), // 1 to 5
    xp: v.number(),
  }).index("by_user_and_skill", ["userId", "skillId"]),

  // 11. Notes & Notebook per Lesson
  userNotes: defineTable({
    userId: v.string(),
    lessonId: v.id("lessons"),
    content: v.string(),
    updatedAt: v.number(),
  }).index("by_user_and_lesson", ["userId", "lessonId"]),

  // 12. Optional External Subscriptions (Pluggable providers: Stripe, LemonSqueezy, etc.)
  userSubscriptions: defineTable({
    userId: v.string(),
    provider: v.optional(v.string()), // "stripe", "mock", "lemonsqueezy"
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    status: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),
});
