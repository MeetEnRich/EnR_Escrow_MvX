// Environment configuration for the Escrow dApp
export const config = {
  // Network environment
  environment: 'devnet' as const,
  
  // API endpoints
  apiUrl: 'https://devnet-api.multiversx.com',
  
  // Backend service URL (NestJS escrow-services)
  backendUrl: 'http://localhost:3001',
  
  // Smart contract address
  escrowContractAddress: 'erd1qqqqqqqqqqqqqpgq9jtpazfu5q222wxzqt9dyc8ah7q987kj5kaqzgmue8',
  
  // Chain ID
  chainId: 'D',
  
  // Common devnet tokens for the dropdown
  commonTokens: [
    { identifier: 'WEGLD-bd4d79', name: 'Wrapped EGLD', decimals: 18 },
    { identifier: 'USDC-c76f1f', name: 'USD Coin', decimals: 6 },
    { identifier: 'MEX-455c57', name: 'MEX Token', decimals: 18 },
  ],
  
  // Native auth configuration
  nativeAuth: {
    expirySeconds: 86400, // 24 hours
    tokenExpirationToastWarningSeconds: 300 // 5 min warning
  }
};

export type Environment = typeof config.environment;
