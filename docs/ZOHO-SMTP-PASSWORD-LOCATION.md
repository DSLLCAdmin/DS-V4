# 🔐 Where to Find Zoho SMTP Password

## ❌ **NOT on the SMTP Tab**

The SMTP tab shows:
- ✅ SMTP Host: `smtppro.zoho.com`
- ✅ SMTP Port: `465` (SSL)
- ❌ **NO password field** (this is normal!)

---

## ✅ **Password is in POP/IMAP Access Settings**

The password is in a **different section** of Zoho Mail settings.

### **Step-by-Step to Find Password:**

1. **Go to Zoho Mail:**
   - https://mail.zoho.com
   - Login as: `admin@darkstreetllc.com`

2. **Navigate to Settings:**
   - Click Settings (gear icon, top right)
   - Click **Mail** (left sidebar)
   - Click **POP/IMAP Access** (NOT "Mail Accounts" → "SMTP")

3. **Find Your Password:**
   - **If 2FA is NOT enabled:**
     - Use your **regular Zoho Mail password**
     - This is the same password you use to login
   
   - **If 2FA IS enabled:**
     - Click **"Generate App Password"** or **"Create App Password"**
     - Copy the generated password
     - This is your SMTP password (different from login password)

---

## 📋 **What You Need for Netlify:**

Based on your SMTP tab screenshot:

```
ZOHO_SMTP_HOST = smtppro.zoho.com
ZOHO_SMTP_PORT = 465
ZOHO_SMTP_USER = admin@darkstreetllc.com
ZOHO_SMTP_PASSWORD = [from POP/IMAP Access settings]
PRODUCT_INTEREST_EMAIL = ProductInterest@darkstreetllc.com
```

---

## 🔗 **Direct Link to POP/IMAP Access:**

After logging into Zoho Mail:
- Settings → Mail → POP/IMAP Access
- Or: https://mail.zoho.com → Settings → Mail → POP/IMAP Access

---

## 💡 **Why Password Isn't on SMTP Tab:**

Zoho doesn't display passwords on the SMTP settings page for security reasons. The password is managed in the POP/IMAP Access section where you can:
- Enable/disable IMAP access
- Generate app passwords (if 2FA enabled)
- See password requirements

---

**Last Updated:** November 9, 2025

