#!/usr/bin/env node

/**
 * Brand Logo First-Half Glow Application Script
 * 
 * This script applies the "first-half glow" effect to all brand logos across the site.
 * It searches for instances of DarkStreet, StreetStore, StreetCircle, and other
 * concatenated brand names and ensures they use the proper components with glow.
 */

const fs = require('fs');
const path = require('path');

// Brand patterns to search for
const BRAND_PATTERNS = [
  { pattern: /DarkStreet/g, component: 'DarkStreetsTextLogo', description: 'DarkStreet' },
  { pattern: /StreetStore/g, component: 'StreetStoreTextLogo', description: 'StreetStore' },
  { pattern: /StreetCircle/g, component: 'StreetCircleTextLogo', description: 'StreetCircle' },
  { pattern: /Dark Streeter/g, component: 'DarkStreetsTextLogo', description: 'Dark Streeter' },
  { pattern: /DarkStreeter/g, component: 'DarkStreetsTextLogo', description: 'DarkStreeter' },
];

// File extensions to process
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Directories to search
const SEARCH_DIRS = [
  'app',
  'components',
  'lib',
  'data'
];

function findFiles(dir, extensions) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && !item.includes('node_modules')) {
        files = files.concat(findFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Skipping directory ${dir}: ${error.message}`);
  }
  
  return files;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    
    // Check for brand patterns
    for (const brand of BRAND_PATTERNS) {
      const matches = content.match(brand.pattern);
      if (matches) {
        console.log(`📝 Found ${matches.length} instances of "${brand.description}" in ${filePath}`);
        
        // Check if already using proper component
        if (content.includes(`${brand.component}`)) {
          console.log(`✅ Already using ${brand.component} component`);
        } else {
          console.log(`⚠️  Needs ${brand.component} component - manual review required`);
          modified = true;
        }
      }
    }
    
    if (modified) {
      console.log(`🔧 File ${filePath} needs manual updates`);
    }
    
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

function generateReport() {
  console.log('\n🎯 BRAND LOGO FIRST-HALF GLOW APPLICATION REPORT');
  console.log('=' .repeat(60));
  
  const allFiles = [];
  for (const dir of SEARCH_DIRS) {
    if (fs.existsSync(dir)) {
      allFiles.push(...findFiles(dir, FILE_EXTENSIONS));
    }
  }
  
  console.log(`📁 Found ${allFiles.length} files to process`);
  
  let totalInstances = 0;
  const brandCounts = {};
  
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const brand of BRAND_PATTERNS) {
        const matches = content.match(brand.pattern);
        if (matches) {
          totalInstances += matches.length;
          brandCounts[brand.description] = (brandCounts[brand.description] || 0) + matches.length;
          
          console.log(`📝 ${file}: ${matches.length} instances of "${brand.description}"`);
        }
      }
    } catch (error) {
      console.log(`❌ Error reading ${file}: ${error.message}`);
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`Total brand instances found: ${totalInstances}`);
  
  for (const [brand, count] of Object.entries(brandCounts)) {
    console.log(`  ${brand}: ${count} instances`);
  }
  
  console.log('\n🎨 CSS CLASSES AVAILABLE:');
  console.log('  .dark-streets-text-logo .dark-part (with glow)');
  console.log('  .street-store-text-logo .street-part (with glow)');
  console.log('  .street-circle-text-logo .street-part (with glow)');
  console.log('  .brand-text-logo .first-half (with glow)');
  
  console.log('\n🔧 COMPONENTS AVAILABLE:');
  console.log('  DarkStreetsTextLogo');
  console.log('  StreetStoreTextLogo');
  console.log('  StreetCircleTextLogo');
  console.log('  BrandTextLogo (generic)');
  
  console.log('\n✅ NEXT STEPS:');
  console.log('1. Review files with brand instances');
  console.log('2. Replace text with proper components');
  console.log('3. Test glow effect on all backgrounds');
  console.log('4. Apply to new brand concatenations as needed');
}

// Run the report
generateReport();
