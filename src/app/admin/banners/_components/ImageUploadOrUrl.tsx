'use client';

import { useState, useRef } from 'react';

interface ImageUploadOrUrlProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadOrUrl({ value, onChange }: ImageUploadOrUrlProps) {
  const [mode, setMode] = useState<'url' | 'upload'>(value ? 'url' : 'url');
  const [urlInput, setUrlInput] = useState(value ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Apply URL ─────────────────────────────────────── */
  const handleSetUrl = () => {
    setError('');
    if (!urlInput.trim()) {
      onChange('');
      return;
    }
    try {
      new URL(urlInput.trim());
      onChange(urlInput.trim());
    } catch {
      setError('Please enter a valid URL.');
    }
  };

  /* ── Upload file ───────────────────────────────────── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/banner-img', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Upload failed');
        return;
      }

      onChange(json.url);
      setUrlInput(json.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  /* ── Remove ────────────────────────────────────────── */
  const handleRemove = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative group w-full max-w-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Banner preview"
            className="w-full aspect-video object-cover rounded-lg border border-dark-border"
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
      )}

      {/* Mode tabs */}
      {!value && (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'url'
                  ? 'bg-accent/20 text-accent'
                  : 'text-neutral-400 hover:text-white bg-zinc-800'
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'upload'
                  ? 'bg-accent/20 text-accent'
                  : 'text-neutral-400 hover:text-white bg-zinc-800'
              }`}
            >
              Upload
            </button>
          </div>

          {mode === 'url' ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSetUrl(); } }}
                placeholder="https://example.com/image.jpg"
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
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-dark-border rounded-lg text-sm text-neutral-300 hover:text-white hover:border-accent/50 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Choose file (max 5MB)
                  </>
                )}
              </button>
              <p className="text-neutral-500 text-xs mt-1">PNG, JPG, WebP, GIF, SVG</p>
            </div>
          )}
        </>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
