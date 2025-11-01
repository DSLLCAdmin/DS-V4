# 🔑 Storefront API Token Check

## ❌ Current Issue

**Storefront API cannot see products that exist in Admin API**

- Products are ACTIVE ✅
- Products are published ✅
- Products have tags ✅
- **BUT Storefront API returns "merchandise does not exist"** ❌

---

## 🔍 Critical Check: Storefront API Token Permissions

**The Storefront API token may not have the correct scopes to access Printful products.**

### **Step 1: Check Storefront API Token**

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click **"Develop apps"** or **"Manage private apps"**
3. Find your Storefront API app/token
4. Click to view/edit permissions

### **Step 2: Verify Required Scopes**

The Storefront API token **MUST** have these scopes:

- ✅ `unauthenticated_read_product_listings`
- ✅ `unauthenticated_read_product_inventory`  
- ✅ `unauthenticated_read_checkouts`
- ✅ `unauthenticated_write_checkouts`
- ✅ `unauthenticated_write_customers`

### **Step 3: Regenerate Token if Needed**

If any scopes are missing:
1. Click **"Regenerate"** or **"Edit"**
2. Select **ALL** required scopes
3. Save/Regenerate
4. **Update the token in your `.env.local` or environment variables**
5. Wait 2-3 minutes
6. Test checkout again

---

## 💡 Alternative: Check Product Fulfillment Service

Printful products might have a different fulfillment service setting that blocks Storefront API access:

1. Go to Products → "DarkStreets Tee - V-Neck"
2. Scroll to **"Variants"** section
3. Click on a variant (e.g., Medium)
4. Check **"Fulfillment service"** field
5. If it says "Printful" or a custom service, try changing it to **"Manual"** or **"Shopify"**
6. Click **"Save"**
7. Repeat for cap product
8. Wait 2-3 minutes
9. Test checkout again

---

## 📝 Next Steps

1. ✅ Tags added (matches working book products)
2. ⏳ Wait 2-3 minutes for sync
3. 🔍 Check Storefront API token scopes
4. 🔍 Check fulfillment service settings
5. 🧪 Test checkout again

---

**Last Updated:** October 31, 2025

