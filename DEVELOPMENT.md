# Project Myriad - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Expo CLI (will be installed automatically)

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/Project-Myriad/Project-Myriad.git
cd Project-Myriad

# Install all dependencies
npm run install:all

# Setup environment files
npm run setup:env

# Run health check
npm run health:check

# Start development servers
npm run dev
```

## 📱 Mobile Development

### Running the Mobile App
```bash
# Start Expo development server
npm run dev:mobile

# Run on specific platforms
npm run dev:web      # Web browser
npm run dev:android  # Android device/emulator
npm run dev:ios      # iOS device/simulator
```

### Building for Production
```bash
# Build for all platforms
npm run build:mobile

# Build for specific platforms
cd mobile
npm run build:web
npm run build:android
npm run build:ios
```

## 🔧 Backend Development

### Starting the Backend
```bash
npm run dev:backend
```

### Database Operations
```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:backend
npm run test:mobile
npm run test:e2e

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Performance Testing
```bash
# Run performance tests
npm run performance:test

# Analyze bundle size
npm run analyze

# Check for circular dependencies
npm run analyze:deps
```

## 🔍 Code Quality

### Linting and Formatting
```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Security Scanning
```bash
# Run security audit
npm run security

# Update dependencies
npm run deps:update

# Check for outdated dependencies
npm run deps:check
```

## 🐳 Docker Development

### Using Docker
```bash
# Build and run with Docker Compose
npm run docker:dev

# Build Docker image
npm run docker:build

# Run production container
npm run docker:run

# Stop containers
npm run docker:stop
```

## 📊 Monitoring and Debugging

### Health Checks
```bash
# Run comprehensive health check
npm run health:check
```

### Error Tracking
The app includes advanced error tracking that:
- Captures and reports all JavaScript errors
- Provides detailed error context and stack traces
- Supports breadcrumb tracking for debugging
- Includes user session information

### Performance Monitoring
- Lighthouse CI for web performance
- Bundle size analysis
- Memory usage tracking
- Render performance testing

## 🔄 Development Workflow

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: your feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create pull request
5. After review, merge to main

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tool changes

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Performance impact is considered
- [ ] Security implications are reviewed
- [ ] Accessibility is maintained

## 🏗️ Architecture

### Project Structure
```
Project-Myriad/
├── backend/          # Node.js API server
├── mobile/           # React Native app (unified)
├── shared/           # Shared utilities and types
├── scripts/          # Build and deployment scripts
├── docs/            # Documentation
└── .github/         # GitHub workflows and templates
```

### Mobile App Architecture
- **React Native + Expo**: Cross-platform mobile development
- **React Native Web**: Web platform support
- **React Navigation**: Navigation and routing
- **Context API**: State management
- **AsyncStorage**: Local data persistence
- **Custom Hooks**: Reusable logic patterns

### Backend Architecture
- **Express.js**: Web application framework
- **RESTful API**: Standard API design
- **Middleware**: Authentication, validation, security
- **Database**: Configurable database support
- **Caching**: Redis-compatible caching layer

## 🔧 Configuration

### Environment Variables
Create `.env` files in the appropriate directories:

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
```

#### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_ENV=development
```

### Expo Configuration
The mobile app uses Expo for development and building. Key configurations:
- `app.json`: App metadata and build settings
- `expo.json`: Expo-specific settings
- `eas.json`: Expo Application Services configuration

## 🚀 Deployment

### Mobile App Deployment
```bash
# Build for app stores
cd mobile
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Backend Deployment
```bash
# Build and deploy backend
npm run build:backend
# Deploy using your preferred method (Docker, Heroku, etc.)
```

### Web Deployment
```bash
# Build web version
cd mobile
npm run build:web
# Deploy to your web hosting service
```

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Add tests
6. Ensure all checks pass
7. Submit a pull request

### Development Standards
- Write tests for new features
- Follow the existing code style
- Update documentation
- Consider performance impact
- Ensure accessibility compliance

### Issue Reporting
When reporting issues, please include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages/logs
- Screenshots if applicable

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Testing Library](https://testing-library.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

## 🆘 Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
npm run clean:mobile
npm run dev:mobile
```

#### Dependency conflicts
```bash
npm run reset
npm run install:all
```

#### Performance issues
```bash
npm run analyze
npm run performance:test
```

#### Build failures
```bash
npm run health:check
npm run lint
npm run test
```

### Getting Help
- Check the [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Search existing [GitHub Issues](https://github.com/Project-Myriad/Project-Myriad/issues)
- Create a new issue with detailed information
- Join our community discussions

---

For more detailed information, see the [full documentation](./docs/) directory.
