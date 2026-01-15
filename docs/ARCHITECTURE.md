# Architecture Documentation

## Overview

Baseflow is a Next.js application that serves as both a standalone web app and a Farcaster Frame.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Web3:** Wagmi + Viem
- **Wallet:** RainbowKit
- **State:** React hooks + localStorage

## Project Structure

```
baseflow/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── public/                # Static assets
└── contracts/             # Smart contracts
```

## Key Features

### Swap Interface
- Token selection with search
- Real-time price quotes
- Gas estimation
- Slippage protection
- Transaction tracking

### Farcaster Integration
- Frame detection
- Mini-app mode
- Embedded swaps

## Data Flow

1. User selects tokens and amount
2. App fetches quote from Uniswap V3
3. User approves token (if needed)
4. Transaction is executed
5. History is saved to localStorage
