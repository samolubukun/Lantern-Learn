import Stripe from "stripe";

export const stripe = process.env.STRIPE_API_KEY
  ? new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : (null as unknown as Stripe);

export const isStripeConfigured = () => !!process.env.STRIPE_API_KEY;
