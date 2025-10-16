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
    id: "cred-stripe",
    name: "Stripe Credentials",
    type: "stripe",
    environment: "live",
    encrypted: true,
    value: `STRIPE_PUBLISHABLE_KEY (live): [REDACTED - See admin credentials]
STRIPE_SECRET_KEY (live): [REDACTED - See admin credentials]
STRIPE_PUBLISHABLE_KEY_TEST (test): [REDACTED - See admin credentials]
STRIPE_SECRET_KEY_TEST (test): [REDACTED - See admin credentials]
STRIPE_WEBHOOK_SECRET (optional): [REDACTED - See admin credentials]`,
    updatedAt: "2025-01-27T22:15:00.000Z"
  },
  {
    id: "cred-shopify",
    name: "Shopify Credentials",
    type: "shopify",
    environment: "live",
    encrypted: true,
    value: `SHOPIFY_STORE_DOMAIN: wenugu-5b.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN: 42ec4a86d00bfb85a44c99bd24a4f5f2
SHOPIFY_ADMIN_API_TOKEN: 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
SHOPIFY_API_KEY: cc9488b381bdc80f155f9067dc683cf8
SHOPIFY_API_SECRET: 68b29ad001aa4c4cf5adc5db5f731db9
SHOPIFY_WEBHOOK_SECRET: 68b29ad001aa4c4cf5adc5db5f731db9`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-amazon",
    name: "Amazon Credentials",
    type: "other",
    environment: "live",
    encrypted: true,
    value: `AMAZON_ASSOCIATE_TAG: dsllc-20
AMAZON_PAAPI_ACCESS_KEY: AKIAIOSFODNN7EXAMPLE
AMAZON_PAAPI_SECRET_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-netlify",
    name: "Netlify Credentials",
    type: "other",
    environment: "live",
    encrypted: true,
    value: `NETLIFY_AUTH_TOKEN: nfp_1234567890abcdefghijKLMNOpqrstuvwxyZ01234567890
NETLIFY_SITE_ID: 12345678-90ab-cdef-1234-567890abcdef`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-git",
    name: "Git Credentials",
    type: "other",
    environment: "live",
    encrypted: true,
    value: `GITHUB_TOKEN: ghp_1234567890abcdefghijKLMNOpqrstuvwxyZ01234567890
GIT_USER_EMAIL: ak@dsllc.com
GIT_USER_NAME: A-Knox`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-supabase",
    name: "Supabase Credentials",
    type: "database",
    environment: "live",
    encrypted: true,
    value: `SUPABASE_URL: https://example.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3ODkwMTIzNCwiZXhwIjoxOTk0NTY3ODkwfQ.1234567890abcdefghijKLMNOpqrstuvwxyZ01234567890
SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjc4OTAxMjM0LCJleHAiOjE5OTQ1Njc4OTB9.1234567890abcdefghijKLMNOpqrstuvwxyZ01234567890
SUPABASE_JWT_SECRET: super-secret-jwt-key-1234567890abcdefghijKLMNOpqrstuvwxyZ01234567890
SUPABASE_DB_URL: postgresql://postgres:password@db.example.supabase.co:5432/postgres`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-dsllc-domain",
    name: "DS LLC Website Domain",
    type: "other",
    environment: "live",
    encrypted: false,
    value: `DOMAIN_NAME: dsllc.com
WWW_DOMAIN: www.dsllc.com
SSL_CERTIFICATE: Let's Encrypt (Auto-renewal)
DNS_PROVIDER: Netlify DNS`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-dsllc-email",
    name: "DS LLC Email Server",
    type: "email",
    environment: "live",
    encrypted: true,
    value: `SMTP_HOST: smtp.dsllc.com
SMTP_PORT: 587
SMTP_USERNAME: admin@dsllc.com
SMTP_PASSWORD: secure_email_password_12345
EMAIL_FROM: noreply@dsllc.com
EMAIL_ADMIN: ak@dsllc.com`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  }
];
