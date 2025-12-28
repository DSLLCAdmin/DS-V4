# DS-Card Sets Product Setup Complete

## ✅ Product Added Successfully

**Product ID**: C-11  
**Product Name**: DS-Card Sets  
**Category**: Accessories  
**Price**: $12.99  
**Status**: Active (inStock: true)

## 📋 Product Details

- **Title**: DS-Card Sets
- **Description**: Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions.
- **Long Description**: Includes details about:
  - Hand-crafted in DarkStreets roadside factory by 'Streeters Ink
  - 20 cards per set (3 sample questions shown, 17 mystery questions)
  - Mix of "Confess" and "Dare" prompts
  - Designed for intimate gatherings and late-night adventures

## 🖼️ Image Carousel Configuration

The product carousel has been configured with 3 image slots:

1. **Image 1**: `/product-images/C-11_ds-card-sets-0.png`
2. **Image 2**: `/product-images/C-11_ds-card-sets-1.png` (Home/Shop listing image)
3. **Image 3**: `/product-images/C-11_ds-card-sets-2.png`

## ⚠️ Required Next Steps

### 1. Upload Product Images

**Action Required**: Upload the 3 card set images to the website.

**File Naming Convention** (already configured):
- `C-11_ds-card-sets-0.png` (or .jpg)
- `C-11_ds-card-sets-1.png` (or .jpg) - This will be the home/shop listing image
- `C-11_ds-card-sets-2.png` (or .jpg)

**Location**: `public/product-images/`

**Note**: The file names end with "ds-card-sets" as requested, following the pattern `[ProductID]_[product-name]-[sequence].[ext]`

### 2. Shopify Setup (Optional - for checkout functionality)

Since this is a DSLLC-manufactured product (not drop-shipped), you'll need to:

1. **Create Product in Shopify**:
   - Go to Shopify Admin → Products → "Add product"
   - Title: "DS-Card Sets"
   - Description: Copy from product description
   - Price: $12.99 (must match exactly)
   - Product Type: "Accessories" or "Games"
   - Vendor: "DS LLC"
   - Tags: "new", "dsllc", "manual", "games", "cards"

2. **Configure Inventory**:
   - Since it's manually fulfilled, enable "Track quantity" if you want inventory management
   - OR select "Don't track inventory" if managing stock manually

3. **Publishing**:
   - Publish to "Home page" collection
   - Enable "DS Website Integration" toggle
   - Verify "Online Store" is enabled

4. **Get Shopify Variant ID**:
   - Go to Shopify Admin → Products → [DS-Card Sets]
   - Click on the variant (usually "Default Title")
   - Copy the variant ID from the URL: `.../variants/[NUMBER]`
   - OR run: `node scripts/get-product-variant-id.js [PRODUCT_ID]`

5. **Update Product Entry**:
   - Edit `data/products.ts`
   - Find product C-11
   - Add: `"shopifyVariantId": [VARIANT_ID],`

### 3. Verify Product Display

After uploading images:

1. **Check Product Page**: Visit `/shop/[product-id]` or search for "DS-Card Sets"
2. **Verify Images**: Ensure all 3 images display in the carousel
3. **Test Carousel**: Click through images to verify navigation works
4. **Check Shop Listing**: Verify the home image (image 2) displays correctly in shop grid

## 📝 Product Entry Location

**File**: `data/products.ts`  
**Line**: After C-10, before D-01

**Carousel Configuration**: `components/ProductImageGallery.tsx`  
**Key**: `'C-11'` in the `imageSets` object

## 🎯 Product Specifications

- **Manufacturer**: DSLLC (DarkStreets LLC)
- **Fulfillment**: Manual (hand-crafted, not drop-shipped)
- **Shipping**: Required (physical product)
- **Set Contents**: 20 cards (3 sample questions + 17 mystery questions)
- **Production**: Hand-made in DarkStreets roadside factory by 'Streeters Ink
- **Theme**: Confession and dare game cards with sultry/questioning prompts

## ✨ Features

- ✅ Product entry created in `data/products.ts`
- ✅ Image carousel configured (3 slots)
- ✅ Product description with sultry theme
- ✅ Mentions 'Streeters Ink manufacturing
- ✅ References 3 shown questions + 17 mystery questions
- ✅ Price set to $12.99
- ✅ Badge set to "New"
- ✅ Category: Accessories

## 🔄 If You Need to Update

**To change description**: Edit `data/products.ts`, find product C-11, modify `description` or `longDescription`

**To change images**: 
1. Replace image files in `public/product-images/`
2. Update paths in `components/ProductImageGallery.tsx` if filenames change

**To change price**: Update `price` field in `data/products.ts` AND Shopify Admin (must match)

**To add more images**: Add additional image paths to the `'C-11'` array in `ProductImageGallery.tsx`

---

**Status**: Product entry complete. Awaiting image upload and optional Shopify setup.

