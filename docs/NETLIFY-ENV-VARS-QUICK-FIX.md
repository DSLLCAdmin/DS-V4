# 🚨 Quick Fix: Netlify Environment Variables (503 Error)

## ⚠️ **Problem:**
Checkout is failing with **503 error** because Netlify doesn't have the new Shopify API credentials.

## ✅ **Solution: Update Netlify Environment Variables**

### **Step 1: Access Netlify Dashboard**

1. Go to: **https://app.netlify.com**
2. Log in to your account
3. Find your site: **DS_2** (or **ds-v5**)

### **Step 2: Navigate to Environment Variables**

1. Click on your site
2. Go to: **Site settings** → **Environment variables**
   - Or: **Site configuration** → **Environment variables**

### **Step 3: Add/Update These Variables**

**Add or update these environment variables with your NEW Shopify App v2 credentials:**

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `SHOPIFY_STORE_DOMAIN` | `wenugu-5b.myshopify.com` | Your store domain |
| `SHOPIFY_STOREFRONT_API_TOKEN` | `[Your new Storefront API token]` | **CRITICAL** - This is what's missing! |
| `SHOPIFY_ADMIN_API_TOKEN` | `[Your new Admin API token]` | For product sync |
| `SHOPIFY_ADMIN_API_ACCESS_TOKEN` | `[Your new Admin API token]` | Same as above (for compatibility) |
| `SHOPIFY_API_VERSION` | `2024-10` | API version |

**Where to find your credentials:**
- Go to Shopify Admin: **Apps** → **Develop apps** → **[Your App v2]** → **API credentials**
- Copy the **Storefront API access token** → Paste into `SHOPIFY_STOREFRONT_API_TOKEN`
- Copy the **Admin API access token** → Paste into `SHOPIFY_ADMIN_API_TOKEN` and `SHOPIFY_ADMIN_API_ACCESS_TOKEN`

### **Step 4: Save and Redeploy**

1. Click **"Save"** or **"Add variable"** for each variable
2. **Trigger a new deployment:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Or wait for the next Git push to auto-deploy

### **Step 5: Verify**

1. Wait for deployment to complete (usually 2-3 minutes)
2. Test checkout again on your live site
3. The 503 error should be resolved

---

## 🔍 **How to Check Current Netlify Variables**

1. In Netlify Dashboard → **Site settings** → **Environment variables**
2. Look for existing variables:
   - If you see old credentials (from the exposed app), **delete them**
   - Add the new credentials from your App v2

---

## ⚠️ **Important Notes**

- **Never commit `.env.local` to Git** - it's already in `.gitignore`
- **Netlify environment variables are separate** from your local `.env.local` file
- **You must update both:**
  - ✅ Local: `.env.local` (for development)
  - ✅ Production: Netlify environment variables (for live site)

---

## 📋 **Quick Checklist**

- [ ] Logged into Netlify Dashboard
- [ ] Navigated to Site settings → Environment variables
- [ ] Added `SHOPIFY_STORE_DOMAIN`
- [ ] Added `SHOPIFY_STOREFRONT_API_TOKEN` (with new token from App v2)
- [ ] Added `SHOPIFY_ADMIN_API_TOKEN` (with new token from App v2)
- [ ] Added `SHOPIFY_ADMIN_API_ACCESS_TOKEN` (same as above)
- [ ] Added `SHOPIFY_API_VERSION=2024-10`
- [ ] Saved all variables
- [ ] Triggered new deployment
- [ ] Tested checkout on live site

---

**Last Updated:** November 7, 2025  
**Status:** 🔴 URGENT - Required to fix 503 error

