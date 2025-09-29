const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

class AutoBackupSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, 'chat-backups');
    this.configFile = path.join(this.projectRoot, 'backup-config.json');
    this.defaultConfig = {
      enabled: true,
      interval: 30, // minutes
      maxBackups: 10,
      includeFiles: [
        'package.json',
        'next.config.js',
        'tsconfig.json',
        'tailwind.config.js',
        'README.md',
        'CREDENTIAL_COLLECTION_LIST.md',
        '.env.local',
        '.env.example',
        'shopify-env-example.txt'
      ],
      includeDirectories: [
        '.git',
        'docs',
        'scripts',
        'components',
        'lib'
      ]
    };
  }

  async loadConfig() {
    try {
      if (await fs.pathExists(this.configFile)) {
        const config = await fs.readJson(this.configFile);
        return { ...this.defaultConfig, ...config };
      }
      return this.defaultConfig;
    } catch (error) {
      console.error('Error loading config:', error.message);
      return this.defaultConfig;
    }
  }

  async saveConfig(config) {
    try {
      await fs.writeJson(this.configFile, config, { spaces: 2 });
      console.log('✅ Configuration saved');
    } catch (error) {
      console.error('❌ Error saving config:', error.message);
    }
  }

  async createBackup() {
    const ChatBackupSystem = require('./chat-backup.js');
    const backup = new ChatBackupSystem();
    await backup.run();
  }

  async start() {
    const config = await this.loadConfig();
    
    if (!config.enabled) {
      console.log('⏸️  Auto-backup is disabled');
      return;
    }

    console.log(`🔄 Starting auto-backup system (every ${config.interval} minutes)`);
    
    // Create initial backup
    await this.createBackup();
    
    // Set up interval
    const intervalMs = config.interval * 60 * 1000;
    setInterval(async () => {
      try {
        await this.createBackup();
      } catch (error) {
        console.error('❌ Auto-backup failed:', error.message);
      }
    }, intervalMs);
  }

  async stop() {
    const config = await this.loadConfig();
    config.enabled = false;
    await this.saveConfig(config);
    console.log('⏹️  Auto-backup stopped');
  }

  async status() {
    const config = await this.loadConfig();
    console.log('📊 Auto-backup Status:');
    console.log(`   Enabled: ${config.enabled ? '✅' : '❌'}`);
    console.log(`   Interval: ${config.interval} minutes`);
    console.log(`   Max Backups: ${config.maxBackups}`);
    console.log(`   Files: ${config.includeFiles.length}`);
    console.log(`   Directories: ${config.includeDirectories.length}`);
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const autoBackup = new AutoBackupSystem();

  switch (command) {
    case 'start':
      autoBackup.start();
      break;
    case 'stop':
      autoBackup.stop();
      break;
    case 'status':
      autoBackup.status();
      break;
    default:
      console.log('Usage: node auto-backup.js [start|stop|status]');
  }
}

module.exports = AutoBackupSystem;
