#!/bin/bash
#!/bin/bash

# Dependency Manager Script for Project Myriad
# This script helps manage dependencies across all workspaces

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Workspaces
WORKSPACES=("." "backend" "frontend" "mobile")

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check dependencies in a workspace
check_workspace_deps() {
    local workspace=$1
    local workspace_name=${workspace:-"root"}
    
    print_status "Checking dependencies in $workspace_name..."
    
    if [ ! -f "$workspace/package.json" ]; then
        print_warning "No package.json found in $workspace_name"
        return 0
    fi
    
    cd "$workspace"
    
    # Check for outdated packages
    print_status "Checking for outdated packages..."
    if npm outdated --json > outdated.json 2>/dev/null; then
        if [ -s outdated.json ] && [ "$(cat outdated.json)" != "{}" ]; then
            print_warning "Outdated packages found in $workspace_name:"
            cat outdated.json | jq -r 'to_entries[] | "  \(.key): \(.value.current) → \(.value.latest)"' 2>/dev/null || cat outdated.json
        else
            print_success "All packages are up to date in $workspace_name"
        fi
    else
        print_error "Failed to check outdated packages in $workspace_name"
    fi
    
    # Security audit
    print_status "Running security audit..."
    if npm audit --audit-level=moderate --json > audit.json 2>/dev/null; then
        vulnerabilities=$(cat audit.json | jq -r '.metadata.vulnerabilities | to_entries[] | select(.value > 0) | "\(.key): \(.value)"' 2>/dev/null || echo "")
        if [ -n "$vulnerabilities" ]; then
            print_warning "Security vulnerabilities found in $workspace_name:"
            echo "$vulnerabilities" | while read -r line; do
                echo "  $line"
            done
        else
            print_success "No security vulnerabilities found in $workspace_name"
        fi
    else
        print_error "Failed to run security audit in $workspace_name"
    fi
    
    # Clean up
    rm -f outdated.json audit.json
    cd - >/dev/null
}

# Function to update dependencies in a workspace
update_workspace_deps() {
    local workspace=$1
    local workspace_name=${workspace:-"root"}
    local update_type=$2
    
    print_status "Updating dependencies in $workspace_name..."
    
    if [ ! -f "$workspace/package.json" ]; then
        print_warning "No package.json found in $workspace_name"
        return 0
    fi
    
    cd "$workspace"
    
    case $update_type in
        "patch")
            print_status "Updating patch versions..."
            npm update --save
            ;;
        "minor")
            print_status "Updating minor versions..."
            if command_exists ncu; then
                ncu -u --target minor
                npm install
            else
                print_error "npm-check-updates not installed. Run: npm install -g npm-check-updates"
                return 1
            fi
            ;;
        "major")
            print_status "Updating major versions (interactive)..."
            if command_exists ncu; then
                ncu -u --target latest
                npm install
            else
                print_error "npm-check-updates not installed. Run: npm install -g npm-check-updates"
                return 1
            fi
            ;;
        *)
            print_error "Invalid update type. Use: patch, minor, or major"
            return 1
            ;;
    esac
    
    cd - >/dev/null
}

# Function to clean dependencies
clean_deps() {
    print_status "Cleaning dependencies..."
    
    for workspace in "${WORKSPACES[@]}"; do
        workspace_name=${workspace:-"root"}
        print_status "Cleaning $workspace_name..."
        
        if [ -d "$workspace/node_modules" ]; then
            rm -rf "$workspace/node_modules"
            print_success "Removed node_modules in $workspace_name"
        fi
        
        if [ -f "$workspace/package-lock.json" ]; then
            rm -f "$workspace/package-lock.json"
            print_success "Removed package-lock.json in $workspace_name"
        fi
    done
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    
    for workspace in "${WORKSPACES[@]}"; do
        workspace_name=${workspace:-"root"}
        
        if [ ! -f "$workspace/package.json" ]; then
            print_warning "No package.json found in $workspace_name, skipping..."
            continue
        fi
        
        print_status "Installing dependencies in $workspace_name..."
        cd "$workspace"
        
        if npm ci >/dev/null 2>&1; then
            print_success "Dependencies installed in $workspace_name"
        else
            print_warning "npm ci failed, trying npm install..."
            if npm install; then
                print_success "Dependencies installed in $workspace_name"
            else
                print_error "Failed to install dependencies in $workspace_name"
                return 1
            fi
        fi
        
        cd - >/dev/null
    done
}

