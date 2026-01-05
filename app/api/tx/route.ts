import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const WETH_PRICE_USD = 3000;
const SLIPPAGE = 0.05;

const SWAP_ABI = [
  'function swapWETHForUSDC(uint256 amountIn, uint256 amountOutMinimum) external returns (uint256)',
  'function swapUSDCForWETH(uint256 amountIn, uint256 amountOutMinimum) external returns (uint256)',
];

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount');
    const from = searchParams.get('from')?.toLowerCase();
    const to = searchParams.get('to')?.toLowerCase();

    if (!amount || !from || !to) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (!CONTRACT_ADDRESS) {
      return NextResponse.json({ error: 'Contract not configured' }, { status: 500 });
    }

    const iface = new ethers.Interface(SWAP_ABI);
    let calldata: string;
    let amountIn: bigint;
    let amountOutMin: bigint;

    if (from === 'weth' && to === 'usdc') {
      amountIn = ethers.parseEther(amount);
      const expectedUsdc = parseFloat(amount) * WETH_PRICE_USD;
      amountOutMin = BigInt(Math.floor(expectedUsdc * (1 - SLIPPAGE) * 1e6));
      calldata = iface.encodeFunctionData('swapWETHForUSDC', [amountIn, amountOutMin]);
    } else if (from === 'usdc' && to === 'weth') {
      amountIn = BigInt(Math.floor(parseFloat(amount) * 1e6));
      const expectedWeth = parseFloat(amount) / WETH_PRICE_USD;
      amountOutMin = ethers.parseEther((expectedWeth * (1 - SLIPPAGE)).toFixed(18));
      calldata = iface.encodeFunctionData('swapUSDCForWETH', [amountIn, amountOutMin]);
    } else {
      return NextResponse.json({ error: 'Invalid swap pair' }, { status: 400 });
    }

    return NextResponse.json({
      chainId: 'eip155:8453',
      method: 'eth_sendTransaction',
      params: { abi: SWAP_ABI, to: CONTRACT_ADDRESS, data: calldata, value: '0x0' },
      attribution: false,
    });
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: 'Failed to prepare transaction' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    contract: CONTRACT_ADDRESS || 'NOT CONFIGURED',
    swaps: ['weth-usdc', 'usdc-weth'],
    network: 'Base Mainnet (8453)',
  });
}
