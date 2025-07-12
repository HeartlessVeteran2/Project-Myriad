
# 🌟 Project Myriad

<div align="center">

![Project Myriad Logo](https://raw.githubusercontent.com/HeartlessVeteran2/Project-Myriad/main/docs/assets/logo.png)

**The definitive, open-source platform for manga and anime enthusiasts**

[![CI](https://github.com/HeartlessVeteran2/Project-Myriad/actions/workflows/ci.yml/badge.svg)](https://github.com/HeartlessVeteran2/Project-Myriad/actions/workflows/ci.yml)
[![Security](https://github.com/HeartlessVeteran2/Project-Myriad/actions/workflows/security.yml/badge.svg)](https://github.com/HeartlessVeteran2/Project-Myriad/actions/workflows/security.yml)
[![Performance](https://github.com/HeartlessVeteran2/Project-Myriad/actions/workflows/performance.yml/badge.svg)](https://github.com/HeartlessVeteran2/Project-Myriad/actions/workflows/performance.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/HeartlessVeteran2/Project-Myriad)](https://github.com/HeartlessVeteran2/Project-Myriad/releases)
[![Discord](https://img.shields.io/discord/1234567890?label=Discord&logo=discord)](https://discord.gg/project-myriad)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing) • [Community](#-community)

</div>

---

## 🎯 Overview

Project Myriad revolutionizes how you experience manga and anime by combining the best of **Komikku** and **Aniyomi** with modern web technologies, AI-powered features, and community-driven enhancements. Built with extensibility and performance at its core, Myriad provides a unified platform for all your otaku needs.

### ✨ What Makes Myriad Special

- 🎨 **Beautiful, Modern UI** - Clean, responsive design across all platforms
- 🔌 **Extensible Architecture** - Plugin system for unlimited source support
- 🤖 **AI-Powered Discovery** - Smart recommendations and content analysis
- 🌐 **Cross-Platform Sync** - Seamless experience across web, mobile, and desktop
- 🏠 **Self-Hosted** - Complete control over your data and privacy
- 🎭 **Community Features** - Share collections, reviews, and connect with fans

## 🚀 Features

### 📚 Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Unified Library** | ✅ | Manage local files and online sources in one place |
| **Extension System** | 🚧 | Add new manga/anime sources with ease |
| **Offline Reader** | 🚧 | Support for CBZ, CBR, PDF, and web formats |
| **Download Manager** | 🚧 | Queue and manage downloads for offline reading |
| **Progress Tracking** | 📋 | Sync reading progress across all devices |
| **Search & Discovery** | 📋 | Advanced search with filters and recommendations |

### 🎥 Media Support

| Type | Formats | Status |
|------|---------|--------|
| **Manga** | CBZ, CBR, PDF, ZIP, RAR | 🚧 |
| **Light Novels** | EPUB, TXT, PDF | 📋 |
| **Anime** | MP4, MKV, WebM | 📋 |
| **Web Content** | Online readers, streaming | 🚧 |

### 🔧 Advanced Features

- **🤖 AI Assistant** - Smart content recommendations and analysis
- **🌍 Multi-language Support** - Internationalization ready
- **🔒 Privacy First** - Self-hosted with optional cloud sync
- **📱 Progressive Web App** - Mobile app experience in the browser
- **🎨 Customizable Themes** - Dark, light, and custom themes
- **📊 Statistics & Analytics** - Reading habits and progress tracking
- **👥 Community Features** - Reviews, ratings, and social sharing
- **🔗 External Integrations** - MyAnimeList, AniList, Kitsu support

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 20+ with Express.js
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT with refresh tokens
- **File Storage**: Local filesystem with S3-compatible support
- **API**: RESTful with GraphQL subscription support

### Frontend
- **Framework**: React 18+ with Vite
- **State Management**: Zustand with persistence
- **UI Library**: Tailwind CSS with Headless UI
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation

### Mobile
- **Framework**: React Native with Expo SDK 50+
- **Navigation**: Expo Router (file-based)
- **State**: Shared store with web frontend
- **Platforms**: iOS, Android, and Web

### DevOps & Infrastructure
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: Built-in health checks and performance monitoring
- **Security**: CodeQL, dependency scanning, and vulnerability management

## ⚡ Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Start the full stack
docker-compose up -d

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
# Mobile: http://localhost:3002
```

### Option 2: Manual Setup

```bash
# Clone and setup
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev

# Mobile setup (new terminal)
cd ../mobile
npm install
npm start
```

### Option 3: One-Click Deploy

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/HeartlessVeteran2/Project-Myriad)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HeartlessVeteran2/Project-Myriad)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template/project-myriad)

## 📖 Documentation

| Documentation | Description |
|---------------|-------------|
| [📋 API Reference](docs/API.md) | Complete API documentation |
| [🏗 Architecture Guide](docs/ARCHITECTURE.md) | System design and architecture |
| [🔌 Extension Development](docs/EXTENSIONS.md) | Creating custom extensions |
| [🚀 Deployment Guide](docs/DEPLOYMENT.md) | Production deployment instructions |
| [🔧 Configuration](docs/CONFIGURATION.md) | Environment and feature configuration |
| [🛠 Development Setup](docs/DEVELOPMENT.md) | Development environment setup |
| [🎨 UI Components](docs/COMPONENTS.md) | Frontend component library |
| [📱 Mobile Development](docs/MOBILE.md) | Mobile app development guide |
| [🔐 Security Guide](docs/SECURITY.md) | Security best practices |
| [📊 Performance](docs/PERFORMANCE.md) | Performance optimization guide |
| [📦 Dependency Management](docs/DEPENDENCY_MANAGEMENT.md) | Dependency management and dashboard guide |

## 🗺 Roadmap

### Phase 1: Foundation (Q3 2025) ✅
- [x] Project setup and core architecture
- [x] Backend API with basic endpoints
- [x] Frontend web application
- [x] Mobile app foundation
- [x] Docker containerization
- [x] CI/CD pipeline

### Phase 2: Core Features (Q4 2025) 🚧
- [ ] Extension system implementation
- [ ] Manga reader with offline support
- [ ] Download manager
- [ ] User authentication and profiles
- [ ] Basic library management
- [ ] Search and filtering

### Phase 3: Advanced Features (Q1 2026) 📋
- [ ] AI-powered recommendations
- [ ] Community features and social sharing
- [ ] Advanced reading statistics
- [ ] Multi-language support
- [ ] Plugin marketplace
- [ ] Performance optimizations

### Phase 4: Ecosystem (Q2 2026) 🔮
- [ ] Anime streaming integration
- [ ] Desktop application (Electron)
- [ ] Web3 features (optional)
- [ ] Enterprise features
- [ ] Advanced analytics
- [ ] Third-party integrations

## 📦 Dependency Management

Project Myriad uses automated dependency management with Renovate to keep dependencies up-to-date and secure.

### Dependency Dashboard

The [Dependency Dashboard](../../issues/5) provides a centralized view of all dependency updates:
- **Security Updates**: Critical security patches are prioritized
- **Grouped Updates**: Related packages are updated together
- **Automated Testing**: All updates are tested before merging

### Managing Dependencies

```bash
# Check dependency status
npm run deps:check

# Update patch versions
npm run deps:update:patch

# Generate dependency report
npm run deps:report
```

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### 🎯 Ways to Contribute

- **🐛 Bug Reports**: Found an issue? [Open a bug report](https://github.com/HeartlessVeteran2/Project-Myriad/issues/new?template=bug_report.md)
- **💡 Feature Requests**: Have an idea? [Suggest a feature](https://github.com/HeartlessVeteran2/Project-Myriad/issues/new?template=feature_request.md)
- **📝 Documentation**: Help improve our docs
- **💻 Code**: Submit pull requests for bug fixes or new features
- **🎨 Design**: Contribute to UI/UX improvements
- **🌍 Translation**: Help translate the app to your language

### 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/Project-Myriad.git`
3. **Create** a branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** your changes: `npm test`
6. **Commit** your changes: `git commit -m 'Add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`
8. **Submit** a pull request

### 📋 Development Guidelines

- Follow our [Code Style Guide](docs/DEVELOPMENT.md#code-style)
- Write tests for new features
- Update documentation as needed
- Follow semantic commit conventions
- Ensure all CI checks pass

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🏆 Community

Join our growing community of manga and anime enthusiasts!

### 💬 Communication Channels

- **Discord**: [Join our server](https://discord.gg/project-myriad) for real-time chat
- **GitHub Discussions**: [Community discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- **Reddit**: [r/ProjectMyriad](https://reddit.com/r/ProjectMyriad) for community content
- **Twitter**: [@ProjectMyriad](https://twitter.com/ProjectMyriad) for updates

### 🎖 Recognition

- **Contributors**: Listed in [CONTRIBUTORS.md](docs/CONTRIBUTORS.md)
- **Sponsors**: Special thanks to our [sponsors](docs/SPONSORS.md)
- **Hall of Fame**: Top contributors featured on our website

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

### 🤔 Why GPL v3?

We chose GPL v3 to ensure that Project Myriad remains free and open source forever. Any modifications or distributions must also be open source, protecting the community's interests.

## 🙏 Acknowledgments

- **Komikku** - Inspiration for manga management features
- **Aniyomi** - Mobile app design inspiration
- **Tachiyomi** - Extension system architecture reference
- **Open Source Community** - For the amazing tools and libraries

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/HeartlessVeteran2/Project-Myriad?style=social)
![GitHub forks](https://img.shields.io/github/forks/HeartlessVeteran2/Project-Myriad?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/HeartlessVeteran2/Project-Myriad?style=social)
![GitHub contributors](https://img.shields.io/github/contributors/HeartlessVeteran2/Project-Myriad)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/HeartlessVeteran2/Project-Myriad)
![Lines of code](https://img.shields.io/tokei/lines/github/HeartlessVeteran2/Project-Myriad)

---

<div align="center">

**Made with ❤️ by the Project Myriad community**

[⬆ Back to top](#-project-myriad)

</div>
