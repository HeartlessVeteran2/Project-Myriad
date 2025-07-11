# 🤝 Contributing to Project Myriad

Thank you for your interest in contributing to Project Myriad! This comprehensive guide will help you get started with contributing to our unified manga, anime, and light novel management platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Extension Development](#extension-development)
- [Performance Guidelines](#performance-guidelines)
- [Security Considerations](#security-considerations)
- [Reporting Issues](#reporting-issues)
- [Community Guidelines](#community-guidelines)
- [Release Process](#release-process)

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** version control
- **Docker** (optional, for containerized development)
- **Database**: MySQL 8.0+ or PostgreSQL 13+

### Setting up the Development Environment

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/your-username/Project-Myriad.git
   cd Project-Myriad
   ```

2. **Install Dependencies**

   ```bash
   # Install all dependencies using the root package.json
   npm install

   # Or install individually:
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install

   # Mobile
   cd ../mobile && npm install
   ```

3. **Environment Configuration**

   ```bash
   # Copy environment templates
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env

   # Configure your environment variables
   # See docs/DEVELOPMENT.md for detailed configuration
   ```

4. **Database Setup**

   ```bash
   # Using Docker (recommended)
   docker-compose up -d mysql

   # Or manual setup - see docs/DEVELOPMENT.md
   ```

5. **Start Development Servers**

   ```bash
   # Start all services
   npm run dev

   # Or start individually:
   # Backend
   cd backend && npm run dev

   # Frontend
   cd frontend && npm start

   # Mobile (React Native)
   cd mobile && npm start
   ```

6. **Verify Setup**
   - Backend API: http://localhost:3001
   - Frontend Web: http://localhost:3000
   - API Documentation: http://localhost:3001/api/docs

## 🔄 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branch structure:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features and enhancements
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

### Branch Naming Convention

```bash
feature/user-authentication-system
bugfix/library-item-display-issue
hotfix/security-vulnerability-fix
docs/api-documentation-update
chore/dependency-updates
```

### Commit Message Format

We follow [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring without functionality changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**

```bash
feat(auth): implement JWT token refresh mechanism
fix(library): resolve pagination issue in manga grid
docs(api): update authentication endpoint documentation
style(frontend): apply consistent button styling
refactor(backend): optimize database query performance
test(library): add unit tests for library service
chore(deps): update dependencies to latest versions
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Develop and Test**
   - Make your changes
   - Write/update tests
   - Ensure all tests pass
   - Update documentation

3. **Pre-submission Checklist**
   - [ ] Code follows style guidelines
   - [ ] Tests pass and coverage is maintained
   - [ ] Documentation is updated
   - [ ] No merge conflicts with develop
   - [ ] Commit messages follow convention
   - [ ] Code is self-reviewed

4. **Submit Pull Request**
   - Use the PR template
   - Link related issues
   - Add relevant labels
   - Request appropriate reviewers

5. **Code Review Process**
   - Address all review comments
   - Update tests if needed
   - Ensure CI/CD checks pass
   - Get approval from required reviewers

### Code Review Guidelines

**For Authors:**

- Keep PRs focused and reasonably sized (<500 lines)
- Provide clear description and context
- Respond to feedback promptly and professionally
- Update documentation alongside code changes

**For Reviewers:**

- Review within 48 hours
- Provide constructive feedback
- Focus on logic, security, performance, and maintainability
- Approve only when confident in the changes

## 💻 Coding Standards

### General Principles

- **Readability**: Code should be self-documenting
- **Consistency**: Follow established patterns
- **Simplicity**: Prefer simple solutions over complex ones
- **Performance**: Consider performance implications
- **Security**: Follow security best practices

### JavaScript/TypeScript Standards

```javascript
// ✅ Good
const getUserLibrary = async (userId, options = {}) => {
  const { page = 1, limit = 20, type } = options;

  try {
    const items = await libraryService.getItems(userId, {
      page,
      limit,
      type,
    });

    return {
      success: true,
      data: items,
    };
  } catch (error) {
    logger.error('Failed to fetch user library', { userId, error });
    throw new ServiceError('Library fetch failed', 500);
  }
};

// ❌ Avoid
function getLibrary(uid, p, l, t) {
  // unclear parameters and no error handling
  return db.query('SELECT * FROM library WHERE user_id = ?', [uid]);
}
```

### Code Formatting

We use **ESLint** and **Prettier** for consistent formatting:

```bash
# Format code
npm run lint:fix
npm run format

# Check formatting
npm run lint
npm run format:check
```

### File Organization

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── pages/               # Page components
├── services/            # API and business logic
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript definitions
├── constants/           # Application constants
├── contexts/            # React contexts
├── store/               # State management
└── __tests__/           # Test files
```

### API Development Standards

**RESTful Design:**

```javascript
// ✅ Good REST endpoints
GET    /api/library/items          // Get library items
POST   /api/library/items          // Create library item
GET    /api/library/items/:id      // Get specific item
PUT    /api/library/items/:id      // Update item
DELETE /api/library/items/:id      // Delete item

// ❌ Avoid non-RESTful patterns
POST   /api/getLibraryItems
GET    /api/library/delete/:id
```

**Error Handling:**

```javascript
// Consistent error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### Database Standards

**Schema Design:**

- Use consistent naming conventions (snake_case)
- Include proper indexes for performance
- Implement foreign key constraints
- Add created_at/updated_at timestamps

**Query Optimization:**

- Use parameterized queries to prevent SQL injection
- Implement proper indexing
- Avoid N+1 query problems
- Use database migrations for schema changes

## 🧪 Testing Guidelines

### Testing Philosophy

We follow the **Testing Pyramid** principle:

- **70%** Unit Tests - Fast, isolated tests
- **20%** Integration Tests - Component interaction tests
- **10%** E2E Tests - Full user workflow tests

### Writing Tests

**Unit Test Example:**

```javascript
// services/__tests__/libraryService.test.js
describe('LibraryService', () => {
  describe('addItem', () => {
    it('should add item with valid data', async () => {
      // Arrange
      const mockItem = { title: 'Test Manga', type: 'manga' };
      const expectedResult = { id: '123', ...mockItem };

      // Act
      const result = await libraryService.addItem('user123', mockItem);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw error for invalid type', async () => {
      const invalidItem = { title: 'Test', type: 'invalid' };

      await expect(libraryService.addItem('user123', invalidItem)).rejects.toThrow(
        'Invalid item type'
      );
    });
  });
});
```

**Integration Test Example:**

```javascript
// api/__tests__/library.integration.test.js
describe('Library API', () => {
  it('should create and retrieve library item', async () => {
    const itemData = { title: 'Test Manga', type: 'manga' };

    // Create item
    const createResponse = await request(app)
      .post('/api/library/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send(itemData)
      .expect(201);

    const itemId = createResponse.body.data.id;

    // Retrieve item
    const getResponse = await request(app)
      .get(`/api/library/items/${itemId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(getResponse.body.data.title).toBe(itemData.title);
  });
});
```

### Test Commands

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Requirements

- **Minimum Coverage**: 80% overall
- **Critical Paths**: 95% coverage required
- **New Code**: Must include tests
- **Coverage Reports**: Generated automatically in CI/CD

## 📚 Documentation

### Code Documentation

**JSDoc Comments:**

```javascript
/**
 * Adds a new item to the user's library
 * @param {string} userId - The user's unique identifier
 * @param {Object} itemData - The item data to add
 * @param {string} itemData.title - The title of the item
 * @param {string} itemData.type - The type (manga, anime, light_novel)
 * @returns {Promise<Object>} The created library item
 * @throws {ValidationError} When item data is invalid
 * @throws {ServiceError} When database operation fails
 */
async function addLibraryItem(userId, itemData) {
  // Implementation
}
```

### API Documentation

We use **OpenAPI 3.0** for API documentation:

```yaml
# Update swagger/openapi.yml when adding endpoints
paths:
  /api/library/items:
    post:
      summary: Add new library item
      tags: [Library]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLibraryItem'
      responses:
        201:
          description: Item created successfully
```

### README Updates

Keep component READMEs current:

- Installation instructions
- Configuration options
- Usage examples
- API references

## 🔌 Extension Development

### Extension Architecture

Extensions are isolated JavaScript modules that implement predefined interfaces:

```javascript
// extensions/example-source/index.js
class ExampleSource {
  constructor() {
    this.id = 'example-source';
    this.name = 'Example Source';
    this.type = 'manga';
    this.version = '1.0.0';
  }

  async search(query, options = {}) {
    // Implementation
  }

  async getChapters(itemId) {
    // Implementation
  }

  async getChapterContent(chapterId) {
    // Implementation
  }
}

module.exports = ExampleSource;
```

### Extension Guidelines

- **Security**: Run in sandboxed environment
- **Performance**: Implement rate limiting and caching
- **Error Handling**: Graceful failure handling
- **Testing**: Include comprehensive tests
- **Documentation**: Clear usage instructions

### Extension Testing

```javascript
// extensions/__tests__/exampleSource.test.js
describe('ExampleSource', () => {
  let source;

  beforeEach(() => {
    source = new ExampleSource();
  });

  it('should search for manga', async () => {
    const results = await source.search('one piece');

    expect(results).toHaveLength(greaterThan(0));
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('id');
  });
});
```

## ⚡ Performance Guidelines

### Frontend Performance

**Bundle Optimization:**

```javascript
// Use dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Implement memoization for expensive calculations
const MemoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => expensiveCalculation(data), [data]);
  return <div>{processedData}</div>;
});

