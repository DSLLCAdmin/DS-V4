<!-- Updated: 2025-08-30T20:54:08.110Z -->
import fs from 'fs';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

console.log('🎨 Generating DarkStreets QR Code with Text Below...\n');

// QR Code Configuration - Text below, no logo overlay
const config = {
  url: 'http://192.168.230.75:3001', // Your current dev URL
  colors: {
    primary: '#B7011F',    // Dark red
    secondary: '#EFD907',  // Bright yellow/gold
    background: '#FFFFFF'  // White background
  },
  size: 1000,
  qrSize: 800, // QR code size (leaving room for text below)
  margin: 4
};

async function generateQRWithText() {
  try {
    console.log('📱 Generating QR Code with Text Below...');
    
    // Generate high-contrast QR code
    const qrDataURL = await QRCode.toDataURL(config.url, {
      width: config.qrSize,
      margin: config.margin,
      color: {
        dark: config.colors.primary,
        light: config.colors.background
      },
      errorCorrectionLevel: 'M' // Medium error correction for reliability
    });
    
    console.log('✅ Base QR Code generated');
    
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
    const qrY = 50; // Leave space at top
    ctx.drawImage(qrImage, qrX, qrY);
    
    console.log('🎨 Adding DarkStreets text below...');
    
    // Add "DARK STREETS" text below QR code
    ctx.save();
    ctx.fillStyle = config.colors.secondary;
    ctx.font = `bold ${config.size * 0.08}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DARK STREETS', config.size / 2, qrY + config.qrSize + 60);
    
    // Add subtitle
    ctx.fillStyle = config.colors.primary;
    ctx.font = `${config.size * 0.04}px Arial`;
    ctx.fillText('SCAN TO EXPLORE', config.size / 2, qrY + config.qrSize + 100);
    
    // Add URL text (smaller, for reference)
    ctx.fillStyle = '#666666';
    ctx.font = `${config.size * 0.025}px Arial`;
    ctx.fillText(config.url, config.size / 2, qrY + config.qrSize + 130);
    
    ctx.restore();
    
    console.log('💾 Saving QR Code...');
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/darkstreets-qr-text.png', buffer);
    
    console.log('🎉 QR Code with Text Below Generated!');
    console.log('📁 Saved as: public/darkstreets-qr-text.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - QR Code: ${config.colors.primary} (Dark Red) on White`);
    console.log(`   - Text: "${config.colors.secondary}" (Bright Yellow/Gold)`);
    console.log(`   - Size: ${config.size}x${config.size}px`);
    console.log(`   - No Logo Overlay: Maximum scan reliability`);
    console.log(`   - Text Below: Clear brand identification`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should scan quickly like the clean version!');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Run the generator
generateQRWithText();
