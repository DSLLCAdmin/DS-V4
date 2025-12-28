# Manual Git Commands - Copy/Paste These

**Instructions:** Open Command Prompt (cmd) and run these commands one at a time.

---

## **STEP 1: Navigate to Project Directory**

```cmd
cd "D:\A-Knox\DS LLC\DS Website-Next_2\DS_2"
```

---

## **STEP 2: Check Current Status**

```cmd
git status
```

This will show you what files have changed.

---

## **STEP 3: Add Files**

```cmd
git add netlify.toml .gitignore ACCOUNT_MAINTENANCE_REQUIREMENTS.md CREDENTIAL_MANAGEMENT_PROCESS.md CREDENTIALS_AUDIT_REAL_VS_PLACEHOLDER.md CREDENTIALS_STATUS_SUMMARY.md AMAZON_DEVELOPER_LOGIN_TROUBLESHOOTING.md AMAZON_SP_API_POSTMAN_CREDENTIALS_GUIDE.md AMAZON_SP_API_URGENT_ACTION.md AMAZON_DEVELOPER_ACCOUNT_RECOVERY_PLAN.md AMAZON_SP_API_ACCOUNT_RECOVERY_URGENT.md SERVICES_QUICK_REFERENCE.md NETLIFY_BUILD_FIX_EXIT_CODE_2.md docs/PHASE-ARCHIVE-PRODUCT-INTEREST-INTEGRATION.md
```

---

## **STEP 4: Verify What's Staged**

```cmd
git status
```

You should see the files listed under "Changes to be committed".

---

## **STEP 5: Commit**

```cmd
git commit -m "Fix Netlify build and secure credential management - Add @netlify/plugin-nextjs to fix build exit code 2 - Update .gitignore to exclude credential files - Redact exposed secrets (ZOHO_SMTP_PASSWORD, SHOPIFY_WEBHOOK_SECRET) - Fix dates in documentation (2025-11-30) - Add credential management process documentation - Add Amazon SP-API recovery guides"
```

---

## **STEP 6: Push to GitHub**

```cmd
git push origin main
```

---

## **STEP 7: Verify Push**

After pushing, check:
1. Netlify should automatically detect the new commit
2. A new deployment should start within 1-2 minutes
3. Check Netlify dashboard for the new deployment

---

## **If You Get Errors:**

### **"Not a git repository"**
- Make sure you're in the correct directory
- Check if `.git` folder exists

### **"Nothing to commit"**
- Files might already be committed
- Run `git status` to see current state

### **"Authentication failed"**
- You may need to authenticate with GitHub
- Check your GitHub credentials

---

**Run these commands manually in your Command Prompt.**

