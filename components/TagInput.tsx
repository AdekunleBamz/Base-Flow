'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Add tag...',
  maxTags,
  disabled = false,
  className,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(value);
  const [input, setInput] = useState('');

  useEffect(() => {
    setTags(value);
  }, [value]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    if (maxTags && tags.length >= maxTags) return;

    const newTags = [...tags, trimmed];
    setTags(newTags);
    onChange?.(newTags);
    setInput('');
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedTags = pastedText.split(/[,\n]/).map(t => t.trim()).filter(Boolean);
    
    pastedTags.forEach(tag => addTag(tag));
  };

  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 p-3 bg-slate-900/50 border border-slate-700 rounded-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-md"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-blue-300 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      
      {(!maxTags || tags.length < maxTags) && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[120px] bg-transparent text-white placeholder-slate-500 outline-none"
        />
      )}
    </div>
  );
}
