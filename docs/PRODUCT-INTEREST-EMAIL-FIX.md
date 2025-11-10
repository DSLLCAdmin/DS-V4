# 🔧 Product Interest Email - Fix Guide

## ❌ **Problem:**
Emails are not being sent because no email service is configured. The system is only logging to console.

## ✅ **Solution: Set Up Zoho SMTP**

Since you're already using Zoho for email, we'll use Zoho SMTP to send emails.

---

## **Step 1: Get Zoho SMTP Credentials**

1. **Go to Zoho Mail:**
   - https://mail.zoho.com
   - Login as `admin@darkstreetllc.com`

2. **Enable IMAP/SMTP Access:**
   - Settings (gear icon) → Mail → POP/IMAP Access
   - Enable "IMAP Access"
   - If 2FA is enabled, generate an "App Password"
   - If 2FA is NOT enabled, use your regular password

3. **Note Your SMTP Settings:**
   - SMTP Host: `smtp.zoho.com`
   - SMTP Port: `587` (or `465` for SSL)
   - SMTP User: `admin@darkstreetllc.com`
   - SMTP Password: Your app password (or regular password if no 2FA)

---

## **Step 2: Install Nodemailer Package**

Run this command in your project directory:

```bash
npm install nodemailer @types/nodemailer
```

Then commit and push:

```bash
git add package.json package-lock.json
git commit -m "Add nodemailer for email sending"
git push origin main
```

---

## **Step 3: Add Environment Variables to Netlify**

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com
   - Select your site (DS_2 or ds-v5)

2. **Navigate to Environment Variables:**
   - Project configuration → Environment variables

3. **Add These Variables:**
   ```
   ZOHO_SMTP_HOST = smtp.zoho.com
   ZOHO_SMTP_PORT = 587
   ZOHO_SMTP_USER = admin@darkstreetllc.com
   ZOHO_SMTP_PASSWORD = [your_app_password_here]
   PRODUCT_INTEREST_EMAIL = ProductInterest@darkstreetllc.com
   ```

4. **Save All Variables**

---

## **Step 4: Trigger New Deployment**

After adding environment variables:
- Go to Deploys tab
- Click "Trigger deploy" → "Deploy site"
- Wait for deployment to complete (2-3 minutes)

---

## **Step 5: Test Again**

1. Go to your live site
2. Navigate to an unreleased product
3. Click "Notify Me When Available"
4. Fill out the form and submit
5. Check ProductInterest@darkstreetllc.com inbox

---

## **Alternative: Use Resend (Easier Setup)**

If Zoho SMTP is too complicated, you can use Resend instead:

1. **Sign up for Resend:**
   - https://resend.com
   - Free tier: 3,000 emails/month

2. **Get API Key:**
   - Dashboard → API Keys → Create new key

3. **Add to Netlify Environment Variables:**
   ```
   RESEND_API_KEY = re_xxxxxxxxxxxxx
   PRODUCT_INTEREST_EMAIL = ProductInterest@darkstreetllc.com
   ```

4. **No package installation needed** - Resend uses fetch API

---

## **Verify Configuration**

After deployment, check Netlify function logs:
- Netlify Dashboard → Functions → View logs
- Look for email sending attempts
- Should see "Email sent via SMTP" or error messages

---

**Last Updated:** November 9, 2025

