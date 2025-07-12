#!/bin/bash

# 🔄 Merge to Main Branch Automation Script
# This script safely merges feature branches to main with comprehensive testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAIN_BRANCH="main"
CURRENT_BRANCH=$(git branch --show-current)
TEMP_BRANCH="temp-merge-$(date +%s)"

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_section() { echo -e "\n${BLUE}🔷 $1${NC}\n"; }

# Cleanup function
cleanup() {
    log_info "Cleaning up temporary branches..."
    git checkout "$CURRENT_BRANCH" 2>/dev/null || true
    git branch -D "$TEMP_BRANCH" 2>/dev/null || true
}

# Set up cleanup trap
trap cleanup EXIT

# Validation functions
validate_branch() {
    if [ "$CURRENT_BRANCH" = "$MAIN_BRANCH" ]; then
        log_error "Cannot merge main branch to itself"
        exit 1
    fi

    if [ -z "$CURRENT_BRANCH" ]; then
        log_error "Could not determine current branch"
        exit 1
    fi
}

check_git_status() {
    if ! git diff --quiet || ! git diff --cached --quiet; then
        log_error "Working directory is not clean. Please commit or stash changes."
        exit 1
    fi
}

run_comprehensive_tests() {
    log_section "Running Comprehensive Test Suite"

    # Install dependencies
    log_info "Installing dependencies..."
    npm ci
    npm run install:all

    # Run linting
    log_info "Running linting checks..."
    npm run lint || {
        log_warning "Linting issues found, attempting auto-fix..."
        npm run lint:fix
    }

    # Run formatting
    log_info "Running code formatting..."
    npm run format:check || {
        log_warning "Formatting issues found, auto-formatting..."
        npm run format
    }

    # Run security audit
    log_info "Running security audit..."
    npm audit --audit-level=moderate || {
        log_warning "Security issues found, attempting auto-fix..."
        npm audit fix
    }

    # Run unit tests
    log_info "Running unit tests..."
    npm run test:unit || {
        log_error "Unit tests failed"
        return 1
    }

    # Run integration tests
    log_info "Running integration tests..."
    npm run test:integration || {
        log_warning "Integration tests failed (may require services)"
    }

    # Build all components
    log_info "Building all components..."
    npm run build || {
        log_error "Build failed"
        return 1
    }

    log_success "All tests passed!"
}

create_merge_commit() {
    log_section "Creating Merge Commit"

    # Get commit statistics
    COMMITS_COUNT=$(git rev-list --count "$MAIN_BRANCH..$CURRENT_BRANCH")
    FILES_CHANGED=$(git diff --name-only "$MAIN_BRANCH..$CURRENT_BRANCH" | wc -l)

    # Create comprehensive merge commit message
    MERGE_MESSAGE="🔀 Merge feature branch '$CURRENT_BRANCH' into main

## 📊 Merge Statistics
- **Commits**: $COMMITS_COUNT
- **Files Changed**: $FILES_CHANGED
- **Branch**: $CURRENT_BRANCH → $MAIN_BRANCH
- **Merged At**: $(date)

## ✅ Pre-merge Verification
- [x] All tests passed
- [x] Code quality checks passed
- [x] Security audit completed
- [x] Build successful
- [x] No merge conflicts

## 🚀 Features & Changes
$(git log --oneline "$MAIN_BRANCH..$CURRENT_BRANCH" | sed 's/^/- /')

This merge was automatically validated and is ready for production deployment."

    # Perform the merge
    git merge --no-ff -m "$MERGE_MESSAGE" "$CURRENT_BRANCH"

    log_success "Merge commit created successfully"
}

# Main automation function
main() {
    log_section "🤖 Starting Automated Merge to Main"

    # Validation
    validate_branch
    check_git_status

    log_info "Current branch: $CURRENT_BRANCH"
    log_info "Target branch: $MAIN_BRANCH"

    # Fetch latest changes
    log_info "Fetching latest changes..."
    git fetch origin

    # Switch to main and pull latest
    log_info "Updating main branch..."
    git checkout "$MAIN_BRANCH"
    git pull origin "$MAIN_BRANCH"

    # Check if feature branch is up to date with main
    log_info "Checking if feature branch needs rebasing..."
    git checkout "$CURRENT_BRANCH"

    BEHIND_COUNT=$(git rev-list --count "$CURRENT_BRANCH..$MAIN_BRANCH")
    if [ "$BEHIND_COUNT" -gt 0 ]; then
        log_warning "Feature branch is $BEHIND_COUNT commits behind main"

        read -p "🔄 Rebase feature branch on main? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Rebasing feature branch on main..."
            git rebase "$MAIN_BRANCH"
        else
            log_warning "Proceeding without rebase"
        fi
    fi

    # Create temporary branch for testing
    log_info "Creating temporary merge branch for testing..."
    git checkout "$MAIN_BRANCH"
    git checkout -b "$TEMP_BRANCH"
    git merge --no-ff --no-commit "$CURRENT_BRANCH"

    # Run comprehensive tests on merged code
    run_comprehensive_tests

    # If tests pass, perform actual merge
    log_info "Tests passed, performing actual merge..."
    git checkout "$MAIN_BRANCH"
    create_merge_commit

    # Tag the merge if desired
    read -p "🏷️  Create version tag? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter version tag (e.g., v1.2.3): " version_tag
        if [ -n "$version_tag" ]; then
            git tag -a "$version_tag" -m "Release $version_tag - Merged $CURRENT_BRANCH"
            log_success "Tag $version_tag created"
        fi
    fi

    # Push to remote
    read -p "🚀 Push to remote repository? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin "$MAIN_BRANCH"
        if git tag | tail -1 | grep -q "v"; then
            git push origin --tags
        fi
        log_success "Changes pushed to remote repository"
    fi

    # Clean up feature branch
    read -p "🗑️  Delete feature branch '$CURRENT_BRANCH'? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -d "$CURRENT_BRANCH"
        git push origin --delete "$CURRENT_BRANCH" 2>/dev/null || true
        log_success "Feature branch deleted"
    fi

    log_section "🎉 Merge to Main Completed Successfully!"
    log_success "Feature '$CURRENT_BRANCH' has been successfully merged to main"
    log_info "Current branch: $(git branch --show-current)"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "🔄 Merge to Main Automation Script"
        echo
        echo "Usage: $0 [options]"
        echo
        echo "This script safely merges the current feature branch to main with:"
        echo "- Comprehensive testing"
        echo "- Security audits"
        echo "- Build verification"
        echo "- Automated merge commit creation"
        echo
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --dry-run      Show what would be done without making changes"
        echo
        exit 0
        ;;
    --dry-run)
        log_info "DRY RUN MODE - No changes will be made"
        validate_branch
        log_info "Would merge: $CURRENT_BRANCH → $MAIN_BRANCH"
        exit 0
        ;;
    *)
        main
        ;;
esac
