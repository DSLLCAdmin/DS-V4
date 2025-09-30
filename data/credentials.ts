export interface CredentialRecord {
  id: string;
  name: string;
  type: 'stripe' | 'shopify' | 'email' | 'database' | 'other';
  environment: 'test' | 'live';
  encrypted: boolean;
  value: string;
  lastUsed?: string;
  updatedAt: string;
}

// STATIC CREDENTIALS DATA - Like products.ts, this survives builds
export const credentials: CredentialRecord[] = [
  // Add your credentials here - they will persist across builds!
  // Example:
  // {
  //   id: "cred-001",
  //   name: "Stripe Live Key",
  //   type: "stripe",
  //   environment: "live",
  //   encrypted: true,
  //   value: "sk_live_your_stripe_key_here",
  //   updatedAt: "2025-09-29T21:45:00.000Z"
  // }
];
