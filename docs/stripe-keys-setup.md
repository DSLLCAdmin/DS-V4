# Stripe Live API Keys Setup

## 🔑 **Get Real Stripe Live Keys**

The current credentials file has placeholder keys. We need the actual live keys from Stripe dashboard.

### **Steps to Get Live Keys:**

#### **1. Access Stripe Dashboard**
- Go to: `https://dashboard.stripe.com/`
- Login with DS LLC account

#### **2. Get API Keys**
- Go to: **Developers** → **API keys**
- Copy the **Publishable key** (starts with `pk_live_`)
- Copy the **Secret key** (starts with `sk_live_`)

#### **3. Update Credentials**
Replace the placeholder values in `data/credentials.ts`:

```typescript
// Replace these placeholder values:
STRIPE_PUBLISHABLE_KEY (live): pk_live_51Oq01aJ21234567890abcdefghijKLMNOpqrstuvwxyZ01234567890
STRIPE_SECRET_KEY (live): sk_live_51Oq01aJ21234567890abcdefghijKLMNOpqrstuvwxyZ01234567890

// With actual keys from Stripe dashboard:
STRIPE_PUBLISHABLE_KEY (live): pk_live_[ACTUAL_KEY_FROM_DASHBOARD]
STRIPE_SECRET_KEY (live): sk_live_[ACTUAL_KEY_FROM_DASHBOARD]
```

#### **4. Test API Access**
After updating, test with:
```bash
node scripts/test-live-integration.js
```

### **Current Status:**
- ✅ Mercury account configured in Stripe
- ✅ Live mode enabled
- ❌ Need real API keys for testing
