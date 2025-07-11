---
name: Performance Issue
about: Report performance problems or optimization opportunities
title: '[PERFORMANCE] '
labels: ['performance', 'needs-triage']
assignees: ''
---

## ⚡ Performance Issue

### Issue Type

- [ ] Slow loading times
- [ ] High memory usage
- [ ] High CPU usage
- [ ] Unresponsive interface
- [ ] Database query performance
- [ ] Network/API performance
- [ ] Mobile performance
- [ ] Other: [Specify]

### Component Affected

- [ ] Frontend Web App
- [ ] Mobile App
- [ ] Backend API
- [ ] Database
- [ ] Extension System
- [ ] File Downloads
- [ ] Image Loading
- [ ] Search Functionality

## 📊 Performance Metrics

### Current Performance

- **Load Time**: [e.g., 5 seconds to load library]
- **Memory Usage**: [e.g., 500MB RAM usage]
- **CPU Usage**: [e.g., 80% CPU on mobile]
- **Network Usage**: [e.g., 10MB data per page]

### Expected Performance

- **Target Load Time**: [e.g., <2 seconds]
- **Target Memory**: [e.g., <200MB]
- **Target CPU**: [e.g., <30%]

### Measurement Tools Used

- [ ] Browser DevTools
- [ ] Lighthouse
- [ ] React DevTools
- [ ] Node.js Profiler
- [ ] Database Query Analyzer
- [ ] Mobile Profiler
- [ ] Other: [Specify tool]

## 🔄 Steps to Reproduce

1. Go to '...'
2. Perform action '....'
3. Observe performance issue
4. Measure with [tool]

## 🌐 Environment

### System Information

**Desktop:**

- OS: [e.g. macOS Big Sur]
- Browser: [e.g. Chrome 91]
- RAM: [e.g. 16GB]
- CPU: [e.g. Intel i7]
- Network: [e.g. WiFi, 100Mbps]

**Mobile:**

- Device: [e.g. iPhone 12]
- OS: [e.g. iOS 14.6]
- Available RAM: [e.g. 4GB]
- Network: [e.g. 4G, WiFi]

**Backend:**

- Server Specs: [CPU, RAM, Storage]
- Database: [Type, version, size]
- Load: [Current user count, requests/sec]

## 🔍 Analysis

### Suspected Cause

What do you think might be causing this performance issue?

- [ ] Large bundle size
- [ ] Inefficient rendering
- [ ] Memory leaks
- [ ] N+1 database queries
- [ ] Missing indexes
- [ ] Large image files
- [ ] Inefficient algorithms
- [ ] Network latency
- [ ] Concurrent request limits

### Profiling Data

If you've done any profiling, share the results:

```
[Paste profiling data, screenshots, or measurements here]
```

## 🚀 Proposed Solution

### Optimization Ideas

If you have ideas for fixing this performance issue:

1. **Solution 1**: [Description and expected impact]
2. **Solution 2**: [Description and expected impact]

### Implementation Approach

- **Frontend Optimizations**: [Code splitting, lazy loading, etc.]
- **Backend Optimizations**: [Caching, query optimization, etc.]
- **Infrastructure Changes**: [CDN, server scaling, etc.]

## 📈 Impact Assessment

### User Impact

- **Severity**:
  - [ ] Low - Slight inconvenience
  - [ ] Medium - Noticeable delay
  - [ ] High - Significant usability impact
  - [ ] Critical - App unusable

### Business Impact

- **User Experience**: [How this affects user satisfaction]
- **Resource Costs**: [Server costs, user churn, etc.]
- **Development Effort**: [Time needed to fix]

## 📸 Evidence

### Screenshots/Videos

Attach screenshots of:

- Performance profiler results
- Network tab showing slow requests
- Memory usage graphs
- CPU usage charts

### Benchmark Results

If you've run benchmarks, include results:

```
[Benchmark data]
```

## 🔧 Workarounds

### Temporary Solutions

Are there any workarounds users can use while this is being fixed?

1. **Workaround 1**: [Description]
2. **Workaround 2**: [Description]

## ✅ Checklist

- [ ] I have measured the performance issue objectively
- [ ] I have provided specific metrics and environment details
- [ ] I have checked if this is a known issue
- [ ] I have attempted to identify the root cause
- [ ] I have considered the impact on different user segments
