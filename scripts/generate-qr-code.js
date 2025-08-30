<!-- Updated: 2025-08-30T20:54:08.109Z -->
import fs from 'fs';
import QRCode from 'qrcode';
import { createCanvas, loadImage, registerFont } from 'canvas';

console.log('🎨 Generating Custom DarkStreets QR Code...\n');

// QR Code Configuration
const config = {
  url: 'https://dsllc-admin-darkstreets-website.vercel.app/', // Your current dev URL
  colors: {
    primary: '#B7011F',    // Dark red
    secondary: '#EFD907',  // Bright yellow/gold
    background: '#000000'  // Black background
  },
  size: 800,
  logoSize: 120,
  text: 'DARK STREETS'
};

async function generateCustomQRCode() {
  try {
    console.log('📱 Generating QR Code...');
    
    // Generate base QR code
    const qrDataURL = await QRCode.toDataURL(config.url, {
      width: config.size,
      margin: 2,
      color: {
        dark: config.colors.primary,
        light: config.colors.background
      },
      errorCorrectionLevel: 'H' // High error correction for logo overlay
    });
    
    console.log('✅ Base QR Code generated');
    
    // Create canvas for final image
    const canvas = createCanvas(config.size, config.size);
    const ctx = canvas.getContext('2d');
    
    // Load QR code image
    const qrImage = await loadImage(qrDataURL);
    ctx.drawImage(qrImage, 0, 0);
    
    console.log('🎨 Adding DarkStreets branding...');
    
    // Add logo placeholder (since we can't load external images in Node.js)
    // This will create a stylized "DS" text logo
    ctx.save();
    
    // Logo background circle
    const centerX = config.size / 2;
    const centerY = config.size / 2;
    const logoRadius = config.logoSize / 2;
    
    // Logo background with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, logoRadius);
    gradient.addColorStop(0, config.colors.secondary);
    gradient.addColorStop(1, config.colors.primary);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = config.colors.background;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Add "DS" text logo
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
    ctx.textBaseline = 'bottom';
    ctx.fillText(config.text, centerX, config.size - 20);
    
    // Add subtitle
    ctx.fillStyle = config.colors.primary;
    ctx.font = `${config.size * 0.04}px Arial`;
    ctx.fillText('SCAN TO EXPLORE', centerX, config.size - 5);
    ctx.restore();
    
    console.log('💾 Saving QR Code...');
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/darkstreets-qr-code.png', buffer);
    
    console.log('🎉 Custom DarkStreets QR Code Generated!');
    console.log('📁 Saved as: public/darkstreets-qr-code.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - Primary Color: ${config.colors.primary} (Dark Red)`);
    console.log(`   - Secondary Color: ${config.colors.secondary} (Bright Yellow/Gold)`);
    console.log(`   - Logo: Stylized "DS" in center`);
    console.log(`   - Text: "${config.text}" branding`);
    console.log(`   - Size: ${config.size}x${config.size}px`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should open your development website!');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Run the generator
generateCustomQRCode();
