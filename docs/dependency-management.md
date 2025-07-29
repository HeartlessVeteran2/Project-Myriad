# Dependency Management Strategy

This document outlines the dependency management strategy for Project Myriad, addressing deprecated packages and maintaining up-to-date dependencies.

## Recent Updates

### Deprecated Package Replacements

The following deprecated packages have been updated or replaced:

1. **metro-react-native-babel-preset** 
   - Replaced with @react-native/babel-preset (^0.80.0) to match React Native 0.80.2
   - The old package has been deprecated in favor of the new scoped package

2. **react-native-document-picker** 
   - Updated to latest version (^9.3.0) which addresses deprecation warnings

3. **react-native-vector-icons**
   - Updated to latest version (^10.2.0) which addresses deprecation warnings

### Core Dependencies Updated

- **react-native**: Updated to 0.80.2 (from 0.80.1)
- **react-native-screens**: Updated to ^4.0.0 (from ^3.29.0)
- **axios**: Updated to ^1.7.9 (from ^1.6.7)
- **react-native-gradle-plugin**: Updated to 0.80.2 (from 0.73.6)

## Renovate Configuration

The project uses Renovate for automated dependency management with the following strategy:

### Package Rules

1. **React Native Core**: Manual review required for React Native updates
2. **React Native Ecosystem**: Grouped updates for React Native related packages
3. **Dev Dependencies**: Auto-merge enabled for development dependencies
4. **Deprecated Package Handling**: Automatic replacement rules for known deprecated packages

### Security

- Vulnerability alerts enabled
- Lock file maintenance enabled
- Dependency dashboard enabled for visibility

## Manual Dependency Checks

### Before Adding New Dependencies

1. Check if the package is actively maintained
2. Verify compatibility with current React Native version
3. Check for security vulnerabilities
4. Consider bundle size impact

### Regular Maintenance

1. Review Renovate dependency dashboard weekly
2. Test major version updates in development environment
3. Monitor for deprecation warnings in build logs
4. Update documentation when dependencies change significantly

## Troubleshooting

### Common Issues

1. **Gradle Plugin Compatibility**: Ensure React Native Gradle plugin version matches React Native version
2. **Metro Configuration**: Update babel presets when Metro packages are updated. For React Native 0.80+, use @react-native/babel-preset instead of metro-react-native-babel-preset

### Known Issues

1. **React 19 Compatibility**: Some packages like `react-native-fast-image@8.6.3` don't yet support React 19. We use `--legacy-peer-deps` flag for npm operations to handle peer dependency conflicts.
2. **Peer Dependencies**: When installing dependencies, use `npm install --legacy-peer-deps` to avoid peer dependency resolution errors.
3. **CI/CD**: All automated workflows use `--legacy-peer-deps` flag to ensure consistent builds.

3. **Native Dependencies**: Run `cd ios && pod install` after updating native dependencies (iOS)
4. **Android Build**: Clean and rebuild Android project after major dependency updates
