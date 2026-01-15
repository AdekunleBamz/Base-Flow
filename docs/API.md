# API Documentation

## Quote API

Get a price quote for token swap.

**Endpoint:** `GET /api/quote`

**Parameters:**
- `from` (string, required): Source token symbol (ETH, WETH, USDC, DAI, cbETH, USDbC)
- `to` (string, required): Destination token symbol
- `amount` (string, required): Amount to swap

**Response:**
```json
{
  "amountIn": "1.0",
  "amountOut": "3200.50",
  "fromToken": "ETH",
  "toToken": "USDC",
  "price": "3200.50",
  "priceImpact": "< 0.1%",
  "fee": "0.3%"
}
```

## Transaction API

Build transaction data for swap.

**Endpoint:** `POST /api/tx`

**Parameters:**
- `from` (string, required): Source token
- `to` (string, required): Destination token
- `amount` (string, required): Amount to swap

**Response:**
```json
{
  "chainId": "eip155:8453",
  "method": "eth_sendTransaction",
  "params": {
    "abi": [...],
    "to": "0x...",
    "data": "0x...",
    "value": "0x0"
  }
}
```

## Frame API

Farcaster Frame integration endpoint.

**Endpoint:** `POST /api/frame`

Handles Farcaster Frame interactions.
