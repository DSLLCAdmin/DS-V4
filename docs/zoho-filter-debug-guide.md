# 🔍 ZOHO FILTER DEBUG - ALL EMAILS IN TEST FOLDER

**Date:** October 30, 2025  
**Issue:** All emails ending up in Test folder despite correct conditions  
**Status:** Email addresses confirmed correct (no typos)

---

## 🔍 **POSSIBLE CAUSES:**

Since email addresses are correct and "Do not process other filters" is checked, possible issues:

1. **Filter Order** - Test filter processing before others
2. **Test Filter Condition Too Broad** - Catching emails it shouldn't
3. **Email Routing** - All emails actually going to test@ address
4. **Field/Operator Issue** - Using wrong field or operator in filters
5. **Case Sensitivity** - Email address case mismatch

---

## 🔍 **DIAGNOSTIC STEPS:**

### **Step 1: Check Filter Order**

**Filters should be in this order (most specific first):**
1. Test Breakout (if test@ emails)
2. Support Breakout (if support@ emails)
3. Admin Breakout (if admin@ emails)
4. Notification (general, if needed)

**To check/change order:**
1. Go to: Settings → Filters
2. View filter list
3. Check order from top to bottom
4. If Test is first and too broad, it catches everything

### **Step 2: Verify Test Filter Condition**

**Current Test Filter:**
- Condition: `To contains test@darkstreetllc.com` ✅ (correct)
- Action: Move to Test folder ✅
- "Do not process other filters": CHECKED ✅

**Possible Issues:**
1. **Condition too broad?** Check if it's `To contains test` or `To contains test@` - should be exact
2. **Case sensitivity?** Try: `To contains Test@darkstreetllc.com` (capital T)
3. **Space issues?** Check for leading/trailing spaces

### **Step 3: Verify Actual Email Addresses**

**When you send test emails, verify:**
1. **To whom are you sending?**
   - Are you actually sending to `admin@darkstreetllc.com`?
   - Are you actually sending to `support@darkstreetllc.com`?
   - Or are all test emails going to `test@darkstreetllc.com`?

2. **Check email headers:**
   - Open an email in Test folder
   - View email headers/source
   - Check actual "To:" address
   - Is it `test@darkstreetllc.com` or something else?

### **Step 4: Check Admin and Support Filter Conditions**

**Verify these exact conditions:**

**Admin Breakout:**
- Field: `To`
- Operator: `contains`
- Value: `admin@darkstreetllc.com` (exact, no spaces)
- Action: Move to `Inbox/Admin/`
- "Do not process other filters": CHECKED

**Support Breakout:**
- Field: `To`
- Operator: `contains`
- Value: `support@darkstreetllc.com` (exact, no spaces)
- Action: Move to `Inbox/Support/`
- "Do not process other filters": CHECKED

### **Step 5: Check for Conflicting Filters**

1. **Look for other filters** that might catch emails:
   - Any filter with broad conditions (e.g., `To contains @`)
   - Any filter moving to Test folder
   - Any filter without "Do not process other filters" checked

2. **Check Notification filter:**
   - What condition does it have?
   - Is it catching emails incorrectly?

---

## 🔧 **SOLUTIONS TO TRY:**

### **Solution 1: Change Condition to "equals" Instead of "contains"**

**Current (contains):**
- `To contains test@darkstreetllc.com`

**Try (equals):**
- `To equals test@darkstreetllc.com`

**Why:** "contains" might match partial strings. "equals" is more specific.

**Note:** If using "equals", you might need to match exact email format including display name.

### **Solution 2: Use Different Field**

**Try "Recipient" instead of "To":**
- Field: `Recipient`
- Operator: `contains`
- Value: `test@darkstreetllc.com`

**Or try "To or Cc":**
- Field: `To or Cc`
- Operator: `contains`
- Value: `test@darkstreetllc.com`

### **Solution 3: Reorder Filters**

**Put Test filter LAST:**
1. Admin Breakout (first)
2. Support Breakout (second)
3. Test Breakout (last)

**Why:** More specific filters should process first.

### **Solution 4: Disable Test Filter Temporarily**

1. **Disable** Test Breakout filter (uncheck it or delete temporarily)
2. **Test** if Admin and Support filters work
3. **If they work:** Test filter was the issue
4. **Re-enable** Test filter with corrected condition

### **Solution 5: Check Email Headers**

1. **Open an email** that ended up in Test folder
2. **View email source/headers**
3. **Check actual "To:" address**
4. **Compare** with filter conditions

---

## 📋 **VERIFICATION CHECKLIST:**

- [ ] Filter order checked (most specific first)
- [ ] Test filter condition verified (exact match)
- [ ] Admin filter condition verified (exact match)
- [ ] Support filter condition verified (exact match)
- [ ] Actual email "To:" addresses verified
- [ ] Email headers checked
- [ ] No conflicting filters
- [ ] All filters have "Do not process other filters" CHECKED

---

## 🧪 **TESTING METHOD:**

### **Proper Test Sequence:**

1. **Send email to admin@:**
   - From: external email
   - To: admin@darkstreetllc.com
   - Subject: "Test Admin Filter"
   - **Expected:** Should go to Admin folder

2. **Send email to support@:**
   - From: external email
   - To: support@darkstreetllc.com
   - Subject: "Test Support Filter"
   - **Expected:** Should go to Support folder

3. **Send email to test@:**
   - From: external email
   - To: test@darkstreetllc.com
   - Subject: "Test Test Filter"
   - **Expected:** Should go to Test folder

4. **Check results:**
   - Check each folder for corresponding email
   - Check Mail Count in filter list
   - Verify emails are in correct folders

---

**Last Updated:** October 30, 2025  
**Status:** Debugging - Email addresses confirmed correct
