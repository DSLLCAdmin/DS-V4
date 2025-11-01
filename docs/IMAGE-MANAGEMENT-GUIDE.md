# 📸 Product Image Management Guide

## 🎯 Image Storage System

### **Current Setup:**
- **All images stored locally** in `public/product-images/` folder
- **NOT pulled from Shopify CDN** - Images are local files only
- Image paths specified in `data/products.ts` → `image` field

### **Why Local Storage?**
- Full control over image quality and optimization
- Faster load times (no external API calls)
- Consistent image delivery
- Easier version control

---

## 📁 Image File Management

### **File Location:**
```
public/product-images/
├── H6_streeter-mug.jpg          ← New Streeter Mug image
├── A8_hats.jpg                   ← Cap image
├── Tees-0.png                    ← Tee shirt images
└── ...
```

### **Naming Convention:**
- **Format:** `[ProductID]_[ProductName].[ext]`
- **Examples:**
  - `H6_streeter-mug.jpg` (Streeter Mug - H-06)
  - `B08_otto-cap.jpg` (Otto Cap - B-08)
  - `T01_v-neck-tee.jpg` (V-Neck Tee - T-01)

### **Image Requirements:**
- **Format:** JPG (preferred) or PNG
- **Dimensions:** 800x800px minimum, 2000x2000px maximum
- **File Size:** <500KB per image (optimized)
- **Aspect Ratio:** Square (1:1) preferred

---

## 🔄 Adding New Product Images

### **Step 1: Prepare Image**
1. **Optimize image** (use TinyPNG, Squoosh, or Photoshop)
2. **Rename file** using convention: `[ProductID]_[ProductName].[ext]`
3. **Example:** `H6_streeter-mug.jpg`

### **Step 2: Upload Image**
1. **Copy image file** to `public/product-images/` folder
2. **Verify filename** matches convention

### **Step 3: Update `data/products.ts`**
1. **Find product entry** in `data/products.ts`
2. **Update `image` field:**
   ```typescript
   "image": "/product-images/H6_streeter-mug.jpg",
   ```
3. **Remove TODO comment** if present

### **Step 4: Commit & Deploy**
1. **Stage changes:**
   ```bash
   git add public/product-images/H6_streeter-mug.jpg data/products.ts
   ```
2. **Commit:**
   ```bash
   git commit -m "Add Streeter Mug image (H-06)"
   ```
3. **Push:**
   ```bash
   git push origin main
   ```
4. **Wait for Netlify deployment** (~2-3 minutes)

---

## ⚠️ Important Notes

### **Image Updates:**
- **If you update an image in Shopify:** You MUST also update the local file in `public/product-images/`
- **If you update an image locally:** You MUST commit and push to GitHub for it to appear on the live site
- **Browser cache:** Clear cache or hard refresh (Ctrl+Shift+R) if old image persists

### **Product ID Changes:**
- **When reassigning product IDs** (e.g., H-02 → H-06):
  - Use a NEW unique product ID
  - Update image filename to match new ID
  - Update `data/products.ts` with new ID and image path
  - **This avoids conflicts with old images**

### **Placeholder Images:**
- **Temporary placeholder:** Use `"/product-images/placeholder.jpg"` until actual image is ready
- **Always add TODO comment:** `// TODO: Add [ProductName] image`

---

## 🔍 Troubleshooting

### **Old Image Still Showing:**
1. **Check file exists:** Verify image file is in `public/product-images/`
2. **Check `data/products.ts`:** Verify `image` path is correct
3. **Check Git status:** Ensure changes are committed and pushed
4. **Clear browser cache:** Hard refresh (Ctrl+Shift+R) or clear cache
5. **Wait for deployment:** Netlify may take 2-3 minutes to deploy

### **Image Not Loading:**
1. **Check file path:** Ensure path starts with `/product-images/`
2. **Check filename:** Verify filename matches exactly (case-sensitive)
3. **Check file exists:** Verify file is in `public/product-images/`
4. **Check file format:** Ensure format is JPG, PNG, or WebP
5. **Check file size:** Ensure file is not corrupted or too large

---

## 📝 Current Product Images

### **Books (Serials/Books):**
- `1a_first-light-ebook.jpg`
- `1a_first-light-PaperBack.jpg`
- `2a_risque-safety-ebook.jpg`
- `2a_risque-safety-PaperBack.jpg`
- `3a_mercury-memory-ebook.jpg`
- `3a_mercury-memory-PaperBack.jpg`

### **Apparel (Apparel & Intimate Wear):**
- `A8_hats.jpg` - DarkStreets' Otto Cap (B-08)
- `Tees-0.png` - DarkStreets Tee - V-Neck (T-01)

### **Culinary & Novelty:**
- `G2_dark-street-mug_Front.jpg` - **OLD DarkStreet Mugs (H-02) - DO NOT USE**
- `H6_streeter-mug.jpg` - **NEW Streeter Mug (H-06) - TODO: Add image**

---

## ✅ Checklist for New Product Images

- [ ] Image optimized (<500KB)
- [ ] Image renamed using convention: `[ProductID]_[ProductName].[ext]`
- [ ] Image file copied to `public/product-images/`
- [ ] `data/products.ts` updated with correct `image` path
- [ ] TODO comment removed (if present)
- [ ] Changes committed to Git
- [ ] Changes pushed to GitHub
- [ ] Netlify deployment complete
- [ ] Image verified on live site

---

**Last Updated:** October 31, 2025  
**Status:** Active - Images stored locally, not from Shopify

