<!-- Updated: 2025-08-30T20:54:08.106Z -->
import fs from 'fs';
import QRCode from 'qrcode';

console.log('📱 Generating Clean, High-Contrast DarkStreets QR Code...\n');

// QR Code Configuration - Optimized for scanning
const config = {
  url: 'http://192.168.230.75:3001', // Your current dev URL
  colors: {
    primary: '#B7011F',    // Dark red
    background: '#FFFFFF'  // Pure white background
  },
  size: 1000, // Larger for better scanning
  margin: 4   // Wider margins for better contrast
};

async function generateCleanQRCode() {
  try {
    console.log('📱 Generating Clean QR Code...');
    
    // Generate high-contrast QR code
    const qrDataURL = await QRCode.toDataURL(config.url, {
      width: config.size,
      margin: config.margin,
      color: {
        dark: config.colors.primary,
        light: config.colors.background
      },
      errorCorrectionLevel: 'M' // Medium error correction for reliability
    });
    
    console.log('✅ Clean QR Code generated');
    
    // Save as PNG
    const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync('./public/darkstreets-qr-clean.png', buffer);
    
    console.log('🎉 Clean DarkStreets QR Code Generated!');
    console.log('📁 Saved as: public/darkstreets-qr-clean.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - Color: ${config.colors.primary} (Dark Red) on White`);
    console.log(`   - Size: ${config.size}x${config.size}px`);
    console.log(`   - High Contrast: Guaranteed to scan perfectly`);
    console.log(`   - No Logo Overlay: Maximum scan reliability`);
    console.log(`   - Wide Margins: Better visual separation`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should open your development website instantly!');
    
    console.log('\n💡 For Marketing Materials:');
    console.log('   - Use this clean version for maximum scan reliability');
    console.log('   - Perfect for posters, flyers, business cards');
    console.log('   - When you go live, just regenerate with your live URL');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Run the generator
generateCleanQRCode();
