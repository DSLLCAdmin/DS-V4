const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Netlify Deployment');
console.log('================================');

// Create netlify.toml configuration
const netlifyConfig = `[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

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
`;

fs.writeFileSync('netlify.toml', netlifyConfig);

// Update next.config.js for static export
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

if (!nextConfig.includes('output: \'export\'')) {
  nextConfig = nextConfig.replace(
    'module.exports = {',
    `module.exports = {
  output: 'export',
  trailingSlash: true,`
  );
  fs.writeFileSync(nextConfigPath, nextConfig);
}

// Update package.json scripts
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (!packageJson.scripts['build:netlify']) {
  packageJson.scripts['build:netlify'] = 'next build && next export';
  packageJson.scripts['deploy:netlify'] = 'npm run build:netlify';
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

console.log('✅ Netlify configuration created:');
console.log('📁 netlify.toml - Deployment settings');
console.log('🔧 next.config.js - Updated for static export');
console.log('📦 package.json - Added Netlify build scripts');

console.log('\n📋 Next Steps:');
console.log('1. Install Netlify CLI: npm install -g netlify-cli');
console.log('2. Login to Netlify: netlify login');
console.log('3. Initialize site: netlify init');
console.log('4. Deploy: npm run deploy:netlify');
console.log('5. Or connect GitHub repo directly on netlify.com');

console.log('\n🌐 Netlify Advantages:');
console.log('- More reliable than Vercel');
console.log('- Better static site handling');
console.log('- Free tier includes more features');
console.log('- Direct GitHub integration');
