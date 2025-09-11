const { execSync } = require('child_process');

console.log('Starting Git operations...');

try {
  console.log('1. Adding all changes...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('2. Committing changes...');
  execSync('git commit -m "Add badge field to all products"', { stdio: 'inherit' });
  
  console.log('3. Pushing to main...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('SUCCESS! All Git operations completed');
} catch (error) {
  console.error('Git operation failed:', error.message);
}