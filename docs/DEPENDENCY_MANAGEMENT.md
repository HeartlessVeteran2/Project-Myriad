# Dependency Management

This document outlines the dependency management strategy for Project Myriad, including how to use the Renovate dependency dashboard and handle dependency updates.

## Overview

Project Myriad uses [Renovate](https://docs.renovatebot.com/) for automated dependency management across all workspaces (backend, frontend, mobile). The dependency dashboard provides a centralized view of all available updates and their status.

## Dependency Dashboard

The dependency dashboard is automatically created and maintained as GitHub issue #5. It provides:

- **Rate-Limited Updates**: Updates that are currently rate-limited and can be forced
- **Open PRs**: Updates that have been created and are awaiting review
- **Ignored/Blocked**: Updates that are blocked or ignored
- **Detected Dependencies**: Complete inventory of all dependencies across the project

### Dashboard Sections

#### 1. Deprecated Dependencies
Lists dependencies that are no longer maintained or have been deprecated:
- `@testing-library/jest-native` - No longer maintained
- `@types/react-native` - Deprecated in favor of built-in types

#### 2. Rate-Limited Updates
Updates that are currently rate-limited to prevent overwhelming the repository:
- Can be forced by checking the corresponding checkbox
- Includes major version updates that require careful review

#### 3. Open Pull Requests
Active dependency update PRs that are ready for review:
- Each PR can be rebased individually
- Option to rebase all open PRs at once

#### 4. Ignored or Blocked
Updates that are intentionally ignored or blocked:
- Can be recreated by checking the corresponding checkbox
- Usually includes updates that caused issues or are not yet ready

## Dependency Groups

Dependencies are organized into logical groups for easier management:

### Core Framework Groups
- **React packages**: React, React DOM, and related packages
- **React Native packages**: React Native and navigation packages
- **Expo packages**: All Expo SDK packages
- **ESLint packages**: ESLint and related plugins/configs

### Update Type Groups
- **All non-major dependencies**: Patch and minor updates grouped together
- **All major dependencies**: Major version updates grouped separately
- **Testing packages**: Jest, Vitest, Testing Library packages
- **GitHub Actions**: All GitHub Actions updates
- **Docker images**: Docker base images and services

## Update Strategy

### Automatic Updates
- **Patch updates**: Auto-merged for development dependencies
- **GitHub Actions patches**: Auto-merged for security and stability
- **Lock file maintenance**: Weekly updates to keep lock files current

### Manual Review Required
- **Major version updates**: Always require manual review
- **Production dependencies**: Require review for all updates
- **Critical packages**: React, React Native, Expo, Express, Node.js

### Security Updates
- **Vulnerability alerts**: Processed immediately regardless of schedule
- **Security patches**: Prioritized and auto-labeled
- **Critical security issues**: Assigned to maintainers immediately

## Handling Updates

### 1. Review Process
1. Check the dependency dashboard for available updates
2. Review grouped updates by category
3. Prioritize security updates and critical patches
4. Test major updates in development environment

### 2. Testing Updates
```bash
# Test backend updates
cd backend
npm install
npm test
npm run lint

# Test frontend updates
cd frontend
npm install
npm run build
npm test
npm run lint

# Test mobile updates
cd mobile
npm install
npm run test:ci
npm run lint
```

### 3. Merging Updates
1. Review PR changes and changelogs
2. Run automated tests
3. Test manually if needed
4. Merge when confident in stability

## Configuration

### Renovate Configuration (`renovate.json`)
The Renovate configuration includes:
- **Scheduling**: Updates run weekly on Monday mornings
- **Rate limiting**: Maximum 10 PRs per hour, 20 concurrent
- **Grouping**: Logical grouping of related packages
- **Auto-merge**: Enabled for safe patch updates
- **Security**: Immediate processing of vulnerability alerts

### Package-Specific Rules
- **Node.js**: Separate major/minor updates
- **React ecosystem**: Grouped updates for compatibility
- **Testing tools**: Grouped for consistent testing environment
- **Docker images**: Pin digests for reproducibility

## Troubleshooting

### Common Issues

#### 1. Conflicting Dependencies
```bash
# Clear all node_modules and reinstall
npm run clean
npm run install:all
```

#### 2. Failed Tests After Update
```bash
# Run comprehensive test suite
npm run test:coverage
npm run lint
npm run audit
```

#### 3. Build Failures
```bash
# Check for breaking changes in changelogs
# Update configuration files if needed
# Test in isolated environment
```

### Emergency Procedures

#### Rollback Process
1. Identify problematic update
2. Revert the specific PR
3. Add package to ignore list temporarily
4. Create issue to track resolution

#### Security Vulnerabilities
1. Check vulnerability details
2. Apply security patches immediately
3. Test thoroughly but prioritize deployment
4. Monitor for additional issues

## Best Practices

### 1. Regular Maintenance
- Review dependency dashboard weekly
- Keep lock files updated
- Monitor security advisories
- Update documentation when needed

### 2. Testing Strategy
- Test updates in development first
- Use staging environment for major updates
- Run full test suite before merging
- Monitor production after deployment

### 3. Communication
- Document breaking changes
- Notify team of major updates
- Update deployment procedures if needed
- Maintain changelog for significant updates

## Monitoring

### Metrics to Track
- Number of outdated dependencies
- Security vulnerabilities count
- Update success rate
- Time to apply security patches

### Tools
- GitHub Security Advisories
- npm audit
- Renovate dashboard
- Dependency graphs

## Resources

- [Renovate Documentation](https://docs.renovatebot.com/)
- [npm Security Best Practices](https://docs.npmjs.com/security)
- [Node.js Security Working Group](https://github.com/nodejs/security-wg)
- [React Security Guidelines](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Support

For dependency-related issues:
1. Check the dependency dashboard first
2. Review package changelogs and migration guides
3. Search existing issues in the repository
4. Create new issue with detailed information
5. Tag maintainers for urgent security issues
