// API types for quote and transaction endpoints

export interface QuoteRequest {
  from: string;
  to: string;
  amount: string;
}

export interface QuoteResponse {
  outputAmount: string;
  priceImpact: string;
  route: string;
  fee: number;
  gasEstimate?: string;
  price?: number;
}

export interface TransactionRequest {
  from: string;
  to: string;
  amount: string;
  slippage?: number;
}

export interface TransactionResponse {
  chainId: string;
  method: string;
  params: {
    abi: any[];
    to: string;
    data: string;
    value: string;
  };
  attribution: boolean;
}

export interface FrameRequest {
  trustedData: {
    messageBytes: string;
  };
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    inputText?: string;
    castId: {
      fid: number;
      hash: string;
    };
  };
}

export interface FrameResponse {
  image: string;
  buttons?: Array<{
    label: string;
    action: 'post' | 'link' | 'mint' | 'tx';
    target?: string;
  }>;
  input?: {
    text: string;
  };
  postUrl?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
}
