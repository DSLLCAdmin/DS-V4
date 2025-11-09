# 📧 Product Interest Email System - Setup Guide

## ✅ **What We've Implemented**

### **Current Flow:**
1. Customer clicks "Product Interest" button on unreleased products
2. Modal opens with contact form (Name, Email, Phone, Message)
3. Customer submits interest
4. System collects:
   - Customer contact details
   - Products visited (from localStorage)
   - Products purchased (from localStorage)
   - Browsing history
5. Email sent to **ProductInterest@darkstreetllc.com** (Zoho)

---

## 🔧 **Email Service Setup (Choose One)**

### **Option 1: Resend (Recommended for Next.js)** ⭐

**Why Resend?**
- Built for Next.js/React
- Simple API
- Free tier: 3,000 emails/month
- Excellent deliverability
- No SMTP configuration needed

**Setup Steps:**

1. **Sign up for Resend:**
   - Go to: https://resend.com
   - Create free account
   - Verify your domain (darkstreetllc.com)

2. **Get API Key:**
   - Dashboard → API Keys
   - Create new API key
   - Copy the key

3. **Add to Environment Variables:**
   ```env
   # .env.local
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   PRODUCT_INTEREST_EMAIL=ProductInterest@darkstreetllc.com
   ```

4. **Add to Netlify Environment Variables:**
   - Netlify Dashboard → Project configuration → Environment variables
   - Add `RESEND_API_KEY` and `PRODUCT_INTEREST_EMAIL`

5. **Install Resend (if needed):**
   ```bash
   npm install resend
   ```

---

### **Option 2: Zoho Mail SMTP**

**Setup Steps:**

1. **Get Zoho SMTP Credentials:**
   - Go to: https://mail.zoho.com
   - Settings → Mail → POP/IMAP Access
   - Enable "IMAP Access"
   - Generate "App Password" (if 2FA enabled)

2. **Add to Environment Variables:**
   ```env
   # .env.local
   ZOHO_SMTP_HOST=smtp.zoho.com
   ZOHO_SMTP_PORT=587
   ZOHO_SMTP_USER=admin@darkstreetllc.com
   ZOHO_SMTP_PASSWORD=your_app_password_here
   PRODUCT_INTEREST_EMAIL=ProductInterest@darkstreetllc.com
   ```

3. **Install Nodemailer:**
   ```bash
   npm install nodemailer @types/nodemailer
   ```

4. **Add to Netlify Environment Variables:**
   - Add all Zoho SMTP variables

---

### **Option 3: Zoho Mail API**

**Setup Steps:**

1. **Create Zoho API Application:**
   - Go to: https://api-console.zoho.com
   - Create new application
   - Get API key and access token

2. **Add to Environment Variables:**
   ```env
   # .env.local
   ZOHO_MAIL_API_KEY=your_zoho_api_key
   PRODUCT_INTEREST_EMAIL=ProductInterest@darkstreetllc.com
   ```

---

## 📋 **Zoho Email Alias Setup**

### **Create ProductInterest@darkstreetllc.com Alias:**

1. **Go to Zoho Mail Admin:**
   - https://mail.zoho.com
   - Login as admin@darkstreetllc.com

2. **Create Alias:**
   - Settings → Mail → Aliases
   - Add new alias: `ProductInterest@darkstreetllc.com`
   - Set as alias of: `admin@darkstreetllc.com`

3. **Create Filter (Optional):**
   - Settings → Mail → Filters
   - Create filter: "Product Interest Emails"
   - Condition: "To" contains "ProductInterest@darkstreetllc.com"
   - Action: Move to folder "Product Interest" (create folder first)

---

## 🧪 **Testing**

### **Test Email Sending:**

1. **Local Testing:**
   ```bash
   npm run dev
   ```
   - Navigate to a product with "In-Design" status
   - Click "Notify Me When Available"
   - Fill out contact form
   - Submit
   - Check console for success message
   - Check ProductInterest@darkstreetllc.com inbox

2. **Production Testing:**
   - Deploy to Netlify
   - Test on live site
   - Verify email arrives in Zoho inbox

---

## 📊 **Email Content Format**

The email sent to ProductInterest@darkstreetllc.com includes:

```
📦 PRODUCT INTEREST NOTIFICATION
================================

Product Information:
--------------------
Product ID: H-06
Product Title: Streeter Mug
Category: Culinary & Novelty
Timestamp: 2025-11-07T12:00:00Z

Customer Information:
---------------------
Name: John Doe
Email: john@example.com
Phone: (555) 123-4567
Message: Looking forward to this product!

Customer Profile:
-----------------
Products Visited: Streeter Tee, Dancer's Tee, DarkStreets' Otto Cap
Products Purchased: Streeter Mug (11 oz), Streeter Tee (Large)

Technical Details:
------------------
Referrer: https://darkstreetllc.com/shop
User Agent: Mozilla/5.0...
Timestamp: 2025-11-07T12:00:00Z
```

---

## 🔍 **Customer Profile Tracking**

### **What Gets Tracked:**

1. **Products Visited:**
   - Stored in `localStorage` as `customer_product_views`
   - Tracks last 10 products viewed
   - Includes product ID and title

2. **Products Purchased:**
   - Stored in `localStorage` as `customer_purchases`
   - Tracks last 10 purchases
   - Includes order details

3. **Cart Activity:**
   - Stored in `localStorage` as `customer_cart_adds`
   - Tracks items added to cart

### **How It Works:**

- When customer views a product → Tracked automatically
- When customer adds to cart → Tracked automatically
- When customer purchases → Tracked automatically
- When customer submits interest → All data included in email

---

## 🎯 **Best Practices**

### **Email Management:**

1. **Create Zoho Filter:**
   - Automatically organize Product Interest emails
   - Move to dedicated folder
   - Easy to review and respond

2. **Response Template:**
   - Create email template for responding to customers
   - Thank them for interest
   - Provide timeline estimate
   - Ask for additional feedback

3. **Customer Database:**
   - Consider exporting emails to spreadsheet
   - Track product interest trends
   - Identify high-demand products

---

## ⚠️ **Troubleshooting**

### **Email Not Sending:**

1. **Check Environment Variables:**
   - Verify `RESEND_API_KEY` or `ZOHO_SMTP_PASSWORD` is set
   - Check `PRODUCT_INTEREST_EMAIL` is correct

2. **Check API Route:**
   - Verify `/api/product-interest` is accessible
   - Check browser console for errors
   - Check Netlify function logs

3. **Check Email Service:**
   - Verify Resend/Zoho account is active
   - Check API key is valid
   - Verify domain is verified (for Resend)

### **Emails Not Arriving:**

1. **Check Spam Folder:**
   - Product Interest emails might be filtered
   - Mark as "Not Spam" if found

2. **Check Zoho Alias:**
   - Verify alias is created correctly
   - Check alias is routing to admin@ inbox

3. **Check Email Service Logs:**
   - Resend: Check dashboard for delivery status
   - Zoho: Check mail logs in admin panel

---

## 📝 **Next Steps**

1. ✅ Choose email service (Resend recommended)
2. ✅ Set up environment variables
3. ✅ Create ProductInterest@ alias in Zoho
4. ✅ Test email sending locally
5. ✅ Deploy to production
6. ✅ Test on live site
7. ✅ Set up Zoho filter for organization

---

**Last Updated:** November 7, 2025  
**Status:** ✅ Implementation Complete - Setup Required

