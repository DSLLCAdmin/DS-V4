# Product Upload Quick Reference

## 🚀 Quick Start

Use the product upload assistant script to streamline adding new products:

```bash
# 1. Check current product ID status
node scripts/add-new-product.js status

# 2. Generate a product template
node scripts/add-new-product.js template

# 3. Add a product (after filling in details)
node scripts/add-new-product.js add '{"category":"Apparel","title":"New Product","price":35,"shopifyVariantId":123456}'
```

## 📋 Product ID Conventions

| Prefix | Category | Last Used | Next Available |
|--------|----------|-----------|----------------|
| A-XX | Serials/Books | A-08 | A-09 |
| T-XX | Apparel (T-Shirts) | T-03 | T-04 |
| B-XX | Accessories (Caps) | B-10 | B-11 |
| H-XX | Home/Culinary | H-06 | H-07 |
| M-XX | Vehicle Accessories (Magnets) | M-01 | M-02 |
| C-K | Other Accessories | Various | Check status |

## ✅ Complete Upload Checklist

### Phase 1: Vendor Setup
- [ ] **Printful Products**: Created in Printful Dashboard
- [ ] **KDP Products**: Published on Amazon KDP (ASIN ready)
- [ ] Product design finalized and approved
- [ ] Pricing determined (including DSLLC markup)

### Phase 2: Shopify Configuration
- [ ] Product created in Shopify Admin
- [ ] Title matches Printful/KDP product name
- [ ] Description written and added
- [ ] Price set (must match DSLLC website)
- [ ] Product Type/Category assigned
- [ ] Tags added (e.g., "new", "printful", "apparel")
- [ ] Images uploaded to Shopify
- [ ] Variants configured (sizes, colors)
- [ ] **CRITICAL**: Published to "Home page" collection
- [ ] **CRITICAL**: "DS Website Integration" toggle enabled
- [ ] Shopify Variant ID retrieved (from URL or script)

### Phase 3: DSLLC Website Integration
- [ ] Product ID assigned (use next available from category)
- [ ] Images prepared and saved to `public/product-images/`
- [ ] Image naming follows convention: `[ProductID]_[name].[ext]`
- [ ] Product added to `data/products.ts`
- [ ] All required fields populated:
  - `id` (matches convention)
  - `category` (matches Shopify)
  - `title` (exact match to Shopify)
  - `price` (exact match to Shopify)
  - `shopifyVariantId` (CRITICAL - must be correct)
  - `fulfillmentProvider` ("printful" or "kdp")
  - `requiresShipping` (true/false)
- [ ] Image carousel configured (if multiple images)
- [ ] Product tested on website

## 🔧 Getting Shopify Variant ID

### Method 1: From Shopify Admin URL
1. Go to Shopify Admin → Products → [Your Product]
2. Click on the variant (e.g., "Default Title" or "Medium")
3. URL contains: `.../variants/[NUMBER]`
4. Copy that number

### Method 2: Using Script
```bash
node scripts/get-product-variant-id.js [SHOPIFY_PRODUCT_ID]
```

Product ID is found in Shopify Admin URL: `.../products/[PRODUCT_ID]`

## 📝 Product Entry Template

```typescript
{
  "id": "T-04",                    // Next available ID from category
  "category": "Apparel",           // Match Shopify Product Type
  "title": "DarkStreets Tee - V-Neck",  // Exact match to Shopify title
  "author": "DS LLC",              // Vendor/brand name
  "price": 35.00,                  // Must match Shopify price exactly
  "description": "Short description for shop listing",
  "longDescription": "Full product description here...\r",
  "image": "/product-images/T-04-tee-example.png",  // Image path
  "inStock": true,                 // true if Active in Shopify
  "badge": "New",                  // Optional: "New", "Sale", "Bestseller"
  "shopifyVariantId": 123456789,   // CRITICAL: Shopify Variant ID
  "printfulVariantId": "123456789", // If Printful product
  "fulfillmentProvider": "printful", // "kdp", "printful", "manual", "digital"
  "requiresShipping": true          // true for physical products
}
```

