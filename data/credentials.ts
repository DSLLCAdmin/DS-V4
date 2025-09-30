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
  {
    id: "cred-test-1",
    name: "Test Credential 1",
    type: "stripe",
    environment: "live",
    encrypted: true,
    value: "sk_live_test_key_12345",
    updatedAt: "2025-09-29T21:50:00.000Z"
  },
  {
    id: "cred-test-2", 
    name: "Test Credential 2",
    type: "shopify",
    environment: "test",
    encrypted: false,
    value: "shpat_test_token_67890",
    updatedAt: "2025-09-29T21:50:00.000Z"
  }
];
