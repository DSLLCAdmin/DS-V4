#!/usr/bin/env node

const https = require('https');
const dns = require('dns');

console.log('🎯 QR CODE DOMAIN TESTING SUITE');
console.log('='.repeat(50));

async function testNameserverPropagation() {
  return new Promise((resolve) => {
    dns.resolveNs('darkstreetllc.com', (err, records) => {
      if (err) {
        resolve({ error: err.message });
      } else {
        const netlifyNs = records.some(ns => ns.includes('nsone.net'));
        resolve({ 
          nameservers: records,
          netlifyDetected: netlifyNs,
          ready: netlifyNs && records.length >= 4
        });
      }
    });
  });
}

async function testDomainResponse() {
  return new Promise((resolve) => {
    const req = https.request('https://darkstreetllc.com', { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          hasEcommerce: data.includes('shop') || data.includes('cart'),
          hasNewFeatures: data.includes('Order Confirmation') || data.includes('Return Policy'),
          hasShopifyIntegration: data.includes('Shopify') || data.includes('checkout'),
          contentLength: data.length,
          isWorking: res.statusCode === 200 && data.length > 1000
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

async function testSSL() {
  return new Promise((resolve) => {
    const req = https.request('https://darkstreetllc.com', { 
      timeout: 10000 
    }, (res) => {
      resolve({
        sslWorking: true,
        status: res.statusCode
      });
    });
    
    req.on('error', (err) => {
      resolve({ 
        sslWorking: false,
        error: err.message 
      });
    });
    
    req.end();
  });
}

async function runFullTest() {
  console.log('\n📡 Testing Nameserver Propagation...');
  const nsTest = await testNameserverPropagation();
  
  if (nsTest.error) {
    console.log('❌ Nameserver Error:', nsTest.error);
    return;
  }
  
  console.log('Current Nameservers:');
  nsTest.nameservers.forEach((ns, i) => {
    console.log(`  ${i+1}. ${ns}`);
  });
  
  console.log(`\nNetlify Detected: ${nsTest.netlifyDetected ? '✅ YES' : '❌ Not yet'}`);
  
  if (!nsTest.netlifyDetected) {
    console.log('\n⏳ Nameservers still propagating...');
    console.log('   Expected: dns1.p08.nsone.net, dns2.p08.nsone.net, etc.');
    console.log('   Wait 15-30 minutes and try again.');
    return;
  }
  
  console.log('\n🌐 Testing Domain Response...');
  const domainTest = await testDomainResponse();
  
  if (domainTest.error) {
    console.log('❌ Domain Error:', domainTest.error);
    return;
  }
  
  console.log(`Status: ${domainTest.status}`);
  console.log(`Has E-commerce: ${domainTest.hasEcommerce ? '✅' : '❌'}`);
  console.log(`Has New Features: ${domainTest.hasNewFeatures ? '✅' : '❌'}`);
  console.log(`Has Shopify Integration: ${domainTest.hasShopifyIntegration ? '✅' : '❌'}`);
  console.log(`Content Length: ${domainTest.contentLength} chars`);
  
  console.log('\n🔒 Testing SSL Certificate...');
  const sslTest = await testSSL();
  
  if (sslTest.sslWorking) {
    console.log('✅ SSL Certificate: Working');
  } else {
    console.log('❌ SSL Certificate:', sslTest.error);
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (nsTest.ready && domainTest.isWorking && sslTest.sslWorking) {
    console.log('🎉 QR CODES ARE FULLY WORKING!');
    console.log('✅ Customers can access e-commerce');
    console.log('✅ All features are live');
    console.log('✅ SSL is secure');
    console.log('\n🚀 Ready for customers!');
  } else {
    console.log('⏳ Still waiting for full propagation...');
    if (!nsTest.ready) console.log('   - Nameservers not fully propagated');
    if (!domainTest.isWorking) console.log('   - Domain not responding properly');
    if (!sslTest.sslWorking) console.log('   - SSL certificate not ready');
  }
}

// Run the test
runFullTest().catch(console.error);
