'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState(value ?? '');
  const [error, setError] = useState('');

  const handleSetUrl = () => {
    setError('');
    if (!urlInput.trim()) {
      onChange(null);
      return;
    }
    try {
      new URL(urlInput.trim());
      onChange(urlInput.trim());
    } catch {
      setError('Please enter a valid URL.');
    }
  };

  const handleRemove = () => {
    onChange(null);
    setUrlInput('');
  };

  return (
    <div>
      {value ? (
        /* ── Preview ──────────────────────────────────── */
        <div className="relative group w-full max-w-[200px]">
          <img
            src={value}
            alt="Product thumbnail"
            className="w-full aspect-square object-cover rounded-lg border border-dark-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-md text-neutral-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Remove image"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        /* ── URL Input ────────────────────────────────── */
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSetUrl(); } }}
              placeholder="Enter image URL…"
              className="flex-1 px-3 py-2 bg-zinc-800 border border-dark-border rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
            <button
              type="button"
              onClick={handleSetUrl}
              disabled={!urlInput.trim()}
              className="px-3 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Set
            </button>
          </div>
          <p className="text-neutral-500 text-xs">
            Paste an external image URL (PNG, JPG, WebP)
          </p>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
