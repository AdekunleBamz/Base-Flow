import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0052ff 0%, #1e3a8a 100%)',
          borderRadius: '40px',
          fontSize: '100px',
        }}
      >
        🌊
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  );
}
