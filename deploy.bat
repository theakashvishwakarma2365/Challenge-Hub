@echo off
echo 🚀 Challenge Hub Deployment Script
echo ==================================

REM Check if dist folder exists
if not exist "dist" (
    echo ❌ No dist folder found. Running build...
    call npm run build
)

echo.
echo 📁 Build files ready in dist/ folder
echo 📊 Total size: ~283 kB (Gzipped: ~77 kB)
echo.

echo 🌐 Choose your deployment platform:
echo 1. Vercel (Recommended)
echo 2. Surge.sh  
echo 3. Firebase Hosting
echo 4. Manual Upload
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo 🔥 Deploying to Vercel...
    where vercel >nul 2>nul
    if errorlevel 1 (
        echo Installing Vercel CLI...
        call npm install -g vercel
    )
    cd dist
    call vercel --prod
) else if "%choice%"=="2" (
    echo ⚡ Deploying to Surge.sh...
    where surge >nul 2>nul
    if errorlevel 1 (
        echo Installing Surge CLI...
        call npm install -g surge
    )
    cd dist
    call surge
) else if "%choice%"=="3" (
    echo 🔥 Deploying to Firebase...
    where firebase >nul 2>nul
    if errorlevel 1 (
        echo Installing Firebase CLI...
        call npm install -g firebase-tools
    )
    call firebase deploy --only hosting
) else if "%choice%"=="4" (
    echo 📂 Manual Upload Instructions:
    echo.
    echo 1. Zip the contents of the 'dist/' folder
    echo 2. Upload to your hosting provider:
    echo    - Hostinger: File Manager → public_html
    echo    - GoDaddy: File Manager → public_html  
    echo    - cPanel: File Manager → public_html
    echo 3. Extract the files in the root directory
    echo 4. Your app will be live at your domain!
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed!
echo 🎉 Your Challenge Hub app is now live!
pause
