# 📋 Master TODO List - All Outstanding Tasks

**Last Updated:** November 9, 2025  
**Status:** Active - Comprehensive Task Tracking  
**Scope:** Product Interest, Zoho CRM, Launch Critical Actions, E-commerce Integration

---

## 🎯 **Overview**

This is the master TODO list for ALL outstanding tasks across all phases:
- Product Interest & Zoho CRM Integration
- Launch Critical Actions (Email, Products, Infrastructure)
- E-commerce Integration (Amazon FBA, Shopify, Inventory)
- System Enhancements & Maintenance

Check off items as you complete them.

---

## 🔴 **PRIORITY 1: Zoho CRM Setup (Required for Integration)**

### **Account Setup**
- [ ] **Sign up for Zoho CRM Free Plan**
  - Link: https://www.zoho.com/crm/free-crm/
  - Use email: `admin@darkstreetllc.com`
  - Complete account verification
  - Complete setup wizard
  - **Reference:** `docs/ZOHO-CRM-FREE-PLAN-SETUP.md`

### **API Application Setup**
- [ ] **Create API Application in Zoho API Console**
  - Go to: https://api-console.zoho.com/
  - Create new "Server-based Application"
  - Set Client Name: "DarkStreet Product Interest"
  - Set Homepage URL: `https://darkstreetllc.com`
  - Set Authorized Redirect URIs: `https://darkstreetllc.com`
  - Select Scopes: `ZohoCRM.modules.leads.ALL`
  - **Output:** Client ID and Client Secret
  - **Reference:** `docs/ZOHO-CRM-PRODUCT-INTEREST-SETUP.md` (Step 2)

- [ ] **Generate Refresh Token**
  - Authorize the application
  - Copy authorization code from redirect URL
  - Exchange code for refresh token
  - Save refresh token securely
  - **Reference:** `docs/ZOHO-CRM-PRODUCT-INTEREST-SETUP.md` (Step 3)

- [ ] **Determine API Domain**
  - Check Zoho account region
  - Default: `com` (US/Global)
  - Other options: `eu`, `in`, `com.au`, `jp`
  - Note the correct domain for environment variables

### **Environment Variables Configuration**
- [ ] **Add to Local Environment (`.env.local`)**
  ```env
  ZOHO_CRM_CLIENT_ID=your_client_id_here
  ZOHO_CRM_CLIENT_SECRET=your_client_secret_here
  ZOHO_CRM_REFRESH_TOKEN=your_refresh_token_here
  ZOHO_CRM_API_DOMAIN=com
  ```
  - Add all 4 variables
  - Verify no typos
  - Test that file is in `.gitignore`

- [ ] **Add to Netlify Environment Variables**
  - Go to: Netlify Dashboard → Site → Site configuration → Environment variables
  - Add: `ZOHO_CRM_CLIENT_ID`
  - Add: `ZOHO_CRM_CLIENT_SECRET`
  - Add: `ZOHO_CRM_REFRESH_TOKEN`
  - Add: `ZOHO_CRM_API_DOMAIN` (value: `com` or your region)
  - **Important:** Trigger new deployment after adding

### **Zoho CRM Custom Fields (Optional but Recommended)**
- [ ] **Create Custom Fields in Zoho CRM**
  - Go to: Zoho CRM → Settings → Customization → Modules → Leads → Fields
  - Create the following fields:
    - [ ] `Product_ID` (Text, 50 characters)
    - [ ] `Product_Title` (Text, 255 characters)
    - [ ] `Product_Category` (Text, 100 characters)
    - [ ] `Customer_Message` (Long Text)
    - [ ] `Products_Visited` (Long Text)
    - [ ] `Products_Purchased` (Long Text)
    - [ ] `Cart_Items` (Long Text)
    - [ ] `Total_Product_Views` (Number)
    - [ ] `Total_Purchases` (Number)
    - [ ] `Total_Cart_Adds` (Number)
    - [ ] `Total_Spent` (Currency)
    - [ ] `Time_On_Site_Minutes` (Number)
    - [ ] `Referrer` (Text, 255 characters)
    - [ ] `User_Agent` (Long Text)
    - [ ] `Interest_Submitted_At` (Date/Time)
  - **Note:** If Free Plan doesn't allow custom fields, data will still be stored in Description field
  - **Reference:** `docs/ZOHO-CRM-PRODUCT-INTEREST-SETUP.md` (Step 4)

