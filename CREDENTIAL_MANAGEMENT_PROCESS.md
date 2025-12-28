# 🔐 Credential Management Process - Going Forward

**Effective Date:** 2025-11-30  
**Status:** ACTIVE - Must follow for all new credentials

---

## ✅ **CREDENTIAL COLLECTION PROCESS**

### **Step 1: Collect at Inception**
When setting up ANY new service:

1. **Immediately capture:**
   - All API keys/tokens
   - Login credentials
   - Access URLs
   - Account IDs
   - Any other authentication data

2. **Document in chat:**
   - Share credentials in chat (we'll handle securely)
   - Don't wait - capture immediately when created

3. **Verify accuracy:**
   - Test credentials work
   - Confirm all required values are captured

---

### **Step 2: Record in Admin Console**
**Within 24 hours of collection:**

1. **Go to:** `/admin/credentials`
2. **Enter PIN:** `DS24` or `DS24_SECURE_CREDS`
3. **Add new credential:**
   - Click "Add Credential"
   - Enter all details
   - Mark as "live" or "test"
   - Mark as "encrypted"
   - Save

4. **Verify in dashboard:**
   - Confirm credential appears
   - Check values are correct (unmask to verify)
   - Note the "Updated" timestamp

---

### **Step 3: Create Secure Backup**
**Within 24 hours of recording:**

1. **Export from Admin Console:**
   - Go to `/admin/credentials`
   - Click "Export" or "Backup" button
   - Download JSON file

2. **Save to secure location:**
   - ✅ **DO:** Save to password manager
   - ✅ **DO:** Save to encrypted USB drive
   - ✅ **DO:** Save to secure cloud storage (separate from project)
   - ❌ **DON'T:** Save in project folder (Netlify will scan)
   - ❌ **DON'T:** Commit to Git
   - ❌ **DON'T:** Store in unencrypted files

3. **Naming convention:**
   - Format: `ds-credentials-backup-YYYY-MM-DD.json`
   - Example: `ds-credentials-backup-2025-11-30.json`
   - Include date in filename

4. **Document backup location:**
   - Note where backup is saved
   - Update this document with location
   - Don't include actual credentials in documentation

---

## 📋 **CHECKLIST FOR NEW CREDENTIALS**

When setting up a new service, complete ALL of these:

- [ ] **Step 1:** Credentials collected at inception
- [ ] **Step 2:** Credentials recorded in Admin Console (`/admin/credentials`)
- [ ] **Step 3:** Backup created and saved to secure location (NOT project folder)
- [ ] **Step 4:** Backup location documented (without actual values)
- [ ] **Step 5:** Credentials tested/verified working
- [ ] **Step 6:** Updated in `CREDENTIAL_COLLECTION_LIST.md` (locations only, not values)

---

## 🚫 **SECURITY RULES**

### **NEVER:**
- ❌ Store credentials in project folder (Netlify scans these)
- ❌ Commit credentials to Git
- ❌ Share credentials in unencrypted emails
- ❌ Store in plain text files
- ❌ Use placeholder values as real credentials

### **ALWAYS:**
- ✅ Use Admin Console for storage
- ✅ Create encrypted backups
- ✅ Store backups outside project folder
- ✅ Test credentials after collection
- ✅ Document credential locations (not values)

---

## 📁 **BACKUP STORAGE LOCATIONS**

**Approved Locations (Outside Project Folder):**
- Password manager (1Password, LastPass, Bitwarden, etc.)
- Encrypted USB drive
- Secure cloud storage (separate account from project)
- Encrypted file on personal computer (outside project folder)

**Forbidden Locations:**
- ❌ `D:\A-Knox\DS LLC\DS Website-Next_2\DS_2\` (project folder)
- ❌ Any Git repository
- ❌ Netlify project files
- ❌ Unencrypted cloud storage

---

## 🔄 **REGULAR MAINTENANCE**

### **Monthly:**
- Review all credentials in Admin Console
- Verify backups are current
- Check for expired credentials
- Update any rotated credentials

### **Quarterly:**
- Full credential audit
- Verify all backups are accessible
- Review security practices
- Update documentation

---

## 📝 **DOCUMENTATION REQUIREMENTS**

When documenting credentials:

1. **In `CREDENTIAL_COLLECTION_LIST.md`:**
   - Document service name
   - Document account IDs/usernames (not passwords)
   - Document where credentials are stored (Admin Console, Netlify, etc.)
   - Document backup location (without actual values)
   - Use `[REDACTED]` for sensitive values

2. **In Chat:**
   - Can share credentials temporarily for setup
   - Will be recorded in Admin Console
   - Will be backed up securely

---

## ✅ **CONFIRMED SECURE CREDENTIALS**

As of 2025-11-30:
- ✅ **Shopify** - Recorded in Admin Console, backed up
- ✅ **Stripe** - Recorded in Admin Console, backed up
- ✅ **Mercury** - Recorded in Admin Console, backed up
- ✅ **Postman** - Recorded in Admin Console, backed up

---

**This process is now MANDATORY for all new credentials.**



