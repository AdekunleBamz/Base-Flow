#!/bin/bash

echo "📊 Analyzing bundle size..."

# Build the project
npm run build

# Analyze bundle
npx @next/bundle-analyzer

echo "✅ Analysis complete!"
