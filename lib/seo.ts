// SEO metadata utilities

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export function generateMetadata(data: SEOMetadata) {
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords?.join(', '),
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.ogImage ? [{ url: data.ogImage }] : [],
      url: data.ogUrl,
    },
    twitter: {
      card: data.twitterCard || 'summary_large_image',
      title: data.title,
      description: data.description,
      images: data.ogImage ? [data.ogImage] : [],
    },
  };
}

export const defaultMetadata = generateMetadata({
  title: 'Baseflow - Token Swap on Base',
  description: 'Seamless token swaps on Base L2. Works as standalone app and Farcaster Frame.',
  keywords: ['Base', 'swap', 'DEX', 'crypto', 'Farcaster', 'web3'],
  ogUrl: 'https://baseflow.app',
});
