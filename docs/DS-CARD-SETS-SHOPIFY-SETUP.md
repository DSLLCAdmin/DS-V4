# DS-Card Sets Shopify Setup Guide

## 🎴 Products Created

Three card set products have been added to the website:
- **C-11**: DS-Card Sets - Lamp Post Set
- **C-12**: DS-Card Sets - Streeter Set  
- **C-13**: DS-Card Sets - After-Hours Set

## 📦 Shopify Product Creation

### Option 1: Manual Creation (Recommended)

1. **Go to Shopify Admin** → Products → "Add product"

2. **For each product (C-11, C-12, C-13):**

   **Product Information:**
   - **Title**: [Product Title from data/products.ts]
   - **Description**: Copy from `longDescription` field
   - **Price**: $12.99 (must match exactly)
   - **Product Type**: Accessories
   - **Vendor**: **DSLLC** (set supplier to DSLLC)
   - **Tags**: `dsllc`, `manual`, `games`, `cards`, `new`, `handmade`, `[set-name]`

   **Inventory:**
   - Select "Track quantity" OR "Don't track inventory" (your choice)
   - If tracking: Set quantity to 999 or your available stock
   - SKU: Use format `DS-CARD-[SET-NAME]` (e.g., `DS-CARD-LAMP-POST`)

   **Shipping:**
   - ✅ Mark as "This is a physical product"
   - Weight: 0.2 kg (approximately 200g for a deck of cards)
   - Requires shipping: Yes

   **Publishing:**
   - ✅ Publish to "Home page" collection
   - ✅ Enable "Online Store"
   - ✅ Enable "DS Website Integration" toggle
   - Click "Save"

3. **Get Shopify Variant ID:**
   - After saving, go to the product page
   - Click on the variant (usually "Default Title")
   - Copy the variant ID from URL: `.../variants/[NUMBER]`
   - OR run: `node scripts/get-product-variant-id.js [PRODUCT_ID]`

4. **Update data/products.ts:**
   - Find each product (C-11, C-12, C-13)
   - Add: `"shopifyVariantId": [VARIANT_ID],`

### Option 2: API Creation (If Token is Valid)

Run the script (after updating API token if needed):
```bash
node scripts/create-ds-card-sets-shopify.js
```

**Note**: The script requires a valid Shopify Admin API token. If you get a 401 error, update the token in the script or set it as an environment variable:
```bash
export SHOPIFY_ACCESS_TOKEN=your_token_here
node scripts/create-ds-card-sets-shopify.js
```

## 📧 Email Notification Setup

Configure email notifications in Shopify Admin:

1. **Go to**: Settings → Notifications

2. **Order Confirmation Email** (Customer receives):
   - ✅ Enable "Order confirmation"
   - Edit template to include shipping cost breakdown
   - Add note: "Shipping cost calculated separately"

3. **Payment Confirmation** (You receive):
   - ✅ Enable "New order" notification
   - ✅ Enable "Payment received" notification
   - Set recipient email to your DSLLC email address

4. **Shipping Confirmation** (Customer receives):
   - ✅ Enable "Order shipping update"
   - Include tracking information when available

5. **Additional Notifications** (Optional):
   - Order cancellation
   - Refund notifications
   - Failed payment notifications

## 🚚 Shipping Configuration

### Set Shipping Origin

1. **Go to**: Settings → Shipping and delivery

2. **Shipping Origin Address:**
   - Set zip code: **90732**
   - Enter full address (if not already set)
   - This is where orders will ship from

### Create Shipping Rate

1. **In Shipping and delivery**, scroll to "Shipping rates"

2. **Add Shipping Rate for United States:**
   - **Name**: "Standard Shipping (3-5 Business Days)"
   - **Price**: Calculate based on your costs (e.g., $4.99 or $5.99)
   - **Conditions**: 
     - Weight: 0.1 kg - 0.5 kg (for card sets)
     - OR Price-based: $0.01 - $999.99
   - **Delivery Time**: 3-5 business days
   - **Transit Time**: 3-5 business days

3. **Additional Shipping Options** (Optional):
   - Express shipping (1-2 days) - Higher cost
   - International shipping rates

### Shipping Cost Calculation

Since shipping cost is "extra" (added to product price):
- Product price: $12.99
- Shipping cost: $X.XX (set in shipping rate)
- **Total customer pays**: $12.99 + shipping

Make sure the shipping rate is clearly displayed at checkout.

## ✅ Verification Checklist

After setup, verify:

- [ ] All three products created in Shopify
- [ ] Vendor/Supplier set to "DSLLC"
- [ ] Price set to $12.99 (matches website)
- [ ] Products published to "Home page" collection
- [ ] "DS Website Integration" toggle enabled
- [ ] Shopify Variant IDs added to data/products.ts
- [ ] Shipping origin zip code set to 90732
- [ ] 3-5 day US shipping rate configured
- [ ] Email notifications enabled:
  - [ ] Order confirmation (with shipping cost)
  - [ ] Payment confirmation
  - [ ] Shipping confirmation
- [ ] Products appear on website
- [ ] "Add to Cart" functionality works
- [ ] Checkout process completes successfully

## 📝 Product Details Reference

### C-11: Lamp Post Set
- **Title**: DS-Card Sets - Lamp Post Set
- **Sample Questions**: 
  - "Who in this group could talk you into Trouble?"
  - "What's One Thing you've done just to feel Dangerous?"
  - "Compliment someone, but make it sound like an Insult" (Dare)
- **SKU**: DS-CARD-LAMP-POST

### C-12: Streeter Set
- **Title**: DS-Card Sets - Streeter Set
- **Sample Questions**:
  - "What's the Riskiest Place you've ever Fooled around?"
  - "What was your first 'real' moment of Desire?"
  - "Who here would make the Best Partner-n-Crime?"
- **SKU**: DS-CARD-STREETER

### C-13: After-Hours Set
- **Title**: DS-Card Sets - After-Hours Set
- **Sample Questions**:
  - "Who here would you trust with your biggest Secret?"
  - "What would be the Title of your Romance Movie?"
  - "Describe a drive-time when fear and excitement blurred together. What Happened?"
- **SKU**: DS-CARD-AFTER-HOURS

## 🔄 After Shopify Setup

Once products are created in Shopify and Variant IDs are obtained:

1. **Update data/products.ts** with Shopify Variant IDs
2. **Test checkout** on the website
3. **Verify email notifications** by placing a test order
4. **Confirm shipping rates** display correctly at checkout

## 📞 Support

If you encounter issues:
- Check Shopify API token is valid
- Verify products are published (not draft)
- Ensure "DS Website Integration" is enabled
- Check that collection assignment is correct
- Verify shipping rates are active

---

**Status**: Products added to website. Awaiting Shopify product creation and Variant ID assignment.

