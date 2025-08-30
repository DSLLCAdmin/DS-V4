#!/usr/bin/env node

/**
 * Nuclear File Update Script
 * This script forces updates to ALL files and then commits and pushes everything
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('💥 NUCLEAR FILE UPDATE - Force updating ALL files with current timestamps...\n');

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
  
  console.log(`🔍 Found ${allFiles.length} files to update...\n`);
  
  // Force update each file
  allFiles.forEach((filePath, index) => {
    try {
      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add timestamp comment if it doesn't exist
      const timestamp = new Date().toISOString();
      const header = `<!-- Updated: ${timestamp} -->\n`;
      
      if (!content.includes('<!-- Updated:')) {
        content = header + content;
      }
      
      // Write back to file (this updates timestamp)
      fs.writeFileSync(filePath, content, 'utf8');
      
      if ((index + 1) % 10 === 0) {
        console.log(`✅ Updated ${index + 1}/${allFiles.length} files...`);
      }
    } catch (error) {
      console.log(`⚠️  Skipped: ${filePath} (${error.message})`);
    }
  });
  
  console.log('\n🚀 All files updated! Now committing and pushing...\n');
  
  // Add all files
  console.log('📦 Adding all files to Git...');
  execSync('git add .', { stdio: 'inherit' });
  
  // Commit
  console.log('💾 Committing updated files...');
  execSync('git commit -m "NUCLEAR UPDATE: Force update all files with current timestamps"', { stdio: 'inherit' });
  
  // Push
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n🎉 NUCLEAR UPDATE COMPLETE!');
  console.log('✅ All files now have current timestamps');
  console.log('✅ All changes committed and pushed');
  console.log('✅ GitHub repository is now current');
  
} catch (error) {
  console.error('❌ Error during nuclear update:', error.message);
  process.exit(1);
}
