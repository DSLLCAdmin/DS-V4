import fs from 'fs';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

console.log('🎨 Generating Clean DarkStreets QR Code (Red on Black)...\n');

// QR Code Configuration - Clean version with logo only
const config = {
  url: 'http://192.168.230.75:3001', // Your current dev URL
  colors: {
    primary: '#B7011F',    // Dark red
    background: '#000000'  // Black background
  },
  size: 1200,
  qrSize: 800, // Larger QR code for better scanning
  margin: 4
};

async function generateCleanQR() {
  try {
    console.log('📱 Generating Clean QR Code with Logo...');
    
    // Generate high-contrast QR code with HIGH error correction
    const qrDataURL = await QRCode.toDataURL(config.url, {
      width: config.qrSize,
      margin: config.margin,
      color: {
        dark: config.colors.primary,
        light: config.colors.background
      },
      errorCorrectionLevel: 'H' // HIGH error correction for logo overlay
    });
    
    console.log('✅ Base QR Code generated with HIGH error correction');
    
    // Create canvas for final image
    const canvas = createCanvas(config.size, config.size);
    const ctx = canvas.getContext('2d');
    
    // Fill background with black
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, config.size, config.size);
    
    // Load QR code image
    const qrImage = await loadImage(qrDataURL);
    
    // Center the QR code
    const qrX = (config.size - config.qrSize) / 2;
    const qrY = (config.size - config.qrSize) / 2;
    ctx.drawImage(qrImage, qrX, qrY);
    
    console.log('🎨 Adding your DarkStreets logo in center...');
    
    // Try to load your actual logo file
    let logoImage = null;
    try {
      // Try different possible logo locations
      const logoPaths = [
        './public/DS-Logo.png',
        './public/DS-Logo-2.png', 
        './public/DS-Logo-3.png',
        './public/Icons/DS-Logo.png'
      ];
      
      for (const logoPath of logoPaths) {
        if (fs.existsSync(logoPath)) {
          logoImage = await loadImage(logoPath);
          console.log(`✅ Loaded logo from: ${logoPath}`);
          break;
        }
      }
    } catch (error) {
      console.log('⚠️ Could not load logo file, will create stylized version');
    }
    
    // Add logo overlay in center of QR code
    if (logoImage) {
      // Use your actual logo
      const logoSize = 120;
      const centerX = config.size / 2;
      const centerY = config.size / 2;
      
      // Add white background circle for logo
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2 + 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = config.colors.primary;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw your logo
      ctx.drawImage(logoImage, centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
      ctx.restore();
    } else {
      // Create stylized "DS" logo
      const logoSize = 120;
      const centerX = config.size / 2;
      const centerY = config.size / 2;
      
      ctx.save();
      
      // Logo background circle
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2 + 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = config.colors.primary;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Stylized "DS" text
      ctx.fillStyle = config.colors.primary;
      ctx.font = `bold ${logoSize * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DS', centerX, centerY);
      
      ctx.restore();
    }
    
    console.log('💾 Saving Clean QR Code...');
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/DSLLC_QRC_CLEAN.png', buffer);
    
    console.log('🎉 Clean DarkStreets QR Code Generated!');
    console.log('📁 Saved as: public/DSLLC_QRC_CLEAN.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - QR Code: ${config.colors.primary} (Dark Red) on Black`);
    console.log(`   - Your Logo: Integrated in center with white background`);
    console.log(`   - No Text: Clean for manual brand addition`);
    console.log(`   - HIGH Error Correction: Maximum scan reliability`);
    console.log(`   - Size: ${config.size}x${config.size}px`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should scan perfectly!');
    console.log('   4. Add your brand elements manually in paint program');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Run the generator
generateCleanQR();
