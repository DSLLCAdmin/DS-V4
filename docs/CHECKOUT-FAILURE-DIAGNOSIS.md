# 🔍 CHECKOUT FAILURE DIAGNOSIS - Cap Product (B-08)

**Date:** October 31, 2025  
**Product:** DarkStreets Otto Cap 18-772 (B-08)  
**Issue:** Shopify checkout failed  
**Error:** "Shopify checkout failed. Please check console logs for details."

---

## 🔍 **ROOT CAUSE:**

**CRITICAL FINDING:** The tee shirt (T-01) and cap (B-08) **do not exist in Shopify yet**.

Diagnostic script results:
- ✅ Found **6 products** in Shopify (all books)
- ❌ **No tee shirt** found in Shopify
- ❌ **No cap** found in Shopify

**The Problem:**
1. Products were created in Printful
2. Products were added to `data/products.ts` with Printful Product IDs
3. Products were **NOT synced to Shopify** yet
4. Checkout fails because Shopify doesn't know about these products

**Current Variant IDs in `data/products.ts`:**
- T-01 (Tee): `42224116793442` ← **Product doesn't exist in Shopify**
- B-08 (Cap): `42283613552738` ← **Product doesn't exist in Shopify**

These are likely Printful Product IDs, not Shopify Variant IDs.

---

## ✅ **SOLUTION:**

### **Step 1: Add Products to Shopify FIRST**

**These products must exist in Shopify before checkout will work:**

1. **Sync from Printful to Shopify:**
   - Go to: Printful Dashboard → "My products"
   - Find: "DarkStreets Tee - V-Neck" and "DarkStreets Otto Cap 18-772"
   - Push to Shopify (if Printful-Shopify integration is active)
   - OR: Create products manually in Shopify

2. **Create Products Manually in Shopify (If needed):**
   - Go to: Shopify Admin → Products → "Add product"
   - Create "DarkStreets Tee - V-Neck" with price $35.00
   - Create "DarkStreets Otto Cap 18-772" with price $22.00
   - Set status to **"Active"**
   - Configure inventory settings
   - Add variants (sizes, colors, etc.)

### **Step 2: Find the Actual Shopify Variant ID**

**Method 1: From Shopify Admin (Easiest)**
1. Go to: Shopify Admin → Products
2. Find: "DarkStreets Otto Cap 18-772" (or similar title)
3. Click on the product
4. Look for the variant section
5. Click on the variant (e.g., "One Size", "Default Title")
6. In the URL, you'll see: `.../variants/XXXXXXXXXXXXXX`
7. Copy that number: `XXXXXXXXXXXXXX` ← This is the Shopify Variant ID

**Method 2: From Shopify GraphQL API**
Use the Storefront API to query products and find the variant ID matching the product title.

---

### **Step 2: Update `data/products.ts`**

Replace the `shopifyVariantId` with the actual Shopify Variant ID:

```typescript
{
  "id": "B-08",
  // ... other fields ...
  "shopifyVariantId": [ACTUAL_SHOPIFY_VARIANT_ID], // Replace with real Shopify ID
  "printfulVariantId": "42283613552738", // Keep Printful ID for reference
  // ... rest of fields ...
}
```

---

### **Step 3: Test Checkout**

1. Clear cart
2. Add cap to cart
3. Click "Shopify Checkout"
4. Should redirect to Shopify checkout successfully

---

## 🔍 **HOW TO VERIFY SHOPIFY VARIANT ID:**

### **Option 1: Check Browser Console**

When checkout fails, the console logs should show:
- Available products and variants from Shopify
- The variant ID that was attempted
- Error messages from Shopify API

Look for logs like:
```
Available products and variants: {...}
Processing cart item: DarkStreets Otto Cap 18-772 (ID: B-08)
Using existing shopifyVariantId: 42283613552738
```

### **Option 2: Query Shopify API Directly**

Use the Shopify Storefront API to query all products and find the variant:

```graphql
query {
  products(first: 50) {
    edges {
      node {
        id
        title
        variants(first: 10) {
          edges {
            node {
              id  # This is the GraphQL ID: gid://shopify/ProductVariant/XXXXXXXXXXXXXX
              title
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}
```

The `id` field contains `gid://shopify/ProductVariant/[NUMBER]` - extract the number part.

---

## 📋 **CHECKLIST:**

- [ ] Found actual Shopify Variant ID from Shopify Admin
- [ ] Updated `shopifyVariantId` in `data/products.ts`
- [ ] Committed and pushed changes
- [ ] Tested checkout with correct Variant ID
- [ ] Verified checkout redirects to Shopify successfully

---

## ⚠️ **IMPORTANT NOTES:**

1. **Printful Product ID ≠ Shopify Variant ID:**
   - Printful Product ID: `42283613552738` (from Printful dashboard)
   - Shopify Variant ID: `XXXXXXXXXXXXXX` (from Shopify Admin) ← **Use this one!**

2. **Variant ID Format:**
   - Shopify GraphQL uses: `gid://shopify/ProductVariant/[NUMBER]`
   - Our code expects just the number: `[NUMBER]`

3. **Multiple Variants:**
   - If the product has multiple variants (sizes, colors), you need the variant ID for the specific variant you want to sell

---

**Last Updated:** October 31, 2025  
**Status:** Awaiting Shopify Variant ID
