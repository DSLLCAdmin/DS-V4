@echo off
REM DS_2 Chat Backup System - Windows Batch Version
REM Automatically backs up chat history and project state

echo 🔄 Starting DS_2 Chat Backup System...

REM Get current directory
set "PROJECT_ROOT=%~dp0"
set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"

REM Create timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "TIMESTAMP=%dt:~0,8%_%dt:~8,6%"
set "BACKUP_NAME=ds2_chat_backup_%TIMESTAMP%"

REM Create backup directory
set "BACKUP_DIR=%PROJECT_ROOT%\chat-backups"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set "BACKUP_PATH=%BACKUP_DIR%\%BACKUP_NAME%"
mkdir "%BACKUP_PATH%"

echo 📁 Project Root: %PROJECT_ROOT%
echo 📂 Backup Directory: %BACKUP_DIR%
echo ⏰ Timestamp: %TIMESTAMP%

echo 📋 Backing up project files...

REM Backup critical project files
if exist "%PROJECT_ROOT%\.git" (
    echo ✅ Backing up .git directory...
    xcopy "%PROJECT_ROOT%\.git" "%BACKUP_PATH%\.git\" /E /I /Q
) else (
    echo ⚠️  No .git directory found
)

if exist "%PROJECT_ROOT%\package.json" (
    echo ✅ Backing up package.json...
    copy "%PROJECT_ROOT%\package.json" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No package.json found
)

if exist "%PROJECT_ROOT%\next.config.js" (
    echo ✅ Backing up next.config.js...
    copy "%PROJECT_ROOT%\next.config.js" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No next.config.js found
)

if exist "%PROJECT_ROOT%\tsconfig.json" (
    echo ✅ Backing up tsconfig.json...
    copy "%PROJECT_ROOT%\tsconfig.json" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No tsconfig.json found
)

if exist "%PROJECT_ROOT%\tailwind.config.js" (
    echo ✅ Backing up tailwind.config.js...
    copy "%PROJECT_ROOT%\tailwind.config.js" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No tailwind.config.js found
)

REM Backup documentation
if exist "%PROJECT_ROOT%\docs" (
    echo ✅ Backing up docs directory...
    xcopy "%PROJECT_ROOT%\docs" "%BACKUP_PATH%\docs\" /E /I /Q
) else (
    echo ⚠️  No docs directory found
)

if exist "%PROJECT_ROOT%\README.md" (
    echo ✅ Backing up README.md...
    copy "%PROJECT_ROOT%\README.md" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No README.md found
)

if exist "%PROJECT_ROOT%\CREDENTIAL_COLLECTION_LIST.md" (
    echo ✅ Backing up CREDENTIAL_COLLECTION_LIST.md...
    copy "%PROJECT_ROOT%\CREDENTIAL_COLLECTION_LIST.md" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No CREDENTIAL_COLLECTION_LIST.md found
)

REM Backup configuration files
if exist "%PROJECT_ROOT%\.env.local" (
    echo ✅ Backing up .env.local...
    copy "%PROJECT_ROOT%\.env.local" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No .env.local found
)

if exist "%PROJECT_ROOT%\.env.example" (
    echo ✅ Backing up .env.example...
    copy "%PROJECT_ROOT%\.env.example" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No .env.example found
)

if exist "%PROJECT_ROOT%\shopify-env-example.txt" (
    echo ✅ Backing up shopify-env-example.txt...
    copy "%PROJECT_ROOT%\shopify-env-example.txt" "%BACKUP_PATH%\" >nul
) else (
    echo ⚠️  No shopify-env-example.txt found
)

REM Backup scripts
if exist "%PROJECT_ROOT%\scripts" (
    echo ✅ Backing up scripts directory...
    xcopy "%PROJECT_ROOT%\scripts" "%BACKUP_PATH%\scripts\" /E /I /Q
) else (
    echo ⚠️  No scripts directory found
)

REM Backup components
if exist "%PROJECT_ROOT%\components" (
    echo ✅ Backing up components directory...
    xcopy "%PROJECT_ROOT%\components" "%BACKUP_PATH%\components\" /E /I /Q
) else (
    echo ⚠️  No components directory found
)

REM Backup lib
if exist "%PROJECT_ROOT%\lib" (
    echo ✅ Backing up lib directory...
    xcopy "%PROJECT_ROOT%\lib" "%BACKUP_PATH%\lib\" /E /I /Q
) else (
    echo ⚠️  No lib directory found
)

REM Create backup manifest
echo DS_2 Chat Backup Manifest > "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo ======================== >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo Backup Date: %date% %time% >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo Backup Name: %BACKUP_NAME% >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo Project Root: %PROJECT_ROOT% >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo. >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo Files Backed Up: >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - .git/ (if exists) >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - package.json >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - next.config.js >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - tsconfig.json >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - tailwind.config.js >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - docs/ >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - README.md >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - CREDENTIAL_COLLECTION_LIST.md >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - .env.local (if exists) >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - .env.example (if exists) >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - shopify-env-example.txt >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - scripts/ >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - components/ >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo - lib/ >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo. >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo Backup Purpose: >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo This backup contains the essential project files and configuration >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo needed to restore the DS_2 project state and continue development. >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo. >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo To Restore: >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo 1. Copy files back to project directory >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo 2. Run npm install >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo 3. Restore .env.local with actual credentials >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"
echo 4. Run npm run dev >> "%BACKUP_PATH%\BACKUP_MANIFEST.txt"

echo ✅ Backup completed: %BACKUP_PATH%
echo 📄 Manifest created: %BACKUP_PATH%\BACKUP_MANIFEST.txt

REM Create latest symlink (Windows 10+)
if exist "%BACKUP_DIR%\latest" rmdir "%BACKUP_DIR%\latest" 2>nul
mklink /D "%BACKUP_DIR%\latest" "%BACKUP_NAME%" >nul 2>&1
if %errorlevel% equ 0 (
    echo 🔗 Latest backup symlink created: %BACKUP_DIR%\latest
) else (
    echo ⚠️  Could not create symlink (requires admin privileges)
)

echo 🎉 DS_2 Chat Backup System completed successfully!
echo 📊 Backup location: %BACKUP_PATH%
echo 🔗 Latest symlink: %BACKUP_DIR%\latest

pause
