#!/bin/bash

echo "🧹 Cleaning build artifacts..."

# Remove build directories
rm -rf .next
rm -rf out
rm -rf build
rm -rf dist

# Remove node_modules
rm -rf node_modules

# Remove lockfiles
rm -f package-lock.json
rm -f yarn.lock

echo "✅ Cleanup complete!"
