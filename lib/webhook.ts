// Webhook utilities for Farcaster integration

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
}

export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implementation would verify HMAC signature
  return true;
}

export function createWebhookResponse(data: any) {
  return {
    success: true,
    data,
    timestamp: Date.now(),
  };
}
