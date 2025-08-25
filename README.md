# Project Myriad
## The Definitive Android Manga and Anime Platform

**Project Myriad** is a comprehensive Android application for manga and anime enthusiasts, built with modern Android technologies including Jetpack Compose, Kotlin, and MVVM Clean Architecture.

### 🚀 Features

#### 🏠 The Vault - Local Media Engine
- **Offline-first management** with smart caching
- Support for `.cbz`, `.cbr` manga formats
- Support for `.mp4`, `.mkv`, `.avi` anime formats
- Metadata scraping and organization
- Local library management with Room database

#### 🧠 AI Core - Intelligent Features
- **OCR Translation** for manga text using ML Kit
- **Art Style Matching** using computer vision
- **AI-powered Recommendations** based on user preferences
- **Natural Language Search** for intuitive content discovery
- **Metadata Extraction** from cover images

#### 🌐 The Browser - Online Discovery Engine
- Extensible source system for browsing online content
- Integration with popular manga and anime platforms
- Unified search across multiple sources
- Source management and configuration

### 📱 Platform Support
- **Android**: Primary target platform (API 21+)
- **Architecture**: Modern Android with Jetpack Compose
- **Performance**: Optimized for all Android devices

### 🛠️ Technology Stack
- **Kotlin** - Primary programming language
- **Jetpack Compose** - Modern UI toolkit with Material 3
- **MVVM Clean Architecture** - Proper separation of concerns
- **Hilt** - Dependency injection
- **Room** - Local database with Flow support
- **Retrofit** - Network operations
- **Coil** - Image loading
- **ML Kit** - OCR and text recognition
- **WorkManager** - Background processing

### 🏗️ Project Structure
```
app/src/main/kotlin/com/projectmyriad/
├── ui/                    # Presentation layer (Compose UI)
│   ├── screens/             # Screen composables
│   ├── navigation/          # Navigation setup
│   └── theme/              # Material 3 theming
├── domain/                # Domain layer (business logic)
│   ├── model/              # Domain models
│   ├── repository/         # Repository interfaces
│   └── usecase/           # Use cases
├── data/                  # Data layer
│   ├── database/           # Room database
│   ├── repository/         # Repository implementations
│   └── network/           # API services
├── di/                    # Dependency injection modules
└── service/              # Background services
```

### 🚀 Getting Started

#### Prerequisites
- Android Studio with Android SDK
- JDK 11 or higher
- Android device or emulator (API 21+)

#### Installation
```bash
# Clone the repository
git clone https://github.com/Heartless-Veteran/Project-Myriad.git
cd Project-Myriad

# Open in Android Studio or build from command line
cd android
./gradlew assembleDebug
```

#### Building for Release
```bash
# Build release APK
./gradlew assembleRelease

# The APK will be generated in:
# app/build/outputs/apk/release/app-release.apk
```

### 🧪 Testing
```bash
# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest
```

### 📦 Key Dependencies
- **Jetpack Compose** - Modern UI toolkit
- **Hilt** - Dependency injection
- **Room** - Local database
- **Retrofit** - Network client
- **Coil** - Image loading
- **ML Kit** - Text recognition
- **WorkManager** - Background tasks

### 🔧 Architecture
The app follows **MVVM Clean Architecture** principles:
- **UI Layer**: Jetpack Compose screens and ViewModels
- **Domain Layer**: Use cases, models, and repository interfaces
- **Data Layer**: Repository implementations, Room database, and network APIs

### 📋 Documentation
- [Development Guide](docs/DEVELOPMENT.md)
- [Requirements](docs/requirements.md)
- [Implementation Plan](docs/plan.md)
- [Task List](docs/tasks.md)

### 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📞 Support
For support and questions, please open an issue on GitHub.

---

**Project Myriad** - The definitive Android platform for manga and anime, built with modern Android technologies and AI-powered features.
