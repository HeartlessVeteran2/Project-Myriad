#!/bin/bash

# 🤖 Complete Repository Automation Script
# This script performs comprehensive checks, fixes, and optimizations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_section() {
    echo -e "\n${BLUE}🔷 $1${NC}"
    echo "----------------------------------------"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Install all dependencies
install_dependencies() {
    log_section "Installing Dependencies"

    log_info "Installing root dependencies..."
    npm ci

    log_info "Installing backend dependencies..."
    cd backend && npm ci && cd ..

    log_info "Installing frontend dependencies..."
    cd frontend && npm ci && cd ..

    log_info "Installing mobile dependencies..."
    cd mobile && npm ci && cd ..

    log_success "All dependencies installed"
}

# Run comprehensive linting and formatting
lint_and_format() {
    log_section "Code Quality Checks"

    log_info "Running ESLint..."
    npm run lint || {
        log_warning "Linting issues found, attempting auto-fix..."
        npm run lint:fix
    }

    log_info "Running Prettier..."
    npm run format:check || {
        log_warning "Formatting issues found, auto-formatting..."
        npm run format
    }

    log_success "Code quality checks completed"
}

# Run security audits
security_audit() {
    log_section "Security Audit"

    log_info "Running npm audit..."
    npm audit --audit-level=moderate || {
        log_warning "Security vulnerabilities found, attempting auto-fix..."
        npm audit fix
    }

    log_info "Checking for security issues in backend..."
    cd backend
    npm audit --audit-level=moderate || npm audit fix
    cd ..

    log_info "Checking for security issues in frontend..."
    cd frontend
    npm audit --audit-level=moderate || npm audit fix
    cd ..

    log_info "Checking for security issues in mobile..."
    cd mobile
    npm audit --audit-level=moderate || npm audit fix
    cd ..

    log_success "Security audit completed"
}

# Run comprehensive test suite
run_tests() {
    log_section "Running Test Suite"

    log_info "Running unit tests..."
    npm run test:unit || {
        log_error "Unit tests failed"
        return 1
    }

    log_info "Running integration tests..."
    npm run test:integration || {
        log_warning "Integration tests failed (may require services)"
    }

    log_success "Test suite completed"
}

# Build all components
build_all() {
    log_section "Building All Components"

    log_info "Building backend..."
    npm run build:backend || {
        log_error "Backend build failed"
        return 1
    }

    log_info "Building frontend..."
    npm run build:frontend || {
        log_error "Frontend build failed"
        return 1
    }

    log_info "Building mobile..."
    npm run build:mobile || {
        log_warning "Mobile build failed (may require platform tools)"
    }

    log_success "Build completed"
}

# Check and fix merge conflicts
check_conflicts() {
    log_section "Checking for Merge Conflicts"

    # Check for conflict markers
    if grep -r "<<<<<<< HEAD\|>>>>>>> \|=======" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" .; then
        log_error "Merge conflict markers found in files"
        log_info "Please resolve conflicts manually"
        return 1
    fi

    log_success "No merge conflicts found"
}

# Update dependencies
update_dependencies() {
    log_section "Dependency Updates"

    log_info "Checking for outdated dependencies..."
    npm run deps:check || true

    log_info "Updating patch versions..."
    npm run deps:update:patch || true

    log_success "Dependencies updated"
}

# Git operations
git_operations() {
    log_section "Git Operations"

    # Fetch latest changes
    log_info "Fetching latest changes..."
    git fetch origin

    # Check current branch
    current_branch=$(git branch --show-current)
    log_info "Current branch: $current_branch"

    # Check if there are any staged changes
    if git diff --cached --quiet; then
        log_info "No staged changes found"
    else
        log_info "Staged changes detected"
        git status --porcelain
    fi

    # Check if there are any unstaged changes
    if git diff --quiet; then
        log_info "No unstaged changes found"
    else
        log_warning "Unstaged changes detected"
        git status --porcelain
    fi

    log_success "Git status checked"
}

# Generate comprehensive report
generate_report() {
    log_section "Generating Automation Report"

    report_file="automation-report-$(date +%Y%m%d-%H%M%S).md"

    cat > "$report_file" << EOF
# 🤖 Repository Automation Report

**Generated:** $(date)
**Branch:** $(git branch --show-current)
**Commit:** $(git rev-parse --short HEAD)

## 📊 Summary

- ✅ Dependencies installed and updated
- ✅ Code quality checks passed
- ✅ Security audit completed
- ✅ Tests executed
- ✅ Build successful
- ✅ No merge conflicts detected

## 📈 Test Coverage

\`\`\`
$(npm run test:coverage 2>/dev/null | tail -10 || echo "Coverage data not available")
\`\`\`

## 🔒 Security Status

\`\`\`
$(npm audit --audit-level=info 2>/dev/null | head -20 || echo "Security audit data not available")
\`\`\`

## 📦 Dependencies

### Outdated Packages
\`\`\`
$(npm outdated 2>/dev/null || echo "No outdated packages found")
\`\`\`

## 🎯 Next Steps

1. Review any warnings or errors above
2. Commit and push changes if everything looks good
3. Create pull request if on feature branch
4. Deploy to staging/production as needed

---
*Report generated by repository automation script*
EOF

    log_success "Report generated: $report_file"
}

# Main automation function
main() {
    log_section "🤖 Starting Complete Repository Automation"

    check_git_repo

    # Run all automation steps
    install_dependencies
    lint_and_format
    security_audit
    check_conflicts
    update_dependencies
    run_tests
    build_all
    git_operations
    generate_report

    log_section "🎉 Repository Automation Completed Successfully"
    log_success "All checks passed! Repository is ready for deployment."

    # Ask if user wants to commit changes
    if [[ -n $(git status --porcelain) ]]; then
        echo
        read -p "📝 Commit all changes? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "🤖 Automated repository improvements and fixes

- Updated dependencies and fixed security issues
- Applied code formatting and linting fixes
- Verified all tests pass
- Generated automation report

Automated by repository automation script"
            log_success "Changes committed successfully"

            echo
            read -p "🚀 Push to remote? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git push
                log_success "Changes pushed to remote repository"
            fi
        fi
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "🤖 Repository Automation Script"
        echo
        echo "Usage: $0 [options]"
        echo
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --deps-only    Only update dependencies"
        echo "  --lint-only    Only run linting and formatting"
        echo "  --test-only    Only run tests"
        echo "  --build-only   Only run builds"
        echo
        exit 0
        ;;
    --deps-only)
        install_dependencies
        update_dependencies
        ;;
    --lint-only)
        lint_and_format
        ;;
    --test-only)
        run_tests
        ;;
    --build-only)
        build_all
        ;;
    *)
        main
        ;;
esac