---

## 🟡 **PRIORITY 2: Testing & Verification**

### **Local Testing**
- [ ] **Test Zoho CRM Integration Locally**
  - Start local dev server: `npm run dev`
  - Navigate to an unreleased product page
  - Click "Product Interest" button
  - Fill out form with test data
  - Submit form
  - Check browser console for errors
  - Check server console for CRM operation logs
  - Verify no errors in logs

- [ ] **Verify Lead Creation in Zoho CRM (Local)**
  - Log into Zoho CRM
  - Go to: Leads module
  - Find the test lead created
  - Verify all data fields are populated correctly:
    - [ ] Contact information (name, email, phone)
    - [ ] Product information (ID, title, category)
    - [ ] Customer profile data (products visited, purchases, etc.)
    - [ ] Technical details (referrer, user agent, timestamp)
  - Verify Lead Source = "Website - Product Interest"

- [ ] **Test Email Deduplication (Local)**
  - Submit Product Interest with same email, different product
  - Check Zoho CRM - should update existing lead, not create duplicate
  - Verify new product interest added to existing lead

### **Production Testing**
- [ ] **Deploy to Production**
  - Ensure all Netlify environment variables are set
  - Trigger deployment (or wait for auto-deploy)
  - Verify deployment successful

- [ ] **Test on Live Site**
  - Visit live website
  - Navigate to unreleased product
  - Submit Product Interest form
  - Verify success message displayed
  - Check email inbox for confirmation email

- [ ] **Verify Lead Creation in Zoho CRM (Production)**
  - Log into Zoho CRM
  - Go to: Leads module
  - Find the production test lead
  - Verify all data populated correctly
  - Compare with local test to ensure consistency

- [ ] **Test Multiple Submissions (Production)**
  - Submit Product Interest for 3-5 different products
  - Verify each creates/updates lead correctly
  - Check for any rate limiting or API errors

---

## 🟢 **PRIORITY 3: Free Plan Evaluation**

### **API Access Testing**
- [ ] **Test API Rate Limits**
  - Submit multiple Product Interest forms rapidly (10+ in quick succession)
  - Monitor for rate limit errors
  - Check API Console for usage statistics
  - Document any limitations found

- [ ] **Test Custom Field Creation**
  - Attempt to create custom fields in Zoho CRM
  - Document if Free Plan allows custom fields
  - Note any limitations or restrictions

- [ ] **Monitor API Usage**
  - Check Zoho API Console for usage statistics
  - Document daily/monthly limits
  - Calculate if Free Plan sufficient for expected volume

### **Feature Evaluation**
- [ ] **Evaluate Lead Management Features**
  - Test lead search and filtering
  - Test lead status updates
  - Test adding notes to leads
  - Document any feature limitations

- [ ] **Evaluate Reporting Capabilities**
  - Create a basic report for Product Interest leads
  - Test grouping by product category
  - Test metrics (count, totals)
  - Document reporting limitations

### **Upgrade Decision**
- [ ] **Make Upgrade Decision**
  - Review all Free Plan limitations found
  - Calculate if Free Plan sufficient for business needs
  - If insufficient, decide to upgrade to Standard Plan
  - Document decision and reasoning

- [ ] **If Upgrading to Standard Plan**
  - [ ] Sign up for Standard Plan ($14/user/month)
  - [ ] Verify API access improved
  - [ ] Test custom field creation (should work now)
  - [ ] Re-test all functionality
  - [ ] Document improvements

---

## 🔵 **PRIORITY 4: Documentation & Cleanup**

### **Documentation Updates**
- [ ] **Update Setup Documentation**
  - Add any issues encountered during setup
  - Add solutions to troubleshooting section
  - Update with actual API domain used
  - Add any Free Plan limitations discovered

- [ ] **Create Testing Results Document**
  - Document all test results
  - Document Free Plan limitations found
  - Document upgrade decision and reasoning
  - Save for future reference

