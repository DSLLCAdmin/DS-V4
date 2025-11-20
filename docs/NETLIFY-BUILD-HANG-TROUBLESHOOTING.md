# Netlify Build Hang Troubleshooting Guide

## 🚨 **Immediate Actions When Build Hangs (10+ minutes)**

### **Step 1: Cancel the Build**
1. Go to **Netlify Dashboard** → **Deploys** tab
2. Find the hanging build
3. Click **"Cancel deploy"** button
4. Wait for cancellation to complete

### **Step 2: Check Build Logs**
1. Click on the cancelled/failed build
2. Scroll through the **build log** to find:
   - Last successful step
   - Error messages
   - Memory warnings
   - Timeout messages

---

## 🔍 **Common Causes & Solutions**

### **1. Build Timeout (Most Common)**

**Symptoms:**
- Build hangs at same step every time
- No error messages, just stops
- Free tier: 15 min limit, Pro: 20 min limit

**Solutions:**

**Option A: Increase Build Timeout (Pro Plan)**
```toml
# Add to netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true
```

**Option B: Optimize Build Process**
- Split large builds into smaller chunks
- Use build caching
- Remove unnecessary dependencies

---

### **2. Memory Issues**

**Symptoms:**
- Build fails with "out of memory" errors
- Build hangs during compilation
- Node process killed

**Solutions:**

**Add to `netlify.toml`:**
```toml
[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--max-old-space-size=4096"  # Increase memory limit
```

**Or in `package.json` build script:**
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

### **3. Infinite Loop or Hanging Process**

**Symptoms:**
- Build hangs at specific step (e.g., "Compiling...")
- No progress for 10+ minutes
- CPU usage high but no output

**Solutions:**

**Check for:**
- Infinite loops in build scripts
- Blocking I/O operations
- Large file processing
- API calls during build

**Fix:**
- Review `next.config.js` for problematic configs
- Check for `useEffect` hooks that run during build
- Disable problematic plugins temporarily

---

### **4. API Routes Compilation Issues**

**Symptoms:**
- Build hangs at "Compiling /api/..." step
- Multiple API routes causing slowdown

**Solutions:**

**Option A: Optimize API Routes**
- Remove unused API routes
- Simplify route handlers
- Add error boundaries

**Option B: Disable API Routes Temporarily**
```javascript
// next.config.js - temporarily disable API routes
const nextConfig = {
  // ... other config
  // Comment out API route compilation if needed
};
```

---

### **5. Large Dependencies or Assets**

**Symptoms:**
- Build hangs during "Collecting page data"
- Large image processing
- Heavy npm packages

**Solutions:**

**Add build optimization:**
```toml
# netlify.toml
[build]
  command = "npm ci && npm run build"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefer-offline --no-audit"
```

**Optimize images:**
- Use Next.js Image optimization
- Compress images before commit
- Use CDN for large assets

---

### **6. Environment Variable Issues**

**Symptoms:**
- Build hangs when accessing env vars
- Missing required variables

**Solutions:**

1. **Check Netlify Environment Variables:**
   - Dashboard → Site settings → Environment variables
   - Verify all required vars are set
   - Check for typos in variable names

2. **Add fallback values:**
```javascript
// next.config.js
env: {
  SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN || '',
  // ... other vars with fallbacks
}
```

---

### **7. Node Version Mismatch**

**Symptoms:**
- Build works locally but hangs on Netlify
- Version-specific errors

**Solutions:**

**Ensure version match:**
```toml
# netlify.toml
[build.environment]
  NODE_VERSION = "18"  # Match your local version
```

**Check local version:**
```bash
node --version
```

---

## 🛠️ **Quick Fixes to Try**

### **Fix 1: Clear Build Cache**
1. Netlify Dashboard → **Deploys**
2. Click **"Clear cache and retry deploy"**
3. Trigger new deployment

### **Fix 2: Simplify Build Command**
Temporarily test with minimal build:
```toml
# netlify.toml
[build]
  command = "npm install && npm run build"
```

### **Fix 3: Add Build Timeout Warning**
```toml
# netlify.toml
[build]
  command = "timeout 1200 npm run build || exit 1"  # 20 min timeout
```

### **Fix 4: Enable Build Logs**
Add verbose logging:
```json
// package.json
{
  "scripts": {
    "build": "NODE_ENV=production next build --debug"
  }
}
```

---

## 📊 **Diagnostic Steps**

### **1. Test Build Locally**
```bash
# Match Netlify environment
NODE_VERSION=18 npm run build

# Check build time
time npm run build
```

### **2. Check Build Size**
```bash
# Check .next folder size
du -sh .next

# If > 200MB, investigate large files
```

### **3. Review Dependencies**
```bash
# Check for large packages
npm ls --depth=0 | sort

# Remove unused dependencies
npm prune
```

### **4. Check for Blocking Operations**
- Review API routes for blocking calls
- Check for `fs.readFileSync` in build
- Look for database connections during build

---

## 🚀 **Prevention Strategies**

### **1. Optimize Build Configuration**
```javascript
// next.config.js
const nextConfig = {
  // Reduce bundle size
  swcMinify: true,
  
  // Optimize images
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },
  
  // Reduce compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### **2. Use Build Plugins**
```toml
# netlify.toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### **3. Enable Build Caching**
```toml
# netlify.toml
[build]
  command = "npm ci && npm run build"
  
[build.environment]
  NETLIFY_CACHE_DIR = ".netlify/cache"
```

---

## 📞 **When to Contact Support**

Contact Netlify Support if:
- Build consistently hangs at same step
- Memory/timeout errors persist after fixes
- Build works locally but fails on Netlify
- Suspected platform issue

**Include in support request:**
- Build log URL
- Last successful build commit
- Local build output
- `netlify.toml` contents

---

## ✅ **Quick Checklist**

When build hangs:
- [ ] Cancel the hanging build
- [ ] Check build logs for errors
- [ ] Verify environment variables
- [ ] Test build locally
- [ ] Clear Netlify build cache
- [ ] Check for infinite loops
- [ ] Verify Node version matches
- [ ] Review large dependencies
- [ ] Check API route compilation
- [ ] Try simplified build command

---

**Last Updated:** November 18, 2025

