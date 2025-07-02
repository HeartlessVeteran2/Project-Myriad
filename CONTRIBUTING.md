# Contributing to Project Myriad

Thank you for your interest in contributing to Project Myriad! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Git
- Basic familiarity with React, Next.js, and Fastify

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/Project-Myriad.git
   cd Project-Myriad
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

5. Set up the database:
   ```bash
   createdb myriad_db
   psql -U your_user -d myriad_db -f src/server/schema.sql
   ```

6. Start the development servers:
   ```bash
   # Terminal 1: Backend (port 3001)
   npm run dev:backend
   
   # Terminal 2: Frontend (port 3000)
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/HeartlessVeteran2/Project-Myriad/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node.js version)

### Suggesting Features

1. Check [Discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions) for existing feature requests
2. Create a new discussion or issue with:
   - Clear description of the proposed feature
   - Use case and benefits
   - Any relevant mockups or examples

### Code Contributions

1. **Find an Issue**: Look for issues labeled `good first issue` for beginner-friendly tasks
2. **Create a Branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**: Write your code following our coding standards
4. **Test**: Ensure your changes work and don't break existing functionality
5. **Commit**: Use clear, descriptive commit messages
6. **Push**: Push your branch to your fork
7. **Pull Request**: Create a PR with a clear description

## 📝 Coding Standards

### JavaScript/React

- Use modern ES6+ syntax
- Follow React best practices and hooks patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Prefer functional components over class components

### Code Style

- Use consistent indentation (2 spaces)
- Use semicolons
- Use single quotes for strings
- Follow existing code formatting in the project

### Git Commits

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters or less
- Reference issues and pull requests when relevant

Examples:
```
Add user authentication middleware
Fix pagination bug in series list
Update dependencies to latest versions
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   │   └── auth/          # Authentication components
│   ├── dashboard/         # Dashboard page
│   └── reader/            # Reader functionality
└── server/                # Backend server
    ├── db/               # Database utilities
    ├── routes/           # API route handlers
    │   ├── auth/         # Authentication routes
    │   └── series/       # Series management routes
    ├── services/         # Business logic services
    ├── schema.sql        # Database schema
    └── server.js         # Main server file
```

## 🧪 Testing

Currently, the project is in early development and doesn't have comprehensive tests yet. When adding new features:

1. Test manually in both development environments
2. Test edge cases and error conditions
3. Verify database operations work correctly
4. Test authentication flows

## 📚 Development Guidelines

### Database Changes

- Always include migration scripts for schema changes
- Test migrations on a clean database
- Update `schema.sql` with any structural changes

### API Changes

- Maintain backward compatibility when possible
- Update API documentation in README.md
- Test all endpoints manually

### Frontend Changes

- Ensure responsive design works on mobile and desktop
- Test in multiple browsers
- Maintain accessibility standards

## 🌟 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Future changelog entries
- Project acknowledgments

## 📞 Getting Help

- Join discussions in [GitHub Discussions](https://github.com/HeartlessVeteran2/Project-Myriad/discussions)
- Ask questions in issues with the `question` label
- Review existing documentation and code

## 📜 License

By contributing, you agree that your contributions will be licensed under the GPL-3.0 License.

Thank you for contributing to Project Myriad! 🎉
