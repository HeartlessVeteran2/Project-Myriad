# 🛠 Development Setup

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

### Required Software

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Docker**: For containerized development ([Download](https://docker.com/))
- **Docker Compose**: Usually included with Docker Desktop

### Optional but Recommended

- **VS Code**: Recommended IDE with extensions ([Download](https://code.visualstudio.com/))
- **PostgreSQL**: For local database development ([Download](https://postgresql.org/))
- **Redis**: For local caching ([Download](https://redis.io/))

## Quick Start

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Install dependencies for all projects
npm run install:all
```

### 2. Environment Setup

Create environment files for each component:

```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp mobile/.env.example mobile/.env
```

### 3. Start Development Environment

#### Option A: Docker Compose (Recommended)

```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up

# Or start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

#### Option B: Manual Setup

```bash
# Terminal 1: Start database and Redis
docker-compose up postgres redis

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start frontend
cd frontend
npm run dev

# Terminal 4: Start mobile (optional)
cd mobile
npm start
```

### 4. Access the Applications

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Mobile**: http://localhost:3002 (web version)
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Development Environment Configuration

### Backend Configuration

Create `backend/.env` file:

```env
# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://myriad:password@localhost:5432/myriad_dev
DATABASE_LOGGING=true

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=development-jwt-secret-change-in-production
JWT_REFRESH_SECRET=development-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Storage
STORAGE_TYPE=local
STORAGE_PATH=./storage
MAX_FILE_SIZE=100MB

# External APIs (optional for development)
MYANIMELIST_CLIENT_ID=your-mal-client-id
MYANIMELIST_CLIENT_SECRET=your-mal-client-secret
ANILIST_CLIENT_ID=your-anilist-client-id
ANILIST_CLIENT_SECRET=your-anilist-client-secret

# Development Features
ENABLE_REGISTRATION=true
ENABLE_COMMUNITY_FEATURES=true
ENABLE_AI_RECOMMENDATIONS=false
ENABLE_DEBUG_ROUTES=true

# Logging
LOG_LEVEL=debug
LOG_FORMAT=dev

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002
```

### Frontend Configuration

Create `frontend/.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_COMMUNITY=true
VITE_ENABLE_AI_FEATURES=false
VITE_ENABLE_WEB3=false

# Development
VITE_ENV=development
VITE_DEBUG=true

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

### Mobile Configuration

Create `mobile/.env` file:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_WS_URL=ws://localhost:3000

# App Configuration
EXPO_PUBLIC_APP_NAME=Project Myriad Dev
EXPO_PUBLIC_APP_SCHEME=myriad-dev
EXPO_PUBLIC_VERSION=1.0.0-dev

# Feature Flags
EXPO_PUBLIC_ENABLE_REGISTRATION=true
EXPO_PUBLIC_ENABLE_COMMUNITY=true
EXPO_PUBLIC_ENABLE_AI_FEATURES=false

# Development
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_DEBUG=true
```

## Development Workflow

### Git Workflow

We follow a simplified Git Flow:

```bash
# Create feature branch
git checkout -b feature/awesome-feature

# Make changes and commit
git add .
git commit -m "feat: add awesome feature"

# Push branch
git push origin feature/awesome-feature

# Create pull request on GitHub
# After review and approval, merge to main
```

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add manga reader component"

# Bug fix
git commit -m "fix: resolve login authentication issue"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: improve library service performance"

# Testing
git commit -m "test: add unit tests for user service"

# Chore
git commit -m "chore: update dependencies"
```

### Development Scripts

#### Root Level Scripts

```bash
# Install all dependencies
npm run install:all

# Start all services in development
npm run dev

# Run tests for all projects
npm run test

# Lint all projects
npm run lint

# Format all code
npm run format

# Build all projects
npm run build

# Clean all node_modules and build artifacts
npm run clean
```

#### Backend Scripts

```bash
cd backend

# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Database operations
npm run db:migrate
npm run db:seed
npm run db:reset

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
```

#### Frontend Scripts

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
npm run test:ui
npm run test:coverage

# Linting and formatting
npm run lint
npm run lint:fix
npm run format

# Type checking
npm run type-check
```

#### Mobile Scripts

```bash
cd mobile

# Start Expo development server
npm start

# Start with specific platform
npm run android
npm run ios
npm run web

# Build for production
npm run build

# Export for deployment
npm run export

# Run tests
npm run test
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

## VS Code Setup

### Recommended Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-python.python",
    "ms-vscode.vscode-docker",
    "expo.vscode-expo-tools",
    "graphql.vscode-graphql",
    "ms-vscode.vscode-thunder-client"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "eslint.workingDirectories": ["backend", "frontend", "mobile"]
}
```

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/index.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/vite",
      "args": ["--mode", "development"],
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/frontend"
    }
  ]
}
```

## Database Development

### Local PostgreSQL Setup

```bash
# Using Docker (recommended)
docker run --name myriad-postgres \
  -e POSTGRES_DB=myriad_dev \
  -e POSTGRES_USER=myriad \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Or install locally (macOS)
brew install postgresql
brew services start postgresql
createdb myriad_dev
```

### Database Migrations

```bash
cd backend

# Create new migration
npm run db:migration:create -- create_users_table

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback

# Reset database
npm run db:reset
```

### Sample Data

```bash
cd backend

# Seed database with sample data
npm run db:seed

# Reset and seed
npm run db:reset:seed
```

## Testing

### Unit Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- user.test.js
```

### Integration Testing

```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration

# Clean up
docker-compose -f docker-compose.test.yml down
```

### E2E Testing

```bash
# Start application in test mode
npm run start:test

# Run E2E tests
npm run test:e2e

# Run E2E tests in headless mode
npm run test:e2e:headless
```

## Code Quality

### ESLint Configuration

The project uses ESLint with custom rules. Configuration in `.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', '@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
```

### Prettier Configuration

Code formatting with Prettier (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Pre-commit Hooks

Using Husky and lint-staged for pre-commit checks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "git add"],
    "*.{json,css,md}": ["prettier --write", "git add"]
  }
}
```

## Performance Profiling

### Backend Profiling

```bash
# Profile with clinic.js
npx clinic doctor -- node index.js

# Memory profiling
node --inspect index.js
# Then open chrome://inspect in Chrome
```

### Frontend Profiling

```bash
# Bundle analysis
npm run build:analyze

# Performance testing
npm run test:performance
```

## Common Development Tasks

### Adding a New Feature

1. **Create Feature Branch**:

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Backend Development**:

   ```bash
   # Add route
   echo "router.get('/new-endpoint', handler);" >> backend/routes/api.js

   # Add handler
   touch backend/controllers/newFeatureController.js

   # Add tests
   touch backend/tests/newFeature.test.js
   ```

3. **Frontend Development**:

   ```bash
   # Add component
   touch frontend/src/components/NewFeature.jsx

   # Add route
   # Update frontend/src/App.jsx

   # Add tests
   touch frontend/src/components/__tests__/NewFeature.test.jsx
   ```

4. **Testing**:
   ```bash
   npm run test
   npm run lint
   ```

### Debugging Common Issues

#### Backend Issues

```bash
# Check logs
docker-compose logs backend

# Check database connection
npm run db:test-connection

# Reset database
npm run db:reset:seed
```

#### Frontend Issues

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check build
npm run build

# Check type errors
npm run type-check
```

#### Mobile Issues

```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check for iOS/Android specific issues
npx expo doctor
```

## Troubleshooting

### Common Issues

1. **Port already in use**:

   ```bash
   # Find process using port
   lsof -ti:3000

   # Kill process
   kill -9 $(lsof -ti:3000)
   ```

2. **Database connection issues**:

   ```bash
   # Check if PostgreSQL is running
   docker ps | grep postgres

   # Restart database
   docker-compose restart postgres
   ```

3. **Module not found errors**:

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Docker issues**:

   ```bash
   # Rebuild containers
   docker-compose build --no-cache

   # Remove all containers and volumes
   docker-compose down -v
   ```

### Getting Help

- **Documentation**: Check the [docs](../docs/) folder for detailed guides
- **Issues**: Search existing [GitHub Issues](https://github.com/HeartlessVeteran2/Project-Myriad/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- **Discord**: Join our [Discord server](https://discord.gg/project-myriad) for real-time help

This development setup guide should get you up and running quickly with Project Myriad. Happy coding! 🚀

## CI/CD Pipeline

The CI/CD pipeline is managed by GitHub Actions and defined in the `.github/workflows/ci-cd.yml` file. It automates code quality checks, testing, and deployment.

### Triggers

The pipeline is triggered on:

- `push` to `main` and `develop` branches
- `pull_request` to `main` and `develop` branches
- `workflow_dispatch` for manual runs

### Jobs

1.  **`quality-checks`**:
    - Lints backend, frontend, and mobile code.
    - Performs security audits.
    - Runs a dependency check.

2.  **`test-backend`**:
    - Runs backend integration and unit tests.
    - Uses MySQL and Redis services.

3.  **`test-frontend`**:
    - Runs frontend tests using Vitest.

4.  **`test-mobile`**:
    - Runs mobile tests on a macOS environment.

5.  **`build-and-push`**:
    - Builds and pushes a Docker image to GitHub Container Registry on pushes to `main`.

6.  **`deploy`**:
    - Deploys the application to production on pushes to `main`.

## Dependency Management

Dependency updates are handled by the `.github/workflows/dependency-updates.yml` workflow. It can be run manually or on a schedule.

The `.github/workflows/auto-merge-dependencies.yml` workflow automatically merges pull requests from Renovate if all tests pass.
