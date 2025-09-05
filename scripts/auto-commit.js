#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const COMMIT_INTERVAL_MINUTES = 30;
const COMMIT_MESSAGE_PREFIX = 'Auto-commit:';

function getCurrentTimestamp() {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function checkForChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length > 0;
  } catch (error) {
    console.error('Error checking git status:', error.message);
    return false;
  }
}

function createCommit() {
  try {
    const timestamp = getCurrentTimestamp();
    const commitMessage = `${COMMIT_MESSAGE_PREFIX} ${timestamp}`;
    
    console.log(`[${timestamp}] Auto-commit: Checking for changes...`);
    
    if (checkForChanges()) {
      // Add all changes
      execSync('git add .', { stdio: 'inherit' });
      
      // Create commit
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      console.log(`[${timestamp}] ✅ Auto-commit successful: ${commitMessage}`);
    } else {
      console.log(`[${timestamp}] ℹ️  No changes to commit`);
    }
  } catch (error) {
    console.error(`[${getCurrentTimestamp()}] ❌ Auto-commit failed:`, error.message);
  }
}

function startAutoCommit() {
  console.log(`🚀 Starting auto-commit every ${COMMIT_INTERVAL_MINUTES} minutes...`);
  console.log(`📁 Working directory: ${process.cwd()}`);
  console.log(`⏰ Next commit check: ${new Date(Date.now() + COMMIT_INTERVAL_MINUTES * 60000).toLocaleString()}`);
  
  // Run immediately
  createCommit();
  
  // Set up interval
  setInterval(createCommit, COMMIT_INTERVAL_MINUTES * 60000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Auto-commit stopped by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Auto-commit stopped by system');
  process.exit(0);
});

// Start the auto-commit process
startAutoCommit();
