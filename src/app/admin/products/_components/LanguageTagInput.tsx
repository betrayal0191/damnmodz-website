'use client';

import { useState, useRef, type KeyboardEvent } from 'react';

interface LanguageTagInputProps {
  value: string[];
  onChange: (langs: string[]) => void;
}

export default function LanguageTagInput({ value, onChange }: LanguageTagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().slice(0, 2);
    if (tag.length === 0) return;
    if (!/^[a-z]{2}$/.test(tag)) return;
    if (value.includes(tag)) {
      setInput('');
      return;
    }
    onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-dark-card border border-dark-border rounded-lg cursor-text min-h-[42px]"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 bg-accent/15 text-accent text-xs font-semibold rounded-md uppercase"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="text-accent/60 hover:text-accent transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 2))}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input) addTag(input); }}
        placeholder={value.length === 0 ? 'Type language code + Enter (e.g. en)' : ''}
        className="bg-transparent text-white text-sm outline-none flex-1 min-w-[120px] placeholder:text-neutral-500"
        maxLength={2}
      />
    </div>
  );
}
