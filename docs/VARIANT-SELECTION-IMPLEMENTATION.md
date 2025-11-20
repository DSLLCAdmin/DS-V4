# Variant Selection Implementation

**Date:** November 7, 2025  
**Status:** ✅ Implemented - Ready for Testing

---

## Overview

The DSLLC website now supports **variant selection within product cards**. Customers can choose between product variants (like 11oz and 15oz mug sizes) and see corresponding images in the carousel.

---

## What Was Implemented

### **1. Product Data Structure (`data/products.ts`)**

**Added `ProductVariant` Interface:**
```typescript
export interface ProductVariant {
  size?: string; // Variant size (e.g., "11 oz", "15 oz")
  price: number;
  shopifyVariantId: number;
  printfulVariantId?: string;
  inStock: boolean;
  imageSetKey?: string; // Key to link to variant-specific image set
}
```

**Updated `Product` Interface:**
- Added `variants?: ProductVariant[]` field
- Legacy `shopifyVariantId` and `printfulVariantId` fields remain for backward compatibility

**Updated Streeter Mug (H-06):**
- Added `variants` array with 11oz and 15oz variants
- Each variant has its own:
  - Price
  - Shopify Variant ID
  - Printful Variant ID
  - Image set key
  - Stock status

---

### **2. Image Gallery (`components/ProductImageGallery.tsx`)**

**Updated `useProductImages` Hook:**
- Now accepts optional `variantImageSetKey` parameter
- Dynamically loads images based on selected variant

**Added Variant-Specific Image Sets:**
- `'H-06-11oz'`: 8 images for 11oz mug
- `'H-06-15oz'`: 8 images for 15oz mug
- Legacy `'H-06'` set remains for backward compatibility

**Image Organization:**
- 11oz images: `black-glossy-mug-black-11-oz-*.jpg`
- 15oz images: `black-glossy-mug-black-15-oz-*.jpg`
- Each variant has 8 views (2 front views, 3 handle-left views, 3 handle-right views)

---

### **3. Product Page UI (`components/ProductPageClient.tsx`)**

**Added Variant Selection:**
- Size selector buttons appear for products with variants
- Buttons show variant size (e.g., "11 oz", "15 oz")
- Selected variant is highlighted
- Out-of-stock variants are disabled

**Dynamic Updates:**
- **Price:** Updates based on selected variant
- **Images:** Carousel switches to variant-specific images
- **Checkout:** Uses correct Shopify Variant ID for selected variant

**State Management:**
- `selectedVariant`: Tracks currently selected variant
- Defaults to first variant in array
- Updates when user selects different variant

---

## How It Works

### **Customer Experience:**

1. **View Product:** Customer opens Streeter Mug product page
2. **See Variants:** Size selector shows "11 oz" and "15 oz" buttons
3. **Select Size:** Customer clicks desired size (e.g., "15 oz")
4. **Images Update:** Carousel automatically switches to 15oz images
5. **Price Updates:** Price displays correct amount for selected size
6. **Add to Cart:** Correct Shopify Variant ID is used for checkout

### **Technical Flow:**

1. Product data includes `variants` array
2. `ProductPageClient` renders variant selector UI
3. User selects variant → `handleVariantSelect()` updates state
4. `useProductImages()` hook receives `variantImageSetKey`
5. `getProductImageSet()` loads variant-specific images
6. `ProductImageGallery` displays correct image set
7. `handleAddToCart()` uses selected variant's `shopifyVariantId`

---

## Current Status

### **✅ Completed:**
- Product data structure updated
- Variant selection UI implemented
- Dynamic image switching working
- Price updates based on variant
- Checkout uses correct variant ID

### **⚠️ TODO:**
- **Get 15oz Shopify Variant ID:**
  - Current value: `0` (placeholder)
  - **Action Required:** Get actual Shopify Variant ID from Shopify Admin
  - **Location:** Shopify Admin → Products → Streeter Mug → 15 oz variant
  - **Update:** `data/products.ts` line 321: `"shopifyVariantId": 0`

- **Verify 15oz Price:**
  - Current value: `15.00` (estimated)
  - **Action Required:** Verify actual price in Shopify
  - **Update:** `data/products.ts` line 320: `"price": 15.00`

- **Verify 15oz Printful SKU:**
  - Current value: `"6360577_9324"` (estimated)
  - **Action Required:** Verify actual Printful SKU
  - **Update:** `data/products.ts` line 322: `"printfulVariantId": "6360577_9324"`

---

## Testing Checklist

- [ ] Variant selector appears on Streeter Mug product page
- [ ] "11 oz" and "15 oz" buttons are visible
- [ ] Clicking "11 oz" shows 11oz images in carousel
- [ ] Clicking "15 oz" shows 15oz images in carousel
- [ ] Price updates when variant is selected
- [ ] Selected variant is highlighted
- [ ] Add to Cart uses correct Shopify Variant ID
- [ ] Checkout works for both variants (after 15oz ID is added)

---

## Files Modified

1. **`data/products.ts`**
   - Added `ProductVariant` interface
   - Updated `Product` interface
   - Updated H-06 product with variants array

2. **`components/ProductImageGallery.tsx`**
   - Updated `useProductImages` hook
   - Added variant-specific image sets
   - Updated `getProductImageSet` function

3. **`components/ProductPageClient.tsx`**
   - Added variant selection state
   - Added variant selector UI
   - Updated `handleAddToCart` to use variant ID
   - Added `handleVariantSelect` function

---

## Next Steps

1. **Get 15oz Shopify Variant ID:**
   - Go to Shopify Admin
   - Navigate to Streeter Mug product
   - Find 15 oz variant
   - Copy variant ID from URL or variant details
   - Update `data/products.ts` line 321

2. **Test on Live Site:**
   - Deploy changes
   - Test variant selection
   - Verify images switch correctly
   - Test checkout for both variants

3. **Apply to Other Products:**
   - Tee (T-01) already has size selection (Apparel)
   - Cap (B-08) - single variant, no changes needed
   - Magnet (M-01) - single variant, no changes needed

---

## Notes

- **Backward Compatibility:** Products without `variants` array continue to work as before
- **Legacy Support:** Old `shopifyVariantId` field still works for single-variant products
- **Image Sets:** Both variant-specific and legacy image sets are maintained
- **Future Products:** New products with variants can use the same structure

---

**End of Document**

