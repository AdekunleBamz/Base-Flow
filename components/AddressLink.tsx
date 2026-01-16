'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AddressLinkProps {
  address: string;
  type?: 'address' | 'tx' | 'token';
  shorten?: boolean;
  showIcon?: boolean;
}

export function AddressLink({ 
  address, 
  type = 'address', 
  shorten = true,
  showIcon = true 
}: AddressLinkProps) {
  const baseUrl = 'https://basescan.org';
  const url = `${baseUrl}/${type}/${address}`;
  
  const displayAddress = shorten 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
    >
      {displayAddress}
      {showIcon && <ExternalLink className="w-3 h-3" />}
    </a>
  );
}

export default AddressLink;
