# 🆓 Zoho CRM Free Plan - Quick Setup Guide

## 🎯 **Starting with Free Plan**

We're starting with the **Free Plan** to test the integration and determine if the API access is sufficient for our needs. If it works well, we'll continue with Free. If API access is too limited, we'll upgrade to Standard Plan.

---

## 🔗 **Sign Up Link**

### **Direct Link to Zoho CRM Free Plan:**
**https://www.zoho.com/crm/free-crm/**

Or go to: https://www.zoho.com/crm/ and click "Sign Up Free"

---

## 📋 **Step-by-Step Signup**

### **Step 1: Create Account**

1. **Click:** "Sign Up Free" or "Get Started Free"
2. **Fill in:**
   - **Email:** `admin@darkstreetllc.com`
   - **Password:** (create secure password)
   - **Company Name:** DarkStreet LLC
   - **Phone:** (optional)
3. **Click:** "Sign Up"
4. **Verify Email:** Check your inbox for verification email
5. **Complete Setup Wizard:**
   - Choose your industry
   - Select number of users (up to 3 for Free Plan)
   - Complete basic setup

---

## 🔑 **Credentials You'll Need to Get**

After signing up, you'll need to get these credentials for the integration:

### **1. Client ID & Client Secret**
- **Where:** Zoho API Console (https://api-console.zoho.com/)
- **How:** Create a new API application (see Step 2 in main setup guide)

### **2. Refresh Token**
- **Where:** Generated from API Console
- **How:** Authorize application and exchange code for token (see Step 3 in main setup guide)

### **3. API Domain**
- **Default:** `com` (for US/Global)
- **Other options:** `eu`, `in`, `com.au`, `jp` (based on your region)

---

## ⚠️ **Free Plan Limitations to Test**

### **What We're Testing:**
1. ✅ **API Access** - Does Free Plan have sufficient API access?
2. ✅ **Custom Fields** - Can we create custom fields for Product Interest data?
3. ✅ **Lead Creation** - Can we create leads via API?
4. ✅ **Data Storage** - Are there storage limits that affect us?

### **Potential Issues:**
- ⚠️ **Limited API Calls** - Free Plan may have rate limits
- ⚠️ **Custom Fields** - May have restrictions on custom field creation
- ⚠️ **Storage Limits** - May have limits on number of leads/records

### **If Free Plan Doesn't Work:**
- We'll upgrade to **Standard Plan** ($14/user/month)
- Standard Plan has full API access guaranteed
- Easy upgrade path - no data loss

---

## 📝 **Quick Checklist**

After signing up, you'll need to:

- [ ] Sign up for Zoho CRM Free Plan
- [ ] Verify email address
- [ ] Complete setup wizard
- [ ] Create API application in Zoho API Console
- [ ] Get Client ID and Client Secret
- [ ] Generate Refresh Token
- [ ] Test API access (we'll help with this)
- [ ] Determine if Free Plan is sufficient or need to upgrade

---

## 🔄 **Next Steps After Signup**

1. **Follow Main Setup Guide:** `docs/ZOHO-CRM-PRODUCT-INTEREST-SETUP.md`
   - Step 2: Create API Application
   - Step 3: Generate Refresh Token
   - Step 4: Create Custom Fields (test if allowed)
   - Step 5: Add Environment Variables
   - Step 6: Test Integration

2. **Test Integration:**
   - Submit Product Interest on website
   - Check if lead is created in Zoho CRM
   - Verify all data is stored correctly

3. **Evaluate:**
   - If Free Plan works → Continue using Free Plan
   - If API access is limited → Upgrade to Standard Plan

---

## 💡 **Upgrade Decision Guide**

### **Upgrade to Standard Plan if:**
- ❌ API calls are rate-limited or blocked
- ❌ Custom fields cannot be created
- ❌ Lead creation via API fails
- ❌ Storage limits are reached quickly
- ✅ Need more than 3 users
- ✅ Need advanced reporting

### **Stay on Free Plan if:**
- ✅ API access works for our needs
- ✅ Custom fields can be created
- ✅ Lead creation works perfectly
- ✅ Storage limits are sufficient
- ✅ 3 users or less is enough

---

## 📞 **Support**

- **Zoho CRM Support:** https://help.zoho.com/portal/en/kb/crm
- **Zoho API Documentation:** https://www.zoho.com/crm/developer/docs/api/v3/
- **Zoho API Console:** https://api-console.zoho.com/

---

## 🎯 **Sign Up Now**

**Direct Link:** https://www.zoho.com/crm/free-crm/

After signing up, let me know and I'll help you:
1. Get the API credentials
2. Set up the integration
3. Test if Free Plan works for our needs
4. Decide if we need to upgrade

---

**Last Updated:** November 9, 2025

