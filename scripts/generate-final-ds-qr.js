const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

console.log('🎨 Generating Final DarkStreet LLC QR Code...\n');

// QR Code Configuration - Final Production Version
const config = {
  url: 'https://darkstreetllc.com/', // Correct DarkStreet LLC website
  colors: {
    primary: '#B7011F',    // Dark red (DS brand color)
    secondary: '#EFD907',  // Bright yellow/gold (DS brand color)
    background: '#000000', // Black background
    text: '#EFD907'        // Gold text
  },
  size: 1000,
  logoSize: 140,
  text: 'DARK STREETS',
  subtitle: 'Scan to Explore'
};

async function generateFinalDSQRCode() {
  try {
    console.log('📱 Generating Final DarkStreet LLC QR Code...');
    
    // Generate base QR code with high error correction
    const qrDataURL = await QRCode.toDataURL(config.url, {
      width: config.size,
      margin: 3,
      color: {
        dark: config.colors.primary,
        light: config.colors.background
      },
      errorCorrectionLevel: 'H' // High error correction for logo overlay
    });
    
    console.log('✅ Base QR Code generated');
    
    // Create canvas for final image with extra space for branding
    const canvasWidth = config.size + 200; // Extra width for text
    const canvasHeight = config.size + 200; // Extra height for text
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Position QR code in center
    const qrX = (canvasWidth - config.size) / 2;
    const qrY = (canvasHeight - config.size) / 2;
    
    // Load QR code image
    const qrImage = await loadImage(qrDataURL);
    ctx.drawImage(qrImage, qrX, qrY);
    
    console.log('🎨 Creating logo space in QR code center...');
    
    // Create open space in center for DS-Logo image
    ctx.save();
    
    const centerX = qrX + config.size / 2;
    const centerY = qrY + config.size / 2;
    const logoRadius = config.logoSize / 2;
    
    // Clear center area for logo placement
    ctx.fillStyle = config.colors.background;
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoRadius + 10, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add subtle border around logo space
    ctx.strokeStyle = config.colors.primary;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add placeholder text for logo area
    ctx.fillStyle = config.colors.text;
    ctx.font = `${config.logoSize * 0.15}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DS-Logo', centerX, centerY);
    
    ctx.restore();
    
    // Add "DARK STREETS" text above QR code
    ctx.save();
    ctx.fillStyle = config.colors.text;
    ctx.font = `bold ${config.size * 0.08}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    // Add text shadow for better visibility
    ctx.shadowColor = config.colors.background;
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(config.text, centerX, qrY - 20);
    ctx.restore();
    
    // Add "Scan to Explore" text below QR code
    ctx.save();
    ctx.fillStyle = config.colors.text;
    ctx.font = `${config.size * 0.05}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Add text shadow
    ctx.shadowColor = config.colors.background;
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(config.subtitle, centerX, qrY + config.size + 20);
    ctx.restore();
    
    // Add subtle border around entire image
    ctx.strokeStyle = config.colors.primary;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvasWidth - 8, canvasHeight - 8);
    
    console.log('💾 Saving final QR code...');
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/DSLLC_Final_QR.png', buffer);
    
    console.log('🎉 Final DarkStreet LLC QR Code Generated!');
    console.log('📁 Saved as: public/DSLLC_Final_QR.png');
    console.log(`🔗 Points to: ${config.url}`);
    console.log('\n🎨 Features:');
    console.log(`   - Brand Colors: ${config.colors.primary} (Red) & ${config.colors.secondary} (Gold)`);
    console.log(`   - Size: ${canvasWidth}x${canvasHeight}px`);
    console.log(`   - Logo Space: Open center for DS-Logo image placement`);
    console.log(`   - High Error Correction: Logo overlay safe`);
    console.log(`   - Professional Branding: Matches website aesthetic`);
    console.log(`   - Clear Call-to-Action: "Scan to Explore"`);
    
    console.log('\n📱 Test it:');
    console.log('   1. Open the PNG file on your phone');
    console.log('   2. Scan with your camera app');
    console.log('   3. Should open DarkStreet LLC website instantly!');
    
    console.log('\n💡 For Marketing Materials:');
    console.log('   - Use this version for all promotional materials');
    console.log('   - Perfect for business cards, flyers, posters');
    console.log('   - Maintains brand consistency with website');
    
    console.log('\n🔧 Technical Details:');
    console.log(`   - QR Code Size: ${config.size}x${config.size}px`);
    console.log(`   - Logo Size: ${config.logoSize}x${config.logoSize}px`);
    console.log(`   - Error Correction: High (H) - Logo overlay safe`);
    console.log(`   - Margins: 3 modules for better scanning`);
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

// Run the generator
generateFinalDSQRCode();
