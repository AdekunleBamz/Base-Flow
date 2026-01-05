import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Baseflow | Token Swaps on Base',
  description: 'Swap WETH and USDC seamlessly on Base mainnet using Uniswap V3',
  openGraph: {
    title: 'Baseflow',
    description: 'Swap WETH ↔ USDC on Base using Uniswap V3',
    images: [`${baseUrl}/api/image`],
  },
  // Farcaster Frame meta tags
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/api/image`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '🌊 Swap WETH → USDC',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': '🌊 Swap USDC → WETH',
    'fc:frame:button:2:action': 'post',
    'fc:frame:button:3': '🚀 Open App',
    'fc:frame:button:3:action': 'link',
    'fc:frame:button:3:target': baseUrl,
    'fc:frame:post_url': `${baseUrl}/api/frame`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
