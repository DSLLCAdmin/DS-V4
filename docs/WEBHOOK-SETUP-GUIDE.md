# 🔔 Shopify Webhook Setup Guide

## 📋 **Understanding Webhook Credentials**

**Important:** The webhook secret is **NOT** automatically generated when you create a Shopify Custom App. It's created separately when you configure webhook subscriptions.

### **Why Webhooks Are Separate:**

1. **Webhooks are optional** - They're only needed if you want real-time notifications (e.g., order creation, inventory updates)
2. **Webhook secret is generated when you create a webhook subscription** - Not when you create the app
3. **You can use any secure string** - The webhook secret is used to verify that webhook requests are actually coming from Shopify

---

## 🔧 **Step 1: Determine If You Need Webhooks**

### **Current Webhook Usage in DS LLC:**

The codebase has webhook endpoints set up for:
- ✅ Order creation (`/api/webhooks/shopify/orders/`)
- ✅ Order updates (`/api/webhooks/shopify/orders/`)

**However:** These are currently **optional** and not critical for basic checkout functionality.

### **Do You Need Webhooks?**

**YES, if you want:**
- Real-time order notifications
- Automatic inventory sync
- Order status updates in your admin dashboard
- Automated fulfillment triggers

**NO, if:**
- You only need basic checkout functionality
- You manually check orders in Shopify Admin
- You don't need real-time notifications

---

## 🔧 **Step 2: Configure Webhooks in Shopify (If Needed)**

### **Option A: Configure via Shopify Admin (Recommended)**

1. **Go to Shopify Admin:**
   - Navigate to: **Settings** → **Notifications**
   - Or: **Apps** → **Develop apps** → **[Your App]** → **Webhooks**

2. **Create Webhook Subscription:**
   - Click **"Create webhook"**
   - **Event:** Select the event (e.g., "Order creation", "Order update")
   - **Format:** JSON
   - **URL:** `https://your-domain.com/api/webhooks/shopify/orders/`
   - Click **"Save webhook"**

3. **Generate Webhook Secret:**
   - Shopify will show you a **webhook signing secret** (or you can generate your own)
   - **Copy this secret** - you'll need it for environment variables

### **Option B: Use the Configuration Script**

The codebase includes a script to configure webhooks programmatically:

```bash
# Update the script with your credentials first
node scripts/configure-shopify-webhooks.js
```

**Before running, update the script:**
- Set `SHOPIFY_ACCESS_TOKEN` (use your Admin API token)
- Set `WEBHOOK_BASE_URL` (your production domain)

---

## 🔧 **Step 3: Set Webhook Secret in Environment Variables**

### **Local Development (`.env.local`):**

```env
# Webhook Secret (optional - only if using webhooks)
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here
```

### **Production (Netlify):**

1. Go to **Netlify Dashboard** → **Site settings** → **Environment variables**
2. Add: `SHOPIFY_WEBHOOK_SECRET` = `[your webhook secret]`

---

## 🔧 **Step 4: Generate Your Own Webhook Secret (Alternative)**

If Shopify doesn't provide a webhook secret, you can generate your own:

### **Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Using Online Generator:**
- Use any secure random string generator
- Minimum 32 characters recommended
- Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

---

## ✅ **Current Status**

### **Files Updated:**

- ✅ `app/api/webhooks/shopify/orders/route.ts` - Now uses environment variable
- ✅ `shopify-env-example.txt` - Includes webhook secret template

### **What You Have (4 of 5):**

1. ✅ **Storefront API Token** - For checkout/product queries
2. ✅ **Admin API Token** - For product management
3. ✅ **Store Domain** - `wenugu-5b.myshopify.com`
4. ✅ **API Version** - `2024-10`
5. ⚠️ **Webhook Secret** - **OPTIONAL** - Only needed if using webhooks

---

## 📝 **Recommendation**

### **For Now (Immediate):**

1. **Skip webhook setup** if you don't need real-time notifications
2. **Set a placeholder** in `.env.local`:
   ```env
   SHOPIFY_WEBHOOK_SECRET=not_configured_yet
   ```
3. **Focus on getting checkout working** with the 4 credentials you have

### **Later (When Needed):**

1. Configure webhooks in Shopify Admin
2. Generate or copy webhook secret
3. Update environment variables
4. Test webhook delivery

---

## 🔍 **How to Check If Webhooks Are Configured**

### **In Shopify Admin:**

1. Go to: **Settings** → **Notifications** → **Webhooks**
2. Look for webhooks pointing to your domain
3. Check if they're **Active** or **Failed**

### **In Your Code:**

The webhook endpoint will log errors if the secret doesn't match:
```
❌ Invalid webhook signature
```

---

## 📚 **Additional Resources**

- [Shopify: Webhooks Overview](https://shopify.dev/docs/apps/webhooks)
- [Shopify: Webhook Security](https://shopify.dev/docs/apps/webhooks/configuration/https#step-5-verify-the-webhook)
- [DS LLC: Webhook Configuration Script](../scripts/configure-shopify-webhooks.js)

---

## ✅ **Summary**

**Answer to Your Question:**

> "Is the webhook created after the App is launched and culled then or do I need to find now?"

**Answer:** Webhooks are **configured separately** after the app is created. They're **optional** and not part of the initial app credentials. You can:

1. **Skip it for now** - Your 4 credentials are sufficient for checkout
2. **Set it up later** - When you need real-time order notifications
3. **Use a placeholder** - Set `SHOPIFY_WEBHOOK_SECRET=not_configured_yet` in `.env.local`

The webhook secret is only needed if you're actively using webhooks for order notifications.

---

**Last Updated:** November 7, 2025  
**Status:** ✅ Webhook code updated to use environment variables  
**Priority:** ⚠️ OPTIONAL - Only needed if using webhooks

