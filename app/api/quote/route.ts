import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

// Uniswap V3 QuoterV2 address on Base
const QUOTER_V2_ADDRESS = '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a';

// QuoterV2 ABI - uses struct for params
const QUOTER_V2_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'fee', type: 'uint24' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInputSingle',
    outputs: [
      { name: 'amountOut', type: 'uint256' },
      { name: 'sqrtPriceX96After', type: 'uint160' },
      { name: 'initializedTicksCrossed', type: 'uint32' },
      { name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const TOKENS: Record<string, { address: string; decimals: number }> = {
  WETH: { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
  USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
  DAI: { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18 },
  cbETH: { address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', decimals: 18 },
  USDbC: { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', decimals: 6 },
};

// Fee tiers to try (in order of liquidity likelihood)
const FEE_TIERS = [3000, 500, 10000, 100]; // 0.3%, 0.05%, 1%, 0.01%

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from')?.toUpperCase();
    const to = searchParams.get('to')?.toUpperCase();
    const amount = searchParams.get('amount');

    if (!from || !to || !amount) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const fromToken = TOKENS[from];
    const toToken = TOKENS[to];

    if (!fromToken || !toToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const quoter = new ethers.Contract(QUOTER_V2_ADDRESS, QUOTER_V2_ABI, provider);

    const amountIn = ethers.parseUnits(amount, fromToken.decimals);
    
    // Try different fee tiers until we find a pool with liquidity
    let amountOut: bigint | null = null;
    let successfulFee: number | null = null;
    let lastError: Error | null = null;

    for (const fee of FEE_TIERS) {
      try {
        const result = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: fromToken.address,
          tokenOut: toToken.address,
          amountIn: amountIn,
          fee: fee,
          sqrtPriceLimitX96: 0,
        });
        
        amountOut = result[0]; // First return value is amountOut
        successfulFee = fee;
        break;
      } catch (e) {
        lastError = e as Error;
        continue;
      }
    }

    if (amountOut !== null && successfulFee !== null) {
      const formattedOutput = ethers.formatUnits(amountOut, toToken.decimals);
      
      // Calculate price
      const inputNum = parseFloat(amount);
      const outputNum = parseFloat(formattedOutput);
      const price = outputNum / inputNum;

      return NextResponse.json({
        amountIn: amount,
        amountOut: formattedOutput,
        fromToken: from,
        toToken: to,
        price: price.toFixed(6),
        priceImpact: '< 0.1%',
        fee: `${successfulFee / 10000}%`,
      });
    }

    // Fallback to estimated prices if all fee tiers fail
    console.error('Quote failed for all fee tiers:', lastError?.message);
    return getFallbackQuote(from, to, amount, fromToken, toToken);
    
  } catch (error) {
    console.error('Quote error:', error);
    
    const from = new URL(req.url).searchParams.get('from')?.toUpperCase() || '';
    const to = new URL(req.url).searchParams.get('to')?.toUpperCase() || '';
    const amount = new URL(req.url).searchParams.get('amount') || '0';
    
    return getFallbackQuote(from, to, amount, TOKENS[from], TOKENS[to]);
  }
}

function getFallbackQuote(
  from: string, 
  to: string, 
  amount: string,
  fromToken?: { address: string; decimals: number },
  toToken?: { address: string; decimals: number }
) {
  const PRICES: Record<string, number> = {
    WETH: 3200,
    cbETH: 3400,
    USDC: 1,
    USDbC: 1,
    DAI: 1,
  };
  
  const fromPrice = PRICES[from] || 1;
  const toPrice = PRICES[to] || 1;
  
  if (!fromPrice || !toPrice || !toToken) {
    return NextResponse.json({ error: 'Unsupported pair' }, { status: 400 });
  }
  
  const inputValue = parseFloat(amount) * fromPrice;
  const outputAmount = (inputValue / toPrice) * 0.997;
  const estimatedOutput = outputAmount.toFixed(toToken.decimals === 6 ? 2 : 6);

  return NextResponse.json({
    amountIn: amount,
    amountOut: estimatedOutput,
    fromToken: from,
    toToken: to,
    price: (fromPrice / toPrice).toFixed(6),
    priceImpact: '< 0.5%',
    fee: '0.3%',
    estimated: true,
  });
}