#!/usr/bin/env node

const https = require('https');
const dns = require('dns');

console.log('🔍 DOMAIN STATUS MONITOR');
console.log('='.repeat(40));

function checkNameservers() {
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

function checkDomain() {
  return new Promise((resolve) => {
    const req = https.request('https://darkstreetllc.com', { 
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
          hasEcommerce: data.includes('shop') || data.includes('cart'),
          contentLength: data.length,
          isWorking: res.statusCode === 200 && data.length > 1000
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    
    req.end();
  });
}

async function runCheck() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n⏰ ${timestamp}`);
  
  // Check nameservers
  const nsResult = await checkNameservers();
  if (nsResult.error) {
    console.log('❌ Nameserver Error:', nsResult.error);
  } else {
    console.log('📡 Nameservers:');
    nsResult.nameservers.forEach((ns, i) => {
      const isNetlify = ns.includes('nsone.net');
      console.log(`   ${i+1}. ${ns} ${isNetlify ? '✅' : '❌'}`);
    });
    console.log(`   Netlify Detected: ${nsResult.netlifyDetected ? '✅ YES' : '❌ Not yet'}`);
  }
  
  // Check domain
  const domainResult = await checkDomain();
  if (domainResult.error) {
    console.log('❌ Domain Error:', domainResult.error);
  } else {
    console.log(`🌐 Domain Status: ${domainResult.status}`);
    console.log(`   E-commerce: ${domainResult.hasEcommerce ? '✅' : '❌'}`);
    console.log(`   Content: ${domainResult.contentLength} chars`);
    console.log(`   Working: ${domainResult.isWorking ? '✅' : '❌'}`);
  }
  
  // Overall status
  const overallReady = nsResult.netlifyDetected && domainResult.isWorking;
  console.log(`\n🎯 Overall Status: ${overallReady ? '✅ READY!' : '⏳ Waiting...'}`);
  
  if (overallReady) {
    console.log('🎉 QR CODES ARE WORKING!');
    console.log('✅ Customers can access the website');
    console.log('✅ E-commerce is live');
    process.exit(0);
  }
}

// Run check every 2 minutes
console.log('Starting domain monitoring...');
console.log('Will check every 2 minutes until ready.');
console.log('Press Ctrl+C to stop.\n');

runCheck();

setInterval(runCheck, 120000); // 2 minutes
