'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Baseflow',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || 'baseflow-swap',
  chains: [base],
  ssr: true,
});

// Token addresses on Base mainnet
export const TOKENS = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    logo: '⟠',
  },
  WETH: {
    address: '0x4200000000000000000000000000000000000006' as `0x${string}`,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logo: '⟠',
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '💵',
  },
  DAI: {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as `0x${string}`,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logo: '🟡',
  },
  cbETH: {
    address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22' as `0x${string}`,
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    decimals: 18,
    logo: '🔷',
  },
  USDbC: {
    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as `0x${string}`,
    symbol: 'USDbC',
    name: 'USD Base Coin',
    decimals: 6,
    logo: '💲',
  },
} as const;

// Contract addresses
export const CONTRACTS = {
  UNISWAP_V3_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481' as `0x${string}`,
  UNISWAP_V3_QUOTER: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a' as `0x${string}`,
  // Universal Router handles ETH wrapping automatically
  UNIVERSAL_ROUTER: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD' as `0x${string}`,
  SWAP_ROUTER: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
};

// ABIs - using viem parseAbi compatible format
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export const SWAP_ROUTER_ABI = [
  {
    type: 'function',
    name: 'swapWETHForUSDC',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMinimum', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapUSDCForWETH',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMinimum', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapETHForUSDC',
    inputs: [{ name: 'amountOutMinimum', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'payable',
  },
] as const;

// Uniswap V3 SwapRouter02 ABI with multicall for ETH handling
export const UNISWAP_ROUTER_ABI = [
  {
    type: 'function',
    name: 'multicall',
    inputs: [
      { name: 'deadline', type: 'uint256' },
      { name: 'data', type: 'bytes[]' },
    ],
    outputs: [{ name: 'results', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'exactInputSingle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
      },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'unwrapWETH9',
    inputs: [
      { name: 'amountMinimum', type: 'uint256' },
      { name: 'recipient', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
] as const;

// WETH ABI for wrapping/unwrapping
export const WETH_ABI = [
  {
    type: 'function',
    name: 'deposit',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [{ name: 'wad', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;