### **Code Cleanup (If Needed)**
- [ ] **Review Error Logs**
  - Check for any console errors during testing
  - Fix any issues found
  - Improve error messages if needed

- [ ] **Optimize if Needed**
  - Review API call efficiency
  - Optimize data collection if needed
  - Improve error handling if issues found

---

## 🟣 **PRIORITY 5: Launch Critical Actions - Email & Infrastructure**

### **Email System Tasks**
- [ ] **Email Migration from Old Provider** ⏳ **HIGH PRIORITY**
  - Review Zoho tech's email migration instructions
  - Access previous email provider
  - Export/Import emails to Zoho
  - Verify all emails migrated correctly
  - **Impact:** Access to historical emails
  - **Reference:** `docs/CRITICAL-ACTIONS-STATUS.md`

- [ ] **Add Test Email Alias** ⏳ **LOW PRIORITY**
  - Add `test@darkstreetllc.com` as alias in Zoho Mail
  - Test email functionality
  - Configure filter if needed
  - **Note:** Not critical - can add later

- [ ] **Configure Email Reply Addresses** ⏳ **LOW PRIORITY**
  - Go to: Zoho Mail → Settings → Mail → Composing
  - Set default "From" addresses per folder
  - Test reply functionality
  - **Note:** Manual selection works, this is for convenience

### **Product Image Fixes**
- [ ] **Review and Fix Broken Product Images** ⏳ **MEDIUM PRIORITY**
  - Review all product pages for broken images
  - Fix any broken image paths
  - Verify all product images display correctly
  - Update `data/products.ts` if image paths need correction
  - **Location:** Product pages, shop page

---

## 🔵 **PRIORITY 6: E-commerce Integration - Product Activation**

### **Non-Book Products Activation** ⏳ **MEDIUM PRIORITY**
- [ ] **T-Shirts (T-01) Activation**
  - Verify vendor assignment (Printful configured?)
  - Check pricing matches Shopify
  - Verify Product ID confirmation
  - Test product checkout
  - Activate in Shopify if test passes
  - Update `inStock: true` in `data/products.ts`

- [ ] **Hats (B-08) Activation**
  - Verify vendor assignment
  - Check pricing matches Shopify
  - Verify Product ID confirmation
  - Test product checkout
  - Activate in Shopify if test passes
  - Update `inStock: true` in `data/products.ts`

- [ ] **Scent Diffusers (C-02) Activation**
  - Verify vendor assignment
  - Check pricing matches Shopify
  - Verify Product ID confirmation
  - Test product checkout
  - Activate in Shopify if test passes
  - Update `inStock: true` in `data/products.ts`

- [ ] **Other Merchandise Activation**
  - Review all non-book products in Draft status
  - Activate products one-by-one after:
    - Vendor assignment verified
    - Price verification completed
    - Product ID confirmation
    - Testing and validation passed
  - **Impact:** Currently sales limited to books only
  - **Reference:** `docs/CRITICAL-ACTIONS-STATUS.md`, `docs/PRODUCT-LAUNCH-GUIDE.md`

---

## 🟢 **PRIORITY 7: E-commerce Integration - Amazon FBA**

### **Amazon FBA Setup** ⏳ **HIGH PRIORITY**
- [ ] **Amazon FBA Product Listing**
  - Create product listings with assigned GTINs
  - Configure product details (title, description, images)
  - Set pricing and inventory levels
  - Configure fulfillment settings
  - **Status:** Account approved, ready for implementation
  - **Reference:** `docs/CURRENT_SYSTEM_WORKFLOW.md`

- [ ] **Amazon FBA Integration Implementation**
  - Set up API integration with Amazon SP-API
  - Configure order fulfillment automation
  - Set up inventory sync
  - Test order processing flow
  - **Status:** Amazon SP-API Access approved (Case ID: `18523145211`)
  - **Reference:** `CREDENTIAL_COLLECTION_LIST.md`

- [ ] **Amazon FBA Inventory Management**
  - Set up cross-platform stock tracking
  - Configure inventory sync between Amazon and DSLLC
  - Set up low stock alerts
  - Monitor inventory levels

---

