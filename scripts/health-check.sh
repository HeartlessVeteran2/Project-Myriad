#!/bin/bash

# Health check script for Project Myriad
set -e

echo "🔍 Project Myriad Health Check"
echo "==============================="

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    echo -n "Checking $service_name... "
    
    if curl -f -s "http://localhost:$port$endpoint" > /dev/null; then
        echo "✅ Healthy"
        return 0
    else
        echo "❌ Unhealthy"
        return 1
    fi
}

# Function to check node version
check_node_version() {
    echo -n "Checking Node.js version... "
    local node_version=$(node --version)
    local required_version="v18"
    
    if [[ "$node_version" == *"$required_version"* ]] || [[ "$node_version" > "$required_version" ]]; then
        echo "✅ $node_version"
        return 0
    else
        echo "❌ $node_version (requires >= $required_version)"
        return 1
    fi
}

# Function to check npm version
check_npm_version() {
    echo -n "Checking npm version... "
    local npm_version=$(npm --version)
    echo "✅ v$npm_version"
    return 0
}

# Function to check dependencies
check_dependencies() {
    echo -n "Checking dependencies... "
    
    if [[ -d "node_modules" && -d "backend/node_modules" && -d "mobile/node_modules" ]]; then
        echo "✅ Installed"
        return 0
    else
        echo "❌ Missing dependencies"
        echo "Run: npm run install:all"
        return 1
    fi
}

# Function to check environment files
check_env_files() {
    echo -n "Checking environment files... "
    
    if [[ -f "backend/.env" ]]; then
        echo "✅ Backend env found"
        return 0
    else
        echo "⚠️  Backend .env missing"
        echo "Run: npm run setup:env"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    echo -n "Checking disk space... "
    local available_space=$(df -h . | awk 'NR==2 {print $4}')
    echo "✅ $available_space available"
    return 0
}

# Function to check ports
check_ports() {
    echo "Checking port availability..."
    
    # Check if ports are in use
    local backend_port=3000
    local mobile_port=8081
    
    if lsof -i :$backend_port > /dev/null 2>&1; then
        echo "⚠️  Port $backend_port is in use (Backend)"
    else
        echo "✅ Port $backend_port is available"
    fi
    
    if lsof -i :$mobile_port > /dev/null 2>&1; then
        echo "⚠️  Port $mobile_port is in use (Mobile)"
    else
        echo "✅ Port $mobile_port is available"
    fi
}

# Main health check
main() {
    local exit_code=0
    
    # System checks
    check_node_version || exit_code=1
    check_npm_version || exit_code=1
    check_dependencies || exit_code=1
    check_env_files || exit_code=1
    check_disk_space || exit_code=1
    check_ports
    
    echo ""
    echo "🌐 Service Health Checks"
    echo "========================"
    
    # Service checks (optional - only if services are running)
    check_service "Backend API" 3000 "/health" || echo "ℹ️  Backend not running (this is ok)"
    check_service "Mobile Metro" 8081 "/" || echo "ℹ️  Mobile Metro not running (this is ok)"
    
    echo ""
    echo "📊 Quick Stats"
    echo "=============="
    
    # Show some quick stats
    echo "📦 Total packages: $(find . -name package.json | wc -l)"
    echo "📁 Project size: $(du -sh . | cut -f1)"
    echo "🗂️  Node modules size: $(du -sh node_modules mobile/node_modules backend/node_modules 2>/dev/null | awk '{sum+=$1} END {print sum "K"}' || echo "0K")"
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        echo "🎉 All checks passed! Project is healthy."
    else
        echo "⚠️  Some issues found. See messages above."
    fi
    
    echo ""
    echo "🚀 Quick Start Commands:"
    echo "npm run dev              # Start development servers"
    echo "npm run start:unified    # Start with unified script"
    echo "npm run test             # Run all tests"
    echo "npm run health:check     # Run this health check again"
    
    exit $exit_code
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
