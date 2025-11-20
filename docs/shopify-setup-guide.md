# Shopify Integration Setup Guide

## 🚀 **Complete Shopify Integration for DarkStreet LLC**

### **Phase 1: Shopify Store Setup**

#### **1. Create Shopify Store**
- **Store Name**: `darkstreetllc` (or `darkstreet-llc`)
- **Store URL**: `darkstreetllc.myshopify.com`
- **Industry**: Books & Media / Apparel
- **Business Type**: Online Store

#### **2. Essential Store Settings**
```bash
# Store Information
Store Name: DarkStreet LLC
Legal Business Name: DarkStreet LLC
Address: [Your Business Address]
Phone: [Your Business Phone]
Email: [Your Business Email]

# Currency & Region
Currency: USD
Country/Region: United States
Timezone: [Your Timezone]
```

#### **3. Payment Settings**
- **Enable Shopify Payments** (Stripe-powered)
- **Payment Methods**: Credit Cards, Debit Cards, PayPal, Apple Pay, Google Pay
- **Currency**: USD only
- **Payout Schedule**: Daily

### **Phase 2: Product Import**

#### **First 10 Products to Import**
1. **Books (Category A)**:
   - A-01: First & Light E-book ($9.99)
   - A-02: First & Light Paperback ($14.99)
   - A-03: First & Light Hardcover ($19.99)
   - A-04: DarkStreet Chronicles E-book ($12.99)
   - A-05: DarkStreet Chronicles Paperback ($17.99)
   - A-06: DarkStreet Chronicles Hardcover ($22.99)

2. **Apparel (Category B)**:
   - B-01: DarkStreet Tees ($24.99)
   - B-02: DarkStreet Caps ($19.99)
   - B-03: DarkStreet Hoodies ($39.99)
   - B-04: DarkStreet Mugs ($14.99)

#### **Product Data Structure**
```json
{
  "title": "First & Light - E-book",
  "description": "The first book in the DarkStreet series...",
  "price": 9.99,
  "compare_at_price": null,
  "sku": "A-01",
  "barcode": "9781234567890",
  "inventory_quantity": 999,
  "inventory_policy": "deny",
  "fulfillment_service": "manual",
  "requires_shipping": false,
  "product_type": "Books",
  "vendor": "DarkStreet LLC",
  "tags": "ebook, digital, darkstreet, series",
  "status": "active"
}
```

### **Phase 3: Technical Integration**

#### **1. API Access Setup**
```bash
# Create Private App
App Name: DarkStreet Website Integration
Admin API Access: Full Access
Webhook Access: Enabled
```

#### **2. Environment Variables**
```bash
# .env.local
SHOPIFY_STORE_NAME=darkstreetllc
SHOPIFY_ADMIN_API_ACCESS_TOKEN= _xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
SHOPIFY_API_VERSION=2024-04
```

#### **3. Webhook Endpoints**
- **Order Creation**: `/api/webhooks/shopify/orders/create`
- **Order Update**: `/api/webhooks/shopify/orders/updated`
- **Order Cancellation**: `/api/webhooks/shopify/orders/cancelled`
- **Inventory Update**: `/api/webhooks/shopify/inventory_levels/update`

### **Phase 4: Checkout Integration**

#### **1. Shopify Checkout Options**
- **Option A**: Redirect to Shopify Checkout (Easiest)
- **Option B**: Embedded Shopify Checkout (More Control)
- **Option C**: Custom Checkout with Shopify API (Most Complex)

#### **2. Recommended: Redirect to Shopify Checkout**
```javascript
// Create checkout session
const checkout = await fetch('https://darkstreetllc.myshopify.com/api/2024-04/checkouts.json', {
  method: 'POST',
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    checkout: {
      line_items: cartItems.map(item => ({
        variant_id: item.shopifyVariantId,
        quantity: item.quantity
      }))
    }
  })
});

// Redirect to Shopify checkout
window.location.href = checkout.checkout.web_url;
```

### **Phase 5: Testing & Launch**

#### **1. Test Scenarios**
- [ ] Add products to cart
- [ ] Proceed to checkout
- [ ] Complete payment with test card
- [ ] Verify order creation in Shopify
- [ ] Test webhook notifications
- [ ] Verify inventory updates

#### **2. Test Payment Cards**
```bash
# Shopify Test Cards
Visa: 4242424242424242
Mastercard: 5555555555554444
American Express: 378282246310005
Declined: 4000000000000002
```

#### **3. Go-Live Checklist**
- [ ] Remove test mode
- [ ] Enable live payments
- [ ] Update webhook URLs to production
- [ ] Test with real payment methods
- [ ] Monitor first few orders

### **Phase 6: Post-Launch Monitoring**

#### **1. Key Metrics to Track**
- Order conversion rate
- Average order value
- Payment success rate
- Cart abandonment rate
- Customer satisfaction

#### **2. Maintenance Tasks**
- Weekly inventory sync
- Monthly sales reports
- Quarterly performance review
- Annual security audit

---

## 🎯 **Next Steps**

1. **Create Shopify Store Account**
2. **Import First 10 Products**
3. **Set Up Payment Processing**
4. **Configure Webhooks**
5. **Test Complete Flow**
6. **Go Live**

---

*This guide will be updated as we progress through the integration.*
