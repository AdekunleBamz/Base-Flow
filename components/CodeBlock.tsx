'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = false,
  fileName,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('rounded-lg overflow-hidden bg-slate-950 border border-slate-800', className)}>
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
          <span className="text-sm text-slate-400 font-mono">{fileName}</span>
          <span className="text-xs text-slate-500 uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors z-10"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-slate-400" />
          )}
        </button>

        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-slate-300 font-mono">
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td className="pr-4 text-slate-600 text-right select-none w-8">
                        {i + 1}
                      </td>
                      <td>{line || '\n'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
