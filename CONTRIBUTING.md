# Contributing to Project Myriad

Thank you for your interest in contributing to Project Myriad! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (v12+)
- [Git](https://git-scm.com/)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/Project-Myriad.git
   cd Project-Myriad
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database Setup**
   ```bash
   createdb project_myriad
   psql -U your_user -d project_myriad -f src/server/schema.sql
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Backend (Fastify)
   npm run dev:backend

   # Terminal 2: Frontend (Next.js)
   npm run dev
   ```

6. **Run Tests**
   ```bash
   npm test
   ```

## 🛠️ Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/your-feature-name` - Feature branches
- `fix/your-fix-name` - Bug fix branches

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 🧪 Testing

We use Jest for testing. Please ensure:

- All new features have tests
- Existing tests continue to pass
- Aim for good test coverage

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Code Style

- Follow existing code patterns
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

### Linting

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── dashboard/          # Dashboard page
│   └── reader/            # Reader page
├── components/            # Shared React components
├── lib/                   # Utility libraries
└── server/                # Backend server
    ├── db/               # Database connection
    ├── routes/           # API routes
    └── services/         # Business logic
```

## 🎯 Current Priorities

Check our [Project Board](https://github.com/HeartlessVeteran2/Project-Myriad/projects) for current priorities:

- **Phase 1**: Core Vault (Local Media MVP) - *In Progress*
- **Phase 2**: Browser (Online Source Integration) - *Upcoming*
- **Phase 3**: AI & Community Features - *Future*

## 🐛 Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots if applicable

Use our [issue templates](.github/ISSUE_TEMPLATE/) when possible.

## 💡 Suggesting Features

We welcome feature suggestions! Please:

- Check if the feature already exists or is planned
- Use the feature request template
- Provide clear use cases and benefits
- Consider implementation complexity

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and resources
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Fastify Documentation](https://www.fastify.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)

## 🆘 Getting Help

- [GitHub Discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- [GitHub Issues](https://github.com/HeartlessVeteran2/Project-Myriad/issues)

## 📄 License

By contributing to Project Myriad, you agree that your contributions will be licensed under the GNU General Public License v3.0.

---

Thank you for contributing to Project Myriad! 🚀