# Function to run tests after dependency updates
run_tests() {
    print_status "Running tests to verify dependency updates..."
    
    # Run linting
    print_status "Running linting..."
    if npm run lint >/dev/null 2>&1; then
        print_success "Linting passed"
    else
        print_error "Linting failed"
        return 1
    fi
    
    # Run tests
    print_status "Running tests..."
    if npm run test >/dev/null 2>&1; then
        print_success "Tests passed"
    else
        print_error "Tests failed"
        return 1
    fi
    
    # Run security audit
    print_status "Running security audit..."
    if npm run audit >/dev/null 2>&1; then
        print_success "Security audit passed"
    else
        print_warning "Security audit found issues"
    fi
}

# Function to generate dependency report
generate_report() {
    local output_file=${1:-"dependency-report.md"}
    
    print_status "Generating dependency report..."
    
    cat > "$output_file" << EOF
# Dependency Report

Generated on: $(date -u '+%Y-%m-%d %H:%M:%S UTC')

## Summary

EOF
    
    for workspace in "${WORKSPACES[@]}"; do
        workspace_name=${workspace:-"root"}
        
        if [ ! -f "$workspace/package.json" ]; then
            continue
        fi
        
        echo "### $workspace_name" >> "$output_file"
        echo "" >> "$output_file"
        
        cd "$workspace"
        
        # Count dependencies
        deps=$(cat package.json | jq -r '.dependencies // {} | keys | length' 2>/dev/null || echo "0")
        devDeps=$(cat package.json | jq -r '.devDependencies // {} | keys | length' 2>/dev/null || echo "0")
        total=$((deps + devDeps))
        
        echo "- Production dependencies: $deps" >> "../$output_file"
        echo "- Development dependencies: $devDeps" >> "../$output_file"
        echo "- Total: $total" >> "../$output_file"
        echo "" >> "../$output_file"
        
        # Check for outdated packages
        if npm outdated --json > outdated.json 2>/dev/null && [ -s outdated.json ] && [ "$(cat outdated.json)" != "{}" ]; then
            echo "#### Outdated Packages" >> "../$output_file"
            echo "" >> "../$output_file"
            echo '```json' >> "../$output_file"
            cat outdated.json >> "../$output_file"
            echo '```' >> "../$output_file"
            echo "" >> "../$output_file"
        fi
        
        # Security audit
        if npm audit --audit-level=moderate --json > audit.json 2>/dev/null; then
            vulnerabilities=$(cat audit.json | jq -r '.metadata.vulnerabilities | to_entries[] | select(.value > 0) | "\(.key): \(.value)"' 2>/dev/null || echo "")
            if [ -n "$vulnerabilities" ]; then
                echo "#### Security Vulnerabilities" >> "../$output_file"
                echo "" >> "../$output_file"
                echo "$vulnerabilities" | while read -r line; do
                    echo "- $line" >> "../$output_file"
                done
                echo "" >> "../$output_file"
            fi
        fi
        
        rm -f outdated.json audit.json
        cd - >/dev/null
    done
    
    print_success "Dependency report generated: $output_file"
}

# Function to show help
show_help() {
    cat << EOF
Dependency Manager for Project Myriad

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    check           Check dependencies for all workspaces
    update TYPE     Update dependencies (TYPE: patch|minor|major)
    clean           Clean all node_modules and lock files
    install         Install dependencies for all workspaces
    test            Run tests after dependency updates
    report [FILE]   Generate dependency report (default: dependency-report.md)
    help            Show this help message

Examples:
    $0 check                    # Check all dependencies
    $0 update patch            # Update patch versions
    $0 update minor            # Update minor versions
    $0 clean && $0 install     # Clean and reinstall
    $0 report deps.md          # Generate report to deps.md

Notes:
    - For minor/major updates, install npm-check-updates globally:
      npm install -g npm-check-updates
    - Always run tests after updating dependencies
    - Review changelogs for major version updates

EOF
}

# Main script logic
main() {
    case "${1:-help}" in
        "check")
            print_status "Starting dependency check..."
            for workspace in "${WORKSPACES[@]}"; do
                check_workspace_deps "$workspace"
                echo ""
            done
            ;;
        "update")
            if [ -z "$2" ]; then
                print_error "Update type required. Use: patch, minor, or major"
                exit 1
            fi
            
            print_status "Starting dependency update ($2)..."
            for workspace in "${WORKSPACES[@]}"; do
                update_workspace_deps "$workspace" "$2"
                echo ""
            done
            
            print_status "Running tests after updates..."
            run_tests
            ;;
        "clean")
            clean_deps
            ;;
        "install")
            install_deps
            ;;
        "test")
            run_tests
            ;;
        "report")
            generate_report "$2"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Run main function with all arguments
main "$@"
