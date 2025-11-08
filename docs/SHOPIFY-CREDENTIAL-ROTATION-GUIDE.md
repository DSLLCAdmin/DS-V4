# 🔐 Shopify API Credential Rotation Guide

## 🚨 **SECURITY ALERT**

Shopify has detected that API credentials were exposed in a public GitHub commit. This guide provides step-by-step instructions to:

1. **Rotate (regenerate) API credentials in Shopify**
2. **Update the codebase to use environment variables**
3. **Secure credentials going forward**

---

## 📋 **STEP 1: Rotate Credentials in Shopify Admin**

### **1.1 Access Shopify Admin**

1. Log in to your Shopify Admin: `https://wenugu-5b.myshopify.com/admin`
2. Navigate to: **Apps** → **Develop apps**
3. Find your app: **"DS Website Integration"** (or the app name you used)

### **1.2 Regenerate API Credentials**

**Option A: Create a New Custom App (Recommended)**

1. Click **"Create an app"**
2. Name: `DS Website Integration v2` (or similar)
3. Click **"Create app"**
4. Configure API scopes:
   - ✅ **Admin API access scopes:**
     - `read_products`, `write_products`
     - `read_orders`, `write_orders`
     - `read_customers`, `write_customers`
     - `read_inventory`, `write_inventory`
   - ✅ **Storefront API access scopes:**
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_read_checkouts`
     - `unauthenticated_write_checkouts`
     - `unauthenticated_write_customers`
5. Click **"Install app"**
6. **Copy the new credentials:**
   - **Storefront API access token** (starts with `shpat_` or similar)
   - **Admin API access token** (starts with `shpat_` or similar)

**Option B: Regenerate Existing App Credentials**

1. Click on your existing app: **"DS Website Integration"**
2. Go to **"API credentials"** tab
3. Click **"Regenerate"** next to the token you want to rotate
4. **⚠️ WARNING:** This will invalidate the old token immediately
5. **Copy the new credentials**

### **1.3 Delete the Old App (After Migration)**

Once you've verified the new credentials work:

1. Go to **Apps** → **Develop apps**
2. Find the old app (with exposed credentials)
3. Click **"Delete app"** or **"Uninstall app"**

---

## 📋 **STEP 2: Update Environment Variables**

### **2.1 Create/Update `.env.local` File**

1. **If `.env.local` doesn't exist:**
   ```bash
   # Copy the example template
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your new credentials:
   ```env
   SHOPIFY_STORE_DOMAIN=wenugu-5b.myshopify.com
   SHOPIFY_STOREFRONT_API_TOKEN=your_new_storefront_token_here
   SHOPIFY_ADMIN_API_TOKEN=your_new_admin_token_here
   SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_new_admin_token_here
   SHOPIFY_API_VERSION=2024-10
   ```

3. **Save the file** (it's already in `.gitignore`, so it won't be committed)

### **2.2 Update Netlify Environment Variables (Production)**

1. Go to **Netlify Dashboard**: `https://app.netlify.com`
2. Select your site: **DS_2** (or your site name)
3. Navigate to: **Site settings** → **Environment variables**
4. **Add or update these variables:**
   - `SHOPIFY_STORE_DOMAIN` = `wenugu-5b.myshopify.com`
   - `SHOPIFY_STOREFRONT_API_TOKEN` = `[your new storefront token]`
   - `SHOPIFY_ADMIN_API_TOKEN` = `[your new admin token]`
   - `SHOPIFY_ADMIN_API_ACCESS_TOKEN` = `[your new admin token]`
   - `SHOPIFY_API_VERSION` = `2024-10`
5. Click **"Save"**
6. **Trigger a new deployment** (or wait for the next Git push)

---

## 📋 **STEP 3: Verify Code Updates**

### **3.1 Files Already Updated**

The following files have been updated to use environment variables:

- ✅ `app/api/shopify/checkout/route.ts`
- ✅ `lib/shopify-product-sync.ts`
- ✅ `lib/product-audit.ts`
- ✅ `lib/shopify-dynamic-mapping.ts`

### **3.2 Scripts That Need Manual Updates**

The following scripts in the `scripts/` folder still have hardcoded credentials. They should be updated to use environment variables:

