import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '600px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0b0d 0%, #0f172a 50%, #0a0b0d 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌊</div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>Baseflow</div>
        <div style={{ fontSize: '20px', color: '#94a3b8', marginTop: '10px' }}>Token Swaps on Base</div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}
