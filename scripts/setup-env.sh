#!/bin/bash
# DS_2 Environment Setup Script
# This script helps you create the .env.local file with proper credentials

echo "🔧 DS_2 Environment Setup"
echo "========================="
echo ""
echo "This script will help you create the .env.local file with your credentials."
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    echo "Do you want to backup the existing file and create a new one? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        echo "✅ Existing .env.local backed up"
    else
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

echo ""
echo "📋 Please provide your Shopify credentials:"
echo ""

# Get Shopify credentials
echo "🏪 Shopify Store Name (e.g., wenugu-5b):"
read -r SHOPIFY_STORE_NAME

echo "🔑 Shopify API Key:"
read -r SHOPIFY_API_KEY

echo "🔐 Shopify API Secret:"
read -r SHOPIFY_API_SECRET

echo "🎫 Shopify Access Token:"
read -r SHOPIFY_ACCESS_TOKEN

echo "🔔 Shopify Webhook Secret (optional):"
read -r SHOPIFY_WEBHOOK_SECRET

echo ""
echo "💳 Please provide your Stripe credentials:"
echo ""

echo "🔑 Stripe Secret Key (sk_test_...):"
read -r STRIPE_SECRET_KEY

echo "🔓 Stripe Publishable Key (pk_test_...):"
read -r STRIPE_PUBLISHABLE_KEY

echo "🔔 Stripe Webhook Secret (optional):"
read -r STRIPE_WEBHOOK_SECRET

echo "🏦 Stripe Account ID (optional):"
read -r STRIPE_ACCOUNT_ID

# Create .env.local file
cat > .env.local << EOF
# DS_2 Environment Variables
# Generated on $(date)

# Shopify API Credentials
SHOPIFY_API_KEY=${SHOPIFY_API_KEY}
SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}
SHOPIFY_SHOP_NAME=${SHOPIFY_STORE_NAME}.myshopify.com
SHOPIFY_ACCESS_TOKEN=${SHOPIFY_ACCESS_TOKEN}
SHOPIFY_WEBHOOK_SECRET=${SHOPIFY_WEBHOOK_SECRET}

# Alternative naming conventions (for compatibility)
SHOPIFY_STORE_NAME=${SHOPIFY_STORE_NAME}
SHOPIFY_ADMIN_API_ACCESS_TOKEN=${SHOPIFY_ACCESS_TOKEN}
SHOPIFY_API_VERSION=2024-04

# Stripe Configuration
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
STRIPE_ACCOUNT_ID=${STRIPE_ACCOUNT_ID}

# Next.js Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
NEXT_PUBLIC_STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

# Supabase Configuration (from your credentials)
SUPABASE_URL=https://tepxztroomkqqnsrjcoa.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcHh6dHJvb21rcXFuc3JqY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzk2MjAsImV4cCI6MjA3NDY1NTYyMH0.91Zd7BJylJ4jIaPECFy90oeT1tOf_sWCQPLXxcQA7pw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcHh6dHJvb21rcXFuc3JqY29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NTkwNzk2MjAsImV4cCI6MjA3NDY1NTYyMH0.ndru5WxpAclld3jE5PgYqyPFc0RAM4jlF08_8uUpqxc
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Test Shopify connection in Admin → Shopify"
echo "3. Add your credentials in Admin → Credentials"
echo ""
echo "⚠️  IMPORTANT: Never commit .env.local to Git!"
echo "   It contains sensitive credentials."
echo ""
echo "🎉 Setup complete!"
