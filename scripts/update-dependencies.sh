#!/bin/bash

# Project Myriad - Dependency Update Script
# This script helps maintain and update project dependencies

set -e

echo "🔄 Project Myriad - Dependency Update Script"
echo "============================================="

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check for deprecated babel preset and warn user
if grep -q "metro-react-native-babel-preset" package.json; then
    echo "⚠️  Warning: Found deprecated metro-react-native-babel-preset"
    echo "   Consider updating to @react-native/babel-preset for React Native 0.80+"
    echo ""
fi

# Check for outdated packages
echo "📊 Checking for outdated packages..."
npm outdated || true

# Update dependencies
echo ""
echo "🔄 Updating dependencies..."
npm update --legacy-peer-deps

# Check for security vulnerabilities
echo ""
echo "🔒 Checking for security vulnerabilities..."
npm audit

# Fix security vulnerabilities if any
echo ""
echo "🔧 Attempting to fix security vulnerabilities..."
npm audit fix --legacy-peer-deps || true

# Clean install to ensure consistency
echo ""
echo "🧹 Performing clean install..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Run tests to ensure everything still works
echo ""
echo "🧪 Running tests to verify updates..."
npm test

echo ""
echo "✅ Dependency update completed successfully!"
echo "📋 Please review the changes and test the application thoroughly."
