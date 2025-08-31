const fs = require('fs');
const path = require('path');

// Read the existing .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';

try {
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
} catch (error) {
  console.log('No existing .env.local file found, creating new one...');
}

// Add frontend environment variables if they don't exist
const frontendVars = [
  'NEXT_PUBLIC_SHOPIFY_SHOP_NAME',
  'NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN'
];

let updated = false;
frontendVars.forEach(varName => {
  if (!envContent.includes(varName)) {
    // Get the corresponding backend variable
    const backendVar = varName.replace('NEXT_PUBLIC_', '');
    const backendValue = process.env[backendVar];
    
    if (backendValue) {
      envContent += `\n${varName}=${backendValue}`;
      updated = true;
      console.log(`✅ Added ${varName} to .env.local`);
    } else {
      console.log(`⚠️  ${backendVar} not found, please add ${varName} manually`);
    }
  }
});

if (updated) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment variables updated successfully!');
} else {
  console.log('✅ All environment variables are already set up!');
}

console.log('\n📋 Frontend environment variables needed:');
console.log('- NEXT_PUBLIC_SHOPIFY_SHOP_NAME');
console.log('- NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN');
console.log('\n💡 These should match your backend Shopify credentials.');
