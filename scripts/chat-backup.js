const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

class ChatBackupSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, 'chat-backups');
    this.timestamp = moment().format('YYYYMMDD_HHmmss');
    this.backupName = `ds2_chat_backup_${this.timestamp}`;
    this.backupPath = path.join(this.backupDir, this.backupName);
  }

  async initialize() {
    console.log('🔄 Starting DS_2 Chat Backup System...');
    console.log(`📁 Project Root: ${this.projectRoot}`);
    console.log(`📂 Backup Directory: ${this.backupDir}`);
    console.log(`⏰ Timestamp: ${this.timestamp}`);

    // Create backup directory
    await fs.ensureDir(this.backupPath);
    console.log(`📋 Created backup directory: ${this.backupPath}`);
  }

  async backupFile(sourcePath, description) {
    try {
      const fullSourcePath = path.join(this.projectRoot, sourcePath);
      const fullDestPath = path.join(this.backupPath, sourcePath);
      
      if (await fs.pathExists(fullSourcePath)) {
        await fs.copy(fullSourcePath, fullDestPath);
        console.log(`✅ Backed up ${description}: ${sourcePath}`);
        return true;
      } else {
        console.log(`⚠️  ${description} not found: ${sourcePath}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error backing up ${description}:`, error.message);
      return false;
    }
  }

  async backupDirectory(sourcePath, description) {
    try {
      const fullSourcePath = path.join(this.projectRoot, sourcePath);
      const fullDestPath = path.join(this.backupPath, sourcePath);
      
      if (await fs.pathExists(fullSourcePath)) {
        await fs.copy(fullSourcePath, fullDestPath);
        console.log(`✅ Backed up ${description}: ${sourcePath}/`);
        return true;
      } else {
        console.log(`⚠️  ${description} not found: ${sourcePath}/`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error backing up ${description}:`, error.message);
      return false;
    }
  }

  async createManifest() {
    const manifest = {
      backupDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      backupName: this.backupName,
      projectRoot: this.projectRoot,
      gitBranch: await this.getGitBranch(),
      gitCommit: await this.getGitCommit(),
      files: [
        '.git/',
        'package.json',
        'next.config.js',
        'tsconfig.json',
        'tailwind.config.js',
        'docs/',
        'README.md',
        'CREDENTIAL_COLLECTION_LIST.md',
        '.env.local',
        '.env.example',
        'shopify-env-example.txt',
        'scripts/',
        'components/',
        'lib/'
      ],
      purpose: 'Essential project files and configuration needed to restore DS_2 project state',
      restoreSteps: [
        'Copy files back to project directory',
        'Run npm install',
        'Restore .env.local with actual credentials',
        'Run npm run dev'
      ]
    };

    const manifestPath = path.join(this.backupPath, 'BACKUP_MANIFEST.json');
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    console.log(`📄 Manifest created: ${manifestPath}`);

    // Also create text version
    const textManifest = this.createTextManifest(manifest);
    const textManifestPath = path.join(this.backupPath, 'BACKUP_MANIFEST.txt');
    await fs.writeFile(textManifestPath, textManifest);
    console.log(`📄 Text manifest created: ${textManifestPath}`);
  }

  createTextManifest(manifest) {
    return `DS_2 Chat Backup Manifest
========================
Backup Date: ${manifest.backupDate}
Backup Name: ${manifest.backupName}
Project Root: ${manifest.projectRoot}
Git Branch: ${manifest.gitBranch}
Git Commit: ${manifest.gitCommit}

Files Backed Up:
${manifest.files.map(file => `- ${file}`).join('\n')}

Backup Purpose:
${manifest.purpose}

To Restore:
${manifest.restoreSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`;
  }

  async getGitBranch() {
    try {
      const { execSync } = require('child_process');
      return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch {
      return 'No git repository';
    }
  }

  async getGitCommit() {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'No git commit';
    }
  }

  async cleanupOldBackups() {
    try {
      const backups = await fs.readdir(this.backupDir);
      const backupDirs = backups.filter(name => name.startsWith('ds2_chat_backup_'));
      
      if (backupDirs.length > 10) {
        // Sort by name (which includes timestamp)
        backupDirs.sort();
        const toDelete = backupDirs.slice(0, backupDirs.length - 10);
        
        for (const dir of toDelete) {
          const dirPath = path.join(this.backupDir, dir);
          await fs.remove(dirPath);
          console.log(`🗑️  Removed old backup: ${dir}`);
        }
      }
    } catch (error) {
      console.error('❌ Error cleaning up old backups:', error.message);
    }
  }

  async run() {
    try {
      await this.initialize();

      // Backup critical files
      await this.backupFile('package.json', 'package.json');
      await this.backupFile('next.config.js', 'next.config.js');
      await this.backupFile('tsconfig.json', 'tsconfig.json');
      await this.backupFile('tailwind.config.js', 'tailwind.config.js');
      await this.backupFile('README.md', 'README.md');
      await this.backupFile('CREDENTIAL_COLLECTION_LIST.md', 'Credential Collection List');
      await this.backupFile('.env.local', '.env.local');
      await this.backupFile('.env.example', '.env.example');
      await this.backupFile('shopify-env-example.txt', 'Shopify Environment Example');

      // Backup directories
      await this.backupDirectory('.git', 'Git Repository');
      await this.backupDirectory('docs', 'Documentation');
      await this.backupDirectory('scripts', 'Scripts');
      await this.backupDirectory('components', 'Components');
      await this.backupDirectory('lib', 'Library Files');

      // Create manifest
      await this.createManifest();

      // Cleanup old backups
      await this.cleanupOldBackups();

      console.log(`✅ Backup completed: ${this.backupPath}`);
      console.log(`📊 Backup location: ${this.backupPath}`);
      console.log('🎉 DS_2 Chat Backup System completed successfully!');

    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const backup = new ChatBackupSystem();
  backup.run();
}

module.exports = ChatBackupSystem;
