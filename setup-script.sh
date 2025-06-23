#!/bin/bash
#
# Project Myriad Scaffolding Script
# ---------------------------------
# This script creates the standard directory structure for the project.
# Use the -p flag to create parent directories as needed and avoid errors if they already exist.

echo "🚀 Scaffolding Project Myriad directories..."

# --- Root Directories ---
mkdir -p .github/workflows
mkdir -p docs/screenshots

# --- Source Code ---
# Public assets that are served directly
mkdir -p public/assets/icons public/assets/images

# Main source code directory
mkdir -p src/app # Next.js App Router
mkdir -p src/components/ui # Reusable UI components (e.g., buttons, inputs)
mkdir -p src/components/layout # Layout components (e.g., Navbar, Footer)
mkdir -p src/lib # Helper functions, utilities, constants
mkdir -p src/hooks # Custom React hooks
mkdir -p src/styles # Global styles
mkdir -p src/types # TypeScript type definitions

# Backend specific code (API routes can go in src/app/api)
mkdir -p src/server/services # Business logic for the backend
mkdir -p src/server/db # Database-related code (migrations, seeds)

# --- Testing ---
mkdir -p tests/components # Component tests
mkdir -p tests/e2e # End-to-end tests
mkdir -p tests/server # Backend/API tests

echo "✅ Directory structure created successfully!"

# --- Create placeholder files ---
# This helps git track the empty directories
touch .github/workflows/.gitkeep
touch docs/screenshots/.gitkeep
touch public/assets/icons/.gitkeep
touch public/assets/images/.gitkeep
touch src/app/.gitkeep
touch src/components/ui/.gitkeep
touch src/components/layout/.gitkeep
touch src/lib/.gitkeep
touch src/hooks/.gitkeep
touch src/styles/.gitkeep
touch src/types/.gitkeep
touch src/server/services/.gitkeep
touch src/server/db/.gitkeep
touch tests/components/.gitkeep
touch tests/e2e/.gitkeep
touch tests/server/.gitkeep

echo "📝 Added .gitkeep files to empty directories."
echo "🎉 All done!"

