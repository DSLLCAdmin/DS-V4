# 🚨 URGENT: Amazon SP-API Call Required

**Deadline:** 2025-12-21  
**Account:** DarkStreet LLC  
**Developer Profile:** Admin DS_SBK  
**Status:** ⚠️ Account will be deactivated if no API call is made

---

## 📋 **Quick Action Steps**

### **Option 1: Using Postman (Recommended - Easiest)**

1. **Download Postman:**
   - Go to: https://www.postman.com/downloads/
   - Install Postman application

2. **Import Amazon SP-API Collection:**
   - Amazon provides a Postman collection for testing
   - Documentation: https://developer-docs.amazon.com/sp-api/docs/using-postman-for-selling-partner-api-models

3. **Configure Authentication:**
   - You'll need your SP-API credentials:
     - LWA (Login with Amazon) Client ID
     - LWA Client Secret
     - Refresh Token
     - AWS Access Key ID
     - AWS Secret Access Key
   - These should be available in your Amazon Developer Dashboard

4. **Make a Simple API Call:**
   - **Recommended Endpoint:** `GET /catalog/v0/items` (Catalog Items API)
   - This is a read-only endpoint that's safe to test
   - Alternative: `GET /orders/v0/orders` (if you have orders)

5. **Verify Success:**
   - Look for HTTP 200 response
   - Any successful response counts (even empty data)

---

### **Option 2: Using cURL (Command Line)**

If you have your credentials, you can use this cURL command:

```bash
curl -X GET "https://sellingpartnerapi-na.amazon.com/catalog/v0/items" \
  -H "x-amz-access-token: YOUR_ACCESS_TOKEN" \
  -H "x-amz-date: $(date -u +'%Y%m%dT%H%M%SZ')" \
  -H "Authorization: AWS4-HMAC-SHA256 Credential=..."
```

**Note:** This requires AWS signature v4 signing, which is complex. Postman is easier.

---

### **Option 3: Using Node.js Script**

If you prefer a script, here's a basic example:

```javascript
// amazon-sp-api-health-check.js
const https = require('https');

// You'll need to get these from Amazon Developer Dashboard
const config = {
  endpoint: 'https://sellingpartnerapi-na.amazon.com',
  accessToken: 'YOUR_ACCESS_TOKEN',
  // ... other auth credentials
};

// Simple health check - get catalog items
const options = {
  hostname: 'sellingpartnerapi-na.amazon.com',
  path: '/catalog/v0/items?MarketplaceId=ATVPDKIKX0DER',
  method: 'GET',
  headers: {
    'x-amz-access-token': config.accessToken,
    // Add AWS signature headers here
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    console.log('Response:', d.toString());
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.end();
```

**Note:** This is a simplified example. Full implementation requires AWS signature v4.

---

## 🔑 **Where to Find Your Credentials**

1. **Amazon Developer Dashboard:**
   - Go to: https://developer.amazonservices.com/
   - Login with your Developer account
   - Navigate to your application
   - Find: LWA credentials, Security Profile

2. **Seller Central:**
   - Go to: https://sellercentral.amazon.com/
   - Login with Seller Central credentials
   - Navigate to: Apps & Services → Develop Apps
   - Find: SP-API credentials

3. **AWS Console:**
   - You'll need AWS IAM credentials for signing requests
   - These should be linked to your SP-API application

---

## 📚 **Helpful Resources**

1. **Amazon SP-API Documentation:**
   - Main Docs: https://developer-docs.amazon.com/sp-api/
   - Postman Guide: https://developer-docs.amazon.com/sp-api/docs/using-postman-for-selling-partner-api-models

2. **Authentication Guide:**
   - LWA (Login with Amazon): https://developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api
   - AWS Signature: https://developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api#signing-requests

3. **API Reference:**
   - Catalog Items API: https://developer-docs.amazon.com/sp-api/docs/catalog-items-api-v0-reference
   - Orders API: https://developer-docs.amazon.com/sp-api/docs/orders-api-v0-reference

---

## ✅ **Success Criteria**

Any of these outcomes counts as a successful API call:
- ✅ HTTP 200 response (even with empty data)
- ✅ HTTP 400/403 with proper error message (shows API is responding)
- ✅ Any response that indicates the API endpoint was reached

**What does NOT count:**
- ❌ Connection timeout
- ❌ DNS resolution failure
- ❌ SSL certificate errors

---

## 🔄 **After Making the Call**

1. **Document the Call:**
   - Note the date and time
   - Save the response (screenshot or log)
   - Update this document with the date

2. **Set Reminder:**
   - Next call needed: ~60-90 days from successful call
   - Consider automating this with a scheduled script

3. **Verify Account Status:**
   - Check Amazon Developer Dashboard
   - Look for confirmation that account is active
   - Monitor for any follow-up emails from Amazon

---

## 📅 **Maintenance Schedule**

After this urgent call, set up regular maintenance:

- **Frequency:** Every 60-75 days (to stay ahead of 90-day baseline)
- **Next Call:** Calculate 60 days from successful call date
- **Automation:** Consider setting up automated health check

---

## 🆘 **If You Need Help**

1. **Amazon Developer Support:**
   - Check: https://developer-docs.amazon.com/sp-api/docs/contact-us
   - Case ID reference: `18523145211` (your previous SP-API approval)

2. **Documentation:**
   - All SP-API docs: https://developer-docs.amazon.com/sp-api/

3. **Community:**
   - Amazon Developer Forums

---

## 📝 **Call Log**

| Date | Time | Endpoint | Status | Notes |
|------|------|----------|--------|-------|
| | | | | |
| | | | | |

---

**Last Updated:** 2025-11-30  
**Next Required Call:** _______________ (60 days after successful call)

