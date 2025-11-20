# Product Image Update Guide

**Purpose:** Simple step-by-step process for updating product images on the DSLLC website.

**Last Updated:** November 7, 2025

---

## Overview

This guide covers updating product images for existing products (Tee, Cap, Mug, Magnet) when new Printful mock-up images are generated.

---

## Quick Update Steps

### **Step 1: Save New Images to Product-Images Folder**

1. Download new mock-up images from Printful
2. Save all images to: `public/product-images/`
3. Follow naming convention: `[ProductID]_[ProductName]-[ViewNumber].[ext]`
   - Example: `M01_streeter-magnet-0.png` (home image)
   - Example: `M01_streeter-magnet-1.png` (view 2)
   - Example: `M01_streeter-magnet-2.png` (view 3)

**Current Product IDs:**
- **T-01**: DarkStreets Tee - V-Neck
- **B-08**: DarkStreets' Otto Cap
- **H-06**: Streeter Mug
- **M-01**: StreeterMagnet

---

### **Step 2: Update Product Data File**

**File:** `data/products.ts`

1. Open `data/products.ts`
2. Find the product entry (search by product ID: `T-01`, `B-08`, `H-06`, or `M-01`)
3. Update the `image` field with the new home image path:
   ```typescript
   "image": "/product-images/[NEW_FILENAME].[ext]"
   ```

**Example for Magnet (M-01):**
```typescript
{
  "id": "M-01",
  // ... other fields ...
  "image": "/product-images/M01_streeter-magnet-0.png", // NEW HOME IMAGE
  // ... rest of product data ...
}
```

**Important:** The `image` field is the **home image** shown in the product card on the shop page.

---

### **Step 3: Update Image Carousel (if product has multiple views)**

**File:** `components/ProductImageGallery.tsx`

1. Open `components/ProductImageGallery.tsx`
2. Find the `imageSets` object (around line 208)
3. Locate the product ID entry (e.g., `'M-01': [...]`)
4. Update the array with all new image paths in order:

**Example for Magnet (M-01):**
```typescript
'M-01': [ // StreeterMagnet - Update with new Printful mock-ups
  '/product-images/M01_streeter-magnet-0.png', // Home image (primary front view)
  '/product-images/M01_streeter-magnet-1.png', // View 2
  '/product-images/M01_streeter-magnet-2.png', // View 3
  '/product-images/M01_streeter-magnet-3.png', // View 4
  '/product-images/M01_streeter-magnet-details.png' // Product details view
]
```

**Note:** 
- First image in array should match the `image` field in `data/products.ts` (home image)
- Order images logically (front view, side views, details, etc.)

---

### **Step 4: Verify Image Files Exist**

Before committing, verify all referenced images exist:

1. Check that all image paths in `data/products.ts` point to existing files
2. Check that all image paths in `ProductImageGallery.tsx` point to existing files
3. Ensure file extensions match (`.png`, `.jpg`, `.jpeg`)

---

### **Step 5: Commit and Deploy**

1. **Stage changes:**
   ```bash
   git add data/products.ts
   git add components/ProductImageGallery.tsx
   git add public/product-images/[NEW_IMAGE_FILES]
   ```

2. **Commit:**
   ```bash
   git commit -m "Update [Product Name] images - New Printful mock-ups"
   ```

3. **Push:**
   ```bash
   git push origin main
   ```

4. **Verify on live site:**
   - Wait for Netlify deployment (usually 1-2 minutes)
   - Check product card on shop page
   - Check product detail page carousel
   - Clear browser cache if old images appear

---

## Product-Specific Notes

### **Tee (T-01)**
- Currently has 16 images in carousel (4 base views × 4 variations)
- Home image: `Tees-0.png`
- If updating, maintain the 4-view structure or simplify as needed

### **Cap (B-08)**
- Currently uses single image: `A8_hats.jpg`
- If adding carousel, update `ProductImageGallery.tsx` with new `'B-08'` entry

### **Mug (H-06)**
- Currently has 4 wrap-around views (0-3)
- Home image is view 2: `H6_streeter-mug-2.jpg`
- Maintain wrap-around sequence when updating

### **Magnet (M-01)**
- Currently has 5 images (4 front views + product details)
- Home image: `car-magnets-white-10x3-front-69063a80be934.png`
- **Note:** New images may have different Printful-generated filenames
- Update both `data/products.ts` and `ProductImageGallery.tsx` with new filenames

---

## Troubleshooting

### **Images Not Showing on Website**

1. **Check file paths:**
   - Ensure paths start with `/product-images/` (not `public/product-images/`)
   - Verify file extensions match exactly (case-sensitive)

2. **Check browser cache:**
   - Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

3. **Check Netlify deployment:**
   - Verify deployment completed successfully
   - Check Netlify build logs for errors

4. **Check console errors:**
   - Open browser DevTools (F12)
   - Check Console tab for 404 errors on image files
   - Check Network tab to see if images are loading

### **Old Images Still Showing**

1. **Verify Git commit:**
   - Ensure all changes were committed
   - Check `git status` to confirm no uncommitted changes

2. **Verify file names:**
   - Old and new images may have similar names
   - Ensure you're referencing the correct new files

3. **Check ProductImageGallery:**
   - Verify `imageSets` array matches new file names
   - Ensure product ID matches exactly (case-sensitive)

---

## Naming Convention Best Practices

**Recommended format:**
```
[ProductID]_[ProductName]-[ViewNumber].[ext]
```

**Examples:**
- `M01_streeter-magnet-0.png` (home image)
- `M01_streeter-magnet-1.png` (view 2)
- `T01_darkstreets-tee-0.png` (home image)
- `B08_otto-cap-0.png` (home image)
- `H06_streeter-mug-0.jpg` (view 0)

**Benefits:**
- Easy to identify product
- Easy to sort and organize
- Avoids conflicts with old images
- Clear view sequence

---

## Checklist

Before committing image updates, verify:

- [ ] All new images saved to `public/product-images/`
- [ ] Images follow naming convention
- [ ] `data/products.ts` updated with new home image path
- [ ] `ProductImageGallery.tsx` updated with new carousel images (if applicable)
- [ ] All image file paths verified (files exist)
- [ ] File extensions match exactly
- [ ] Git changes staged
- [ ] Commit message descriptive
- [ ] Changes pushed to GitHub
- [ ] Netlify deployment successful
- [ ] Live site verified (with cache cleared)

---

## Quick Reference

**Files to Update:**
1. `data/products.ts` - Update `image` field (home image)
2. `components/ProductImageGallery.tsx` - Update `imageSets` array (carousel)

**Image Location:**
- `public/product-images/`

**Product IDs:**
- T-01: Tee
- B-08: Cap
- H-06: Mug
- M-01: Magnet

---

**End of Guide**

