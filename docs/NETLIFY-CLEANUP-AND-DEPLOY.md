# 🧹 Netlify Cleanup and Deployment Guide

## ✅ **Step 1: Check for Old Credentials**

### **Navigate to Environment Variables List:**

1. You're currently on the "Sensitive variable policy" page
2. **Go back to the Environment Variables list:**
   - In the left sidebar, under "Project configuration"
   - Click on **"Environment variables"** (it should be highlighted or visible)
   - Or look for a tab/link that says "Environment variables"

3. **Review all environment variables:**
   - Look for any **old/exposed credentials** from the previous Shopify App v1
   - These might have names like:
     - `SHOPIFY_ACCESS_TOKEN` (old name)
     - `SHOPIFY_SHOP_NAME` (old name)
     - Any variables with the **old/exposed tokens** from the compromised app

4. **Delete old credentials:**
   - Click on any old variables
   - Click **"Delete"** or **"Remove"**
   - Confirm deletion

---

## ✅ **Step 2: Verify Your New Variables**

Make sure you have these **4 new variables** with your App v2 credentials:

- ✅ `SHOPIFY_STORE_DOMAIN` = `wenugu-5b.myshopify.com`
- ✅ `SHOPIFY_STOREFRONT_API_TOKEN` = `[your new storefront token]`
- ✅ `SHOPIFY_ADMIN_API_TOKEN` = `[your new admin token]`
- ✅ `SHOPIFY_ADMIN_API_ACCESS_TOKEN` = `[your new admin token]`
- ✅ `SHOPIFY_API_VERSION` = `2024-10`

---

## ✅ **Step 3: Save Sensitive Variable Policy (If Changed)**

1. If you're still on the "Sensitive variable policy" page:
   - Click **"Save"** button at the bottom
   - This saves the policy settings (even if you didn't change them)

2. **Note:** The current setting "Require approval" is fine for security

---

## ✅ **Step 4: Trigger New Deployment**

After saving all changes, trigger a new deployment:

### **Method 1: From Deploys Tab**
1. Go to **"Deploys"** in the left sidebar
2. Click **"Trigger deploy"** button (usually at the top)
3. Select **"Deploy site"**
4. Wait for deployment to complete (2-3 minutes)

### **Method 2: From Project Overview**
1. Go to **"Project overview"** in the left sidebar
2. Look for **"Trigger deploy"** button
3. Click it and select **"Deploy site"**

### **Method 3: Wait for Auto-Deploy**
- If you push to GitHub, Netlify will auto-deploy
- But it's better to trigger manually to test immediately

---

## ✅ **Step 5: Test Checkout**

1. Wait for deployment to complete (check the Deploys tab)
2. Visit your live site: `https://ds-v5.netlify.app` (or your custom domain)
3. Add a product to cart
4. Click "Shopify Checkout"
5. The **503 error should be resolved** ✅

---

## 📋 **Checklist**

- [ ] Checked Environment Variables list for old credentials
- [ ] Deleted any old/exposed credentials from App v1
- [ ] Verified all 4 new variables are present
- [ ] Saved Sensitive Variable Policy (if on that page)
- [ ] Triggered new deployment
- [ ] Waited for deployment to complete
- [ ] Tested checkout on live site

---

## ⚠️ **Important Notes**

- **Old credentials to look for:**
  - Any variables with the **old exposed tokens** (from the compromised app)
  - Variables with old naming like `SHOPIFY_ACCESS_TOKEN` (if you're using the new names)
  - Any duplicate variables with different values

- **Don't delete:**
  - Your new App v2 credentials
  - Any other non-Shopify environment variables (Stripe, etc.)

---

**Last Updated:** November 7, 2025