// Use React.useCallback for stable function references
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

**Image Optimization:**

- Use WebP format when possible
- Implement lazy loading
- Provide responsive images
- Optimize for different screen densities

### Backend Performance

**Database Optimization:**

```javascript
// ✅ Good - Use indexes and limit results
const getLibraryItems = async (userId, { page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  return await db.query(
    `
    SELECT id, title, type, created_at
    FROM library_items
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `,
    [userId, limit, offset]
  );
};

// ❌ Avoid - Fetching all data
const getLibraryItems = async userId => {
  return await db.query('SELECT * FROM library_items WHERE user_id = ?', [userId]);
};
```

**Caching Strategy:**

```javascript
// Implement Redis caching for frequently accessed data
const getCachedUserLibrary = async userId => {
  const cacheKey = `user:${userId}:library`;

  let library = await redis.get(cacheKey);
  if (!library) {
    library = await libraryService.getItems(userId);
    await redis.setex(cacheKey, 300, JSON.stringify(library)); // 5 min cache
  }

  return JSON.parse(library);
};
```

### Performance Monitoring

- Use browser dev tools for frontend profiling
- Implement backend performance monitoring
- Set up performance budgets in CI/CD
- Monitor Core Web Vitals

## 🔒 Security Considerations

### Input Validation

