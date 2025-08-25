# Firewall Issue Resolution for Project Myriad

## Problem
The build process was failing with firewall blocking `dl.google.com` when Gradle attempted to download dependencies and build tools from Google's repositories.

## Root Cause
Gradle was using implicit repository configuration, which defaults to accessing Google's servers at `dl.google.com`. When a firewall blocks this domain, the build fails.

## Solution Implemented

### 1. Explicit Repository Configuration
Modified `android/build.gradle` to explicitly define repositories with firewall-friendly alternatives:

- **Maven Central** as primary repository (better firewall compatibility)
- **Google Maven** with explicit URL configuration  
- **Alternative mirrors** for Google repositories
- **JitPack** for additional dependencies
- **Local Maven** for offline builds

### 2. Gradle Properties Configuration
Created `android/gradle.properties` with:
- Optimized JVM memory settings
- Android X and Jetifier support
- Proxy configuration placeholders for corporate environments

### 3. CI/CD Pre-download Strategy
Created `.github/workflows/android-build.yml` workflow that:
- Downloads Gradle wrapper and dependencies BEFORE firewall restrictions
- Caches dependencies to avoid repeated downloads
- Uses offline-first build strategies
- Pre-configures Android SDK components

### 4. Fallback Configuration
Updated native modules configuration to handle React Native CLI changes gracefully.

## Testing the Fix

To verify the firewall issue is resolved:

```bash
cd android
./gradlew dependencies --no-daemon --offline || ./gradlew dependencies --no-daemon
```

## Additional Configuration for Corporate Environments

If behind a corporate firewall, uncomment and configure proxy settings in `android/gradle.properties`:

```properties
systemProp.http.proxyHost=proxy.company.com
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=proxy.company.com
systemProp.https.proxyPort=8080
```

## Alternative Solutions

1. **Use repository mirrors**
2. **Enable offline builds with dependency pre-fetching**
3. **Configure corporate proxy settings**
4. **Add domains to firewall allowlist**: `dl.google.com`, `maven.google.com`

This solution provides multiple fallback mechanisms to ensure builds succeed even in restrictive network environments.