#!/bin/bash

# Challenge Hub - Quick Deployment Script

echo "🚀 Challenge Hub Deployment Script"
echo "=================================="

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ No dist folder found. Running build..."
    npm run build
fi

echo ""
echo "📁 Build files ready in dist/ folder"
echo "📊 Total size: ~283 kB (Gzipped: ~77 kB)"
echo ""

echo "🌐 Choose your deployment platform:"
echo "1. Vercel (Recommended)"
echo "2. Surge.sh"
echo "3. Firebase Hosting"
echo "4. Manual Upload"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🔥 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        cd dist
        vercel --prod
        ;;
    2)
        echo "⚡ Deploying to Surge.sh..."
        if ! command -v surge &> /dev/null; then
            echo "Installing Surge CLI..."
            npm install -g surge
        fi
        cd dist
        surge
        ;;
    3)
        echo "🔥 Deploying to Firebase..."
        if ! command -v firebase &> /dev/null; then
            echo "Installing Firebase CLI..."
            npm install -g firebase-tools
        fi
        firebase deploy --only hosting
        ;;
    4)
        echo "📂 Manual Upload Instructions:"
        echo ""
        echo "1. Zip the contents of the 'dist/' folder"
        echo "2. Upload to your hosting provider:"
        echo "   - Hostinger: File Manager → public_html"
        echo "   - GoDaddy: File Manager → public_html"
        echo "   - cPanel: File Manager → public_html"
        echo "3. Extract the files in the root directory"
        echo "4. Your app will be live at your domain!"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo "🎉 Your Challenge Hub app is now live!"
