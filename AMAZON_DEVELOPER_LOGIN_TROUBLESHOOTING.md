# 🔐 Amazon Developer Dashboard Login Troubleshooting

**Issue:** "Not Authorized" error when trying to access Amazon Developer Dashboard  
**Attempted Email:** `admin@darkstreetllc.com`  
**Developer Profile:** Admin DS_SBK

---

## 🎯 **The Problem**

The Amazon Developer account is **separate** from your Seller Central account. The email `admin@darkstreetllc.com` is not associated with the Developer account.

**Key Information:**
- **Developer Profile Name:** Admin DS_SBK
- **Seller ID:** `A350LGOV5YMV4U` (Seller Central - different account)
- **SP-API Access:** APPROVED (Case ID: `18523145211`)

---

## ✅ **Solution Options**

### **Option 1: Try Seller Central First (Recommended)**

Since your Seller Central account is active, you can access SP-API credentials through Seller Central:

**Steps:**
1. Go to: **https://sellercentral.amazon.com/**
2. Login with your Seller Central credentials
3. Navigate to: **Apps & Services** → **Develop Apps**
4. You should see your SP-API application there
5. Access credentials from there

**Why this works:**
- Seller Central and Developer accounts can be linked
- SP-API credentials are accessible from Seller Central
- Your Seller ID `A350LGOV5YMV4U` is active

---

### **Option 2: Find the Correct Developer Account Email**

The Developer account was likely created with a **personal email** (possibly Scott Knox's email). Try:

**Possible Email Addresses:**
- Personal email associated with "Scott Boyd Knox"
- Email used during the original SP-API setup months ago
- Check your email history for Amazon Developer account creation emails

**Steps to Find:**
1. Search your email inbox for:
   - "Amazon Developer"
   - "SP-API"
   - "Developer.amazonservices.com"
   - Case ID: `18523145211`
2. Look for account creation or approval emails from months ago
3. The email address in those messages is likely your Developer account login

---

### **Option 3: Use "Forgot Password" with Different Emails**

Try password recovery with emails you might have used:

1. Go to: **https://developer.amazonservices.com/ap/signin**
2. Click **"Need help?"**
3. Try **"Forgot your password?"**
4. Enter possible email addresses:
   - Personal email (Scott Knox)
   - Any email you used for Amazon accounts
   - Check if any email is recognized

---

### **Option 4: Access via Seller Central Developer Apps**

**Direct Path:**
1. Login to Seller Central: **https://sellercentral.amazon.com/**
2. Go to: **Settings** → **User Permissions** (if you have admin access)
3. Or: **Apps & Services** → **Develop Apps**
4. Look for your SP-API application
5. Click on it to view credentials

**Alternative Path:**
- Seller Central → **Performance** → **API Access** (if available)

---

### **Option 5: Contact Amazon Support**

If you can't access the account:

**Contact Information:**
- **Case ID Reference:** `18523145211` (your SP-API approval case)
- **Support:** https://developer-docs.amazon.com/sp-api/docs/contact-us
- **Mention:**
  - Developer Profile: Admin DS_SBK
  - Seller ID: `A350LGOV5YMV4U`
  - Need to access SP-API credentials
  - Account was created months ago

---

## 🔍 **Where to Find Credentials (Once Logged In)**

### **If Accessing via Seller Central:**

1. **Login with Amazon (LWA) Credentials:**
   - Seller Central → Apps & Services → Develop Apps
   - Select your application
   - Go to **"Login with Amazon"** section
   - Find: Client ID, Client Secret

2. **Refresh Token:**
   - Same location
   - May need to generate/authorize if not already done

3. **AWS Credentials:**
   - These are in AWS Console, not Amazon
   - Go to: https://console.aws.amazon.com/iam/
   - Look for IAM user associated with SP-API

---

### **If Accessing via Developer Dashboard:**

1. **Login:** https://developer.amazonservices.com/
2. **Navigate:** Apps & Services → Develop Apps
3. **Select Application:** Your SP-API application
4. **View Credentials:**
   - Login with Amazon (LWA) section
   - Security Profile section
   - IAM ARN and External ID

---

## 📋 **Quick Checklist**

- [ ] Try logging into Seller Central first
- [ ] Check Seller Central → Apps & Services → Develop Apps
- [ ] Search email history for Amazon Developer account emails
- [ ] Try password recovery with different email addresses
- [ ] Check if credentials are already saved in a password manager
- [ ] Contact Amazon Support with Case ID `18523145211`

---

## 💡 **Alternative: Check Your Records**

Since you went through the process months ago, check:

1. **Password Manager:**
   - Search for "Amazon Developer"
   - Search for "SP-API"
   - Search for "developer.amazonservices.com"

2. **Browser Saved Passwords:**
   - Chrome: Settings → Passwords → Search "amazon"
   - Look for developer.amazonservices.com entries

3. **Documentation/Notes:**
   - Any notes from when you set up SP-API
   - Emails saved from the setup process
   - Chat history from when you set it up

4. **Chat Backups:**
   - Check: `D:\A-Knox\DS LLC\DS Website-Next_2\DS_2\chat-backups\`
   - Search for "Amazon Developer" or "SP-API" in backup files

---

## 🚨 **Important Notes**

1. **Two Separate Accounts:**
   - **Seller Central:** For selling (Seller ID: `A350LGOV5YMV4U`)
   - **Developer Dashboard:** For API access (Profile: Admin DS_SBK)
   - They can be linked, but may use different login emails

2. **Credentials Location:**
   - LWA credentials: Amazon Developer Dashboard or Seller Central
   - AWS credentials: AWS IAM Console (separate login)
   - Role ARN: AWS IAM Console

3. **If You Can't Access:**
   - Amazon Support can help recover access
   - Use Case ID `18523145211` as reference
   - They may be able to link accounts or reset access

---

## 🔗 **Direct Links**

- **Seller Central:** https://sellercentral.amazon.com/
- **Developer Dashboard:** https://developer.amazonservices.com/
- **AWS IAM Console:** https://console.aws.amazon.com/iam/
- **Amazon Support:** https://developer-docs.amazon.com/sp-api/docs/contact-us

---

**Next Steps:**
1. Try Seller Central login first (most likely to work)
2. Check Apps & Services → Develop Apps in Seller Central
3. If that doesn't work, search email history for Developer account emails
4. Contact Amazon Support if needed

---

**Last Updated:** 2025-11-30  
**Status:** Need to identify correct Developer account email or access via Seller Central



