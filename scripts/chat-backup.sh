#!/bin/bash
# DS_2 Chat Backup System
# Automatically backs up chat history and project state

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$PROJECT_ROOT/chat-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="ds2_chat_backup_$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting DS_2 Chat Backup System..."
echo "📁 Project Root: $PROJECT_ROOT"
echo "📂 Backup Directory: $BACKUP_DIR"
echo "⏰ Timestamp: $TIMESTAMP"

# Create backup folder
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
mkdir -p "$BACKUP_PATH"

echo "📋 Backing up project files..."

# Backup critical project files
cp -r "$PROJECT_ROOT/.git" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No .git directory found"
cp "$PROJECT_ROOT/package.json" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No package.json found"
cp "$PROJECT_ROOT/next.config.js" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No next.config.js found"
cp "$PROJECT_ROOT/tsconfig.json" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No tsconfig.json found"
cp "$PROJECT_ROOT/tailwind.config.js" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No tailwind.config.js found"

# Backup documentation
cp -r "$PROJECT_ROOT/docs" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No docs directory found"
cp "$PROJECT_ROOT/README.md" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No README.md found"
cp "$PROJECT_ROOT/CREDENTIAL_COLLECTION_LIST.md" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No credential list found"

# Backup configuration files
cp "$PROJECT_ROOT/.env.local" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No .env.local found"
cp "$PROJECT_ROOT/.env.example" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No .env.example found"
cp "$PROJECT_ROOT/shopify-env-example.txt" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No shopify-env-example.txt found"

# Backup scripts
cp -r "$PROJECT_ROOT/scripts" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No scripts directory found"

# Backup components
cp -r "$PROJECT_ROOT/components" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No components directory found"

# Backup lib
cp -r "$PROJECT_ROOT/lib" "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  No lib directory found"

# Create backup manifest
cat > "$BACKUP_PATH/BACKUP_MANIFEST.txt" << EOF
DS_2 Chat Backup Manifest
========================
Backup Date: $(date)
Backup Name: $BACKUP_NAME
Project Root: $PROJECT_ROOT
Git Branch: $(git branch --show-current 2>/dev/null || echo "No git repository")
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "No git commit")

Files Backed Up:
- .git/ (if exists)
- package.json
- next.config.js
- tsconfig.json
- tailwind.config.js
- docs/
- README.md
- CREDENTIAL_COLLECTION_LIST.md
- .env.local (if exists)
- .env.example (if exists)
- shopify-env-example.txt
- scripts/
- components/
- lib/

Backup Purpose:
This backup contains the essential project files and configuration
needed to restore the DS_2 project state and continue development.

To Restore:
1. Copy files back to project directory
2. Run npm install
3. Restore .env.local with actual credentials
4. Run npm run dev

EOF

echo "✅ Backup completed: $BACKUP_PATH"
echo "📄 Manifest created: $BACKUP_PATH/BACKUP_MANIFEST.txt"

# Create latest symlink
ln -sfn "$BACKUP_NAME" "$BACKUP_DIR/latest"

echo "🔗 Latest backup symlink created: $BACKUP_DIR/latest"

# Clean up old backups (keep last 10)
echo "🧹 Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t | tail -n +11 | xargs -r rm -rf

echo "🎉 DS_2 Chat Backup System completed successfully!"
echo "📊 Backup location: $BACKUP_PATH"
echo "🔗 Latest symlink: $BACKUP_DIR/latest"
