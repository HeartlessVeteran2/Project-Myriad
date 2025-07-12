#!/bin/bash

# Project Myriad - Unified App Launcher
# This script starts the unified React Native app that works on web, iOS, and Android

echo "🚀 Starting Project Myriad Unified App..."

# Navigate to the mobile directory (which now contains the unified app)
cd "$(dirname "$0")/mobile"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Start the app based on the argument provided
case "$1" in
    "web")
        echo "🌐 Starting web version..."
        npm run web
        ;;
    "android")
        echo "🤖 Starting Android version..."
        npm run android
        ;;
    "ios")
        echo "🍎 Starting iOS version..."
        npm run ios
        ;;
    "all")
        echo "🎯 Starting development server for all platforms..."
        npm start
        ;;
    *)
        echo "Usage: $0 {web|android|ios|all}"
        echo "  web     - Start web version"
        echo "  android - Start Android version"
        echo "  ios     - Start iOS version"  
        echo "  all     - Start development server for all platforms"
        exit 1
        ;;
esac
