// Image optimization utilities

export function getOptimizedImageUrl(
  src: string,
  width?: number,
  quality: number = 75
): string {
  if (!src.startsWith('http')) return src;
  
  const url = new URL(src);
  if (width) url.searchParams.set('w', width.toString());
  url.searchParams.set('q', quality.toString());
  
  return url.toString();
}

export function generateImageSrcSet(src: string, widths: number[]): string {
  return widths
    .map(width => `${getOptimizedImageUrl(src, width)} ${width}w`)
    .join(', ');
}

export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}
