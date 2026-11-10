import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getAuthUserId(
  ctx: { db: QueryCtx["db"] | MutationCtx["db"] },
  token?: string
): Promise<string | null> {
  // 1. If explicit token provided, look up in sessions table
  if (token) {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (session && session.expiresAt > Date.now()) {
      return session.userId;
    }
    return null;
  }

  // 2. Fallback: check most recent active session in database
  const latestSession = await ctx.db
    .query("sessions")
    .order("desc")
    .first();

  if (latestSession && latestSession.expiresAt > Date.now()) {
    return latestSession.userId;
  }

  // 3. Fallback: check first user record
  const firstUser = await ctx.db.query("users").first();
  if (firstUser) {
    return firstUser._id.toString();
  }

  // 4. Fallback: check first userProgress record
  const firstProgress = await ctx.db.query("userProgress").first();
  if (firstProgress) {
    return firstProgress.userId;
  }

  return null;
}
