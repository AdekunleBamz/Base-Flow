import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://base-flow-4pzl0v40z-bamzzs-projects.vercel.app';

export const metadata: Metadata = {
  title: 'Baseflow | Token Swaps on Base',
  description: 'Swap WETH and USDC seamlessly on Base mainnet using Uniswap V3',
  openGraph: {
    title: 'Baseflow',
    description: 'Swap WETH ↔ USDC on Base using Uniswap V3',
    images: [`${baseUrl}/api/image`],
  },
  // Farcaster Frame v2 meta tags for MiniApp
  other: {
    // Frame v2 (MiniApp) - primary
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/api/image`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    // Launch button for MiniApp
    'fc:frame:button:1': '🌊 Launch Baseflow',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': baseUrl,
    // Fallback buttons
    'fc:frame:button:2': 'Swap WETH → USDC',
    'fc:frame:button:2:action': 'tx',
    'fc:frame:button:2:target': `${baseUrl}/api/tx?amount=0.01&from=weth&to=usdc`,
    'fc:frame:button:3': 'Swap USDC → WETH', 
    'fc:frame:button:3:action': 'tx',
    'fc:frame:button:3:target': `${baseUrl}/api/tx?amount=50&from=usdc&to=weth`,
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
