# Troubleshooting Guide

## Common Issues

### Wallet Won't Connect

**Problem:** RainbowKit modal doesn't open or wallet fails to connect.

**Solutions:**
- Check NEXT_PUBLIC_WALLETCONNECT_ID is set correctly
- Clear browser cache and localStorage
- Try different wallet
- Check network (should be Base mainnet)

### Quote API Fails

**Problem:** Cannot fetch price quote.

**Solutions:**
- Verify token symbols are correct (ETH, WETH, USDC, etc.)
- Check amount is valid number > 0
- Ensure RPC URL is accessible
- Try different token pair

### Transaction Fails

**Problem:** Swap transaction reverts or fails.

**Solutions:**
- Check wallet has sufficient balance
- Verify gas fees are covered
- Increase slippage tolerance
- Wait for network congestion to clear
- Check token allowance

### Slow Performance

**Problem:** App is slow or laggy.

**Solutions:**
- Clear browser cache
- Disable browser extensions
- Check internet connection
- Use Chrome/Brave for best performance

### Frame Not Working

**Problem:** Farcaster Frame doesn't load.

**Solutions:**
- Verify Frame meta tags in layout.tsx
- Check image URLs are accessible
- Test in Warpcast app
- Validate Frame API responses

## Debug Mode

Enable debug logging:
```typescript
// In lib/logger.ts
logger.setLogLevel(LogLevel.DEBUG);
```

## Getting Help

- Check documentation
- Open GitHub issue
- Join Discord community
- Contact support
