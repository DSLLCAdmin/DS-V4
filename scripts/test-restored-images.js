const fs = require('fs');
const path = require('path');

console.log('🖼️ Testing Restored Images');
console.log('==========================');

const publicDir = path.join(__dirname, '..', 'public');

// Check the two restored files
const filesToCheck = [
  'DS-WebBanner-1.webp',
  'DSLLC_QRC_1.png'
];

filesToCheck.forEach(filename => {
  const filePath = path.join(publicDir, filename);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${filename}: ${(stats.size / 1024).toFixed(1)}KB`);
    
    // Check if file is not corrupted
    if (stats.size > 0) {
      console.log(`   - File size: OK`);
    } else {
      console.log(`   - File size: CORRUPTED (0 bytes)`);
    }
    
    // Check if file appears to be binary
    try {
      const content = fs.readFileSync(filePath);
      const isText = content.includes('\n') && content.length < 10000;
      if (!isText) {
        console.log(`   - Binary format: OK`);
      } else {
        console.log(`   - Binary format: POSSIBLY CORRUPTED (text detected)`);
      }
    } catch (error) {
      console.log(`   - Error reading file: ${error.message}`);
    }
  } else {
    console.log(`❌ ${filename}: FILE NOT FOUND`);
  }
});

console.log('\n🎯 Next Steps:');
console.log('1. Run "npm run dev" to test locally');
console.log('2. Check if banner and QR code display correctly');
console.log('3. If working, commit changes and deploy to Netlify');
