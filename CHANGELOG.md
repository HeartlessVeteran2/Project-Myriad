# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure with Next.js frontend and Fastify backend
- User authentication system with JWT tokens
- Series management with file upload support
- Reading progress tracking
- Database schema for users, series, and reading progress

### Changed

- Updated `@fastify/multipart` to v9.0.0 for improved file upload handling
- Enhanced project documentation with detailed API endpoints and tech stack information

### Infrastructure

- Added Renovate bot for automated dependency updates
- Configured GitHub Actions workflow for CI/CD
- Added Dependabot for security updates
- Created issue templates for better project management

## [0.1.1] - 2025-07-02

### Added

- Comprehensive CONTRIBUTING.md with development guidelines
- Enhanced CHANGELOG.md following Keep a Changelog format
- Additional npm scripts for database management
- Detailed API documentation in README.md
- Markdown linting script

### Changed

- Updated README.md with current dependency versions and improved structure
- Enhanced project documentation with detailed tech stack information
- Improved markdown formatting across all documentation files

### Fixed

- Markdown formatting issues across documentation files
- Missing .env.example file references in setup instructions

## [0.1.0] - 2025-01-XX

### Features

- Initial release of Project Myriad
- Core vault functionality for local manga management
- Basic web reader with keyboard navigation
- User registration and authentication
- Series upload via drag-and-drop or file picker
- PostgreSQL database integration
- RESTful API with Fastify backend
- Responsive React frontend with Next.js

### Dependencies

- React 18.x
- Next.js 14.x
- Fastify 4.x
- PostgreSQL with pg client v8.16.2
- bcrypt v5.1.1 for password hashing
- jsonwebtoken v9.0.2 for JWT authentication
- unzipper v0.10.14 for archive extraction
