# 🧹 Credential Rotation Cleanup Guide

## ✅ **SHOPIFY CLEANUP (Required)**

### **1. Delete Old Shopify App v1**

**This is CRITICAL** - The old app with exposed credentials must be deleted:

1. **Go to Shopify Admin:**
   - Navigate to: **Apps** → **Develop apps**
   - Find the old app: **"DS Website Integration"** (the one with exposed credentials)

2. **Delete the App:**
   - Click on the old app
   - Click **"Delete app"** or **"Uninstall app"**
   - Confirm deletion
   - ⚠️ **Warning:** Make sure you've verified the new App v2 is working before deleting!

3. **Verify New App v2 is Active:**
   - Confirm **"DS Website Integration v2"** (or your new app name) is installed
   - Check that it has the correct API scopes configured
   - Verify it's being used by your website (test checkout)

---

## ✅ **PRINTFUL INTEGRATION (No Changes Needed)**

### **Good News: Printful Doesn't Need Updates**

**Printful uses its own connection to Shopify** - it doesn't use your Shopify API credentials directly.

### **How Printful Works:**
- Printful has its own app installed in Shopify
- Printful connects to Shopify via OAuth (separate from your API credentials)
- Your Shopify API credential rotation **does NOT affect Printful**

### **What to Verify (Optional):**
1. **Check Printful App Status:**
   - Go to Shopify Admin → **Apps** → **Installed apps**
   - Find **"Printful"** app
   - Verify it shows as **"Active"** or **"Connected"**
   - If disconnected, reconnect it (this is separate from API credentials)

2. **Test Printful Order Flow:**
   - Place a test order for a Printful product (Tee, Cap, Mug)
   - Verify order appears in Printful dashboard
   - No changes needed if orders are flowing correctly

---

## ✅ **KINDLE DIRECT PUBLISHING (KDP) - No Changes Needed**

### **KDP is Completely Separate**

**KDP doesn't use Shopify credentials at all:**
- Books are fulfilled through Amazon KDP
- KDP products redirect to Amazon product pages
- No Shopify API integration required

### **KDP Configuration:**
- Products have `fulfillmentProvider: "kdp"` in `data/products.ts`
- KDP products have `kdpASIN` (Amazon ASIN)
- Checkout redirects to Amazon, not Shopify

**No cleanup needed for KDP** ✅

---

## ✅ **AMAZON FBA INTEGRATION (No Changes Needed)**

### **Amazon FBA Uses Its Own App**

**Amazon FBA integration is separate:**
- Amazon FBA has its own app in Shopify
- Connects via OAuth (separate from API credentials)
- Your Shopify API credential rotation **does NOT affect Amazon FBA**

### **What to Verify (Optional):**
1. **Check Amazon FBA App Status:**
   - Go to Shopify Admin → **Apps** → **Installed apps**
   - Find **"Amazon FBA"** app (if installed)
   - Verify it shows as **"Active"** or **"Connected"**

---

## ✅ **OTHER INTEGRATIONS TO CHECK**

### **1. Webhooks (If Configured)**

If you have webhooks configured:
1. Go to Shopify Admin → **Settings** → **Notifications** → **Webhooks**
2. Check if any webhooks are using the old app
3. Update webhook URLs if needed (usually not required)

### **2. Third-Party Apps**

Check any other Shopify apps you have installed:
- **Payment processors** (Stripe, PayPal) - No changes needed
- **Shipping apps** - No changes needed
- **Marketing apps** - No changes needed
- **Analytics apps** - No changes needed

**Most apps use OAuth connections, not your API credentials.**

---

## 📋 **CLEANUP CHECKLIST**

### **Shopify:**
- [ ] Verified new App v2 is working correctly
- [ ] Tested checkout with new credentials
- [ ] Deleted old App v1 (with exposed credentials)
- [ ] Responded to Shopify's security email

### **Printful:**
- [ ] Verified Printful app is still connected (optional)
- [ ] Tested Printful order flow (optional)
- [ ] No changes needed ✅

### **KDP:**
- [ ] No changes needed ✅
- [ ] KDP is completely separate from Shopify

### **Amazon FBA:**
- [ ] Verified Amazon FBA app is still connected (optional)
- [ ] No changes needed ✅

### **Other Integrations:**
- [ ] Checked webhooks (if configured)
- [ ] Verified other apps are still working
- [ ] No changes needed for most apps ✅

---

## ⚠️ **IMPORTANT NOTES**

### **What DOES Need Updates:**
- ✅ **Shopify Custom App v1** - Must be deleted
- ✅ **Environment Variables** - Already updated (local and Netlify)

### **What DOES NOT Need Updates:**
- ❌ **Printful** - Uses its own OAuth connection
- ❌ **KDP** - Completely separate from Shopify
- ❌ **Amazon FBA** - Uses its own app connection
- ❌ **Payment Processors** - Use OAuth, not API credentials
- ❌ **Most Other Apps** - Use OAuth connections

---

## 🔍 **HOW TO VERIFY EVERYTHING IS WORKING**

### **1. Test Checkout:**
- Add product to cart
- Complete checkout
- Verify order appears in Shopify Admin

### **2. Test Printful Products:**
- Order a Printful product (Tee, Cap, Mug)
- Verify order appears in Printful dashboard
- Verify fulfillment starts automatically

### **3. Test KDP Products:**
- Click "Buy on Amazon" for a book
- Verify redirect to Amazon product page works

### **4. Check Shopify Admin:**
- Go to **Orders** - verify new orders are appearing
- Go to **Apps** - verify only new App v2 is installed
- Go to **Settings** → **Notifications** - verify webhooks are working (if configured)

---

## 📝 **SUMMARY**

**Required Cleanup:**
1. ✅ Delete old Shopify App v1 (with exposed credentials)
2. ✅ Verify new App v2 is working

**No Cleanup Needed:**
- ✅ Printful (uses its own connection)
- ✅ KDP (completely separate)
- ✅ Amazon FBA (uses its own app)
- ✅ Most other Shopify apps (use OAuth)

**The credential rotation only affects your Custom App - other integrations are unaffected!**

---

**Last Updated:** November 7, 2025  
**Status:** ✅ Cleanup guide created