```javascript
// ✅ Validate and sanitize all inputs
const addLibraryItem = async (req, res) => {
  const { error, value } = itemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: error.details[0].message },
    });
  }

  // Proceed with validated data
  const item = await libraryService.addItem(req.user.id, value);
  res.status(201).json({ success: true, data: item });
};
```

### Authentication & Authorization

```javascript
// Implement proper JWT token validation
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Access token required' },
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Invalid token' },
      });
    }

    req.user = user;
    next();
  });
};
```

### Security Checklist

- [ ] All inputs validated and sanitized
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (CSP headers, output encoding)
- [ ] CSRF protection implementation
- [ ] Secure password handling (bcrypt)
- [ ] HTTPS enforcement
- [ ] Rate limiting implementation
- [ ] Security headers configuration
- [ ] Dependency vulnerability scanning

## 🐛 Reporting Issues

### Bug Reports

Use our bug report template when creating issues:

```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**

- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

Follow the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 👥 Community Guidelines

### Communication Standards

- **Be Respectful**: Treat all community members with respect
- **Be Constructive**: Provide helpful, actionable feedback
- **Be Patient**: Remember that everyone has different experience levels
- **Be Inclusive**: Welcome newcomers and help them get started

### Getting Help

1. **Search First**: Check existing issues and documentation
2. **Use Templates**: Use provided issue templates
3. **Provide Context**: Include relevant information and examples
4. **Be Specific**: Use clear, descriptive titles and descriptions

### Community Resources

- **Discord Server**: Real-time community chat
- **GitHub Discussions**: Feature discussions and Q&A
- **Documentation**: Comprehensive guides and tutorials
- **Blog**: Updates and technical articles

## 📦 Release Process

### Versioning Strategy

We follow **Semantic Versioning (SemVer)**:

- **MAJOR.MINOR.PATCH** (e.g., 2.1.3)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Schedule

- **Major Releases**: Quarterly (Q1, Q2, Q3, Q4)
- **Minor Releases**: Monthly (first Monday of each month)
- **Patch Releases**: As needed (critical bugs, security issues)
- **Hotfixes**: Immediate (security vulnerabilities)

### Release Process

1. **Feature Freeze**: Stop new features, focus on testing
2. **Release Candidate**: Create RC branch for testing
3. **Testing Phase**: Comprehensive testing across all platforms
4. **Documentation**: Update changelog and documentation
5. **Release**: Tag version and deploy to production
6. **Post-Release**: Monitor for issues and prepare hotfixes if needed

### Changelog Format

```markdown
# Changelog

## [2.1.0] - 2024-01-15

### Added

- New manga reading mode with vertical scrolling
- Extension marketplace for third-party sources
- Dark mode theme option

### Changed

- Improved library organization with custom tags
- Enhanced search functionality with filters

### Fixed

- Fixed pagination issue in library grid view
- Resolved memory leak in reader component

### Security

- Updated authentication system with refresh tokens
- Fixed XSS vulnerability in user profiles
```

## 🎖️ Recognition

### Contributor Recognition

- **CHANGELOG.md**: All contributors listed for each release
- **README.md**: Contributors section with GitHub profiles
- **Special Recognition**: Major contributors highlighted in releases
- **Swag**: Stickers and merchandise for active contributors

### Contribution Types

- **Code**: Bug fixes, features, performance improvements
- **Documentation**: Guides, tutorials, API documentation
- **Testing**: Writing tests, reporting bugs, testing releases
- **Design**: UI/UX improvements, graphics, icons
- **Community**: Helping others, moderating discussions
- **Translation**: Localizing the application

## ❓ Questions and Support

### Where to Get Help

- **Technical Issues**: Create a GitHub issue
- **General Questions**: Use GitHub Discussions
- **Real-time Chat**: Join our Discord server
- **Email**: contact@project-myriad.dev

### Maintainer Contact

- **Lead Maintainer**: @maintainer-username
- **Backend Team**: @backend-team
- **Frontend Team**: @frontend-team
- **Mobile Team**: @mobile-team

---

Thank you for contributing to Project Myriad! Your efforts help create a better experience for the entire community. 🚀
