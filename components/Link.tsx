'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  showIcon?: boolean;
}

export function Link({ href, external = false, showIcon = true, children, className = '', ...props }: LinkProps) {
  const isExternal = external || href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors ${className}`}
      {...props}
    >
      {children}
      {isExternal && showIcon && <ExternalLink className="w-4 h-4" />}
    </a>
  );
}

export default Link;
