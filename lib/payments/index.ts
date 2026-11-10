import { PaymentProvider } from "./types";
import { LanternCreditAdapter } from "./credit-adapter";
import { OptionalStripeAdapter } from "./stripe-adapter";

export * from "./types";
export { LanternCreditAdapter } from "./credit-adapter";
export { OptionalStripeAdapter } from "./stripe-adapter";

class PaymentManager {
  private providers = new Map<string, PaymentProvider>();

  constructor() {
    this.register(new LanternCreditAdapter());
    this.register(new OptionalStripeAdapter());
  }

  register(provider: PaymentProvider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(preferredId?: string): PaymentProvider {
    // 1. If explicit provider requested and available, use it
    if (preferredId && this.providers.has(preferredId)) {
      const p = this.providers.get(preferredId)!;
      if (p.isAvailable()) return p;
    }

    // 2. Check environment config PAYMENT_PROVIDER
    const envProvider = process.env.PAYMENT_PROVIDER;
    if (envProvider && this.providers.has(envProvider)) {
      const p = this.providers.get(envProvider)!;
      if (p.isAvailable()) return p;
    }

    // 3. Fallback to default Lantern Credit System (always available)
    return this.providers.get("credit")!;
  }

  listAvailableProviders(): { id: string; name: string }[] {
    return Array.from(this.providers.values())
      .filter((p) => p.isAvailable())
      .map((p) => ({ id: p.id, name: p.name }));
  }
}

export const paymentManager = new PaymentManager();

export const getPaymentAdapter = (preferredId?: string) => {
  return paymentManager.getProvider(preferredId);
};

