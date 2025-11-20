# Quick Image Update Reference Card

**For:** Tee (T-01), Cap (B-08), Mug (H-06), Magnet (M-01)

---

## 3-Step Process

### **1. Save Images**
- Download from Printful
- Save to: `public/product-images/`
- Name: `[ProductID]_[Name]-[View].[ext]`

### **2. Update Two Files**

**File 1:** `data/products.ts`
- Find product by ID (T-01, B-08, H-06, M-01)
- Update `"image"` field = new home image path

**File 2:** `components/ProductImageGallery.tsx` (if carousel)
- Find `imageSets` object (line ~208)
- Update product ID array with all new image paths

### **3. Git Commit**
```bash
git add data/products.ts components/ProductImageGallery.tsx public/product-images/*
git commit -m "Update [Product] images - New Printful mock-ups"
git push origin main
```

---

## Product IDs Reference

| Product | ID | Current Home Image |
|---------|----|-------------------|
| Tee | T-01 | `/product-images/Tees-0.png` |
| Cap | B-08 | `/product-images/A8_hats.jpg` |
| Mug | H-06 | `/product-images/H6_streeter-mug-2.jpg` |
| Magnet | M-01 | `/product-images/car-magnets-white-10x3-front-69063a80be934.png` |

---

## File Locations

- **Product Data:** `data/products.ts`
- **Image Carousel:** `components/ProductImageGallery.tsx`
- **Image Folder:** `public/product-images/`

---

## Quick Troubleshooting

**Images not showing?**
1. Check file paths start with `/product-images/`
2. Verify files exist in `public/product-images/`
3. Clear browser cache (Ctrl+F5)
4. Check Netlify deployment completed

---

**See full guide:** `PRODUCT-IMAGE-UPDATE-GUIDE.md`

