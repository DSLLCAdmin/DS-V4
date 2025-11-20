# 🔔 Shopify Webhook Setup - Complete Guide

## ✅ **Status: Ready to Configure**

Now that your Shopify app rotation is complete, you can set up webhooks for real-time order notifications.

---

## 📋 **Step 1: Configure Webhooks in Shopify Admin**

### **Option A: Via Shopify Admin UI (Recommended)**

1. **Navigate to Shopify Admin:**
   - Go to: **Settings** → **Notifications** → **Webhooks**
   - Or: **Apps** → **Develop apps** → **[Your App v2]** → **Webhooks**

2. **Create Webhook Subscription:**
   - Click **"Create webhook"** or **"Add webhook"**
   - **Event:** Select `Order creation` (or `orders/create`)
   - **Format:** JSON
   - **URL:** `https://ds-v5.netlify.app/api/webhooks/shopify/orders/`
     - ⚠️ **Note:** Replace with your actual production domain if different
   - Click **"Save webhook"**

3. **Repeat for Additional Events (Optional):**
   - `Order update` → Same URL
   - `Order paid` → Same URL
   - `Order cancelled` → Same URL

4. **Get Webhook Secret:**
   - After creating the webhook, Shopify will show you a **"Webhook signing secret"**
   - **Copy this secret** - you'll need it for environment variables
   - ⚠️ **If no secret is shown:** You can generate your own (see Step 2)

---

## 📋 **Step 2: Generate Webhook Secret (If Needed)**

If Shopify doesn't provide a webhook secret, you can generate your own secure secret:

### **Using Node.js (Recommended):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Using PowerShell (Windows):**
```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### **Using Online Generator:**
- Use any secure random string generator
- Minimum 32 characters recommended
- Example format: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

---

## 📋 **Step 3: Add Webhook Secret to Environment Variables**

### **Local Development (`.env.local`):**

1. **Open `.env.local`** in your project root
2. **Add or update:**
   ```env
   SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here
   ```
3. **Replace `your_webhook_secret_here`** with the actual secret from Step 1 or Step 2
4. **Save the file**
5. **Restart your development server** if it's running

### **Production (Netlify):**

1. **Go to Netlify Dashboard:**
   - Navigate to: **Site settings** → **Environment variables**
   - Or: **Project configuration** → **Environment variables**

2. **Add New Variable:**
   - **Key:** `SHOPIFY_WEBHOOK_SECRET`
   - **Value:** `[your webhook secret]`
   - **Scopes:** Production, Deploy previews (optional)
   - Click **"Save"**

3. **Trigger New Deploy:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - This ensures the new environment variable is available

---

## 📋 **Step 4: Verify Webhook Configuration**

### **Check in Shopify Admin:**
1. Go to: **Settings** → **Notifications** → **Webhooks**
2. Verify your webhook is listed and shows **"Active"** status
3. If it shows **"Failed"**, check:
   - URL is correct and accessible
   - Webhook secret matches in both places
   - Your site is deployed and accessible

### **Test Webhook Delivery:**
1. In Shopify Admin, click on your webhook
2. Click **"Send test notification"**
3. Check your Netlify function logs for the webhook request
4. You should see: `📦 Shopify Order Created:` in the logs

### **Check Your Code:**
The webhook endpoint will log:
- ✅ `✅ Order processed successfully` - if webhook works
- ❌ `❌ Invalid webhook signature` - if secret doesn't match
- ❌ `❌ Missing webhook signature` - if Shopify isn't sending signature

---

## 📋 **Step 5: Update Webhook URL (If Needed)**

If your production domain is different from `ds-v5.netlify.app`:

1. **Get Your Production Domain:**
   - Check Netlify dashboard → **Domain settings**
   - Or use your custom domain if configured

2. **Update Webhook URL in Shopify:**
   - Go to: **Settings** → **Notifications** → **Webhooks**
   - Click on your webhook
   - Update **URL** to: `https://your-domain.com/api/webhooks/shopify/orders/`
   - Click **"Save"**

---

## ✅ **Current System Status**

### **What's Already Set Up:**
- ✅ Webhook endpoint code (`app/api/webhooks/shopify/orders/route.ts`)
- ✅ Environment variable support (`SHOPIFY_WEBHOOK_SECRET`)
- ✅ Signature verification (HMAC-SHA256)
- ✅ Order creation handler (POST)
- ✅ Order update handler (PUT)

### **What You Need to Do:**
1. ⚠️ Configure webhooks in Shopify Admin
2. ⚠️ Get/generate webhook secret
3. ⚠️ Add secret to `.env.local`
4. ⚠️ Add secret to Netlify environment variables
5. ⚠️ Test webhook delivery

---

## 🔍 **Troubleshooting**

### **Webhook Shows "Failed" in Shopify:**
- Check that your site is deployed and accessible
- Verify the URL is correct: `https://your-domain.com/api/webhooks/shopify/orders/`
- Check Netlify function logs for errors

### **"Invalid webhook signature" Error:**
- Verify `SHOPIFY_WEBHOOK_SECRET` matches in both Shopify and your environment variables
- Check for extra spaces or characters in the secret
- Ensure the secret is the same in `.env.local` and Netlify

### **Webhook Not Receiving Events:**
- Verify webhook is **"Active"** in Shopify Admin
- Check that the event type matches (e.g., `orders/create`)
- Test with "Send test notification" in Shopify Admin

---

## 📚 **Additional Resources**

- [Shopify: Webhooks Overview](https://shopify.dev/docs/apps/webhooks)
- [Shopify: Webhook Security](https://shopify.dev/docs/apps/webhooks/configuration/https#step-5-verify-the-webhook)
- [DS LLC: Webhook Setup Guide](./WEBHOOK-SETUP-GUIDE.md)

---

## ✅ **Summary**

**Answer to Your Question:**

> "Do we now have an ability to grab the Shopify webhook cred and add it to the system since our rotation is complete?"

**Answer:** Yes! Now that your app rotation is complete, you can:

1. **Configure webhooks in Shopify Admin** (Settings → Notifications → Webhooks)
2. **Get the webhook secret** (shown when creating webhook, or generate your own)
3. **Add to `.env.local`** for local development
4. **Add to Netlify** environment variables for production
5. **Test webhook delivery** to verify it works

The webhook secret is **separate** from your app credentials - it's generated when you create webhook subscriptions, not when you create the app.

---

**Last Updated:** November 8, 2025  
**Status:** ✅ Ready to configure  
**Priority:** ⚠️ OPTIONAL - Only needed if using webhooks for real-time notifications

