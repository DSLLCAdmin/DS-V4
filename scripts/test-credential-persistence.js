// Credential Persistence Test Script
// Run this in browser console to test credential persistence

console.log('🔍 CREDENTIAL PERSISTENCE TEST');
console.log('==============================');

// Test 1: Check localStorage directly
const storageKey = 'dsllc.credentials.v1';
const rawData = localStorage.getItem(storageKey);
console.log('📁 Raw localStorage data:', rawData);

if (rawData) {
  try {
    const parsed = JSON.parse(rawData);
    console.log('📊 Parsed data:', parsed);
    console.log('📈 Number of credentials:', parsed.items ? parsed.items.length : 'No items array');
  } catch (error) {
    console.error('❌ Failed to parse localStorage data:', error);
  }
} else {
  console.log('⚠️ No data found in localStorage');
}

// Test 2: Check sessionStorage
const sessionData = sessionStorage.getItem(storageKey);
console.log('📁 Raw sessionStorage data:', sessionData);

// Test 3: Check all localStorage keys
console.log('🔑 All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('credential')) {
    console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
  }
}

// Test 4: Simulate credential addition
console.log('🧪 Testing credential addition...');
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
  deviceId: 'test-device',
  items: [testCredential]
};

try {
  localStorage.setItem(storageKey, JSON.stringify(testState));
  console.log('✅ Test credential saved successfully');
  
  // Verify it was saved
  const saved = localStorage.getItem(storageKey);
  console.log('✅ Verification - saved data:', saved);
} catch (error) {
  console.error('❌ Failed to save test credential:', error);
}

console.log('🎯 Test complete - check results above');
