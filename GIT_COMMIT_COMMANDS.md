# Git Add, Commit, Push Commands

**Status:** ✅ Safe to commit - No credentials in changed files

---

## 📋 **COMMANDS TO RUN**

Copy and paste these commands in your terminal:

```bash
# Add only safe files (excludes security alert files via .gitignore)
git add netlify.toml
git add .gitignore
git add ACCOUNT_MAINTENANCE_REQUIREMENTS.md
git add CREDENTIAL_MANAGEMENT_PROCESS.md
git add CREDENTIALS_AUDIT_REAL_VS_PLACEHOLDER.md
git add CREDENTIALS_STATUS_SUMMARY.md
git add AMAZON_DEVELOPER_LOGIN_TROUBLESHOOTING.md
git add AMAZON_SP_API_POSTMAN_CREDENTIALS_GUIDE.md
git add AMAZON_SP_API_URGENT_ACTION.md
git add AMAZON_DEVELOPER_ACCOUNT_RECOVERY_PLAN.md
git add AMAZON_SP_API_ACCOUNT_RECOVERY_URGENT.md
git add SERVICES_QUICK_REFERENCE.md
git add NETLIFY_BUILD_FIX_EXIT_CODE_2.md

# Commit
git commit -m "Fix Netlify build: Add Next.js plugin and update credential management docs

- Add @netlify/plugin-nextjs to fix build exit code 2
- Update .gitignore to exclude credential files
- Fix dates in documentation (2025-11-30)
- Add credential management process documentation
- Add Amazon SP-API recovery guides"

# Push
git push origin main
```

---

## ✅ **VERIFICATION**

**Files being committed:**
- ✅ `netlify.toml` - Build configuration only
- ✅ `.gitignore` - Security patterns only
- ✅ Documentation files - No credentials

**Files NOT being committed (in .gitignore):**
- ❌ `SECURITY_ALERT_CREDENTIALS_EXPOSED.md` - Contains credentials
- ❌ `IMMEDIATE_SECURITY_FIX_STEPS.md` - Contains credentials
- ❌ `docs/dsllc-admin-credentials.md` - Contains credentials
- ❌ `data/credentials.ts` - Contains credentials

---

**Safe to proceed with commit.**

