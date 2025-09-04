const https = require('https');

const testImages = [
  '1a_first-light-ebook.webp',
  '2a_risque-safety-ebook.webp',
  '3a_mercury-memory-ebook.webp',
  'A2_mesh-bodysuits.webp',
  'A8_hats.webp',
  'B7_mirror-charms.webp',
  'B2_Dark Streets Scent Diffusers.webp',
  'B3_window-shades.webp',
  'D8_Moonlight Noir Projection Lamps.webp',
  'D6_neon-light-wall-signs.webp',
  'G2_dark-street-mug_Front.webp'
];

const baseUrl = 'https://ds-v5.netlify.app';

console.log('🔍 Testing Netlify Image Accessibility');
console.log('=====================================');

function testImage(imagePath) {
  return new Promise((resolve) => {
    const url = `${baseUrl}/product-images/${imagePath}`;
    
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${imagePath} - Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`❌ ${imagePath} - Status: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ ${imagePath} - Error: ${err.message}`);
      resolve(false);
    });
  });
}

async function testAllImages() {
  console.log(`Testing ${testImages.length} images on ${baseUrl}...\n`);
  
  const results = await Promise.all(testImages.map(testImage));
  const successCount = results.filter(Boolean).length;
  
  console.log(`\n📊 Results: ${successCount}/${testImages.length} images accessible`);
  
  if (successCount === 0) {
    console.log('\n🚨 All images failed! This suggests a Netlify configuration issue.');
  } else if (successCount < testImages.length) {
    console.log('\n⚠️ Some images failed. Check individual errors above.');
  } else {
    console.log('\n✅ All images accessible! The issue might be in the React app.');
  }
}

testAllImages();
