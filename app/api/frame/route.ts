import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

interface FrameButton {
  label: string;
  action: 'post' | 'tx' | 'link' | 'mint';
  target?: string;
}

interface FrameResponse {
  version: string;
  image: string;
  buttons: FrameButton[];
  postUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;
    const buttonIndex = untrustedData?.buttonIndex;

    let frameResponse: FrameResponse = {
      version: 'vNext',
      image: `${BASE_URL}/api/image`,
      buttons: [],
      postUrl: `${BASE_URL}/api/frame`,
    };

    if (buttonIndex === 1) {
      frameResponse.image = `${BASE_URL}/api/image?swap=weth-usdc`;
      frameResponse.buttons = [
        { label: '0.01 WETH (~$30)', action: 'tx', target: `${BASE_URL}/api/tx?amount=0.01&from=weth&to=usdc` },
        { label: '0.05 WETH (~$150)', action: 'tx', target: `${BASE_URL}/api/tx?amount=0.05&from=weth&to=usdc` },
        { label: '0.1 WETH (~$300)', action: 'tx', target: `${BASE_URL}/api/tx?amount=0.1&from=weth&to=usdc` },
        { label: '← Back', action: 'post' },
      ];
    } else if (buttonIndex === 2) {
      frameResponse.image = `${BASE_URL}/api/image?swap=usdc-weth`;
      frameResponse.buttons = [
        { label: '50 USDC', action: 'tx', target: `${BASE_URL}/api/tx?amount=50&from=usdc&to=weth` },
        { label: '100 USDC', action: 'tx', target: `${BASE_URL}/api/tx?amount=100&from=usdc&to=weth` },
        { label: '250 USDC', action: 'tx', target: `${BASE_URL}/api/tx?amount=250&from=usdc&to=weth` },
        { label: '← Back', action: 'post' },
      ];
    } else {
      frameResponse.buttons = [
        { label: '🌊 Swap WETH → USDC', action: 'post' },
        { label: '🌊 Swap USDC → WETH', action: 'post' },
      ];
    }

    const html = generateFrameHtml(frameResponse);
    return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Invalid frame request' }, { status: 400 });
  }
}

export async function GET() {
  const frameResponse: FrameResponse = {
    version: 'vNext',
    image: `${BASE_URL}/api/image`,
    buttons: [
      { label: '🌊 Swap WETH → USDC', action: 'post' },
      { label: '🌊 Swap USDC → WETH', action: 'post' },
    ],
    postUrl: `${BASE_URL}/api/frame`,
  };

  const html = generateFrameHtml(frameResponse);
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
}

function generateFrameHtml(frame: FrameResponse): string {
  let buttonsMeta = '';
  
  frame.buttons.forEach((button, index) => {
    const buttonNum = index + 1;
    buttonsMeta += `<meta property="fc:frame:button:${buttonNum}" content="${button.label}" />\n`;
    buttonsMeta += `<meta property="fc:frame:button:${buttonNum}:action" content="${button.action}" />\n`;
    if (button.target) {
      buttonsMeta += `<meta property="fc:frame:button:${buttonNum}:target" content="${button.target}" />\n`;
    }
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${frame.image}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="${frame.postUrl}" />
  ${buttonsMeta}
  <meta property="og:image" content="${frame.image}" />
  <title>Baseflow - Token Swaps on Base</title>
</head>
<body>
  <h1>Baseflow</h1>
  <p>This page is meant to be viewed as a Farcaster Frame.</p>
</body>
</html>`;
}
