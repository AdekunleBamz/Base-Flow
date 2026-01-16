# Security Best Practices

## Smart Contract Security

- All swaps go through audited Uniswap V3 contracts
- No custom swap logic that could have vulnerabilities
- Users approve tokens to Uniswap router, not our contracts

## Frontend Security

### Input Validation
- All user inputs are validated before processing
- Amount inputs are sanitized to prevent injection
- Address validation before any transactions

### API Security
- Rate limiting on all API endpoints
- Input validation on server side
- No sensitive data in client-side code

### Transaction Safety
- Slippage protection prevents sandwich attacks
- Deadline prevents stale transactions
- Amount validation prevents overflow

## User Safety

### Best Practices
- Always verify transaction details before signing
- Start with small amounts when testing
- Use hardware wallet for large amounts
- Keep recovery phrase secure
- Verify contract addresses on BaseScan

### Red Flags
- Unusual token approvals
- Very high slippage requirements
- Suspiciously good prices
- Unknown token contracts

## Privacy

### Data Collection
- No personal information collected
- Transaction history stored locally only
- Analytics are anonymized
- No tracking cookies

### On-Chain Privacy
- All transactions are public on blockchain
- Wallet addresses are pseudonymous
- Consider privacy implications

## Reporting Security Issues

Found a security vulnerability?

**DO NOT** open a public GitHub issue.

Email: security@baseflow.app

We will respond within 24 hours.
