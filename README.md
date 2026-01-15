# Baseflow 🌊

A beautiful **token swap interface** for Base that works as both a **standalone web app** and a **Farcaster mini-app/Frame**.

## ✨ Features

- 🌐 **Standalone Web App** - Full swap interface with wallet connection via RainbowKit
- 📱 **Farcaster Frame** - Embedded swaps directly in Warpcast
- ⚡ **Real Mainnet** - Uses Uniswap V3 pools on Base L2
- 💧 **No Liquidity Needed** - Routes through existing DEX liquidity
- 🎨 **Beautiful UI** - Dark theme with smooth animations and micro-interactions
- 📊 **Price Charts** - Real-time price data and 24h trends
- 🔄 **Transaction History** - Track all your swaps with persistent storage
- ⚙️ **Advanced Settings** - Customizable slippage and deadline
- 🔔 **Toast Notifications** - Instant feedback on all actions
- 🎯 **Gas Estimation** - See estimated transaction costs before swapping

## 🚀 Quick Start

```bash
cd ~/baseflow
npm install
cp .env.example .env
# Add your contract address to .env
npm run dev
```

Open http://localhost:3000 to see the swap interface!

## 📋 Deployment

1. **Deploy Contract** → Remix IDE → Base Mainnet
2. **Copy address** → `.env`
3. **Get WalletConnect ID** → [WalletConnect Cloud](https://cloud.walletconnect.com)
4. **Deploy to Vercel** → `vercel`
5. **Update URL** → Vercel env vars
6. **Cast on Warpcast!** 🎉

## 🔑 Base Mainnet Addresses

| Contract | Address |
|----------|---------|
| Uniswap V3 Router | `0x2626664c2603336E57B271c5C0b26F421741e481` |
| WETH | `0x4200000000000000000000000000000000000006` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

## 📁 Structure

```
baseflow/
├── contracts/
│   └── UniswapSwapRouter.sol   # Deploy to Base
├── components/
│   ├── SwapCard.tsx            # Main swap interface
│   └── Web3Provider.tsx        # Wallet connection
├── lib/
│   └── config.ts               # Tokens & contracts
├── app/
│   ├── page.tsx                # Home page with swap
│   ├── swap/page.tsx           # Dedicated swap page
│   ├── layout.tsx              # Frame meta tags
│   └── api/
│       ├── frame/route.ts      # Farcaster Frame logic
│       ├── tx/route.ts         # Transaction builder
│       ├── quote/route.ts      # Price quotes
│       └── image/route.tsx     # Dynamic OG images
├── package.json
└── .env.example
```

## 🎯 Usage Modes

### Standalone Web App
Visit the URL directly and connect your wallet to swap tokens.

### Farcaster Frame
Cast the URL on Warpcast - users can swap directly in the feed or click "Open App" for the full interface.

---

Built with 💙 for Base
