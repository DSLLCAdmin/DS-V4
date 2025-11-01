# 🔧 Shopify Storefront API Visibility Fix

## ❌ Current Issue

**Error:** `The merchandise with id gid://shopify/ProductVariant/42224116793442 does not exist.`

**Symptoms:**
- Products are ACTIVE ✅
- Products are published to Online Store ✅
- Products have inventory ✅
- Payments configured ✅
- Shipping configured ✅
- Store plan active ✅
- **BUT Storefront API cannot see the variants** ❌

---

## 🔍 Root Cause Analysis

The Storefront API has **different visibility requirements** than the Admin API:

1. **Products must be in a published collection** (often required)
2. **Storefront API token must have correct scopes**
3. **Products must not be in draft/archived collections**
4. **Sales channel visibility settings**

---

## ✅ Solutions to Try

### Solution 1: Add Products to a Published Collection

**The Storefront API often requires products to be in at least one published collection.**

1. Go to Shopify Admin → Products → Collections
2. Click "Create collection"
3. Name it: "All Products" or "Featured Products"
4. Set status to **"Published"**
5. Add both products:
   - "DarkStreets Tee - V-Neck"
   - "DarkStreets' Otto Cap"
6. Set collection to **"Live"**
7. Click "Save"

**OR use existing collection:**
- Find existing published collection
- Add both products to it

### Solution 2: Verify Storefront API Token Permissions

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" (or find your Storefront API app)
3. Find your Storefront API token
4. Check required scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_customers`
   - ✅ `unauthenticated_write_customers`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_write_customers`
   - ✅ `unauthenticated_read_checkouts`

5. If any are missing, **regenerate the token** with all required scopes

### Solution 3: Check Sales Channel Visibility

1. Go to Shopify Admin → Products
2. Open "DarkStreets Tee - V-Neck"
3. Scroll to **"Availability"** section
4. Ensure **"Online Store"** is checked
5. Click "Save" (even if no changes)
6. Repeat for "DarkStreets' Otto Cap"

### Solution 4: Re-publish Products with Collections

1. Go to Shopify Admin → Products
2. Open "DarkStreets Tee - V-Neck"
3. In the **"Collections"** section:
   - Ensure product is in at least one **published** collection
   - If not, add to a published collection
4. Click "Save"
5. Repeat for cap

### Solution 5: Check for Collection Restrictions

1. Go to Shopify Admin → Products → Collections
2. Open each collection that contains the products
3. Check if collection has:
   - ✅ Status: "Published" or "Live"
   - ❌ NOT "Draft" or "Hidden"
4. If collection is draft, publish it

---

## 🔍 Diagnostic Steps

### Step 1: Verify Products are in Collections

**Check via API:**
```bash
node scripts/list-all-shopify-products.js
```

**Check in Shopify Admin:**
1. Go to Products → "DarkStreets Tee - V-Neck"
2. Look at "Collections" section
3. Verify it's in at least one collection
4. Click on the collection name
5. Verify collection is **"Published"** (not Draft)

### Step 2: Test Storefront API Again

After adding products to collections:
```bash
node scripts/test-shopify-checkout.js
```

### Step 3: Check Collection Status

1. Go to Collections
2. Find collections containing tee/cap
3. Verify status is **"Published"** or **"Live"**

---

## 💡 Most Likely Fix

**Adding products to a published collection** is the most common solution for Storefront API visibility issues.

**Quick Fix:**
1. Products → Collections → Create "All Products" (or use existing)
2. Set to **"Published"**
3. Add both tee and cap
4. Wait 2-3 minutes
5. Test checkout again

---

## 📝 Notes

- Printful products may need to be in collections for Storefront API visibility
- Storefront API has stricter visibility rules than Admin API
- Collections must be **published**, not draft
- Wait 2-3 minutes after changes for sync

---

**Last Updated:** October 31, 2025  
**Status:** Awaiting collection assignment test

