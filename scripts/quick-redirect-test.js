#!/usr/bin/env node
/**
 * Quick Redirect Test
 * Tests if Shopify product pages have redirect scripts
 */

const https = require('https');

async function testRedirect(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasRedirect = data.includes('darkstreetllc.com');
        const redirectMatch = data.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
        resolve({
          status: res.statusCode,
          hasRedirect,
          redirectUrl: redirectMatch ? redirectMatch[1] : null,
          contentLength: data.length
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ error: 'Timeout' });
    });
    
    req.end();
  });
}

async function runQuickTest() {
  console.log('🔍 Quick Redirect Test...\n');
  
  const testUrls = [
    'https://wenugu-5b.myshopify.com/products/confession-shots-kits',
    'https://wenugu-5b.myshopify.com/products/ds-route-generator-app',
    'https://wenugu-5b.myshopify.com/products/memory-mercury-scavenger-hunt'
  ];
  
  for (const url of testUrls) {
    console.log(`Testing: ${url}`);
    const result = await testRedirect(url);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else {
      console.log(`✅ Status: ${result.status}`);
      console.log(`   Redirect: ${result.hasRedirect ? 'YES' : 'NO'}`);
      if (result.redirectUrl) {
        console.log(`   URL: ${result.redirectUrl}`);
      }
      console.log(`   Size: ${result.contentLength} bytes`);
    }
    console.log('---');
  }
}

runQuickTest().catch(console.error);
