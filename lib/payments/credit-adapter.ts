import { PaymentProvider, CheckoutParams, CheckoutResult } from "./types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export class LanternCreditAdapter implements PaymentProvider {
  readonly id = "credit";
  readonly name = "Lantern Credit System";

  isAvailable(): boolean {
    return true; // Always available as the core platform engine
  }

  async createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult> {
    // When using the default credit adapter, grant credits directly
    await convex.mutation(api.credits.addCredits, {
      userId: params.userId,
      amount: params.credits,
      description: `Purchased package: ${params.title} (${params.credits} credits)`,
      provider: "lantern_credit_engine",
      type: "purchase",
    });

    const returnUrlObj = new URL(params.returnUrl, "http://localhost:3000");
    returnUrlObj.searchParams.set("credit_purchase", "success");
    returnUrlObj.searchParams.set("credits_added", params.credits.toString());

    return {
      url: returnUrlObj.toString(),
      sessionId: `credit_txn_${Date.now()}_${params.userId}`,
      provider: this.id,
      simulated: true,
      message: `Successfully credited ${params.credits} Lantern credits!`,
    };
  }
}

