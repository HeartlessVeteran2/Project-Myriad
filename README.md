# Project Myriad

🎉 **A unified manga, anime, and light novel management platform with cross-platform React Native app!**

## 🚀 Quick Start

### Start the Unified App (Web + Mobile)

```bash
# Start all platforms
./scripts/start-unified-app.sh all

# Or start specific platform
./scripts/start-unified-app.sh web     # Web browser
./scripts/start-unified-app.sh android # Android device/emulator
./scripts/start-unified-app.sh ios     # iOS device/simulator
```

### Alternative: Use npm scripts

```bash
# Install dependencies
npm run install:all

# Start backend + mobile app
npm run dev

# Start unified app for all platforms
npm run start:unified
```

## 📁 Project Structure

```
backend/          # Node.js/Express API server
mobile/           # Unified React Native app (web + mobile)
├── src/
│   ├── components/   # Cross-platform components
│   ├── screens/     # App screens
│   └── shared/      # Re-exports from ../shared/
shared/           # Common utilities and API logic
scripts/          # Build and deployment scripts
docs/            # Documentation
```

## Features

✅ **Unified Components**: Header, SearchBar, LoadingSpinner, ErrorBoundary, Sidebar
✅ **Cross-Platform Storage**: AsyncStorage for mobile, localStorage for web  
✅ **Theme Support**: Dark/light mode across all platforms
✅ **Navigation**: React Navigation for all platforms
✅ **Error Handling**: ErrorBoundary catches crashes gracefully
✅ **Responsive Design**: Works on mobile and desktop web

## Development

The app uses:
- **React Native** for mobile platforms
- **React Native Web** for web platform compatibility
- **Expo** for easy development and building
- **AsyncStorage** for cross-platform storage

## Next Steps

1. **Add More Screens**: Create library, settings, and profile screens
2. **Implement API Integration**: Connect to your backend services
3. **Add Platform-Specific Features**: Use platform detection for mobile-only features
4. **Testing**: Run tests across all platforms
5. **Build & Deploy**: Create production builds for web, iOS, and Android

The migration is complete! You now have a single codebase that provides a seamless experience across web and mobile platforms.
