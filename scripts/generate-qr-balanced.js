import fs from 'fs';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

console.log('🎨 Generating Balanced DarkStreets QR Code...\n');

// QR Code Configuration - Balanced approach
const config = {
  url: 'http://192.168.230.75:3001', // Your current dev URL
  colors: {
    primary: '#B7011F',    // Dark red
    secondary: '#EFD907',  // Bright yellow/gold
    background: '#FFFFFF'  // White background
  },
  size: 1000,
  qrSize: 800, // QR code size (leaving room for text below)
  margin: 4,
  logoSize: 80 // Smaller logo for minimal interference
};

async function generateBalancedQR() {
  try {
    console.log('📱 Generating Balanced QR Code...');
    
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
    const qrY = 50; // Leave space at top
    ctx.drawImage(qrImage, qrX, qrY);
    
    console.log('🎨 Adding subtle logo overlay and text below...');
    
    // Add subtle logo overlay in center
    ctx.save();
    
    // Logo background circle (smaller and more transparent)
    const centerX = config.size / 2;
    const centerY = qrY + (config.qrSize / 2);
    const logoRadius = config.logoSize / 2;
    
    // Semi-transparent logo background
    ctx.globalAlpha = 0.7;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, logoRadius);
    gradient.addColorStop(0, config.colors.secondary);
    gradient.addColorStop(1, config.colors.primary);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = config.colors.background;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add "DS" text logo
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = config.colors.background;
    ctx.font = `bold ${config.logoSize * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DS', centerX, centerY);
    
    ctx.restore();
    
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
    
    console.log('💾 Saving Balanced QR Code...');
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/darkstreets-qr-balanced.png', buffer);
    
    console.log('🎉 Balanced QR Code Generated!');
    console.log('📁 Saved as: public/darkstreets-qr-balanced.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - QR Code: ${config.colors.primary} (Dark Red) on White`);
    console.log(`   - Subtle Logo: Small "DS" overlay with transparency`);
    console.log(`   - Text Below: Clear brand identification`);
    console.log(`   - HIGH Error Correction: Compensates for logo overlay`);
    console.log(`   - Size: ${config.size}x${config.size}px`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should still scan reliably due to HIGH error correction');
    
    console.log('\n💡 Balance Achieved:');
    console.log('   - Brand recognition with logo');
    console.log('   - Scan reliability with error correction');
    console.log('   - Professional appearance with text below');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Run the generator
generateBalancedQR();