## 🟡 **PRIORITY 8: E-commerce Integration - Shopify**

### **Shopify Product Import** ⏳ **MEDIUM PRIORITY**
- [ ] **Import First 10 Products to Shopify**
  - Review products ready for sync
  - Import product data to Shopify
  - Verify product information accuracy
  - Test product display in Shopify store
  - **Status:** First 10 products ready for sync
  - **Reference:** `docs/CURRENT_SYSTEM_WORKFLOW.md`

- [ ] **Complete Shopify Store Setup**
  - Configure store settings
  - Set up payment methods
  - Configure shipping zones and rates
  - Set up tax settings
  - Configure store appearance
  - **Reference:** `docs/CURRENT_SYSTEM_WORKFLOW.md`

- [ ] **Shopify Inventory Sync System**
  - Create manual sync script (`scripts/sync-inventory-status.js`)
    - Fetch products from Shopify
    - Compare status with `data/products.ts`
    - Report mismatches
    - Optionally update `data/products.ts`
  - Add sync button to admin dashboard
  - Test sync functionality
  - **Reference:** `docs/inventory-sync-management.md`

- [ ] **Webhook Implementation for Real-Time Sync**
  - Set up Shopify webhooks for product updates
  - Set up webhooks for inventory changes
  - Set up webhooks for order status updates
  - Test webhook delivery and processing
  - **Reference:** `docs/CURRENT_SYSTEM_WORKFLOW.md`, `docs/inventory-sync-management.md`

---

## 🟠 **PRIORITY 9: Payment Processing**

### **Stripe Integration** ⏳ **MEDIUM PRIORITY**
- [ ] **Complete Stripe Integration**
  - Verify Stripe API keys configured
  - Test payment processing
  - Configure webhook endpoints
  - Set up payment confirmation emails
  - **Status:** Stripe configured (live mode), integration pending
  - **Reference:** `docs/CURRENT_SYSTEM_WORKFLOW.md`

- [ ] **Payment Processing Testing**
  - Test successful payment flow
  - Test failed payment handling
  - Test refund processing
  - Verify webhook delivery
  - Test payment confirmation emails

---

## 🔴 **PRIORITY 10: Inventory Management System**

### **Inventory Sync & Management**
- [ ] **Create Inventory Sync Script**
  - Build script to sync Shopify inventory status
  - Compare with `data/products.ts`
  - Report discrepancies
  - Optionally auto-update `data/products.ts`
  - **Location:** `scripts/sync-inventory-status.js`
  - **Reference:** `docs/inventory-sync-management.md`

- [ ] **Add Sync API Endpoint**
  - Create `app/api/shopify/sync-products/route.ts`
  - GET endpoint: Fetch and display sync status
  - POST endpoint: Update `data/products.ts`
  - Add error handling and logging
  - **Reference:** `docs/inventory-sync-management.md`

- [ ] **Add Admin Dashboard Sync Button**
  - Add "Sync Inventory Status" button to admin dashboard
  - Integrate with sync API endpoint
  - Display sync results
  - Add error handling
  - **Component:** `components/ShopifyIntegrationDashboard.tsx`
  - **Reference:** `docs/inventory-sync-management.md`

- [ ] **Set Up Webhook-Based Inventory Sync**
  - Configure Shopify webhooks for inventory changes
  - Create webhook handler for inventory updates
  - Update `data/products.ts` automatically
  - Test webhook delivery and processing
  - **Reference:** `docs/inventory-sync-management.md`

---

## 🟣 **PRIORITY 11: Future Enhancements (Optional)**

### **Product Interest & CRM Enhancements**
- [ ] **Enhanced Customer Profile**
  - Consider adding more tracking metrics
  - Consider adding customer segmentation
  - Consider adding purchase prediction

- [ ] **CRM Workflow Automation**
  - Set up automated follow-up emails
  - Set up lead scoring rules
  - Set up lead assignment rules

- [ ] **Reporting & Analytics**
  - Create custom dashboards in Zoho CRM
  - Set up automated reports
  - Create product interest trend analysis

- [ ] **Integration Enhancements**
  - Consider syncing with Shopify customer data
  - Consider adding webhook notifications
  - Consider adding real-time updates