### For Products with Variants (Sizes/Colors)

```typescript
{
  "id": "T-04",
  "category": "Apparel",
  "title": "DarkStreets Tee - V-Neck",
  "author": "DS LLC",
  "price": 35.00,  // Default/fallback price
  "description": "Unisex Short Sleeve V-Neck T-Shirt",
  "image": "/product-images/T-04-tee-0.png",
  "inStock": true,
  "variants": [
    {
      "size": "S",
      "price": 35.00,
      "shopifyVariantId": 123456789,
      "inStock": true
    },
    {
      "size": "M",
      "price": 35.00,
      "shopifyVariantId": 123456790,
      "inStock": true
    }
    // ... more variants
  ],
  "fulfillmentProvider": "printful",
  "requiresShipping": true
}
```

### For KDP Books

```typescript
{
  "id": "A-09",
  "category": "Serials/Books",
  "title": "Book Title - E-book",
  "author": "Author Name",
  "price": 2.99,
  "description": "Book description",
  "image": "/product-images/A-09-book-cover.jpg",
  "inStock": true,
  "shopifyVariantId": 123456789,
  "fulfillmentProvider": "kdp",
  "kdpASIN": "B0FDH86NJJ",
  "kdpType": "ebook",  // or "paperback"
  "requiresShipping": false  // false for e-books
}
```

## 🖼️ Image Requirements

1. **Location**: `public/product-images/`
2. **Naming Convention**: `[ProductID]_[descriptive-name].[ext]`
   - Example: `M-02_streeter-magnet-front.png`
   - For carousels: `M-02_streeter-magnet-0.png`, `M-02_streeter-magnet-1.png`, etc.
3. **Home Image**: Should be image #2 for 4-image carousels (shown in shop listing)
4. **Format**: Optimized for web (compressed but high quality)
5. **Extensions**: `.jpg`, `.png`, `.webp`

## ⚠️ Critical Fields

| Field | Why It's Critical | How to Verify |
|-------|------------------|---------------|
| `shopifyVariantId` | Required for checkout to work | Double-check from Shopify Admin URL |
| `price` | Must match Shopify exactly | Compare with Shopify Admin price |
| `inStock` | Controls product visibility | Set to `true` if Active in Shopify |
| `image` | Product won't display without correct path | Verify file exists in `public/product-images/` |

## 🔍 Verification Steps

After adding a product:

1. **Check Syntax**: Ensure no missing commas, quotes, or brackets
2. **Verify IDs**: Confirm Product ID follows convention and is unique
3. **Test on Website**: Visit product page and verify:
   - Product displays correctly
   - Images load properly
   - Price matches Shopify
   - "Add to Cart" button works
   - Checkout process completes

## 📚 Additional Resources

- **Complete Guide**: `docs/PRODUCT-LAUNCH-GUIDE.md`
- **Operations SOP**: `docs/pdf-ready/DSLLC-OPERATIONS-SOP-GUIDE.txt`
- **Shopify Integration**: `docs/SHOPIFY_INTEGRATION.md`

## 🆘 Troubleshooting

### Product doesn't appear on website
- Check `inStock` is set to `true`
- Verify product is Active (not Draft) in Shopify
- Check collection assignment in Shopify

### "Add to Cart" doesn't work
- Verify `shopifyVariantId` is correct
- Check Shopify Variant ID from Shopify Admin
- Ensure variant exists and is available for sale

### Images don't load
- Verify image path starts with `/product-images/`
- Check file exists in `public/product-images/`
- Ensure filename matches exactly (case-sensitive)

### Price mismatch
- Compare `price` field with Shopify Admin price
- Update if Shopify price changed
- Ensure no currency symbols in price field