**Scripts to Update:**
- `scripts/test-mug-checkout.js`
- `scripts/check-printful-config.js`
- `scripts/query-products-via-storefront-api.js`
- `scripts/add-tags-to-products.js`
- `scripts/compare-working-vs-failing-products.js`
- `scripts/check-product-collections.js`
- `scripts/test-shopify-checkout.js`
- `scripts/check-product-images.js`
- `scripts/check-product-inventory.js`
- `scripts/publish-products-to-online-store.js`
- `scripts/check-storefront-api.js`
- `scripts/get-product-variant-id.js`
- `scripts/diagnose-shopify-variants.js`
- `scripts/list-all-shopify-products.js`
- `scripts/test-amazon-fba-integration.js`
- `scripts/configure-amazon-fba.js`
- `scripts/create-fulfillment-services.js`
- `scripts/test-all-8-books.js`
- `scripts/test-webhook-delivery.js`
- `scripts/configure-shopify-webhooks.js`

**Update Pattern:**

Replace hardcoded tokens like this:
```javascript
// OLD (INSECURE):
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_ADMIN_API_TOKEN = 'your_admin_api_token_here';

// NEW (SECURE):
const SHOPIFY_STOREFRONT_API_TOKEN = process.env.SHOPIFY_STOREFRONT_API_TOKEN || '';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '';
```

**For Node.js scripts**, you may need to load `.env.local`:
```javascript
// At the top of the script:
require('dotenv').config({ path: '.env.local' });
```

---

## 📋 **STEP 4: Test the Integration**

### **4.1 Test Locally**

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test checkout:**
   - Add a product to cart
   - Proceed to checkout
   - Verify checkout completes successfully

3. **Test product sync:**
   ```bash
   # If you have a sync script
   npm run shopify:sync
   ```

### **4.2 Test Production (After Netlify Deployment)**

1. Visit your live site
2. Test checkout flow
3. Verify orders are created in Shopify Admin

---

## 📋 **STEP 5: Respond to Shopify**

### **5.1 Email Response Template**

Reply to Shopify's email (`Ticket ID: 452c0314-6bbe-4345-8225-54552295351b`) with:

```
Subject: Re: Security Risk - Custom App DS Website Integration

Dear Shopify Ecosystem Governance Team,

Thank you for notifying us of the security risk involving our Custom App "DS Website Integration" on store wenugu-5b.myshopify.com.

We have taken the following actions to address this issue:

1. ✅ Identified and removed all hardcoded API credentials from our codebase
2. ✅ Migrated all API calls to use environment variables
3. ✅ Created new Custom App with new API credentials
4. ✅ Updated all environment variables in both local and production environments
5. ✅ Deleted the old Custom App with exposed credentials
6. ✅ Verified the integration is working correctly with new credentials

The exposed commit (cea5ea1e996091685b31f5d7140d9f0b014a6a1a) has been addressed, and we have implemented security best practices to prevent future credential exposure.

We confirm that we have received this message and have completed the credential rotation process.

Best regards,
[Your Name]
DS LLC
```

---

## 🔒 **SECURITY BEST PRACTICES GOING FORWARD**

### **✅ DO:**
- ✅ Always use environment variables for API credentials
- ✅ Keep `.env.local` in `.gitignore` (already done)
- ✅ Use `.env.local.example` as a template (never with real credentials)
- ✅ Rotate credentials periodically (every 6-12 months)
- ✅ Use different credentials for development and production
- ✅ Review commits before pushing to ensure no credentials are included

### **❌ DON'T:**
- ❌ Never hardcode credentials in source code
- ❌ Never commit `.env.local` to Git
- ❌ Never share credentials in chat, email, or documentation
- ❌ Never use production credentials in development
- ❌ Never leave credentials in commit history (use `git filter-branch` if needed)

---

## 📚 **ADDITIONAL RESOURCES**

- [Shopify: Rotating API credentials for admin-created apps](https://shopify.dev/docs/apps/auth/admin-app-access-tokens#rotating-credentials)
- [Shopify: API License and Terms of Use](https://www.shopify.com/legal/api-terms)
- [Next.js: Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify: Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

## ✅ **CHECKLIST**

- [ ] Created new Custom App in Shopify Admin
- [ ] Copied new Storefront API token
- [ ] Copied new Admin API token
- [ ] Updated `.env.local` with new credentials
- [ ] Updated Netlify environment variables
- [ ] Tested checkout locally
- [ ] Tested checkout on production
- [ ] Deleted old Custom App
- [ ] Responded to Shopify's email
- [ ] Verified no hardcoded credentials remain in codebase

---

**Last Updated:** November 7, 2025  
**Status:** ✅ Code updated to use environment variables  
**Next Steps:** Rotate credentials in Shopify Admin and update `.env.local`

