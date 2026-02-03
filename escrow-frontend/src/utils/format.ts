import BigNumber from 'bignumber.js';

// Format a large number with decimals for human display
export function formatAmount(amount: string, decimals: number = 18): string {
  const bn = new BigNumber(amount);
  const divisor = new BigNumber(10).pow(decimals);
  const formatted = bn.dividedBy(divisor);
  
  // Show up to 4 decimal places, remove trailing zeros
  return formatted.toFixed(4).replace(/\.?0+$/, '');
}

// Convert human-readable amount to blockchain amount
export function toBlockchainAmount(amount: string, decimals: number = 18): string {
  const bn = new BigNumber(amount);
  const multiplier = new BigNumber(10).pow(decimals);
  return bn.multipliedBy(multiplier).toFixed(0);
}

// Shorten address for display
export function shortenAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Get token display name from identifier
export function getTokenName(identifier: string): string {
  // Token format: TOKEN-abc123
  const parts = identifier.split('-');
  return parts[0] || identifier;
}

// Validate bech32 address format
export function isValidAddress(address: string): boolean {
  return /^erd1[a-z0-9]{58}$/.test(address);
}

// Get token decimals (default values for common tokens)
export function getTokenDecimals(identifier: string): number {
  const tokenDecimals: Record<string, number> = {
    'WEGLD-bd4d79': 18,
    'USDC-c76f1f': 6,
    'MEX-455c57': 18,
    'EGLD': 18,
  };
  return tokenDecimals[identifier] ?? 18;
}
