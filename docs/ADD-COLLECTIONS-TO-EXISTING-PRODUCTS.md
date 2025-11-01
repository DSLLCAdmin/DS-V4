# 🔧 How to Add Collections to Existing Products

## ❌ Issue: Tee Shirt and Cap Not Visible in Storefront API

**Root Cause Discovery:**
- New "Streeter Mug" product was published WITH "Home page" collection ✅
- Tee shirt and cap products were published WITHOUT collections ❌
- Books work WITHOUT collections (different product type)
- **Hypothesis:** Printful products need collections for Storefront API visibility

---

## ✅ Solution: Add Collections to Tee Shirt and Cap

### **Method 1: Edit Product Directly (Easiest)**

1. **Go to Shopify Admin → Products**
2. **Open "DarkStreets Tee - V-Neck"**
3. **Scroll to "Product organization" section (right sidebar)**
4. **Find "Collections" field**
5. **Click the search/input field**
6. **Search for and select "Home page" (or "All Current Available Products")**
7. **Click "Save"** (top right)
8. **Repeat for "DarkStreets' Otto Cap"**

### **Method 2: Through Collections Page**

1. **Go to Shopify Admin → Products → Collections**
2. **Open "Home page" (or your published collection)**
3. **Click "Add products"**
4. **Search for:**
   - "DarkStreets Tee - V-Neck"
   - "DarkStreets' Otto Cap"
5. **Select both products**
6. **Click "Add"**
7. **Click "Save"**

### **Method 3: Bulk Edit (If Multiple Products)**

1. **Go to Shopify Admin → Products**
2. **Select checkboxes for:**
   - "DarkStreets Tee - V-Neck"
   - "DarkStreets' Otto Cap"
3. **Click "Bulk actions" → "Add to collection"**
4. **Select collection: "Home page"**
5. **Click "Add"**

---

## 🔍 Verification Steps

After adding collections:

1. **Verify in Shopify:**
   - Products → "DarkStreets Tee - V-Neck" → Collections section should show "Home page"
   - Products → "DarkStreets' Otto Cap" → Collections section should show "Home page"

2. **Test Storefront API:**
   ```bash
   node scripts/query-products-via-storefront-api.js
   ```
   - Should now see tee and cap in the list

3. **Test Checkout:**
   - Wait 2-3 minutes for sync
   - Test checkout on DSLLC website
   - Should work now! ✅

---

## 📝 Notes

- **Collections must be PUBLISHED** (not draft) for Storefront API visibility
- Printful products may require collections for Storefront API access
- Books work without collections (different fulfillment provider)
- Wait 2-3 minutes after adding collections for Shopify to sync

---

**Last Updated:** October 31, 2025  
**Status:** Awaiting collection assignment to tee/cap products

