# 🔐 DS LLC Account Maintenance Requirements

**Last Updated:** 2025-11-30  
**Status:** Launch Phase - Limited Business Activity

---

## 🚨 **URGENT: Amazon API Services**

### **⚠️ Action Required Before 2025-12-21**

**Issue:** Amazon Developer account has not had a successful API call in 60+ days. Account will be deactivated if no successful API call is made before the deadline.

**Account Details:**
- **Account Name:** DarkStreet LLC
- **Developer Profile:** Admin DS_SBK
- **SP-API Access:** APPROVED (Case ID: `18523145211`)
- **Amazon Se, orders, inventory)
3. Test endpoint: `https://developer-docs.amazon.com/sp-api/docs/using-postman-for-selling-partner-api-models#call-an-sp-api-endpoint`ller ID:** `A350LGOV5YMV4U`
- **Deadline:** 2025-12-21

**Required Action:**
1. Make a successful API call using an application within the Developer account
2. Use any SP-API endpoint (e.g., catalog items

**Maintenance Schedule:**
- **Frequency:** Every 60-90 days (to stay ahead of 90-day baseline)
- **Next Check:** 2025-03-21 (60 days from deadline)
- **Automation:** Consider setting up automated health check API calls

**Resources:**
- SP-API Documentation: https://developer-docs.amazon.com/sp-api/
- Postman Guide: https://developer-docs.amazon.com/sp-api/docs/using-postman-for-selling-partner-api-models
- Developer Dashboard: https://developer.amazonservices.com/

---

## 📋 **ALL SERVICES & MAINTENANCE REQUIREMENTS**

### **1. 🛍️ SHOPIFY**

**Status:** ✅ Active  
**Store:** `darkstreet-llc.myshopify.com` / `wenugu-5b.myshopify.com`  
**Developer Dashboard ID:** `181601160`

**Maintenance Tasks:**
- [ ] **Monthly:** Review API usage and webhook health
- [ ] **Quarterly:** Rotate API access tokens (if security policy requires)
- [ ] **Ongoing:** Monitor webhook delivery status
- [ ] **Ongoing:** Verify fulfillment services are configured (Amazon FBA, Printful, Manual)
- [ ] **Ongoing:** Check payment gateway status (Stripe integration)

**Key Credentials:**
- Admin API Access Token
- Webhook Secret
- Storefront API Token

**Documentation:**
- Admin API: https://shopify.dev/docs/api/admin
- Webhook Setup: See `SHOPIFY-WEBHOOK-SETUP-COMPLETE.md`

---

### **2. 📦 AMAZON FBA (Fulfillment by Amazon)**

**Status:** ✅ Active  
**Seller ID:** `A350LGOV5YMV4U`  
**Active Countries:** United States, Canada, Mexico

**Maintenance Tasks:**
- [ ] **URGENT:** Make SP-API call before 2025-12-21 (see above)
- [ ] **Monthly:** Review FBA inventory levels
- [ ] **Quarterly:** Verify tax information is current (currently VALIDATED ✅)
- [ ] **Ongoing:** Monitor seller account health metrics
- [ ] **Ongoing:** Check for policy violations or account warnings
- [ ] **Ongoing:** Review and respond to customer service messages

**Key Credentials:**
- Seller Central Login
- SP-API Developer Credentials
- Security Profile (Admin DS_SBK)

**Documentation:**
- Seller Central: https://sellercentral.amazon.com/
- SP-API: https://developer-docs.amazon.com/sp-api/

---

### **3. 🎨 PRINTFUL**

**Status:** ⚠️ Mentioned in fulfillment setup, needs verification

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and is connected to Shopify
- [ ] **Monthly:** Review product catalog sync
- [ ] **Monthly:** Check fulfillment success rates
- [ ] **Quarterly:** Review pricing and shipping costs
- [ ] **Ongoing:** Monitor order fulfillment status

**Setup Required:**
- Connect Printful account to Shopify
- Configure products (T-01: DarkStreets Tee, B-08: Hats)
- Enable automatic fulfillment

**Documentation:**
- Printful Integration: See `docs/shopify-fulfillment-setup.md`

---

### **4. 💳 STRIPE PAYMENTS**

**Status:** ✅ Active (Production Ready)  
**Account ID:** `acct_1R082h4umMavg4ao`  
**API Version:** `2025-06-30.basil`

**Maintenance Tasks:**
- [ ] **Monthly:** Review transaction volume and fees
- [ ] **Quarterly:** Review webhook delivery logs
- [ ] **Annually:** Review and update API version (if deprecated)
- [ ] **Ongoing:** Monitor for failed payments or disputes
- [ ] **Ongoing:** Check webhook endpoint health (`/api/webhooks/stripe`)

**Key Credentials:**
- Live Secret Key
- Webhook Secret
- Publishable Key

**Documentation:**
- Dashboard: https://dashboard.stripe.com/
- Webhook Events: Account category (4 events configured)

---

### **5. ☁️ NETLIFY (Hosting)**

**Status:** ✅ Active  
**Site:** `ds-v5.netlify.app`  
**Domain:** `darkstreetllc.com`  
**Team:** DStreeters

**Maintenance Tasks:**
- [ ] **Weekly:** Monitor deployment status
- [ ] **Monthly:** Review build logs for errors
- [ ] **Quarterly:** Review environment variables
- [ ] **Ongoing:** Monitor site uptime and performance
- [ ] **Ongoing:** Check SSL certificate status (auto-renewed)
- [ ] **Ongoing:** Review bandwidth and build minutes usage

**Key Credentials:**
- GitHub OAuth (via DSLLCAdmin)
- Environment Variables (multiple services)

**Documentation:**
- Dashboard: https://app.netlify.com
- Build Troubleshooting: See `docs/NETLIFY-BUILD-HANG-TROUBLESHOOTING.md`

---

### **6. 📧 EMAIL SERVICES**

#### **6a. Zoho Mail (Primary Email)**

**Status:** ✅ Active  
**Domain:** `mail.darkstreetllc.com`  
**SMTP Server:** `smtp.darkstreetllc.com`

**Maintenance Tasks:**
- [ ] **Monthly:** Review email account access
- [ ] **Quarterly:** Rotate SMTP passwords (if security policy requires)
- [ ] **Ongoing:** Monitor email deliverability
- [ ] **Ongoing:** Check SPF/DMARC records validity

**Key Credentials:**
- SMTP Password (App Password if 2FA enabled)
- IMAP/POP3 Access

**Documentation:**
- SMTP Setup: See `docs/ZOHO-SMTP-CREDENTIALS-REFERENCE.md`

#### **6b. SendGrid (Transactional Email)**

**Status:** ⚠️ Mentioned but may not be fully configured

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and API key is valid
- [ ] **Monthly:** Review email sending volume
- [ ] **Quarterly:** Review bounce and spam complaint rates
- [ ] **Ongoing:** Monitor sender reputation

**Setup Required:**
- Verify SendGrid account status
- Configure API key in environment variables
- Set up domain authentication

---

### **7. 🗄️ SUPABASE (Database)**

**Status:** ✅ Active  
**Project:** DSLLC_Admin-Backup  
**Project URL:** `https://tepxztroomkqqnsrjcoa.supabase.co`

**Maintenance Tasks:**
- [ ] **Monthly:** Review database usage and storage
- [ ] **Quarterly:** Review API key rotation (if needed)
- [ ] **Ongoing:** Monitor database performance
- [ ] **Ongoing:** Check backup status

**Key Credentials:**
- Anon Public Key
- Service Role Secret
- Database URL

**Documentation:**
- Dashboard: https://supabase.com/dashboard

---

### **8. 🐙 GITHUB (Version Control)**

**Status:** ✅ Active  
**Account:** DSLLCAdmin  
**Repository:** `github.com/DSLLCAdmin/DS-V4`

**Maintenance Tasks:**
- [ ] **Monthly:** Review repository access and permissions
- [ ] **Quarterly:** Review and rotate Personal Access Tokens (if used)
- [ ] **Ongoing:** Monitor for security alerts
- [ ] **Ongoing:** Review and merge dependency updates

**Key Credentials:**
- GitHub Account Access
- Personal Access Tokens (if applicable)
- SSH Keys (if applicable)

---

### **9. 🌐 DOMAIN & DNS**

**Status:** ✅ Active  
**Domain:** `darkstreetllc.com`  
**Registrar:** Wyoming Agents  
**Hosting Provider:** Epik LLC  
**Expiration:** 2026-08-04

**Maintenance Tasks:**
- [ ] **Annually:** Renew domain before expiration (2026-08-04)
- [ ] **Quarterly:** Review DNS records
- [ ] **Ongoing:** Monitor domain status
- [ ] **Ongoing:** Verify auto-renewal is enabled ✅

**Key Credentials:**
- Domain Registrar Login (Wyoming Agents)
- DNS Management Access

**Contact:**
- Registrar: `legal@epik.com`
- Phone: `+1-208-618-2758`

---

### **10. 📊 ANALYTICS & TRACKING**

#### **10a. Google Analytics**

**Status:** ⚠️ Mentioned but may not be configured

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and tracking code is installed
- [ ] **Monthly:** Review analytics data
- [ ] **Quarterly:** Review goals and conversion tracking

**Setup Required:**
- Verify Google Analytics account
- Confirm tracking ID in environment variables
- Test tracking on live site

#### **10b. Google Tag Manager**

**Status:** ⚠️ Mentioned but may not be configured

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and container is deployed
- [ ] **Quarterly:** Review tags and triggers

---

### **11. 🤖 OPENAI (Chatbot Service)**

**Status:** ⚠️ Mentioned but may not be configured

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and API key is valid
- [ ] **Monthly:** Review API usage and costs
- [ ] **Quarterly:** Review and update system prompts

**Setup Required:**
- Verify OpenAI account
- Configure API key in environment variables
- Test chatbot functionality

---

### **12. 🎫 ZENDESK (Customer Support)**

**Status:** ⚠️ Mentioned but may not be configured

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and is integrated
- [ ] **Monthly:** Review ticket volume and response times
- [ ] **Quarterly:** Review API token validity

**Setup Required:**
- Verify Zendesk account
- Configure API token
- Set up subdomain: `dsllc`

---

### **13. 📚 AMAZON KDP (Kindle Direct Publishing)**

**Status:** ✅ Active (Income Tracker configured)

**Maintenance Tasks:**
- [ ] **Monthly:** Review royalty reports
- [ ] **Quarterly:** Verify tax information (W-9)
- [ ] **Ongoing:** Monitor book sales and performance
- [ ] **Ongoing:** Update book listings as needed

**Key Credentials:**
- KDP Account Login
- Author Central Access

---

### **14. 💰 PAYPAL**

**Status:** ⚠️ Mentioned in payment methods, needs verification

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and is connected to Shopify
- [ ] **Monthly:** Review transaction volume
- [ ] **Quarterly:** Review API credentials
- [ ] **Ongoing:** Monitor for disputes or chargebacks

**Setup Required:**
- Verify PayPal Business account
- Configure PayPal in Shopify payment settings
- Test PayPal checkout flow

---

### **15. 🔍 SENTRY (Error Monitoring)**

**Status:** ⚠️ Mentioned but may not be configured

**Maintenance Tasks:**
- [ ] **Verify:** Account exists and DSN is configured
- [ ] **Weekly:** Review error reports
- [ ] **Monthly:** Review and resolve critical errors

**Setup Required:**
- Verify Sentry account
- Configure DSN in environment variables
- Test error reporting

---

## 📅 **MAINTENANCE SCHEDULE SUMMARY**

### **Daily/Weekly:**
- Monitor Netlify deployments
- Check for critical errors (Sentry, if configured)
- Review order fulfillment status

### **Monthly:**
- Review all service usage and costs
- Check API/webhook health
- Review analytics data
- Monitor email deliverability

### **Quarterly:**
- Review and rotate API keys (if required by security policy)
- Review DNS and domain status
- Audit environment variables
- Review service subscriptions and costs

### **Annually:**
- Domain renewal (2026-08-04)
- Review and update API versions
- Security audit of all accounts
- Review and update business information

### **As Needed:**
- Amazon SP-API calls (every 60-90 days to maintain access)
- Service-specific updates and patches
- Security incident response

---

## 🚨 **CRITICAL DEADLINES**

| Service | Deadline | Action Required |
|---------|----------|----------------|
| **Amazon SP-API** | **2025-12-21** | **Make successful API call** |
| Domain Renewal | 2026-08-04 | Renew domain registration |

---

## 📝 **NOTES**

- **Launch Phase:** DS LLC is still in launch phase with limited business activity
- **Account Status:** Most accounts are active but some services may need verification
- **Automation:** Consider automating health checks for critical services (Amazon SP-API, webhooks)
- **Documentation:** Keep this document updated as services are added or removed

---

## 🔗 **QUICK REFERENCE LINKS**

- **Amazon SP-API:** https://developer-docs.amazon.com/sp-api/
- **Shopify Admin:** https://admin.shopify.com/
- **Stripe Dashboard:** https://dashboard.stripe.com/
- **Netlify Dashboard:** https://app.netlify.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repository:** https://github.com/DSLLCAdmin/DS-V4

---

**Last Review Date:** _______________  
**Next Review Date:** _______________  
**Reviewed By:** _______________

