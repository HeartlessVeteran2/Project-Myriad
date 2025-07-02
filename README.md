# Project Myriad 📖

[![Node.js CI](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/nodejs.yml?branch=main&label=tests)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![Security Audit](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/security.yml?branch=main&label=security)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![Docker Build](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/docker.yml?branch=main&label=docker)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

The definitive platform for manga and anime enthusiasts.

**Project Myriad** is an open-source web application designed to be the ultimate home for your manga and anime collections. It seamlessly merges local media management with powerful online discovery and community features.

---

## ✨ Features

- **Unified Library:** Manage your local files and online sources all in one place.
- **The Vault:** A powerful, offline-first manager for your local manga (`.cbz`, `.cbr`) and anime files.
- **Drag-and-Drop Upload:** Easily add new manga by dragging `.cbz` or `.zip` files onto the dashboard.
- **Progress Tracking:** Resume reading where you left off, with per-series progress bars and "Continue Reading" buttons.
- **Edit & Delete:** Rename or remove series directly from the dashboard.
- **Search & Sort:** Quickly find and organize your collection.
- **Responsive Gallery:** View your collection in a modern, mobile-friendly grid.
- **Reader:** Read manga with keyboard navigation, thumbnails, and progress tracking.
- **The Browser:** An extensible system to browse and read/watch from various online sources. *(Planned)*
- **AI-Powered Discovery:** Get recommendations based on art style, your reading habits, and more. *(Planned)*
- **Community Focused:** Share collections, build collaborative guides, and enjoy your hobbies with others. *(Planned)*

---

## 🖼️ Screenshots

<!--
Add screenshots or GIFs here to showcase UI and features.
Example:
![Library View](docs/screenshots/library.png)
-->

---

## 🚀 Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (v12+)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database Admin (Adminer): http://localhost:8080
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up the database
createdb project_myriad
psql -U <your_user> -d project_myriad -f src/server/schema.sql

# Start the backend (Fastify API)
npm run dev:backend

# In a new terminal, start the frontend (Next.js)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app.

---

## 🖥️ Usage

### Dashboard
- **Upload:** Drag and drop `.cbz` or `.zip` files, or use the file picker.
- **Search/Sort:** Use the search bar and sort dropdown to find series.
- **Edit:** Click the edit button to rename a series.
- **Delete:** Remove a series with the delete button.
- **Continue Reading:** Jump to your last read page with one click.

### Reader
- **Navigation:** Use next/previous buttons or arrow keys.
- **Thumbnails:** Toggle a thumbnail grid for quick navigation.
- **Progress:** Your reading progress is saved automatically.

---

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
