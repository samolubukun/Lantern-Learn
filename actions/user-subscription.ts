"use server";

import { getPaymentAdapter } from "@/lib/payments";
import { absoluteUrl } from "@/lib/utils";

const returnUrl = absoluteUrl("/shop");

export const createCheckoutUrl = async (params?: {
  credits?: number;
  priceInCents?: number;
  title?: string;
  providerId?: string;
  userId?: string;
  userEmail?: string;
}) => {
  const credits = params?.credits ?? 100;
  const priceInCents = params?.priceInCents ?? 999;
  const title = params?.title ?? `${credits} Lantern Credits`;
  const userId = params?.userId || "lantern_learner";
  const userEmail = params?.userEmail || "learner@lantern.io";

  const adapter = getPaymentAdapter(params?.providerId);

  const session = await adapter.createCheckoutSession({
    userId,
    userEmail,
    credits,
    priceInCents,
    title,
    returnUrl,
  });

  return { data: session.url, simulated: session.simulated, message: session.message };
};

// Backwards-compatible alias for existing components
export const createStripeUrl = async () => {
  return createCheckoutUrl();
};
