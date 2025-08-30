<!-- Updated: 2025-08-30T20:54:08.118Z -->
#!/usr/bin/env node

/**
 * Fresh GitHub Repository Setup Script
 * This script sets up a completely new GitHub repository for DarkStreets LLC
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up fresh GitHub repository for DarkStreets LLC...\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from your project root.');
  process.exit(1);
}

try {
  // 1. Initialize fresh Git repository
  console.log('📁 Initializing fresh Git repository...');
  execSync('git init', { stdio: 'inherit' });
  
  // 2. Add all files
  console.log('📦 Adding all files to Git...');
  execSync('git add .', { stdio: 'inherit' });
  
  // 3. Create initial commit
  console.log('💾 Creating initial commit...');
  execSync('git commit -m "Initial DarkStreets LLC website setup"', { stdio: 'inherit' });
  
  // 4. Create new branch called 'main'
  console.log('🌿 Creating main branch...');
  execSync('git branch -M main', { stdio: 'inherit' });
  
  console.log('\n✅ Fresh Git repository initialized successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to GitHub.com and create a NEW repository');
  console.log('2. Copy the repository URL');
  console.log('3. Run: git remote add origin <YOUR_NEW_REPO_URL>');
  console.log('4. Run: git push -u origin main');
  console.log('\n🎯 This will give you a completely clean Git → Vercel pipeline!');
  
} catch (error) {
  console.error('❌ Error setting up Git repository:', error.message);
  process.exit(1);
}
