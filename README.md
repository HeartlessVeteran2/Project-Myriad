# 📚 Project Myriad

<div align="center">

[![Node.js CI](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/nodejs.yml?branch=main&label=tests&style=flat-square)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![Security Audit](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/security.yml?branch=main&label=security&style=flat-square)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![Docker Build](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/docker.yml?branch=main&label=docker&style=flat-square)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/HeartlessVeteran2/Project-Myriad?style=flat-square)](package.json)
[![Stars](https://img.shields.io/github/stars/HeartlessVeteran2/Project-Myriad?style=flat-square)](https://github.com/HeartlessVeteran2/Project-Myriad/stargazers)

**The definitive platform for manga and anime enthusiasts**

*Unified library management • Offline-first vault • AI-powered discovery • Community-focused*

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is Project Myriad?

Project Myriad is a modern, **open-source web application** that revolutionizes how you manage and enjoy your manga and anime collections. Built with **Next.js 15** and **Fastify**, it combines powerful local media management with extensible online source integration.

### 🎨 **The Vision**
- **Phase 1: The Vault** - Perfect local collection management ✅ *Currently in Development*
- **Phase 2: The Browser** - Extensible online source integration 🔄 *Coming Soon*
- **Phase 3: The Curator** - AI-powered discovery and recommendations 📋 *Planned*
- **Phase 4: The Community** - Social features and collaborative collections 💭 *Future*

---

## ✨ Features

### 🗂️ **The Vault - Local Collection Management**
- **📁 Drag & Drop Upload** - Simply drop `.cbz` or `.zip` files to add manga
- **📖 Built-in Reader** - Read with keyboard navigation, thumbnails, and progress tracking
- **📊 Progress Tracking** - Automatic bookmark saving and "Continue Reading" functionality
- **🔍 Smart Search & Filtering** - Find content instantly with advanced search
- **📱 Mobile-First Design** - Fully responsive interface that works on all devices
- **⚡ Performance Optimized** - Fast loading with image optimization and lazy loading
- **🎨 Modern UI** - Clean, intuitive interface with dark/light theme support

### 🛡️ **Production-Ready Features**
- **🔐 Robust Security** - JWT authentication, input validation, and secure file handling
- **📝 Comprehensive Logging** - Advanced logging with file rotation and performance monitoring
- **⚠️ Error Handling** - User-friendly error messages and graceful failure recovery
- **✅ Full Test Coverage** - Comprehensive test suite with CI/CD integration
- **🐳 Docker Support** - Easy deployment with Docker and Docker Compose
- **📊 Health Monitoring** - Built-in health checks and metrics endpoints

### 🔧 **Developer Experience**
- **🚀 Modern Stack** - Next.js 15, Fastify, PostgreSQL, and Docker
- **📚 Documentation** - Comprehensive API docs and deployment guides
- **🔄 CI/CD Pipeline** - Automated testing, security auditing, and deployment
- **🎯 ESLint & Prettier** - Code quality and formatting enforcement
- **🧪 Jest Testing** - Unit, integration, and end-to-end testing

---

## 🖼️ Screenshots

<details>
<summary>📱 Mobile Dashboard</summary>

*Coming Soon - Screenshots of the responsive mobile interface*

</details>

<details>
<summary>💻 Desktop Library View</summary>

*Coming Soon - Screenshots of the desktop library interface*

</details>

<details>
<summary>📖 Manga Reader</summary>

*Coming Soon - Screenshots of the built-in manga reader*

</details>

---

## 🚀 Quick Start

### 🐳 **Option 1: Docker (Recommended)**

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Start with Docker Compose
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### 💻 **Option 2: Manual Installation**

#### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v12+ ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))

#### Installation Steps

```bash
# 1. Clone and setup
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# 4. Setup database
createdb project_myriad
npm run migrate

# 5. Start development servers
npm run dev          # Frontend (Next.js) on :3000
npm run dev:backend  # Backend (Fastify) on :3001
```

### 🚀 **First Steps**

1. **Create Account** - Register at `http://localhost:3000/register`
2. **Upload Manga** - Drag `.cbz` or `.zip` files to the dashboard
3. **Start Reading** - Click any series to open the built-in reader
4. **Enjoy!** - Your progress is automatically saved

---

## 📖 Documentation

### 📚 **User Guides**
- [Getting Started Guide](docs/GETTING_STARTED.md)
- [User Manual](docs/USER_MANUAL.md)
- [FAQ & Troubleshooting](docs/FAQ.md)

### 👨‍💻 **Developer Docs**
- [API Documentation](docs/API.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

### 🔧 **Technical Details**
- [Environment Configuration](docs/ENVIRONMENT.md)
- [Database Schema](src/server/schema.sql)
- [Testing Guide](docs/TESTING.md)

---

## 🏗️ Architecture

### **Tech Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15 + React 19 | Modern SSR web application |
| **Backend** | Fastify + Node.js | High-performance API server |
| **Database** | PostgreSQL | Reliable data persistence |
| **Authentication** | JWT + bcrypt | Secure user authentication |
| **File Processing** | unzipper + Node.js streams | Archive extraction and processing |
| **Testing** | Jest + Testing Library | Comprehensive test coverage |
| **DevOps** | Docker + GitHub Actions | Containerization and CI/CD |

### **Project Structure**

```
Project-Myriad/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── components/         # React components
│   │   ├── dashboard/          # Dashboard page
│   │   └── reader/             # Manga reader
│   ├── components/             # Shared React components
│   ├── lib/                    # Utility libraries
│   │   ├── errors.js           # Error handling system
│   │   ├── logger.js           # Logging system
│   │   └── validation-schemas.js # Input validation
│   ├── server/                 # Backend application
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic
│   │   └── db/                 # Database utilities
│   └── styles/                 # CSS and styling
├── tests/                      # Test suites
├── docs/                       # Documentation
└── docker/                     # Docker configuration
```

---

## 🚦 Current Status

### ✅ **Completed (Phase 1: The Vault)**
- ✅ Local manga collection management (.cbz/.zip support)
- ✅ Built-in manga reader with navigation and progress tracking
- ✅ Responsive web interface (mobile-first design)
- ✅ User authentication and secure file handling
- ✅ Comprehensive error handling and validation
- ✅ Production-ready logging and monitoring
- ✅ Full test coverage with CI/CD pipeline
- ✅ Docker deployment support

### 🔄 **In Progress**
- 🔄 Enhanced UI/UX improvements
- 🔄 Performance optimizations
- 🔄 Additional file format support (.cbr)
- 🔄 Advanced search and filtering

### 📋 **Planned (Phase 2: The Browser)**
- 📋 Plugin system for online manga sources
- 📋 Metadata aggregation and matching
- 📋 Offline synchronization
- 📋 Advanced library management features

### 💭 **Future (Phase 3 & 4)**
- 💭 AI-powered content discovery and recommendations
- 💭 Community features and collaborative collections
- 💭 Advanced analytics and reading insights
- 💭 Mobile applications (React Native)

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Project Myriad is built by the community, for the community.

### 🌟 **Ways to Contribute**

- **🐛 Bug Reports** - Found a bug? [Open an issue](https://github.com/HeartlessVeteran2/Project-Myriad/issues/new)
- **💡 Feature Requests** - Have an idea? [Start a discussion](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- **📝 Documentation** - Help improve our docs and guides
- **🛠️ Code** - Submit pull requests for bug fixes and new features
- **🎨 Design** - Contribute UI/UX improvements and design assets
- **🧪 Testing** - Help expand our test coverage

### 📋 **Good First Issues**

Perfect for newcomers to the project:

- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts for reader
- [ ] Implement series sorting options
- [ ] Create user onboarding flow
- [ ] Add more comprehensive error messages

### 🚀 **Advanced Contributions**

For experienced developers:

- [ ] Implement .cbr file parsing
- [ ] Add image optimization pipeline
- [ ] Create automated testing for file uploads
- [ ] Implement database migration system
- [ ] Add internationalization support

### 📖 **Development Setup**

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/Project-Myriad.git
cd Project-Myriad

# 3. Install dependencies
npm install

# 4. Create a feature branch
git checkout -b feature/your-feature-name

# 5. Make your changes and test them
npm test
npm run lint

# 6. Commit and push
git commit -m "Add your feature description"
git push origin feature/your-feature-name

# 7. Open a Pull Request on GitHub
```

For detailed contributing guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📊 **Project Stats**

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/HeartlessVeteran2/Project-Myriad?style=flat-square)
![GitHub code size](https://img.shields.io/github/languages/code-size/HeartlessVeteran2/Project-Myriad?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/HeartlessVeteran2/Project-Myriad?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/HeartlessVeteran2/Project-Myriad?style=flat-square)

</div>

---

## � License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Free to use** - Use for personal and commercial purposes
- ✅ **Free to modify** - Adapt the code to your needs
- ✅ **Free to distribute** - Share with others
- ⚠️ **Share changes** - Modifications must be shared under the same license
- ⚠️ **Include license** - Original license and copyright must be included

---

## 🙏 Acknowledgments

### **Built With Love Using**
- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Database
- [Docker](https://www.docker.com/) - Containerization Platform

### **Special Thanks**
- The open-source community for inspiration and tools
- All contributors who help make this project better
- Beta testers and early adopters providing valuable feedback

---

## 📞 Support & Community

### **Get Help**
- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/HeartlessVeteran2/Project-Myriad/issues)
- 💬 [GitHub Discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- 📧 [Email Support](mailto:support@projectmyriad.example.com)

### **Stay Updated**
- ⭐ [Star this repository](https://github.com/HeartlessVeteran2/Project-Myriad/stargazers) to show support
- 👀 [Watch releases](https://github.com/HeartlessVeteran2/Project-Myriad/releases) for updates
- 🐦 Follow us on [Twitter @ProjectMyriad](https://twitter.com/ProjectMyriad) *(Coming Soon)*

---

<div align="center">

**Made with ❤️ by the Project Myriad team and contributors**

*Empowering manga and anime enthusiasts worldwide*

</div>

## 🛠️ API Endpoints (Local Dev)

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in and receive a JWT
- `GET /api/series` — List your series
- `POST /api/series/upload` — Upload a new series (`.cbz`/`.zip`)
- `PATCH /api/series/:id` — Edit a series title
- `DELETE /api/series/:id` — Delete a series
- `GET /api/series/:id/images` — Get image URLs for a series

---

## 🗺️ Project Roadmap

We are building Myriad in phases. You can follow our progress on our [GitHub Project Board](https://github.com/HeartlessVeteran2/Project-Myriad/projects).

### Phase 1: The Core Vault (Local Media MVP) 🟡 *In Progress*
- [x] Basic Next.js + Fastify setup
- [x] User authentication (JWT)
- [x] File upload system (.cbz/.zip)
- [x] Basic manga reader with navigation
- [x] Progress tracking
- [x] Series management (edit/delete)
- [x] Docker containerization
- [x] CI/CD pipeline setup
- [ ] Enhanced file format support (.cbr)
- [ ] Improved UI/UX design
- [ ] Mobile responsiveness
- [ ] Search and filtering improvements
- [ ] Bulk operations

### Phase 2: The Browser (Online Source Integration) 🔵 *Planned*
- [ ] Plugin system architecture
- [ ] Online source integrations
- [ ] Metadata fetching and matching
- [ ] Synchronized reading progress
- [ ] Offline caching

### Phase 3: AI & Community Enhancements 🟣 *Future*
- [ ] AI-powered recommendations
- [ ] Art style analysis
- [ ] Community features
- [ ] Social reading lists
- [ ] Review and rating system

### Phase 4: Full Anime & Video Integration 🟠 *Future*
- [ ] Video player integration
- [ ] Anime episode tracking
- [ ] Multi-format support
- [ ] Streaming integration  

---

## 🛠️ Development

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking (when TypeScript is added)
npm run type-check
```

### CI/CD

This project includes comprehensive GitHub Actions workflows:

- **CI Pipeline** - Automated testing, linting, and building
- **Security Audits** - Vulnerability scanning and dependency reviews  
- **Docker Builds** - Container image building and caching
- **Database Testing** - Schema validation and migration testing
- **Performance Testing** - Lighthouse and load testing
- **Automated Deployments** - Staging and production deployments

---

## 🛠️ Tech Stack

- **Frontend:** React (with Next.js 15)
- **Backend:** Node.js (with Fastify)
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File Processing:** Unzipper for .cbz files
- **Testing:** Jest with Testing Library
- **CI/CD:** GitHub Actions
- **Containerization:** Docker & Docker Compose

---

## 🤝 How to Contribute

We welcome all contributors!  
Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

- Check out issues marked with the [good first issue](https://github.com/HeartlessVeteran2/Project-Myriad/issues?q=is%3Aissue+is%3Aopen+label%3A"good+first+issue") label for beginner-friendly tasks.
- Join discussions, open issues, or suggest features.

### Community & Support

- [GitHub Discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- Raise issues or feature requests [here](https://github.com/HeartlessVeteran2/Project-Myriad/issues).

---

## ⚖️ License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Inspired by the best in open-source manga/anime management.
- Thanks to all contributors and the community!
