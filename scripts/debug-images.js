const fs = require('fs');
const path = require('path');

console.log('🔍 Debug Image Loading Issues');
console.log('============================');

const publicDir = path.join(__dirname, '..', 'public');

// Check if files exist and their properties
const filesToCheck = [
  'DS-WebBanner-1.webp',
  'DSLLC_QRC_1.png'
];

filesToCheck.forEach(filename => {
  const filePath = path.join(publicDir, filename);
  
  console.log(`\n📁 Checking: ${filename}`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ File exists: ${(stats.size / 1024).toFixed(1)}KB`);
    
    // Check file permissions
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      console.log(`✅ File is readable`);
    } catch (error) {
      console.log(`❌ File is not readable: ${error.message}`);
    }
    
    // Check if file is actually an image by reading first few bytes
    try {
      const buffer = fs.readFileSync(filePath, { encoding: null });
      const header = buffer.slice(0, 8);
      
      if (filename.endsWith('.webp')) {
        // WebP magic number: RIFF....WEBP
        if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
          console.log(`✅ Valid WebP file header detected`);
        } else {
          console.log(`❌ Invalid WebP file header: ${header.toString('hex')}`);
        }
      } else if (filename.endsWith('.png')) {
        // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
        if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
          console.log(`✅ Valid PNG file header detected`);
        } else {
          console.log(`❌ Invalid PNG file header: ${header.toString('hex')}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error reading file header: ${error.message}`);
    }
    
  } else {
    console.log(`❌ File does not exist`);
  }
});

// Check if Next.js dev server is running
console.log('\n🌐 Checking if dev server is accessible...');
console.log('Try accessing these URLs in your browser:');
console.log(`http://localhost:3000/DS-WebBanner-1.webp?v=restored`);
console.log(`http://localhost:3000/DSLLC_QRC_1.png?v=restored`);

console.log('\n🔧 Troubleshooting Steps:');
console.log('1. Stop the dev server (Ctrl+C)');
console.log('2. Delete the .next folder: rm -rf .next');
console.log('3. Restart: npm run dev');
console.log('4. Hard refresh browser (Ctrl+Shift+R)');
console.log('5. Check browser network tab for image requests');
