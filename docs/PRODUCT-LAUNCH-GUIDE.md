# 🚀 DS LLC PRODUCT LAUNCH GUIDE

**Date:** October 31, 2025  
**Status:** Active Standard Operating Procedure  
**Purpose:** Standardized process for launching new products on the DSLLC website

---

## 📋 **TABLE OF CONTENTS:**

1. [Overview](#overview)
2. [Phase 1: Product Definition & Vendor Setup](#phase-1-product-definition--vendor-setup)
3. [Phase 2: Shopify Configuration](#phase-2-shopify-configuration)
4. [Phase 3: DSLLC Website Integration](#phase-3-dsllc-website-integration)
5. [Phase 4: Image Asset Management](#phase-4-image-asset-management)
6. [Phase 5: Deployment & Verification](#phase-5-deployment--verification)
7. [Product ID Convention](#product-id-convention)
8. [Image Naming Standards](#image-naming-standards)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 **OVERVIEW:**

This guide provides a step-by-step process for launching new products on the DSLLC website, ensuring consistency, accuracy, and seamless integration with Shopify and fulfillment providers (Printful, KDP, etc.).

### **Critical Success Factors:**
- ✅ Accurate Product ID assignment
- ✅ Consistent image naming and organization
- ✅ Correct Shopify Variant ID mapping
- ✅ Proper inventory status synchronization
- ✅ Complete testing before going live

---

## 📦 **PHASE 1: PRODUCT DEFINITION & VENDOR SETUP**

### **Step 1.1: Product Design & Finalization**
1. **Design Requirements:**
   - Finalize all product design elements (logos, text, graphics)
   - Ensure brand consistency with DSLLC guidelines
   - Verify color accuracy and print quality
   - Get approval from stakeholders

2. **Product Specifications:**
   - Materials and construction details
   - Sizes, colors, and variants
   - Weight and dimensions
   - Care instructions

### **Step 1.2: Vendor Platform Setup**

#### **For Printful Products:**
1. **Create Product in Printful:**
   - Go to Printful Dashboard → "My products"
   - Select product template (e.g., "Otto Cap 18-772")
   - Upload design files (high-resolution PNG, JPG, or SVG)
   - Configure print areas and placement
   - Set retail price (consider DSLLC markup)
   - **Critical:** Note the Printful Product ID (e.g., `#42283613552738`)

2. **Printful Product Configuration:**
   - Select all applicable variants (sizes, colors)
   - Verify mockup previews
   - Set fulfillment settings
   - Enable automatic sync to Shopify (if applicable)

#### **For KDP Products:**
1. **Create Product in KDP:**
   - Upload manuscript and cover files
   - Configure pricing and distribution
   - Set publication date
   - **Critical:** Note the ASIN once published

### **Step 1.3: Profitability Analysis**
- Calculate product cost + fulfillment fees
- Determine retail price (accounting for Shopify fees, payment processing)
- Verify profit margins meet business goals
- Document pricing decisions

---

## 🛍️ **PHASE 2: SHOPIFY CONFIGURATION**

### **Step 2.1: Create Product in Shopify Admin**

1. **Navigate to Products:**
   - Go to: Shopify Admin → Products → "Add product"

2. **Product Information:**
   - **Title:** Use clear, descriptive title matching Printful/KDP product
     - Example: `"DarkStreets Otto Cap 18-772"`
   - **Description:** Write compelling product copy
     - Highlight features, benefits, materials
     - Include brand storytelling
     - Add care instructions if applicable
   - **Product Type:** Assign category (e.g., "Apparel & Accessories", "Books")
   - **Vendor:** Set to "DS LLC" or fulfillment provider name
   - **Tags:** Add relevant tags (e.g., `new`, `bestseller`, `printful`, `digital`, `physical`)

3. **Media Upload:**
   - Upload primary product image (high-resolution)
   - Add additional images (front, back, detail shots)
   - **Critical:** Use consistent naming (see [Image Naming Standards](#image-naming-standards))
   - Ensure images are optimized for web (compressed but high quality)

4. **Pricing:**
   - **Price:** Set retail price (must match DSLLC website)
   - **Compare at price:** Optional (for sale promotions)
   - **Taxable:** Check appropriate tax settings

5. **Inventory Management:**
   - **For Printful/FBA Products:** 
     - Select "Don't track inventory" (fulfillment handled by vendor)
     - OR: Set inventory sync with fulfillment app
   - **For Self-Fulfilled Products:**
     - Enable "Track quantity"
     - Set initial stock levels
   - **Critical:** Inventory tracking affects `inStock` status on DSLLC website

6. **Shipping Configuration:**
   - Mark as physical product (requires shipping)
   - Set accurate weight and dimensions
   - Configure shipping zones and rates

7. **Product Variants:**
   - Add all size/color options
   - Set prices per variant if different
   - Add variant images if applicable
   - **Critical:** Note the Shopify Variant ID for each variant

### **Step 2.2: Retrieve Shopify Variant ID**

**This is CRITICAL for DSLLC website integration:**

1. **Method 1: From Product Edit Page**
   - Go to: Shopify Admin → Products → [Your Product]
   - Click on a specific variant (e.g., "One Size", "Medium")
   - The URL will contain the variant ID: `.../variants/42283613552738`
   - Copy this number: `42283613552738`

2. **Method 2: From API Response**
   - Use Shopify Admin API to fetch product data
   - Variant ID is in the response JSON

3. **Method 3: From Printful Sync**
   - If synced from Printful, the variant ID is shown in Printful dashboard
   - Match Printful Product ID to Shopify Variant ID

**⚠️ IMPORTANT:** The Shopify Variant ID is essential for the "Add to Cart" functionality. Without it, checkout will fail.

### **Step 2.3: Product Status**

- **Initial Status:** Set to **"Draft"** during setup and testing
- **Active Status:** Change to **"Active"** only after:
  - ✅ Product fully configured in Shopify
  - ✅ DSLLC website integration complete
  - ✅ Testing successful
  - ✅ Images uploaded and verified

### **Step 2.4: Fulfillment Integration**

- **Printful:** Ensure Shopify-Printful integration is active
- **KDP:** No direct integration - manual redirect to Amazon
- **Other Vendors:** Configure fulfillment service in Shopify

---

## 💻 **PHASE 3: DSLLC WEBSITE INTEGRATION**

### **Step 3.1: Assign DSLLC Product ID**

**CRITICAL:** Use consistent Product ID convention (see [Product ID Convention](#product-id-convention))

1. **Determine Product Category:**
   - Books/Serials: `A-XX`
   - T-Shirts/Apparel: `T-XX`
   - Hats/Caps: `B-XX` or `H-XX`
   - Merchandise: `M-XX`
   - Accessories: `C-XX`

2. **Find Next Available Number:**
   - Review `data/products.ts` for existing IDs
   - Use next sequential number (e.g., if last is `T-01`, new is `T-02`)

3. **Document Product ID Assignment:**
   - Keep a master list of Product IDs
   - Avoid duplicates and gaps

### **Step 3.2: Update `data/products.ts`**

1. **Open File:**
   - Navigate to: `data/products.ts`
   - Locate insertion point (alphabetically or by category)

2. **Add Product Object:**

```typescript
{
  "id": "B-08",                    // DSLLC Product ID (see convention)
  "category": "Apparel & Intimate Wear",  // Match Shopify category
  "title": "DarkStreets Otto Cap 18-772",  // Match Shopify title exactly
  "author": "DS LLC",               // Vendor/brand name
  "price": 22.00,                   // Must match Shopify price
  "description": "Premium 6-Panel Low Profile Garment Washed Cotton Twill Dad Hat",  // Short description
  "longDescription": "Full product description here...\r",  // Detailed description
  "image": "/product-images/A8_hats.jpg",  // Image path (see naming standards)
  "inStock": true,                  // false if Draft in Shopify, true if Active
  "badge": "New",                   // Optional: "New", "Sale", "Bestseller"
  "shopifyVariantId": 42283613552738,  // CRITICAL: Shopify Variant ID
  "printfulVariantId": "42283613552738",  // If Printful product
  "fulfillmentProvider": "printful", // "kdp", "printful", "manual", "digital"
  "requiresShipping": true,         // true for physical products
  // Additional fields for books:
  // "kdpASIN": "B0FDH86NJJ",       // For KDP books
  // "kdpType": "ebook",            // "ebook" or "paperback"
}
```

**Field-by-Field Requirements:**

| Field | Requirement | Example |
|-------|-------------|---------|
| `id` | Unique, follows convention | `"B-08"` |
| `category` | Match Shopify Product Type | `"Apparel & Intimate Wear"` |
| `title` | Exact match to Shopify title | `"DarkStreets Otto Cap 18-772"` |
| `author` | Brand/vendor name | `"DS LLC"` |
| `price` | **Must match Shopify price exactly** | `22.00` |
| `description` | Short description (1-2 sentences) | `"Premium 6-Panel..."` |
| `longDescription` | Full product description | Multi-line text |
| `image` | Path from `/product-images/` | `"/product-images/A8_hats.jpg"` |
| `inStock` | `true` if Active in Shopify, `false` if Draft | `true` |
| `badge` | Optional marketing badge | `"New"` |
| `shopifyVariantId` | **CRITICAL - Must be correct** | `42283613552738` |
| `printfulVariantId` | If Printful product | `"42283613552738"` |
| `fulfillmentProvider` | Fulfillment service | `"printful"` |
| `requiresShipping` | Physical vs digital | `true` or `false` |

### **Step 3.3: Verify Product Entry**

**Checklist:**
- [ ] Product ID is unique and follows convention
- [ ] Title matches Shopify exactly
- [ ] Price matches Shopify exactly
- [ ] `shopifyVariantId` is correct (double-check!)
- [ ] Image path is correct and file exists
- [ ] `inStock` matches Shopify status
- [ ] Description is compelling and accurate
- [ ] All required fields are populated
- [ ] Syntax is correct (no missing commas, quotes)

---

## 🖼️ **PHASE 4: IMAGE ASSET MANAGEMENT**

### **Step 4.1: Image Naming Convention**

**Format:** `[ProductID]-[ProductNameShort]-[Sequence].[ext]`

**Rules:**
- Use lowercase letters
- Use hyphens (-) for word separation
- Include Product ID in filename
- Use sequence numbers for multiple images (0, 1, 2, ...)
- Use standard extensions: `.jpg`, `.png`, `.webp`

**Examples:**
```
B-08-otto-cap-0.jpg         // Primary image
B-08-otto-cap-1.jpg         // Secondary image (front detail)
B-08-otto-cap-2.jpg         // Tertiary image (side view)
T-01-vneck-tee-0.png        // T-Shirt primary
A-02-first-light-0.jpg      // Book cover
```

**Alternative (If Product ID Not in Filename):**
```
A8_hats.jpg                 // If using existing naming
cap-darkstreets-0.jpg       // Descriptive name
```

### **Step 4.2: Image Sequence Standards**

**Primary Image (Sequence 0):**
- Front-facing product shot
- Best angle showing main features
- High resolution, optimized for web
- Used as main product image

**Secondary Images (Sequence 1+):**
- Detail shots (close-ups of features)
- Alternative angles (back, side)
- Lifestyle shots (product in use)
- Size guide images (if applicable)

**Naming Pattern:**
- Primary: `product-0.jpg`
- Detail: `product-1.jpg`
- Side: `product-2.jpg`
- Back: `product-3.jpg`

### **Step 4.3: Image Optimization**

1. **File Format:**
   - Use JPG for photos with many colors
   - Use PNG for images with transparency
   - Use WebP for best compression (if supported)

2. **Dimensions:**
   - Recommended: 800x800px minimum
   - Maximum: 2000x2000px (avoid oversized files)
   - Maintain aspect ratio

3. **Compression:**
   - Optimize for web (reduce file size)
   - Maintain visual quality
   - Target: <500KB per image

4. **Tools:**
   - Photoshop: "Save for Web"
   - Online tools: TinyPNG, Squoosh
   - ImageMagick (command line)

### **Step 4.4: Upload Images**

1. **Location:**
   - All product images go in: `public/product-images/`

2. **Upload Process:**
   - Copy optimized images to `public/product-images/`
   - Verify filenames match `image` field in `data/products.ts`
   - Check that all referenced images exist

3. **File Organization:**
   - Consider subfolders for large catalogs (optional):
     - `public/product-images/apparel/`
     - `public/product-images/books/`
     - `public/product-images/accessories/`

---

## 🚀 **PHASE 5: DEPLOYMENT & VERIFICATION**

### **Step 5.1: Local Testing (Optional but Recommended)**

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test Product Display:**
   - Navigate to: `http://localhost:3000/shop`
   - Find your new product
   - Verify: title, description, price, image all correct
   - Check: "Out of Stock" overlay not showing (if `inStock: true`)

3. **Test Cart Functionality:**
   - Add product to cart
   - Verify cart shows correct product and price
   - Proceed to checkout
   - Verify Shopify redirect works correctly
   - Verify correct variant is selected

4. **Test KDP Redirect (If Applicable):**
   - For KDP books, verify redirect to Amazon works
   - Check ASIN is correct in URL

### **Step 5.2: Git Commit & Push**

1. **Stage Changes:**
   ```bash
   git status                                    # Check changes
   git add data/products.ts                      # Add product data
   git add public/product-images/new-image.jpg   # Add new images
   ```

2. **Commit Changes:**
   ```bash
   git commit -m "Add new product: [Product Title] (ID: [ProductID])"
   ```
   
   **Example:**
   ```bash
   git commit -m "Add new DarkStreets Otto Cap (ID: B-08)"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```

   **This triggers Netlify automatic deployment**

### **Step 5.3: Monitor Netlify Deployment**

1. **Check Deployment Status:**
   - Go to: Netlify Dashboard → Your Site → Deploys
   - Wait for build to complete (typically 2-3 minutes)

2. **Check for Build Errors:**
   - Review build logs for TypeScript errors
   - Check for missing images or broken paths
   - Verify all imports resolve correctly

3. **Verify Deployment Success:**
   - Status should show "Published"
   - No errors in build logs

### **Step 5.4: Live Website Verification**

1. **Hard Refresh:**
   - Open DSLLC website: `https://darkstreetllc.com/shop`
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear cache if needed

2. **Product Visibility Check:**
   - [ ] Product appears on shop page
   - [ ] Title, description, price correct
   - [ ] Image displays correctly (not broken)
   - [ ] "Out of Stock" overlay NOT present (if `inStock: true`)
   - [ ] Badge displays correctly (if applicable)

3. **Product Page Check:**
   - Click product to view detail page
   - [ ] All information displays correctly
   - [ ] Image gallery works (if multiple images)
   - [ ] "Add to Cart" button functions

4. **Cart & Checkout Test:**
   - [ ] Add product to cart
   - [ ] Cart shows correct product, price, quantity
   - [ ] Proceed to checkout
   - [ ] Shopify checkout loads correctly
   - [ ] Correct variant is pre-selected
   - [ ] Price matches DSLLC website

5. **KDP Redirect Test (If Applicable):**
   - [ ] Click "Buy on Amazon" (or equivalent)
   - [ ] Redirects to correct Amazon product page
   - [ ] ASIN matches KDP listing

### **Step 5.5: Shopify Status Update**

**After successful testing:**

1. **Change Product Status in Shopify:**
   - Go to: Shopify Admin → Products → [Your Product]
   - Change status from **"Draft"** to **"Active"**
   - Product is now live in Shopify

2. **Verify Inventory Sync (If Applicable):**
   - If using automated sync, verify `inStock` updates correctly
   - If manual sync, update `data/products.ts` → `inStock: true`
   - Commit and push change

---

## 🆔 **PRODUCT ID CONVENTION**

### **Format:**
`[Category]-[Sequential Number]`

### **Category Prefixes:**

| Category | Prefix | Example | Description |
|----------|--------|---------|-------------|
| Books/Serials | `A-` | `A-01`, `A-02` | All book products (e-books, paperbacks) |
| T-Shirts/Apparel | `T-` | `T-01`, `T-02` | T-shirts, tank tops, apparel |
| Hats/Caps | `B-` or `H-` | `B-08`, `H-01` | Baseball caps, dad hats |
| Merchandise | `M-` | `M-01`, `M-02` | General merchandise |
| Accessories | `C-` | `C-01`, `C-02` | Keychains, rings, accessories |
| Digital Services | `D-` | `D-01`, `D-02` | Digital products, services |

### **Rules:**
- Sequential numbers: `01`, `02`, `03`, ... (use leading zeros)
- Start from `01` for each category
- No gaps in sequence (if `T-01` exists, next is `T-02`, not `T-03`)
- Never reuse Product IDs (even if product is discontinued)
- Document Product ID assignments in a master list

### **Example Assignments:**

```
A-01: First & Light - E-book
A-02: First & Light - Paperback
A-03: Risque & Safety - E-book
T-01: DarkStreets Tee - V-Neck
B-08: DarkStreets Otto Cap 18-772
M-01: (Next merchandise product)
```

---

## 📸 **IMAGE NAMING STANDARDS**

### **Primary Convention:**

**Format:** `[ProductID]-[ProductNameShort]-[Sequence].[ext]`

**Components:**
- `ProductID`: DSLLC Product ID (e.g., `B-08`)
- `ProductNameShort`: Abbreviated product name (e.g., `otto-cap`)
- `Sequence`: Sequential number starting at `0` (e.g., `0`, `1`, `2`)
- `Extension`: File type (`.jpg`, `.png`, `.webp`)

**Examples:**
```
B-08-otto-cap-0.jpg          // Primary image
B-08-otto-cap-1.jpg          // Secondary (detail shot)
B-08-otto-cap-2.jpg          // Tertiary (side view)
T-01-vneck-tee-0.png         // T-shirt primary
A-02-first-light-0.jpg       // Book cover
```

### **Alternative Convention (If Legacy Names Exist):**

**Format:** `[LegacyName]-[Sequence].[ext]`

**Examples:**
```
A8_hats.jpg                  // Existing naming
A8_hats-1.jpg                // Additional images
cap-darkstreets-0.jpg        // Descriptive name
```

### **Image Sequence Guidelines:**

| Sequence | Purpose | Content |
|----------|---------|---------|
| `0` | Primary image | Main product shot, front-facing, best angle |
| `1` | Detail shot | Close-up of key features or logo |
| `2` | Alternative angle | Side, back, or different perspective |
| `3` | Lifestyle shot | Product in use or context |
| `4+` | Additional | Size guides, texture details, etc. |

### **File Format Recommendations:**

- **JPG:** Photos, complex images with many colors
- **PNG:** Images requiring transparency (logos, overlays)
- **WebP:** Best compression (use if browser support is acceptable)

### **Location:**

All product images: `public/product-images/`

**Path in `data/products.ts`:**
```typescript
"image": "/product-images/B-08-otto-cap-0.jpg"
```

---

## 🔧 **TROUBLESHOOTING**

### **Issue: Product Shows "Out of Stock" But Is Active in Shopify**

**Causes:**
1. `inStock: false` in `data/products.ts`
2. Product status is "Draft" in Shopify
3. Changes not committed/pushed to GitHub
4. Netlify build not completed

**Solutions:**
1. Check `data/products.ts` → Set `inStock: true`
2. Verify Shopify product status is "Active"
3. Commit and push changes: `git add`, `git commit`, `git push`
4. Wait for Netlify rebuild (2-3 minutes)
5. Hard refresh website (Ctrl+Shift+R)

---

### **Issue: Checkout Fails or Wrong Product Selected**

**Causes:**
1. Incorrect `shopifyVariantId` in `data/products.ts`
2. Variant doesn't exist in Shopify
3. Product is Draft or Archived in Shopify

**Solutions:**
1. Double-check `shopifyVariantId` matches Shopify variant
2. Verify variant exists and is active in Shopify
3. Confirm product status is "Active" in Shopify
4. Test checkout flow with correct variant ID

---

### **Issue: Image Not Displaying (Broken Image)**

**Causes:**
1. Image file doesn't exist in `public/product-images/`
2. Incorrect path in `data/products.ts`
3. Filename typo or case mismatch
4. Image not committed to Git

**Solutions:**
1. Verify image exists: `ls public/product-images/your-image.jpg`
2. Check `image` field matches actual filename (case-sensitive!)
3. Verify image is committed: `git status`
4. If missing, add and commit: `git add public/product-images/...`

---

### **Issue: Price Mismatch Between DSLLC and Shopify**

**Causes:**
1. Price updated in Shopify but not `data/products.ts`
2. Manual price change in Shopify
3. Different currency or tax settings

**Solutions:**
1. Update `price` in `data/products.ts` to match Shopify
2. Verify Shopify price is correct
3. Commit and push changes

---

### **Issue: Product Not Appearing on Shop Page**

**Causes:**
1. `inStock: false` (filters out unavailable products)
2. Category mismatch
3. Build error in Netlify
4. Cache issues

**Solutions:**
1. Check `inStock` status in `data/products.ts`
2. Verify category is correct
3. Check Netlify build logs for errors
4. Hard refresh and clear cache

---

## 📝 **CHECKLIST: NEW PRODUCT LAUNCH**

**Use this checklist for every new product:**

### **Vendor Setup:**
- [ ] Product created in Printful/KDP/etc.
- [ ] Design files uploaded and approved
- [ ] Pricing configured
- [ ] Fulfillment settings verified

### **Shopify Configuration:**
- [ ] Product created in Shopify Admin
- [ ] Title, description, pricing set
- [ ] Images uploaded to Shopify
- [ ] Variants configured
- [ ] **Shopify Variant ID noted**
- [ ] Inventory settings configured
- [ ] Product Type and Tags set
- [ ] Shipping settings configured

### **DSLLC Website Integration:**
- [ ] **Product ID assigned** (following convention)
- [ ] Product entry added to `data/products.ts`
- [ ] All fields populated correctly
- [ ] `shopifyVariantId` is correct (double-check!)
- [ ] Price matches Shopify
- [ ] `inStock` status set correctly

### **Image Management:**
- [ ] Images optimized for web
- [ ] Images named following convention
- [ ] Images uploaded to `public/product-images/`
- [ ] `image` path in `data/products.ts` matches filename
- [ ] Multiple images sequenced correctly (if applicable)

### **Testing:**
- [ ] Local testing completed (if done)
- [ ] Changes committed to Git
- [ ] Changes pushed to GitHub
- [ ] Netlify build successful
- [ ] Live website tested:
  - [ ] Product visible on shop page
  - [ ] Image displays correctly
  - [ ] Title, description, price correct
  - [ ] "Out of Stock" overlay not present (if active)
  - [ ] Add to cart works
  - [ ] Checkout redirects correctly
  - [ ] Correct variant selected in Shopify

### **Final Activation:**
- [ ] Shopify product status changed to "Active"
- [ ] `inStock: true` in `data/products.ts` (if needed)
- [ ] Final commit and push (if status changed)
- [ ] Final verification on live site

---

## 📚 **RELATED DOCUMENTATION:**

- **Inventory Sync Management:** `docs/inventory-sync-management.md`
- **Shopify Setup Guide:** `docs/shopify-setup-guide.md`
- **Critical Actions Status:** `docs/CRITICAL-ACTIONS-STATUS.md`

---

**Last Updated:** October 31, 2025  
**Version:** 1.0  
**Status:** Active Standard Operating Procedure
