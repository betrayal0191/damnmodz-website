'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  /* ── Close on Escape ─────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, lightboxOpen]);

  /* ── Reset lightbox when modal closes ────────────────── */
  useEffect(() => {
    if (!open) setLightboxOpen(false);
  }, [open]);

  /* ── Lock body scroll ────────────────────────────────── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !product) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(price);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ── Backdrop ──────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── Modal card ───────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] mx-4 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h2 className="text-lg font-bold text-white truncate pr-4">Product Details</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body (scrollable) ──────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* ── Image + Title row ────────────────────── */}
          <div className="flex gap-5">
            {product.image_url ? (
              <button
                onClick={() => setLightboxOpen(true)}
                className="flex-shrink-0 rounded-xl overflow-hidden border border-dark-border hover:border-accent/50 transition-colors cursor-zoom-in"
                title="Click to enlarge"
              >
                <Image
                  src={product.image_url}
                  alt={product.title}
                  width={100}
                  height={150}
                  className="object-cover w-[100px] h-[150px]"
                />
              </button>
            ) : (
              <div className="w-[100px] h-[150px] rounded-xl bg-dark-body border border-dark-border flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-neutral-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 break-words">{product.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent">
                  {product.item_type}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-800 text-neutral-300">
                  {product.category}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{formatPrice(product.price)}</p>
            </div>
          </div>

          {/* ── Info grid ────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Affiliate Fee" value={`${product.affiliate_fee}%`} />
            <InfoCard label="Item Type" value={product.item_type} />
            <InfoCard label="Created" value={formatDate(product.created_at)} />
            <InfoCard label="Updated" value={formatDate(product.updated_at)} />
          </div>

          {/* ── Languages ────────────────────────────── */}
          {product.languages.length > 0 && (
            <Section title="Languages">
              <div className="flex gap-1.5 flex-wrap">
                {product.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-800 text-neutral-300 uppercase"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* ── Description (HTML) ───────────────────── */}
          <Section title="Description">
            <div
              className="prose prose-invert prose-sm max-w-none text-neutral-300 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </Section>

          {/* ── Content ──────────────────────────────── */}
          <Section title="Content">
            <p className="text-neutral-300 text-sm whitespace-pre-wrap break-words">{product.content}</p>
          </Section>

          {/* ── Additional Info ───────────────────────── */}
          {product.additional_info && (
            <Section title="Additional Info">
              <p className="text-neutral-300 text-sm whitespace-pre-wrap break-words">{product.additional_info}</p>
            </Section>
          )}

          {/* ── Activation Instructions ──────────────── */}
          {product.activation_instructions && (
            <Section title="Activation Instructions">
              <p className="text-neutral-300 text-sm whitespace-pre-wrap break-words">{product.activation_instructions}</p>
            </Section>
          )}

          {/* ── Product ID ───────────────────────────── */}
          <div className="pt-2 border-t border-dark-border">
            <p className="text-neutral-500 text-xs font-mono">ID: {product.id}</p>
          </div>
        </div>
      </div>

      {/* ── Image lightbox ───────────────────────────── */}
      {lightboxOpen && product.image_url && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-[80vw] max-h-[90vh]">
            <Image
              src={product.image_url}
              alt={product.title}
              width={600}
              height={900}
              className="object-contain max-w-[80vw] max-h-[90vh] rounded-2xl shadow-2xl"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-full bg-dark-card border border-dark-border text-neutral-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helper components ─────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-dark-body border border-dark-border rounded-lg px-4 py-3">
      <p className="text-neutral-500 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}
