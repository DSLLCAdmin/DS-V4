@echo off
REM DS_2 Environment Setup Script for Windows
REM This script helps you create the .env.local file with proper credentials

echo 🔧 DS_2 Environment Setup
echo =========================
echo.
echo This script will help you create the .env.local file with your credentials.
echo.

REM Check if .env.local already exists
if exist ".env.local" (
    echo ⚠️  .env.local already exists!
    echo Do you want to backup the existing file and create a new one? (y/n)
    set /p response=
    if /i "%response%"=="y" (
        for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
        set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
        set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
        set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"
        copy .env.local .env.local.backup.%timestamp%
        echo ✅ Existing .env.local backed up
    ) else (
        echo ❌ Setup cancelled
        exit /b 1
    )
)

echo.
echo 📋 Please provide your Shopify credentials:
echo.

REM Get Shopify credentials
echo 🏪 Shopify Store Name (e.g., wenugu-5b):
set /p SHOPIFY_STORE_NAME=

echo 🔑 Shopify API Key:
set /p SHOPIFY_API_KEY=

echo 🔐 Shopify API Secret:
set /p SHOPIFY_API_SECRET=

echo 🎫 Shopify Access Token:
set /p SHOPIFY_ACCESS_TOKEN=

echo 🔔 Shopify Webhook Secret (optional):
set /p SHOPIFY_WEBHOOK_SECRET=

echo.
echo 💳 Please provide your Stripe credentials:
echo.

echo 🔑 Stripe Secret Key (sk_test_...):
set /p STRIPE_SECRET_KEY=

echo 🔓 Stripe Publishable Key (pk_test_...):
set /p STRIPE_PUBLISHABLE_KEY=

echo 🔔 Stripe Webhook Secret (optional):
set /p STRIPE_WEBHOOK_SECRET=

echo 🏦 Stripe Account ID (optional):
set /p STRIPE_ACCOUNT_ID=

REM Create .env.local file
(
echo # DS_2 Environment Variables
echo # Generated on %date% %time%
echo.
echo # Shopify API Credentials
echo SHOPIFY_API_KEY=%SHOPIFY_API_KEY%
echo SHOPIFY_API_SECRET=%SHOPIFY_API_SECRET%
echo SHOPIFY_SHOP_NAME=%SHOPIFY_STORE_NAME%.myshopify.com
echo SHOPIFY_ACCESS_TOKEN=%SHOPIFY_ACCESS_TOKEN%
echo SHOPIFY_WEBHOOK_SECRET=%SHOPIFY_WEBHOOK_SECRET%
echo.
echo # Alternative naming conventions (for compatibility)
echo SHOPIFY_STORE_NAME=%SHOPIFY_STORE_NAME%
echo SHOPIFY_ADMIN_API_ACCESS_TOKEN=%SHOPIFY_ACCESS_TOKEN%
echo SHOPIFY_API_VERSION=2024-04
echo.
echo # Stripe Configuration
echo STRIPE_SECRET_KEY=%STRIPE_SECRET_KEY%
echo STRIPE_PUBLISHABLE_KEY=%STRIPE_PUBLISHABLE_KEY%
echo STRIPE_WEBHOOK_SECRET=%STRIPE_WEBHOOK_SECRET%
echo STRIPE_ACCOUNT_ID=%STRIPE_ACCOUNT_ID%
echo.
echo # Next.js Configuration
echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=%STRIPE_PUBLISHABLE_KEY%
echo NEXT_PUBLIC_STRIPE_SECRET_KEY=%STRIPE_SECRET_KEY%
echo.
echo # Supabase Configuration (from your credentials)
echo SUPABASE_URL=https://tepxztroomkqqnsrjcoa.supabase.co
echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcHh6dHJvb21rcXFuc3JqY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzk2MjAsImV4cCI6MjA3NDY1NTYyMH0.91Zd7BJylJ4jIaPECFy90oeT1tOf_sWCQPLXxcQA7pw
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcHh6dHJvb21rcXFuc3JqY29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NTkwNzk2MjAsImV4cCI6MjA3NDY1NTYyMH0.ndru5WxpAclld3jE5PgYqyPFc0RAM4jlF08_8uUpqxc
) > .env.local

echo.
echo ✅ .env.local file created successfully!
echo.
echo 🔧 Next steps:
echo 1. Restart your development server: npm run dev
echo 2. Test Shopify connection in Admin → Shopify
echo 3. Add your credentials in Admin → Credentials
echo.
echo ⚠️  IMPORTANT: Never commit .env.local to Git!
echo    It contains sensitive credentials.
echo.
echo 🎉 Setup complete!
pause
