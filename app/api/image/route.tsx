import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const swap = searchParams.get('swap');
  const status = searchParams.get('status');

  let title = 'Baseflow';
  let subtitle = 'WETH ↔ USDC on Base';
  let gradient = 'linear-gradient(135deg, #0052ff 0%, #1e3a8a 50%, #0a0b0d 100%)';
  let emoji = '🌊';
  let footer = 'Powered by Uniswap V3';

  if (swap === 'weth-usdc') {
    title = 'WETH → USDC';
    subtitle = 'Select amount to swap';
    gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    emoji = '💎';
    footer = 'Swapping WETH for USDC';
  } else if (swap === 'usdc-weth') {
    title = 'USDC → WETH';
    subtitle = 'Select amount to swap';
    gradient = 'linear-gradient(135deg, #0052ff 0%, #00d4ff 100%)';
    emoji = '💵';
    footer = 'Swapping USDC for WETH';
  } else if (status === 'success') {
    title = 'Swap Complete! ✅';
    subtitle = 'Transaction successful';
    gradient = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    emoji = '🎉';
  } else if (status === 'error') {
    title = 'Swap Failed ❌';
    subtitle = 'Please try again';
    gradient = 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)';
    emoji = '⚠️';
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: gradient,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 80px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '40px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ fontSize: 100, marginBottom: 20 }}>{emoji}</div>
          <div style={{ fontSize: 64, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 12 }}>{title}</div>
          <div style={{ fontSize: 32, color: '#555', marginBottom: 30 }}>{subtitle}</div>
          <div style={{ fontSize: 24, color: '#888' }}>{footer}</div>
          <div
            style={{
              marginTop: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#f0f0f0',
              padding: '12px 24px',
              borderRadius: '50px',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0052ff' }} />
            <div style={{ fontSize: 20, color: '#666' }}>Base Mainnet</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
