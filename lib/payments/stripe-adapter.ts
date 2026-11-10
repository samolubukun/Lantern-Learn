import { PaymentProvider, CheckoutParams, CheckoutResult } from "./types";

export class OptionalStripeAdapter implements PaymentProvider {
  readonly id = "stripe";
  readonly name = "Stripe (Optional External Provider)";

  private getStripeClient() {
    if (!process.env.STRIPE_API_KEY) {
      return null;
    }
    try {
      // Dynamically require stripe only if key exists
      const Stripe = require("stripe");
      return new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: "2023-10-16",
        typescript: true,
      });
    } catch {
      return null;
    }
  }

  isAvailable(): boolean {
    return !!process.env.STRIPE_API_KEY;
  }

  async createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult> {
    const stripe = this.getStripeClient();

    if (!stripe) {
      // Graceful fallback to internal credit adapter
      const returnUrlObj = new URL(params.returnUrl, "http://localhost:3000");
      returnUrlObj.searchParams.set("provider_fallback", "stripe_not_configured");
      return {
        url: returnUrlObj.toString(),
        provider: this.id,
        simulated: true,
        message: "Stripe is not configured in this environment. Falling back to credit system.",
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: params.userEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: params.currency || "USD",
            product_data: {
              name: params.title,
              description: params.description || `${params.credits} Lantern Credits`,
            },
            unit_amount: params.priceInCents,
          },
        },
      ],
      metadata: {
        userId: params.userId,
        credits: params.credits.toString(),
      },
      success_url: `${params.returnUrl}?payment_status=success`,
      cancel_url: `${params.returnUrl}?payment_status=cancelled`,
    });

    return {
      url: session.url || params.returnUrl,
      sessionId: session.id,
      provider: this.id,
      simulated: false,
    };
  }

  async handleWebhook(
    rawBody: string,
    signature: string
  ): Promise<{
    event: string;
    userId?: string;
    credits?: number;
    status: string;
  } | null> {
    const stripe = this.getStripeClient();
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return null;
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      return {
        event: event.type,
        userId: session.metadata?.userId,
        credits: session.metadata?.credits ? parseInt(session.metadata.credits, 10) : undefined,
        status: "completed",
      };
    }

    return {
      event: event.type,
      status: "received",
    };
  }
}

