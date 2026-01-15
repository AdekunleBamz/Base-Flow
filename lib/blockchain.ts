// Blockchain utilities

import { formatUnits, parseUnits } from 'viem';

/**
 * Format wei to ether
 */
export function weiToEther(wei: bigint, decimals: number = 18): string {
  return formatUnits(wei, decimals);
}

/**
 * Parse ether to wei
 */
export function etherToWei(ether: string, decimals: number = 18): bigint {
  return parseUnits(ether, decimals);
}

/**
 * Shorten transaction hash
 */
export function shortenTxHash(hash: string, chars: number = 6): string {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Get block explorer URL
 */
export function getExplorerUrl(type: 'tx' | 'address' | 'token', value: string): string {
  const baseUrl = 'https://basescan.org';
  return `${baseUrl}/${type}/${value}`;
}

/**
 * Check if address is contract
 */
export async function isContract(address: string, provider: any): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch {
    return false;
  }
}
