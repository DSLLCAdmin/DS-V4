<!-- Updated: 2025-08-30T20:54:08.104Z -->
#!/usr/bin/env node

/**
 * Connect to New GitHub Repository Script
 * This script connects your local repo to a fresh GitHub repository
 */

import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔗 Connecting to new GitHub repository...\n');

// Get the new repository URL from user
rl.question('Enter your NEW GitHub repository URL (e.g., https://github.com/username/repo-name): ', (repoUrl) => {
  try {
    // Remove .git suffix if present
    const cleanRepoUrl = repoUrl.replace(/\.git$/, '');
    
    console.log(`\n📡 Connecting to: ${cleanRepoUrl}`);
    
    // 1. Add the new remote origin
    console.log('🔗 Adding new remote origin...');
    execSync(`git remote add origin ${cleanRepoUrl}`, { stdio: 'inherit' });
    
    // 2. Push to the new repository
    console.log('🚀 Pushing to new GitHub repository...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n✅ Successfully connected to new GitHub repository!');
    console.log('\n🎯 Next steps:');
    console.log('1. Go to Vercel and create a NEW project');
    console.log('2. Import this new GitHub repository');
    console.log('3. Deploy with clean Git integration!');
    
  } catch (error) {
    console.error('❌ Error connecting to GitHub:', error.message);
    console.log('\n💡 Make sure:');
    console.log('- The repository URL is correct');
    console.log('- You have access to the repository');
    console.log('- The repository exists on GitHub');
  } finally {
    rl.close();
  }
});
