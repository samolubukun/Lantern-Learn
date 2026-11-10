export type CheckoutParams = {
  userId: string;
  userEmail?: string;
  credits: number;
  priceInCents: number;
  currency?: string;
  title: string;
  description?: string;
  returnUrl: string;
};

export type CheckoutResult = {
  url: string;
  sessionId?: string;
  provider: string;
  simulated?: boolean;
  message?: string;
};

export interface PaymentProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): boolean;
  createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult>;
  handleWebhook?(
    rawBody: string,
    signature: string
  ): Promise<{
    event: string;
    userId?: string;
    credits?: number;
    status: string;
  } | null>;
}

