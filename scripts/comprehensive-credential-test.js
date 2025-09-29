// Comprehensive Credential Persistence Test
// Copy and paste this into your browser console on the Admin Credentials page

console.log('🔍 COMPREHENSIVE CREDENTIAL PERSISTENCE TEST');
console.log('============================================');

// Test 1: Check current state
const storageKey = 'dsllc.credentials.v1';
console.log('📁 Storage Key:', storageKey);

// Test 2: Check localStorage
const rawData = localStorage.getItem(storageKey);
console.log('📁 Raw localStorage data:', rawData);

if (rawData) {
  try {
    const parsed = JSON.parse(rawData);
    console.log('📊 Parsed data:', parsed);
    console.log('📈 Number of credentials:', parsed.items ? parsed.items.length : 'No items array');
    console.log('🕒 Last updated:', parsed.updatedAt);
    console.log('🆔 Device ID:', parsed.deviceId);
  } catch (error) {
    console.error('❌ Failed to parse localStorage data:', error);
  }
} else {
  console.log('⚠️ No data found in localStorage');
}

// Test 3: Check sessionStorage
const sessionData = sessionStorage.getItem(storageKey);
console.log('📁 Raw sessionStorage data:', sessionData);

// Test 4: Check all credential-related keys
console.log('🔑 All localStorage keys containing "credential":');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('credential')) {
    console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
  }
}

// Test 5: Check device ID
const deviceKey = 'dsllc.credentials.deviceId';
const deviceId = localStorage.getItem(deviceKey);
console.log('🆔 Device ID:', deviceId);

// Test 6: Simulate the exact save operation
console.log('🧪 Testing exact save operation...');
const testCredential = {
  id: 'test-' + Date.now(),
  name: 'Test Credential',
  type: 'other',
  environment: 'test',
  encrypted: false,
  value: 'test-value',
  lastUsed: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const testState = {
  version: 1,
  updatedAt: new Date().toISOString(),
  deviceId: deviceId || 'test-device',
  items: [testCredential]
};

try {
  // Save to both localStorage and sessionStorage (like the app does)
  localStorage.setItem(storageKey, JSON.stringify(testState));
  sessionStorage.setItem(storageKey, JSON.stringify(testState));
  console.log('✅ Test credential saved successfully');
  
  // Verify it was saved
  const saved = localStorage.getItem(storageKey);
  const sessionSaved = sessionStorage.getItem(storageKey);
  console.log('✅ localStorage verification:', saved ? 'SUCCESS' : 'FAILED');
  console.log('✅ sessionStorage verification:', sessionSaved ? 'SUCCESS' : 'FAILED');
} catch (error) {
  console.error('❌ Failed to save test credential:', error);
}

// Test 7: Check browser storage quota
try {
  const testData = 'x'.repeat(1024 * 1024); // 1MB test
  localStorage.setItem('test-quota', testData);
  localStorage.removeItem('test-quota');
  console.log('✅ localStorage quota test: PASSED');
} catch (error) {
  console.error('❌ localStorage quota test: FAILED', error);
}

// Test 8: Check if storage is being cleared by something else
console.log('🔍 Monitoring localStorage changes...');
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;
const originalClear = localStorage.clear;

localStorage.setItem = function(key, value) {
  console.log('📝 localStorage.setItem called:', key, value?.substring(0, 50) + '...');
  return originalSetItem.call(this, key, value);
};

localStorage.removeItem = function(key) {
  console.log('🗑️ localStorage.removeItem called:', key);
  return originalRemoveItem.call(this, key);
};

localStorage.clear = function() {
  console.log('🧹 localStorage.clear called - THIS WOULD CLEAR ALL DATA!');
  return originalClear.call(this);
};

console.log('🎯 Test complete - check results above');
console.log('📊 Monitor the console for any localStorage operations');
console.log('🔄 Now try adding a credential and watch for localStorage operations');
