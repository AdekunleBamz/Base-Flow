// Environment variables validation

interface EnvironmentVariables {
  NEXT_PUBLIC_WALLETCONNECT_ID: string;
  NEXT_PUBLIC_BASE_RPC_URL: string;
  NEXT_PUBLIC_CONTRACT_ADDRESS?: string;
}

function validateEnvVariables(): EnvironmentVariables {
  const errors: string[] = [];

  const NEXT_PUBLIC_WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;
  const NEXT_PUBLIC_BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';
  const NEXT_PUBLIC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!NEXT_PUBLIC_WALLETCONNECT_ID) {
    console.warn('⚠️  NEXT_PUBLIC_WALLETCONNECT_ID is not set - wallet connection may not work properly');
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return {
    NEXT_PUBLIC_WALLETCONNECT_ID: NEXT_PUBLIC_WALLETCONNECT_ID || 'baseflow-swap',
    NEXT_PUBLIC_BASE_RPC_URL,
    NEXT_PUBLIC_CONTRACT_ADDRESS,
  };
}

// Validate on module load
export const env = validateEnvVariables();

export default env;
