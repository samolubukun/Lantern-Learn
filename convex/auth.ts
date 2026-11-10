import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEFAULT_WELCOME_CREDITS = 100;

// Loads designated admin emails strictly from the environment variable (zero hardcoded emails)
function getEnvAdminEmails(): string[] {
  const envVal = process.env.ADMIN_EMAILS || "";
  return envVal
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isUserAdmin(user: { email: string; isAdmin?: boolean }): boolean {
  if (user.isAdmin) return true;
  return getEnvAdminEmails().includes(user.email.toLowerCase());
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + ":" + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateRandomHex(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const name = args.name.trim();

    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please provide a valid email address.",
      };
    }

    if (!name || name.length < 2) {
      return {
        success: false,
        error: "Name must be at least 2 characters.",
      };
    }

    if (!args.password || args.password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists. Please log in instead.",
      };
    }

    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(args.password, salt);
    const now = Date.now();

    const isAdmin = getEnvAdminEmails().includes(email);

    const userId = await ctx.db.insert("users", {
      name,
      email,
      passwordHash,
      salt,
      imageSrc: "/mascot.svg",
      createdAt: now,
      isAdmin,
    });

    // Automatically assign active course if any exists
    const firstCourse = await ctx.db
      .query("courses")
      .withIndex("by_order")
      .first();

    const today = new Date().toISOString().split("T")[0];

    // Initialize user progress with welcome credits
    await ctx.db.insert("userProgress", {
      userId: userId.toString(),
      userName: name,
      userImageSrc: "/mascot.svg",
      activeCourseId: firstCourse?._id,
      hearts: 5,
      points: 0,
      credits: DEFAULT_WELCOME_CREDITS,
      streakCount: 0,
      lastActiveDate: today,
    });

    // Record welcome credit grant transaction
    await ctx.db.insert("creditTransactions", {
      userId: userId.toString(),
      amount: DEFAULT_WELCOME_CREDITS,
      type: "grant",
      description: "Welcome bonus starter credits",
      provider: "welcome_grant",
      createdAt: now,
    });

    // Create session token
    const token = generateRandomHex(32);
    await ctx.db.insert("sessions", {
      token,
      userId: userId.toString(),
      expiresAt: now + SESSION_DURATION_MS,
    });

    return {
      success: true,
      token,
      user: {
        id: userId.toString(),
        name,
        email,
        imageSrc: "/mascot.svg",
        isAdmin,
      },
    };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password. Please verify your credentials and try again.",
      };
    }

    const computedHash = await hashPassword(args.password, user.salt);
    if (computedHash !== user.passwordHash) {
      return {
        success: false,
        error: "Invalid email or password. Please verify your credentials and try again.",
      };
    }

    const now = Date.now();
    const token = generateRandomHex(32);

    await ctx.db.insert("sessions", {
      token,
      userId: user._id.toString(),
      expiresAt: now + SESSION_DURATION_MS,
    });

    // Ensure userProgress exists
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id.toString()))
      .first();

    if (!progress) {
      const firstCourse = await ctx.db.query("courses").first();
      await ctx.db.insert("userProgress", {
        userId: user._id.toString(),
        userName: user.name,
        userImageSrc: user.imageSrc || "/mascot.svg",
        activeCourseId: firstCourse?._id,
        hearts: 5,
        points: 0,
        credits: DEFAULT_WELCOME_CREDITS,
        streakCount: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
      });
    }

    return {
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        imageSrc: user.imageSrc || "/mascot.svg",
        isAdmin: isUserAdmin(user),
      },
    };
  },
});

export const logout = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) return { success: true };

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

export const getCurrentUser = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    // Try finding in users table
    const allUsers = await ctx.db.query("users").collect();
    const user = allUsers.find((u) => u._id.toString() === session.userId);

    if (user) {
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        imageSrc: user.imageSrc || "/mascot.svg",
        isAdmin: isUserAdmin(user),
      };
    }

    // Fallback to userProgress
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", session.userId))
      .first();

    if (progress) {
      return {
        id: session.userId,
        name: progress.userName,
        email: "learner@lantern.io",
        imageSrc: progress.userImageSrc || "/mascot.svg",
      };
    }

    return null;
  },
});

export const grantAdminRole = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.trim().toLowerCase()))
      .first();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await ctx.db.patch(user._id, { isAdmin: true });
    return { success: true, message: `Admin privileges granted to ${args.email}` };
  },
});

// Ensure any existing user in database has admin privilege if none currently exists
export const ensureAdminExists = mutation({
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    if (allUsers.length === 0) return { updated: 0 };

    const hasAdmin = allUsers.some((u) => u.isAdmin);
    if (!hasAdmin) {
      // Grant to first user
      await ctx.db.patch(allUsers[0]._id, { isAdmin: true });
      return { updated: 1, email: allUsers[0].email };
    }

    return { updated: 0 };
  },
});

// Update user profile name and/or avatar image
export const updateProfile = mutation({
  args: {
    token: v.optional(v.string()),
    name: v.optional(v.string()),
    imageSrc: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const updates: { name?: string; imageSrc?: string } = {};

    if (args.name !== undefined) {
      const trimmed = args.name.trim();
      if (trimmed.length < 2) {
        return { success: false, error: "Name must be at least 2 characters long." };
      }
      updates.name = trimmed;
    }

    if (args.imageSrc !== undefined) {
      const trimmedImage = args.imageSrc.trim();
      if (!trimmedImage) {
        return { success: false, error: "Avatar image cannot be empty." };
      }
      updates.imageSrc = trimmedImage;
    }

    // 1. Update in users collection
    const allUsers = await ctx.db.query("users").collect();
    const userDoc = allUsers.find((u) => u._id.toString() === userId);
    if (userDoc) {
      await ctx.db.patch(userDoc._id, updates);
    }

    // 2. Synchronize to userProgress collection
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (progress) {
      const progressUpdates: { userName?: string; userImageSrc?: string } = {};
      if (updates.name) progressUpdates.userName = updates.name;
      if (updates.imageSrc) progressUpdates.userImageSrc = updates.imageSrc;
      await ctx.db.patch(progress._id, progressUpdates);
    }

    return {
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: userId,
        name: updates.name || userDoc?.name || "Learner",
        email: userDoc?.email || "",
        imageSrc: updates.imageSrc || userDoc?.imageSrc || "/mascot.svg",
        isAdmin: userDoc ? isUserAdmin(userDoc) : false,
      },
    };
  },
});

// Update account password with current password verification
export const updatePassword = mutation({
  args: {
    token: v.optional(v.string()),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.token);
    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    if (!args.newPassword || args.newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const allUsers = await ctx.db.query("users").collect();
    const userDoc = allUsers.find((u) => u._id.toString() === userId);
    if (!userDoc) {
      return { success: false, error: "User account not found." };
    }

    // Verify current password hash
    const currentHash = await hashPassword(args.currentPassword, userDoc.salt);
    if (currentHash !== userDoc.passwordHash) {
      return { success: false, error: "Current password is incorrect. Please try again." };
    }

    // Generate new salt and compute fresh password hash
    const newSalt = generateRandomHex(16);
    const newPasswordHash = await hashPassword(args.newPassword, newSalt);

    await ctx.db.patch(userDoc._id, {
      passwordHash: newPasswordHash,
      salt: newSalt,
    });

    return {
      success: true,
      message: "Password updated successfully.",
    };
  },
});


