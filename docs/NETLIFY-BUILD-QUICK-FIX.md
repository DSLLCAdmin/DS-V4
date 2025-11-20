# Netlify Build Hang - Quick Fix Guide

## 🚨 **IMMEDIATE ACTIONS (Do These First)**

### **1. Cancel the Hanging Build**
```
Netlify Dashboard → Deploys → Cancel deploy
```

### **2. Clear Build Cache**
```
Netlify Dashboard → Deploys → "Clear cache and retry deploy"
```

### **3. Check Build Logs**
- Click on the cancelled build
- Scroll to find where it stopped
- Look for: errors, memory warnings, timeout messages

---

## ⚡ **MOST COMMON FIXES**

### **Fix #1: Increase Memory Limit**
Already added to `netlify.toml`:
```toml
NODE_OPTIONS = "--max-old-space-size=4096"
```

### **Fix #2: Use npm ci Instead of npm install**
Already updated in `netlify.toml`:
```toml
command = "npm ci && npm run build"
```

### **Fix #3: Remove Problematic SPA Redirect**
The redirect rule in `netlify.toml` has been commented out as it can cause Next.js routing issues.

---

## 🔍 **DIAGNOSTIC STEPS**

### **Step 1: Test Build Locally**
```bash
# In your terminal
npm ci
npm run build

# Time the build
time npm run build
```

**If local build works but Netlify hangs:**
- Check environment variables in Netlify dashboard
- Verify Node version matches (should be 18)
- Check for missing dependencies

### **Step 2: Check Build Log Location**
Look for where build stopped:
- ✅ "Installing dependencies" - npm issue
- ✅ "Compiling..." - Next.js compilation issue
- ✅ "Collecting page data" - Page generation issue
- ✅ "Generating static pages" - Static export issue
- ✅ "Linting and checking validity" - Code issue

### **Step 3: Review Recent Changes**
Check what changed in last commit:
- New dependencies?
- New API routes?
- Large files added?
- Config changes?

---

## 🛠️ **QUICK FIXES BY SYMPTOM**

### **Hangs at "Installing dependencies"**
```toml
# netlify.toml
[build.environment]
  NPM_FLAGS = "--prefer-offline --no-audit --legacy-peer-deps"
```

### **Hangs at "Compiling..."**
- Check for infinite loops in code
- Review `next.config.js` for issues
- Temporarily disable problematic plugins

### **Hangs at "Generating static pages"**
- Check for blocking API calls in pages
- Review `getStaticProps` functions
- Check for large data processing

### **Memory Errors**
Already fixed with `NODE_OPTIONS = "--max-old-space-size=4096"`

### **Timeout (15+ minutes)**
- Upgrade to Netlify Pro (20 min limit)
- Or optimize build to complete faster
- Split build into smaller steps

---

## 📋 **CHECKLIST**

When build hangs:
- [ ] Cancel the build
- [ ] Clear build cache
- [ ] Check build logs
- [ ] Test build locally (`npm run build`)
- [ ] Verify environment variables
- [ ] Check Node version (should be 18)
- [ ] Review recent code changes
- [ ] Try deploying previous working commit
- [ ] Check for large files in commit
- [ ] Verify all dependencies are in package.json

---

## 🚀 **PREVENT FUTURE HANGS**

### **1. Optimize Build**
```javascript
// next.config.js - already optimized
const nextConfig = {
  swcMinify: true,  // Faster compilation
  // ... other optimizations
};
```

### **2. Use Build Caching**
Netlify automatically caches `node_modules` between builds when using `npm ci`

### **3. Monitor Build Times**
- Track build duration in Netlify dashboard
- Alert if builds exceed 10 minutes
- Optimize before hitting timeout

---

## 📞 **STILL HANGING?**

If build still hangs after trying fixes:

1. **Check Netlify Status:** https://www.netlifystatus.com/
2. **Contact Support:** Include build log URL and commit hash
3. **Try Previous Commit:** Deploy a known-working commit to isolate the issue

---

**Quick Reference:**
- Free tier timeout: 15 minutes
- Pro tier timeout: 20 minutes
- Default memory: ~2GB
- With fix: 4GB memory available

