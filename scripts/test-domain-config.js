#!/usr/bin/env node

/**
 * Domain Configuration Test Script
 * 
 * This script tests the domain configuration and provides
 * step-by-step instructions for fixing domain issues.
 */

const https = require('https');
const dns = require('dns').promises;

console.log('🌐 DOMAIN CONFIGURATION TEST');
console.log('='.repeat(50));

// Test domains
const domains = [
  'darkstreetllc.com',
  'www.darkstreetllc.com',
  'ds-v5.netlify.app'
];

// Test DNS resolution
async function testDNSResolution(domain) {
  try {
    const records = await dns.resolve4(domain);
    return { success: true, records };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test HTTP response
async function testHTTPResponse(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          hasContent: data.length > 1000,
          isNetlifyError: data.includes('Site not found') && data.includes('Netlify'),
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

async function runDomainTests() {
  console.log('\n🔍 Testing DNS Resolution...');
  
  for (const domain of domains) {
    const dnsResult = await testDNSResolution(domain);
    console.log(`📊 ${domain}:`);
    
    if (dnsResult.success) {
      console.log(`   ✅ DNS: ${dnsResult.records.join(', ')}`);
    } else {
      console.log(`   ❌ DNS: ${dnsResult.error}`);
    }
  }
  
  console.log('\n🔍 Testing HTTP Responses...');
  
  for (const domain of domains) {
    const url = `https://${domain}`;
    const httpResult = await testHTTPResponse(url);
    
    console.log(`📊 ${url}:`);
    
    if (httpResult.error) {
      console.log(`   ❌ HTTP: ${httpResult.error}`);
    } else {
      console.log(`   Status: ${httpResult.status}`);
      console.log(`   Content Length: ${httpResult.contentLength} chars`);
      
      if (httpResult.isNetlifyError) {
        console.log(`   ❌ Netlify 404 Error - Domain not configured`);
      } else if (httpResult.status === 200 && httpResult.hasContent) {
        console.log(`   ✅ Working correctly`);
      } else {
        console.log(`   ⚠️ Unexpected response`);
      }
    }
    console.log('');
  }
  
  console.log('\n🛠️ DOMAIN FIX INSTRUCTIONS:');
  console.log('='.repeat(50));
  
  console.log('\n1️⃣ NETLIFY CONFIGURATION:');
  console.log('   • Go to Netlify Dashboard');
  console.log('   • Select site: ds-v5');
  console.log('   • Site Settings → Domain Management');
  console.log('   • Add Custom Domain: darkstreetllc.com');
  console.log('   • Add Custom Domain: www.darkstreetllc.com');
  console.log('   • Enable SSL for both domains');
  
  console.log('\n2️⃣ DNS CONFIGURATION:');
  console.log('   • A Record: @ → 75.2.60.5');
  console.log('   • CNAME Record: www → ds-v5.netlify.app');
  console.log('   • TTL: 3600 seconds');
  
  console.log('\n3️⃣ VERIFICATION:');
  console.log('   • Wait 5-10 minutes for DNS propagation');
  console.log('   • Test: https://darkstreetllc.com');
  console.log('   • Test: https://www.darkstreetllc.com');
  
  console.log('\n🎯 EXPECTED RESULT:');
  console.log('   ✅ darkstreetllc.com → DS LLC website');
  console.log('   ✅ www.darkstreetllc.com → DS LLC website');
  console.log('   ✅ QR codes will work seamlessly');
  console.log('   ✅ Customer access will be effortless');
}

runDomainTests().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});
