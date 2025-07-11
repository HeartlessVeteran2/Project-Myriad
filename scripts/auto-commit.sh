#!/bin/bash

# Auto-commit and push script for Project Myriad
# Usage: ./scripts/auto-commit.sh "commit message"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if commit message is provided
if [ $# -eq 0 ]; then
    print_error "Please provide a commit message"
    echo "Usage: $0 \"Your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"

print_status "Starting auto-commit process..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    print_warning "No changes to commit"
    exit 0
fi

# Add all changes
print_status "Adding all changes..."
git add .

# Show what will be committed
print_status "Files to be committed:"
git diff --cached --name-only

# Commit changes
print_status "Committing changes with message: '$COMMIT_MESSAGE'"
git commit -m "$COMMIT_MESSAGE"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current branch: $CURRENT_BRANCH"

# Push changes
print_status "Pushing to origin/$CURRENT_BRANCH..."
if git push origin "$CURRENT_BRANCH"; then
    print_status "Successfully pushed changes!"
else
    print_error "Failed to push changes"
    exit 1
fi

print_status "Auto-commit completed successfully!"
