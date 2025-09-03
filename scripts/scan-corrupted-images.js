const fs = require('fs');
const path = require('path');

console.log('🔍 Scanning for Corrupted Images');
console.log('================================');

const corruptedFiles = [];
const validFiles = [];

// Image file extensions to check
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];

// Magic numbers for different image formats
const magicNumbers = {
  '.png': [0x89, 0x50, 0x4E, 0x47], // PNG: 89 50 4E 47
  '.jpg': [0xFF, 0xD8, 0xFF], // JPEG: FF D8 FF
  '.jpeg': [0xFF, 0xD8, 0xFF], // JPEG: FF D8 FF
  '.webp': [0x52, 0x49, 0x46, 0x46], // WebP: RIFF
  '.gif': [0x47, 0x49, 0x46], // GIF: GIF
  '.bmp': [0x42, 0x4D], // BMP: BM
  '.tiff': [0x49, 0x49, 0x2A, 0x00] // TIFF: II*
};

function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (item !== 'node_modules' && item !== '.next' && !item.startsWith('.')) {
        scanDirectory(fullPath);
      }
    } else {
      const ext = path.extname(item).toLowerCase();
      if (imageExtensions.includes(ext)) {
        checkImageFile(fullPath, ext);
      }
    }
  }
}

function checkImageFile(filePath, ext) {
  try {
    const stats = fs.statSync(filePath);
    const buffer = fs.readFileSync(filePath, { encoding: null });
    
    if (buffer.length === 0) {
      corruptedFiles.push({ path: filePath, size: 0, issue: 'Empty file' });
      return;
    }
    
    const header = buffer.slice(0, 8);
    const expectedMagic = magicNumbers[ext];
    
    if (!expectedMagic) {
      validFiles.push({ path: filePath, size: stats.size, ext });
      return;
    }
    
    let isValid = true;
    for (let i = 0; i < expectedMagic.length; i++) {
      if (header[i] !== expectedMagic[i]) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      validFiles.push({ path: filePath, size: stats.size, ext });
    } else {
      const headerHex = header.slice(0, 4).toString('hex');
      corruptedFiles.push({ 
        path: filePath, 
        size: stats.size, 
        issue: `Invalid header: ${headerHex}`,
        ext 
      });
    }
    
  } catch (error) {
    corruptedFiles.push({ path: filePath, issue: `Error reading: ${error.message}` });
  }
}

// Start scanning from project root
const projectRoot = path.join(__dirname, '..');
console.log(`📁 Scanning: ${projectRoot}`);

scanDirectory(projectRoot);

// Report results
console.log('\n📊 Scan Results:');
console.log('================');

if (corruptedFiles.length === 0) {
  console.log('✅ No corrupted images found!');
} else {
  console.log(`❌ Found ${corruptedFiles.length} corrupted images:`);
  console.log('');
  
  corruptedFiles.forEach((file, index) => {
    const relativePath = path.relative(projectRoot, file.path);
    console.log(`${index + 1}. ${relativePath}`);
    console.log(`   Size: ${file.size} bytes`);
    console.log(`   Issue: ${file.issue}`);
    console.log('');
  });
  
  console.log('📋 Action Required:');
  console.log('1. Check your backup for these files');
  console.log('2. Replace corrupted files with working versions');
  console.log('3. Run this script again to verify fixes');
}

console.log(`\n✅ Valid images found: ${validFiles.length}`);
if (validFiles.length > 0) {
  console.log('\n📁 Valid image files:');
  validFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file.path);
    console.log(`   ${relativePath} (${(file.size / 1024).toFixed(1)}KB)`);
  });
}

// Create a backup report
const report = {
  scanDate: new Date().toISOString(),
  totalImages: validFiles.length + corruptedFiles.length,
  corruptedCount: corruptedFiles.length,
  validCount: validFiles.length,
  corruptedFiles: corruptedFiles.map(f => ({
    path: path.relative(projectRoot, f.path),
    size: f.size,
    issue: f.issue,
    ext: f.ext
  })),
  validFiles: validFiles.map(f => ({
    path: path.relative(projectRoot, f.path),
    size: f.size,
    ext: f.ext
  }))
};

fs.writeFileSync('corrupted-images-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Detailed report saved: corrupted-images-report.json');
