const fs = require('fs');
const path = require('path');

console.log('🔒 Image Protection Script');
console.log('========================');

// Check if .gitattributes exists and is correct
const gitAttributesPath = path.join(__dirname, '..', '.gitattributes');
if (fs.existsSync(gitAttributesPath)) {
    const content = fs.readFileSync(gitAttributesPath, 'utf8');
    if (content.includes('*.png binary') && content.includes('*.jpg binary')) {
        console.log('✅ .gitattributes is properly configured');
    } else {
        console.log('❌ .gitattributes needs updating');
    }
} else {
    console.log('❌ .gitattributes file missing');
}

// List corrupted image files
const publicDir = path.join(__dirname, '..', 'public');
const corruptedFiles = [];

function checkFile(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath);
        
        // Check if file is corrupted (0 bytes or contains text instead of binary)
        if (stats.size === 0) {
            corruptedFiles.push(`${filePath} (0 bytes)`);
        } else if (content.includes('\n') && content.length < 10000) {
            // Small files with newlines might be corrupted
            const firstLine = content.toString().split('\n')[0];
            if (firstLine.length > 100) {
                corruptedFiles.push(`${filePath} (possible text corruption)`);
            }
        }
    } catch (error) {
        console.log(`Error checking ${filePath}: ${error.message}`);
    }
}

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            scanDirectory(filePath);
        } else if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
            checkFile(filePath);
        }
    });
}

console.log('\n🔍 Scanning for corrupted image files...');
scanDirectory(publicDir);

if (corruptedFiles.length > 0) {
    console.log('\n❌ Corrupted files found:');
    corruptedFiles.forEach(file => console.log(`  - ${file}`));
} else {
    console.log('\n✅ No obvious corruption detected');
}

console.log('\n📋 Protection Recommendations:');
console.log('1. ✅ .gitattributes file prevents future corruption');
console.log('2. 🔄 Restore original images from backup');
console.log('3. 🧪 Test images before copying to project');
console.log('4. 💾 Keep backup copies outside Git repository');

console.log('\n🎯 Next Steps:');
console.log('- Search your backup for original DS-WebBanner-1.webp and DSLLC_QRC_1.png');
console.log('- Copy them to a temporary location first');
console.log('- Verify they open correctly before moving to project');
