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
    value: `STRIPE_PUBLISHABLE_KEY (live): pk_live_PLACEHOLDER_REPLACE_WITH_ACTUAL_KEY
STRIPE_SECRET_KEY (live): sk_live_PLACEHOLDER_REPLACE_WITH_ACTUAL_KEY
STRIPE_PUBLISHABLE_KEY_TEST (test): pk_test_PLACEHOLDER_REPLACE_WITH_ACTUAL_KEY
STRIPE_SECRET_KEY_TEST (test): sk_test_PLACEHOLDER_REPLACE_WITH_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET (optional): whsec_PLACEHOLDER_REPLACE_WITH_ACTUAL_SECRET`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-shopify",
    name: "Shopify Credentials",
    type: "shopify",
    environment: "live",
    encrypted: true,
    value: `SHOPIFY_STORE_DOMAIN: ds-llc-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN: shpat_PLACEHOLDER_REPLACE_WITH_ACTUAL_TOKEN
SHOPIFY_ADMIN_API_TOKEN: shpat_PLACEHOLDER_REPLACE_WITH_ACTUAL_TOKEN`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-amazon",
    name: "Amazon Credentials",
    type: "other",
    environment: "live",
    encrypted: true,
    value: `AMAZON_ASSOCIATE_TAG: dsllc-20
AMAZON_PAAPI_ACCESS_KEY: PLACEHOLDER_REPLACE_WITH_ACTUAL_ACCESS_KEY
AMAZON_PAAPI_SECRET_KEY: PLACEHOLDER_REPLACE_WITH_ACTUAL_SECRET_KEY`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-netlify",
    name: "Netlify Credentials",
    type: "other",
    environment: "live",
    encrypted: true,
    value: `NETLIFY_AUTH_TOKEN: nfp_PLACEHOLDER_REPLACE_WITH_ACTUAL_TOKEN
NETLIFY_SITE_ID: PLACEHOLDER_REPLACE_WITH_ACTUAL_SITE_ID`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  },
  {
    id: "cred-git",
    name: "Git Credentials",
    type: "other",
    environment: "live",
    encrypted: true,
    value: `GITHUB_TOKEN: ghp_PLACEHOLDER_REPLACE_WITH_ACTUAL_TOKEN
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
    value: `SUPABASE_URL: https://PLACEHOLDER_REPLACE_WITH_ACTUAL_PROJECT.supabase.co
SUPABASE_ANON_KEY: PLACEHOLDER_REPLACE_WITH_ACTUAL_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY: PLACEHOLDER_REPLACE_WITH_ACTUAL_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET: PLACEHOLDER_REPLACE_WITH_ACTUAL_JWT_SECRET
SUPABASE_DB_URL: postgresql://postgres:PLACEHOLDER_PASSWORD@db.PLACEHOLDER_PROJECT.supabase.co:5432/postgres`,
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
SMTP_PASSWORD: PLACEHOLDER_REPLACE_WITH_ACTUAL_PASSWORD
EMAIL_FROM: noreply@dsllc.com
EMAIL_ADMIN: ak@dsllc.com`,
    updatedAt: "2025-01-27T21:50:00.000Z"
  }
];
