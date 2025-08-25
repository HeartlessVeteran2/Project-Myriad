# Development Guide - Project Myriad

## Overview
Project Myriad is a modern Android application built with **Kotlin**, **Jetpack Compose**, and **MVVM Clean Architecture**. This guide covers the development setup, architecture, and contribution guidelines.

## Prerequisites
- **Android Studio** Electric Eel (2022.1.1) or later
- **JDK 11** or higher
- **Android SDK** with API level 21-34
- **Git** for version control

## Project Setup

### 1. Clone and Open
```bash
git clone https://github.com/Heartless-Veteran/Project-Myriad.git
cd Project-Myriad
```
Open the `android` folder in Android Studio.

### 2. Gradle Sync
Android Studio will automatically sync Gradle. If issues occur:
```bash
cd android
./gradlew clean
./gradlew build
```

### 3. Run the App
- Select an Android device or emulator (API 21+)
- Click "Run" in Android Studio or use:
```bash
./gradlew assembleDebug
./gradlew installDebug
```

## Architecture

### MVVM Clean Architecture
The project follows a three-layer architecture:

#### **UI Layer** (`ui/`)
- **Composables**: Jetpack Compose UI components
- **ViewModels**: UI state and business logic coordination
- **Navigation**: Navigation component setup
- **Themes**: Material 3 theming

#### **Domain Layer** (`domain/`)
- **Models**: Core business objects
- **Use Cases**: Business logic operations
- **Repository Interfaces**: Contracts for data access

#### **Data Layer** (`data/`)
- **Repositories**: Data source coordination
- **Database**: Room database with DAOs and entities
- **Network**: Retrofit API services
- **Models**: Data transfer objects

### Dependency Injection
**Hilt** is used for dependency injection:
- `@HiltAndroidApp` on Application class
- `@AndroidEntryPoint` on Activities/Fragments/ViewModels
- `@Module` and `@InstallIn` for providing dependencies

### Database
**Room** database with:
- **Entities**: Database table definitions
- **DAOs**: Data access interfaces with Flow support
- **Converters**: Type conversion for complex objects

## Key Technologies

### UI Development
- **Jetpack Compose**: Declarative UI toolkit
- **Material 3**: Latest Material Design components
- **Navigation Compose**: Type-safe navigation
- **Accompanist**: Additional Compose utilities

### Data & Networking
- **Room**: Local SQLite database
- **Retrofit**: HTTP client for APIs
- **Gson**: JSON serialization
- **DataStore**: Preferences storage

### Background Processing
- **WorkManager**: Deferrable background tasks
- **Foreground Services**: Long-running operations (downloads)

### AI Features
- **ML Kit**: Text recognition (OCR)
- **TensorFlow Lite**: On-device AI models
- **CameraX**: Camera functionality

## Development Workflow

### 1. Feature Development
1. Create feature branch: `git checkout -b feature/feature-name`
2. Follow the architecture patterns
3. Write unit tests for business logic
4. Write UI tests for screens
5. Update documentation if needed

### 2. Code Style
- Follow [Kotlin coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- Use ktlint for code formatting
- Follow Compose best practices

### 3. Testing
```bash
# Unit tests
./gradlew test

# Instrumented tests
./gradlew connectedAndroidTest

# UI tests
./gradlew connectedDebugAndroidTest
```

### 4. Building
```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease
```

## Core Features Implementation

### 1. The Vault (Local Media Engine)
- **File Management**: Comics (.cbz, .cbr) and video files
- **Metadata Extraction**: Using ExifInterface and MediaMetadataRetriever
- **Library Organization**: Room database with categories and tags
- **Import System**: File picker integration

### 2. AI Core (Intelligent Features)
- **OCR Translation**: ML Kit text recognition
- **Recommendations**: TensorFlow Lite models
- **Natural Language Search**: Text processing and indexing
- **Art Style Analysis**: Computer vision models

### 3. The Browser (Online Discovery)
- **Source System**: Extensible plugin architecture
- **Content Scraping**: Retrofit with custom parsing
- **Unified Search**: Multi-source aggregation
- **Download Queue**: WorkManager integration

## Contribution Guidelines

### 1. Before Contributing
- Check existing issues and PRs
- Discuss major changes in issues first
- Follow the existing architecture patterns

### 2. Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Update documentation
6. Submit pull request

### 3. Code Review
- All PRs require review
- Address feedback promptly
- Ensure CI checks pass
- Keep PRs focused and reasonably sized

## Common Development Tasks

### Adding a New Screen
1. Create screen composable in `ui/screens/`
2. Add ViewModel with Hilt injection
3. Define navigation route
4. Add to navigation graph
5. Write tests

### Adding Database Entity
1. Create entity in `data/database/entity/`
2. Add DAO in `data/database/dao/`
3. Update database class
4. Create repository implementation
5. Add migration if needed

### Adding Network Service
1. Define API interface in `data/network/`
2. Create data models
3. Add to Retrofit module
4. Implement repository
5. Add error handling

## Debugging

### Logging
Use structured logging with tags:
```kotlin
Log.d("MyriadApp", "Feature action completed")
```

### Database Inspection
Use Android Studio's Database Inspector to view Room database contents.

### Network Debugging
Enable HTTP logging interceptor in debug builds for API debugging.

## Performance Optimization

### Compose Best Practices
- Use `remember` for expensive calculations
- Implement `LazyColumn`/`LazyRow` for large lists
- Avoid unnecessary recomposition
- Use `derivedStateOf` for computed state

### Memory Management
- Use appropriate image loading with Coil
- Implement proper lifecycle management
- Clean up resources in ViewModels

### Battery Optimization
- Use WorkManager for background tasks
- Implement proper caching strategies
- Minimize wake locks and network calls

## Release Process

### 1. Version Management
Update version in `app/build.gradle`:
```gradle
versionCode 1
versionName "1.0.0"
```

### 2. Build Variants
- **Debug**: Development builds with logging
- **Release**: Optimized builds for distribution

### 3. Signing
Configure signing keys for release builds in `keystore.properties`.

## Troubleshooting

### Common Issues
1. **Gradle sync failures**: Check SDK versions and dependencies
2. **Compose compilation errors**: Verify Compose compiler version
3. **Hilt errors**: Ensure proper annotation usage
4. **Room migration issues**: Check database schema changes

### Getting Help
- Check existing GitHub issues
- Review Android documentation
- Join the project Discord/Slack (if available)

---

This development guide is actively maintained. Please suggest improvements through issues or PRs.