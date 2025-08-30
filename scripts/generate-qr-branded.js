import fs from 'fs';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

console.log('🎨 Generating DarkStreets QR Code with Your Actual Brand Elements...\n');

// QR Code Configuration - Using your actual brand
const config = {
  url: 'http://192.168.230.75:3001', // Your current dev URL
  colors: {
    primary: '#B7011F',    // Dark red
    secondary: '#EFD907',  // Bright yellow/gold (your metallic gold)
    background: '#FFFFFF'  // White background
  },
  size: 1200, // Larger canvas for better detail
  qrSize: 700, // QR code size (leaving room for logo and text)
  margin: 4
};

async function generateBrandedQR() {
  try {
    console.log('📱 Generating QR Code with Your Brand Elements...');
    
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
    
    // Fill background
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, config.size, config.size);
    
    // Load QR code image
    const qrImage = await loadImage(qrDataURL);
    
    // Center the QR code horizontally, position it in upper portion
    const qrX = (config.size - config.qrSize) / 2;
    const qrY = 80; // Leave space at top for logo
    ctx.drawImage(qrImage, qrX, qrY);
    
    console.log('🎨 Adding your DarkStreets logo and stylized text...');
    
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
      const centerY = qrY + (config.qrSize / 2);
      
      // Add white background circle for logo
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2 + 10, 0, 2 * Math.PI);
      ctx.fillStyle = config.colors.background;
      ctx.fill();
      ctx.strokeStyle = config.colors.primary;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw your logo
      ctx.drawImage(logoImage, centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
      ctx.restore();
    } else {
      // Create stylized "DS" logo similar to your design
      const logoSize = 120;
      const centerX = config.size / 2;
      const centerY = qrY + (config.qrSize / 2);
      
      ctx.save();
      
      // Logo background circle
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2 + 10, 0, 2 * Math.PI);
      ctx.fillStyle = config.colors.background;
      ctx.fill();
      ctx.strokeStyle = config.colors.primary;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Stylized "DS" text (simulating your intertwined design)
      ctx.fillStyle = config.colors.primary;
      ctx.font = `bold ${logoSize * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Position "D" and "S" to overlap slightly (intertwined effect)
      ctx.fillText('D', centerX - 8, centerY);
      ctx.fillText('S', centerX + 8, centerY);
      
      ctx.restore();
    }
    
    // Add "Dark Streets" text below QR code in your stylized font style
    ctx.save();
    
    // Main "Dark Streets" text with metallic effect
    const textY = qrY + config.qrSize + 30; // Reduced gap from 80 to 30
    
    // Create metallic gold effect with multiple layers
    ctx.fillStyle = config.colors.secondary;
    ctx.font = `bold ${config.size * 0.09}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add shadow for 3D effect
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw "Dark" and "Streets" with proper spacing (no overlap)
    ctx.fillText('Dark', config.size / 2 - 60, textY);
    ctx.fillText('Streets', config.size / 2 + 60, textY);
    
    // Add subtitle
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#000000'; // Changed to black
    ctx.font = `${config.size * 0.035}px Arial`; // Made smaller
    ctx.fillText('SCAN TO EXPLORE', config.size / 2, textY + 50);
    
    // Remove URL text completely
    ctx.restore();
    
    console.log('💾 Saving Branded QR Code...');
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/DSLLC_QRC.png', buffer);
    
    console.log('🎉 Branded DarkStreets QR Code Generated!');
    console.log('📁 Saved as: public/DSLLC_QRC.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - QR Code: ${config.colors.primary} (Dark Red) on White`);
    console.log(`   - Your Logo: Integrated in center with white background`);
    console.log(`   - Stylized Text: "Dark Streets" in your metallic gold style`);
    console.log(`   - HIGH Error Correction: Compensates for logo overlay`);
    console.log(`   - Size: ${config.size}x${config.size}px`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should scan reliably with your brand elements!');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Run the generator
generateBrandedQR();
