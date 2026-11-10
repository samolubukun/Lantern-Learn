/**
 * Lantern Application Error Handling & Sanitization
 *
 * Ensures all backend, network, and Convex errors are translated
 * into clean, user-friendly, production-grade notifications.
 * Never leaks raw server traces, request IDs, or unhandled exception prefixes.
 */

export function formatFriendlyErrorMessage(
  err: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!err) return fallback;

  const rawMessage = typeof err === "string" ? err : (err as any)?.message || String(err);

  // If the message contains a Convex uncaught error wrapper:
  // e.g. "[CONVEX M(auth:login)] [Request ID: ...] Server Error Uncaught Error: Invalid email or password at handler (../convex/auth.ts:134:25) Called by client"
  if (rawMessage.includes("Uncaught Error:")) {
    const after = rawMessage.split("Uncaught Error:")[1];
    if (after) {
      const clean = after
        .split(/at\s+(?:handler|async|Object|\w+)/i)[0]
        .split("Called by")[0]
        .replace(/\[Request ID:[^\]]+\]/gi, "")
        .trim();
      if (clean) {
        return humanizeError(clean);
      }
    }
  }

  // If the message contains a generic Server Error prefix
  if (rawMessage.includes("Server Error")) {
    const after = rawMessage.split("Server Error")[1];
    if (after) {
      const clean = after
        .replace(/^[:\s-]+/, "")
        .replace(/^Error:\s*/i, "")
        .split(/at\s+(?:handler|async|Object|\w+)/i)[0]
        .split("Called by")[0]
        .replace(/\[Request ID:[^\]]+\]/gi, "")
        .trim();
      if (clean) {
        return humanizeError(clean);
      }
    }
  }

  // Strip any leading [CONVEX ...] or bracket tags if present
  let sanitized = rawMessage
    .replace(/^\[CONVEX[^\]]*\]\s*/gi, "")
    .replace(/^\[Request ID:[^\]]*\]\s*/gi, "")
    .replace(/^Error:\s*/i, "")
    .split("Called by")[0]
    .trim();

  return humanizeError(sanitized, fallback);
}

function humanizeError(msg: string, fallback = "An unexpected error occurred. Please try again."): string {
  const lower = msg.toLowerCase();

  if (lower.includes("invalid email or password") || lower.includes("invalid credentials")) {
    return "Invalid email or password. Please verify your credentials and try again.";
  }

  if (lower.includes("already exists") || lower.includes("email already in use")) {
    return "An account with this email address already exists. Please log in instead.";
  }

  if (lower.includes("password must be at least")) {
    return "Password must be at least 6 characters long.";
  }

  if (lower.includes("valid email address") || lower.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  if (lower.includes("user not found") || lower.includes("account not found")) {
    return "No account found with this email address.";
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("websocket")
  ) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  if (lower.includes("timed out") || lower.includes("timeout")) {
    return "Connection timed out. Please check your network connection and try again.";
  }

  if (lower.includes("unauthorized") || lower.includes("not authenticated")) {
    return "You must be signed in to perform this action.";
  }

  if (lower.includes("not enough hearts") || lower.includes("energy depleted")) {
    return "You don't have enough focus energy. Practice lessons or refill in the shop!";
  }

  if (lower.includes("not enough points") || lower.includes("insufficient points")) {
    return "You don't have enough points for this purchase.";
  }

  if (lower.includes("not enough credits") || lower.includes("insufficient credits")) {
    return "You don't have enough credits for this upgrade.";
  }

  // If it's a short clean sentence without technical stack traces, return it
  if (!msg.includes("at ") && !msg.includes("[") && msg.length <= 140) {
    return msg;
  }

  return fallback;
}