### **E-commerce Enhancements**
- [ ] **Advanced Inventory Management**
  - Multi-warehouse inventory tracking
  - Automated reorder points
  - Inventory forecasting

- [ ] **Order Management Enhancements**
  - Order tracking integration
  - Automated shipping notifications
  - Return/refund automation

- [ ] **Analytics & Reporting**
  - Sales analytics dashboard
  - Product performance reports
  - Customer behavior analysis

---

## 📊 **Progress Tracking**

### **Overall Progress**
- **Total Tasks:** 100+
- **Completed:** 0
- **In Progress:** 0
- **Pending:** 100+

### **By Priority**
- **Priority 1 (Zoho CRM Setup):** 0/15 completed
- **Priority 2 (Zoho CRM Testing):** 0/10 completed
- **Priority 3 (Zoho CRM Evaluation):** 0/8 completed
- **Priority 4 (Documentation):** 0/4 completed
- **Priority 5 (Email & Infrastructure):** 0/5 completed
- **Priority 6 (Product Activation):** 0/4+ completed
- **Priority 7 (Amazon FBA):** 0/3 completed
- **Priority 8 (Shopify Integration):** 0/4 completed
- **Priority 9 (Payment Processing):** 0/2 completed
- **Priority 10 (Inventory Management):** 0/4 completed
- **Priority 11 (Future Enhancements):** 0/8+ completed

---

## 🔗 **Quick Reference Links**

### **Setup Guides**
- **Main Setup Guide:** `docs/ZOHO-CRM-PRODUCT-INTEREST-SETUP.md`
- **Free Plan Quick Start:** `docs/ZOHO-CRM-FREE-PLAN-SETUP.md`
- **Plan Comparison:** `docs/ZOHO-CRM-SUBSCRIPTION-TIER.md`
- **Next Phase Brief:** `docs/NEXT-PHASE-BRIEF-ZOHO-CRM-SETUP.md`
- **Phase Archive:** `docs/PHASE-ARCHIVE-PRODUCT-INTEREST-INTEGRATION.md`

### **External Links**
- **Zoho CRM Free Plan:** https://www.zoho.com/crm/free-crm/
- **Zoho API Console:** https://api-console.zoho.com/
- **Zoho CRM API Docs:** https://www.zoho.com/crm/developer/docs/api/v3/
- **Zoho CRM Support:** https://help.zoho.com/portal/en/kb/crm

---

## 📝 **Notes Section**

Use this section to track any issues, questions, or important notes:

```
[Add your notes here as you work through the tasks]
```

---

## 📚 **Related Documentation**

### **Product Interest & Zoho CRM**
- `docs/ZOHO-CRM-PRODUCT-INTEREST-SETUP.md` - Main setup guide
- `docs/ZOHO-CRM-FREE-PLAN-SETUP.md` - Free Plan quick start
- `docs/ZOHO-CRM-SUBSCRIPTION-TIER.md` - Plan comparison
- `docs/NEXT-PHASE-BRIEF-ZOHO-CRM-SETUP.md` - Next phase brief
- `docs/PHASE-ARCHIVE-PRODUCT-INTEREST-INTEGRATION.md` - Phase archive

### **Launch Critical Actions**
- `docs/CRITICAL-ACTIONS-STATUS.md` - Critical actions status report
- `docs/PRODUCT-LAUNCH-GUIDE.md` - Product launch standard procedure
- `docs/inventory-sync-management.md` - Inventory sync management

### **E-commerce Integration**
- `docs/CURRENT_SYSTEM_WORKFLOW.md` - Current system workflow
- `docs/shopify-fulfillment-setup.md` - Shopify fulfillment setup
- `CREDENTIAL_COLLECTION_LIST.md` - Credentials collection list

---

## ✅ **Completion Checklist**

When all Priority 1-3 tasks are complete:
- [ ] All Zoho CRM setup tasks completed
- [ ] Integration tested and working
- [ ] Free Plan evaluated
- [ ] Upgrade decision made (if needed)
- [ ] All documentation updated
- [ ] System fully operational

---

**Last Updated:** November 9, 2025  
**Next Review:** After Zoho CRM setup completion

