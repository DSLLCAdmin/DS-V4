# 🔧 Netlify Build Fix - Exit Code 2

**Issue:** Build completes successfully but fails with exit code 2  
**Status:** Build output looks successful, but Netlify reports failure

---

## 🔍 **ANALYSIS**

Looking at your build log:
- ✅ `npm ci` completed successfully
- ✅ `npm run build` completed successfully  
- ✅ All 142 pages generated
- ✅ Functions bundled successfully
- ❌ But then: "Failed during stage 'building site': Build script returned non-zero exit code: 2"

**The Problem:** Exit code 2 typically means a command failed, but your build log shows success. This suggests:
1. A post-build step is failing silently
2. Netlify Next.js plugin issue
3. Publish directory mismatch

---

## ✅ **SOLUTION 1: Add Netlify Next.js Plugin**

Your `netlify.toml` doesn't have the Next.js plugin. Add it:

```toml
[build]
  command = "npm ci && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--max-old-space-size=4096"
  NPM_FLAGS = "--prefer-offline --no-audit"

# Add this plugin
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Why:** The Next.js plugin handles the proper deployment of Next.js apps with API routes on Netlify.

---

## ✅ **SOLUTION 2: Fix Publish Directory**

Your `netlify.toml` has `publish = ".next"` but Next.js 15 might need a different setup. Try:

```toml
[build]
  command = "npm ci && npm run build"
  publish = ".next"  # Keep this for Next.js 15 with API routes

# But also ensure Next.js plugin handles it
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## ✅ **SOLUTION 3: Add Error Handling to Build Command**

Make the build command more explicit:

```toml
[build]
  command = "npm ci && npm run build || exit 1"
  publish = ".next"
```

This ensures any failure in the build chain properly exits.

---

## 🎯 **RECOMMENDED FIX (Try This First)**

Update your `netlify.toml` to include the Next.js plugin:

```toml
[build]
  command = "npm ci && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--max-old-space-size=4096"
  NPM_FLAGS = "--prefer-offline --no-audit"

# Add Next.js plugin for proper deployment
[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Type = "image/webp"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Type = "image/png"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Type = "image/jpeg"
```

---

## 📋 **STEPS TO FIX**

1. **Update `netlify.toml`:**
   - Add the `[[plugins]]` section with `@netlify/plugin-nextjs`
   - Keep `publish = ".next"`

2. **Commit and Push:**
   ```bash
   git add netlify.toml
   git commit -m "Fix Netlify build: Add Next.js plugin"
   git push origin main
   ```

3. **Trigger New Deployment:**
   - Netlify will auto-deploy from the push
   - Or manually trigger in Netlify dashboard

4. **Monitor Build:**
   - Watch the build log
   - Should complete successfully now

---

## 🔍 **ALTERNATIVE: Check for Post-Build Scripts**

If the plugin doesn't fix it, check if there are any post-build scripts that might be failing:

1. Check `package.json` for `postbuild` script
2. Check for any Netlify build hooks
3. Check for any scripts that run after build

---

## ⚠️ **IF STILL FAILING**

If it still fails after adding the plugin:

1. **Check Netlify Build Logs:**
   - Look for any error messages after "Functions bundling completed"
   - Check for any warnings or errors

2. **Try Simplifying Build:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```
   (Remove `npm ci` temporarily to test)

3. **Check Next.js Version:**
   - You're on Next.js 15.4.6
   - Ensure Netlify supports this version
   - Plugin should handle it, but verify

---

**Next Step:** Update `netlify.toml` with the plugin and redeploy.

