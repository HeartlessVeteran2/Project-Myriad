# Project Myriad 📖

[![Build Status](https://img.shields.io/github/actions/workflow/status/HeartlessVeteran2/Project-Myriad/ci.yml?branch=main)](https://github.com/HeartlessVeteran2/Project-Myriad/actions)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

The definitive platform for manga and anime enthusiasts.

**Project Myriad** is an open-source web application designed to be the ultimate home for your manga and anime collections. It seamlessly merges local media management with powerful online discovery and community features.

---

## ✨ Features

- **Unified Library:** Manage your local files and online sources all in one place.
- **The Vault:** A powerful, offline-first manager for your local manga (`.cbz`, `.cbr`) and anime files.
- **The Browser:** An extensible system to browse and read/watch from various online sources.
- **AI-Powered Discovery:** Get recommendations based on art style, your reading habits, and more.
- **Community Focused:** Share collections, build collaborative guides, and enjoy your hobbies with others.

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
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [PostgreSQL](https://www.postgresql.org/) (if running without Docker)

### Local Installation

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env as needed

# Set up the database (if not using Docker)
# Example for PostgreSQL:
createdb myriad_db

# Run database migrations (if applicable)
# npm run migrate

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app.

### Docker Deployment

```bash
docker compose up --build
```

---

## 🗺️ Project Roadmap

We are building Myriad in phases. You can follow our progress on our [Project Board](https://github.com/HeartlessVeteran2/Project-Myriad/projects).

- [✅] Phase 0: Project Setup & Community Guidelines  
- [In Progress] Phase 1: The Core Vault (Local Media MVP)  
- [Upcoming] Phase 2: The Browser (Online Source Integration)  
- [Upcoming] Phase 3: AI & Community Enhancements  
- [Future] Phase 4: Full Anime & Video Integration  

---

## 🛠️ Tech Stack

- **Frontend:** React (with Next.js)
- **Backend:** Node.js (with Fastify)
- **Database:** PostgreSQL
- **Deployment:** Docker, GitHub Actions

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
