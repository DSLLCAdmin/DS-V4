# 🗄️ Zoho CRM Product Interest Database Setup

## 📋 **Overview**

This guide sets up Zoho CRM to store Product Interest data from your website. This creates a centralized database where you can:
- Track all product interest submissions
- View customer profiles and browsing history
- Generate reports and analytics
- Manage follow-ups and customer relationships

---

## 💰 **Zoho CRM Subscription Tiers**

### **Starting with: Free Plan** ⭐ (Testing Phase)
- **Price:** Free (up to 3 users)
- **Sign Up:** https://www.zoho.com/crm/free-crm/
- **Perfect for:** Testing integration before committing
- **Includes:**
  - Lead management
  - Basic features
  - Limited API access ⚠️ (we'll test if sufficient)
  - Up to 3 users
- **Limitations:**
  - Limited API access (may affect integration)
  - Basic features only
  - May not support all custom fields
- **Upgrade Path:** If Free Plan API access is insufficient, upgrade to Standard Plan ($14/user/month)

### **Upgrade Option: Standard Plan**
- **Price:** $14/user/month (billed annually) or $20/month (monthly)
- **Free Trial:** 15 days
- **When to upgrade:** If Free Plan API access is too limited
- **Includes:**
  - Full API access ✅
  - Lead scoring
  - Multiple pipelines
  - Standard reports
  - 250 mass emails daily

### **Upgrade Path:**
- **Professional Plan:** $23/user/month - For advanced reporting
- **Enterprise Plan:** $40/user/month - For custom modules and advanced features

---

## 🔧 **Setup Steps**

### **Step 1: Sign Up for Zoho CRM Free Plan**

1. **Go to:** https://www.zoho.com/crm/free-crm/
2. **Click:** "Sign Up Free" or "Get Started Free"
3. **Choose:** Free Plan (we'll test first, upgrade to Standard if needed)
4. **Create Account:**
   - Use: `admin@darkstreetllc.com`
   - Verify email
   - Complete setup wizard
   - **Note:** Free Plan has limited API access - we'll test to see if it works for our needs

---

### **Step 2: Create Zoho API Application**

1. **Go to:** https://api-console.zoho.com/
2. **Login** with your Zoho account
3. **Click:** "Add Client"
4. **Select:** "Server-based Applications"
5. **Fill in:**
   - **Client Name:** "DS LLC Product Interest"
   - **Homepage URL:** `https://darkstreetllc.com`
   - **Authorized Redirect URIs:** 
     - `https://darkstreetllc.com/api/zoho-callback`
     - `http://localhost:3000/api/zoho-callback` (for local testing)
6. **Click:** "Create"
7. **Copy Credentials:**
   - **Client ID** (save this)
   - **Client Secret** (save this)

---

### **Step 3: Generate Refresh Token**

1. **Open Browser:** Go to this URL (replace `YOUR_CLIENT_ID` with your Client ID):
   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=https://darkstreetllc.com/api/zoho-callback
   ```

2. **Authorize:** Click "Accept" to authorize the application

3. **Get Code:** You'll be redirected to a URL like:
   ```
   https://darkstreetllc.com/api/zoho-callback?code=1000.xxxxx.xxxxx
   ```
   - **Copy the `code` value** (the part after `code=`)

4. **Exchange Code for Refresh Token:**
   - Use this command (replace values):
   ```bash
   curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
     -d "grant_type=authorization_code" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=https://darkstreetllc.com/api/zoho-callback" \
     -d "code=YOUR_CODE_FROM_STEP_3"
   ```
   - **Save the `refresh_token`** from the response

---

### **Step 4: Create Custom Fields in Zoho CRM (Optional but Recommended)**

1. **Go to:** Zoho CRM → Settings (gear icon) → Customization → Modules → Leads → Fields
2. **Click:** "New Field"
3. **Create these fields:**
   - **Product_ID** (Text, 50 characters)
   - **Product_Title** (Text, 255 characters)
   - **Product_Category** (Text, 100 characters)
   - **Customer_Message** (Long Text)
   - **Products_Visited** (Long Text)
   - **Products_Purchased** (Long Text)
   - **Cart_Items** (Long Text)
   - **Total_Product_Views** (Number)
   - **Total_Purchases** (Number)
   - **Total_Cart_Adds** (Number)
   - **Total_Spent** (Currency)
   - **Time_On_Site_Minutes** (Number)
   - **Referrer** (Text, 255 characters)
   - **User_Agent** (Long Text)
   - **Interest_Submitted_At** (Date/Time)

**Note:** If you don't create custom fields, the data will still be stored in the `Description` field.

---

### **Step 5: Add Environment Variables**

#### **Local (.env.local):**
```env
# Zoho CRM API Credentials
ZOHO_CRM_CLIENT_ID=your_client_id_here
ZOHO_CRM_CLIENT_SECRET=your_client_secret_here
ZOHO_CRM_REFRESH_TOKEN=your_refresh_token_here
ZOHO_CRM_API_DOMAIN=com  # Use 'com', 'eu', 'in', 'com.au', or 'jp' based on your region
```

#### **Netlify Environment Variables:**
1. **Go to:** Netlify Dashboard → Your Site → Site configuration → Environment variables
2. **Add:**
   - `ZOHO_CRM_CLIENT_ID` = (your Client ID)
   - `ZOHO_CRM_CLIENT_SECRET` = (your Client Secret)
   - `ZOHO_CRM_REFRESH_TOKEN` = (your Refresh Token)
   - `ZOHO_CRM_API_DOMAIN` = `com` (or your region)

---

### **Step 6: Test Integration**

1. **Deploy** your changes to Netlify
2. **Visit** your website
3. **Express interest** in an unreleased product
4. **Check Zoho CRM:**
   - Go to: Zoho CRM → Leads
   - You should see a new lead with the product interest data

---

## 📊 **Using Zoho CRM for Product Interest**

### **Viewing Product Interest:**
1. **Go to:** Zoho CRM → Leads
2. **Filter by:** Lead Source = "Website - Product Interest"
3. **View:** All product interest submissions

### **Generating Reports:**
1. **Go to:** Zoho CRM → Reports
2. **Create Report:**
   - **Type:** Leads Report
   - **Filter:** Lead Source = "Website - Product Interest"
   - **Group by:** Product Category or Product Title
   - **Metrics:** Count of Leads, Total Spent

### **Following Up:**
1. **Open Lead** in Zoho CRM
2. **View:** Customer profile, products visited, purchase history
3. **Update:** Lead Status (e.g., "Contacted", "Qualified")
4. **Add Notes:** Track follow-up conversations

---

## 🔍 **Troubleshooting**

### **Issue: "Failed to get access token"**
- **Check:** Client ID, Client Secret, and Refresh Token are correct
- **Verify:** API Domain matches your Zoho region
- **Solution:** Regenerate Refresh Token if expired

### **Issue: "Failed to create lead"**
- **Check:** Zoho CRM subscription is active
- **Verify:** API access is enabled in your Zoho CRM plan
- **Solution:** Ensure you're on Standard Plan or higher

### **Issue: Custom fields not saving**
- **Check:** Field names match exactly (case-sensitive)
- **Verify:** Fields are created in Zoho CRM
- **Solution:** Check field API names in Zoho CRM Settings

---

## ✅ **Success Checklist**

- [ ] Zoho CRM account created (Standard Plan recommended)
- [ ] API application created in Zoho API Console
- [ ] Refresh Token generated
- [ ] Custom fields created (optional)
- [ ] Environment variables added to `.env.local`
- [ ] Environment variables added to Netlify
- [ ] Test submission created in Zoho CRM
- [ ] Reports configured for analytics

---

## 📞 **Support**

- **Zoho CRM Support:** https://help.zoho.com/portal/en/kb/crm
- **Zoho API Documentation:** https://www.zoho.com/crm/developer/docs/api/v3/
- **Zoho API Console:** https://api-console.zoho.com/

---

## 💡 **Next Steps**

1. **Set up automated workflows** in Zoho CRM to send follow-up emails
2. **Create custom reports** for product interest trends
3. **Integrate with Zoho Inventory** to track product demand
4. **Set up lead scoring** based on customer profile data

---

**Last Updated:** November 9, 2025

