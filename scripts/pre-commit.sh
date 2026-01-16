#!/bin/bash

# Run linter
echo "🔍 Running linter..."
npm run lint

# Run type check
echo "📝 Running type check..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm test

# Build the project
echo "📦 Building project..."
npm run build

echo "✅ Pre-commit checks passed!"
