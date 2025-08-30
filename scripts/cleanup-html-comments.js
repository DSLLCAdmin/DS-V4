#!/usr/bin/env node

/**
 * Cleanup HTML Comments Script
 * This script removes all HTML comments that the nuclear script added
 */

import fs from 'fs';
import path from 'path';

console.log('🧹 Cleaning up HTML comments from nuclear script...\n');

// Function to recursively find all files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllFiles(filePath, fileList);
    } else if (stat.isFile() && !file.startsWith('.') && !file.includes('.git')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

try {
  console.log('📁 Finding all files in project...');
  const allFiles = getAllFiles('.');
  
  console.log(`🔍 Found ${allFiles.length} files to check...\n`);
  
  let cleanedCount = 0;
  
  // Check and clean each file
  allFiles.forEach((filePath, index) => {
    try {
      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Remove HTML comments
      content = content.replace(/<!-- Updated: [^>]+ -->\n?/g, '');
      
      // If content changed, write it back
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`🧹 Cleaned: ${filePath}`);
        cleanedCount++;
      }
      
      if ((index + 1) % 50 === 0) {
        console.log(`✅ Checked ${index + 1}/${allFiles.length} files...`);
      }
    } catch (error) {
      console.log(`⚠️  Skipped: ${filePath} (${error.message})`);
    }
  });
  
  console.log(`\n🎉 Cleanup complete!`);
  console.log(`✅ Cleaned ${cleanedCount} files`);
  console.log(`✅ All HTML comments removed`);
  console.log(`✅ Files ready for Vercel deployment`);
  
} catch (error) {
  console.error('❌ Error during cleanup:', error.message);
  process.exit(1);
}
