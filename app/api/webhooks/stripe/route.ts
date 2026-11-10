import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { OptionalStripeAdapter } from "@/lib/payments/stripe-adapter";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

const stripeAdapter = new OptionalStripeAdapter();

export async function POST(req: Request) {
  if (!stripeAdapter.isAvailable() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Stripe is disabled or unconfigured; webhook skipped." },
      { status: 200 }
    );
  }

  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  try {
    const result = await stripeAdapter.handleWebhook(body, signature);

    if (result?.userId && result.credits) {
      // Credit-based purchase fulfillment
      await convex.mutation(api.credits.addCredits, {
        userId: result.userId,
        amount: result.credits,
        description: `External Stripe top-up: ${result.credits} credits`,
        provider: "stripe",
        type: "purchase",
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
}
