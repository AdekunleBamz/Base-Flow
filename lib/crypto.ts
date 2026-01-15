// Crypto utilities for hashing and encoding

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export function encodeBase64(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

export function decodeBase64(str: string): string {
  if (typeof atob !== 'undefined') {
    return atob(str);
  }
  return Buffer.from(str, 'base64').toString();
}

export function generateRandomId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
