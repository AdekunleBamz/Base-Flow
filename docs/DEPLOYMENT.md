# Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- WalletConnect Project ID
- Base RPC URL (optional)

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_ID=your_project_id
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Optional
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## Deploy to Other Platforms

### Netlify
```bash
npm run build
# Deploy .next folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Post-Deployment

1. Test all features
2. Verify wallet connection
3. Test swaps on testnet first
4. Monitor errors and logs
