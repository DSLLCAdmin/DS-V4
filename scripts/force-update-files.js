#!/usr/bin/env node

/**
 * Force Update Files Script
 * This script forces updates to all important files by adding a space and saving
 * This will update file timestamps to current time
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Force updating all important files with current timestamps...\n');

// List of important files to force update
const importantFiles = [
  'app/shop/page.tsx',
  'app/page.tsx',
  'data/products.ts',
  'README.md',
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json'
];

// List of important directories to check
const importantDirs = [
  'app',
  'components',
  'data',
  'lib',
  'public',
  'scripts'
];

console.log('📁 Force updating individual files...');

// Force update individual files
importantFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      // Read file content
      let content = fs.readFileSync(file, 'utf8');
      
      // Add a comment with current timestamp
      const timestamp = new Date().toISOString();
      const header = `<!-- Updated: ${timestamp} -->\n`;
      
      // Only add header if it doesn't already exist
      if (!content.includes('<!-- Updated:')) {
        content = header + content;
      }
      
      // Write back to file (this updates timestamp)
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
    } catch (error) {
      console.log(`⚠️  Skipped: ${file} (${error.message})`);
    }
  }
});

console.log('\n📁 Force updating directories by touching files...');

// Force update directories by touching files in them
importantDirs.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    try {
      // Find first file in directory
      const files = fs.readdirSync(dir);
      const firstFile = files.find(file => 
        fs.statSync(path.join(dir, file)).isFile() && 
        !file.startsWith('.')
      );
      
      if (firstFile) {
        const filePath = path.join(dir, firstFile);
        // Touch the file to update timestamp
        const content = fs.readFileSync(filePath, 'utf8');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Touched: ${dir}/ (via ${firstFile})`);
      }
    } catch (error) {
      console.log(`⚠️  Skipped: ${dir}/ (${error.message})`);
    }
  }
});

console.log('\n🎯 All files force updated! Now commit and push:');
console.log('git add .');
console.log('git commit -m "Force update all files with current timestamps"');
console.log('git push origin main');
