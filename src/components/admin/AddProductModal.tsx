'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { ITEM_TYPES, type ItemType, type CreateProductInput } from '@/types/product';
import { createProduct } from '@/app/admin/products/actions';
import RichTextEditor from './RichTextEditor';
import LanguageTagInput from './LanguageTagInput';
import ImageUpload from './ImageUpload';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/* ── Shared field label ─────────────────────────────── */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

/* ── Shared text input classes ──────────────────────── */
const inputCls =
  'w-full px-3 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-accent/50 transition-colors';

const textareaCls = `${inputCls} resize-y min-h-[80px]`;

export default function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
  /* ── Form state ─────────────────────────────────────── */
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [itemType, setItemType] = useState<ItemType>('Key');
  const [affiliateFee, setAffiliateFee] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [activationInstructions, setActivationInstructions] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* ── Reset form when modal opens ────────────────────── */
  useEffect(() => {
    if (open) {
      setTitle('');
      setPrice('');
      setCategory('');
      setItemType('Key');
      setAffiliateFee('');
      setDescription('');
      setContent('');
      setAdditionalInfo('');
      setActivationInstructions('');
      setLanguages([]);
      setImageUrl(null);
      setError('');
    }
  }, [open]);

  /* ── Close on Escape ────────────────────────────────── */
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    },
    [open, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  /* ── Lock body scroll when open ─────────────────────── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* ── Submit ─────────────────────────────────────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const input: CreateProductInput = {
      title,
      price: parseFloat(price) || 0,
      description,
      category,
      affiliate_fee: parseFloat(affiliateFee) || 0,
      item_type: itemType,
      content,
      additional_info: additionalInfo || null,
      activation_instructions: activationInstructions || null,
      languages,
      image_url: imageUrl,
    };

    const result = await createProduct(input);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* ── Backdrop ──────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* ── Panel ─────────────────────────────────────── */}
      <div className="relative w-full max-w-2xl mx-4 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto bg-dark-header border border-dark-border rounded-xl shadow-2xl">
        {/* ── Header ──────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-header border-b border-dark-border rounded-t-xl">
          <h2 className="text-lg font-bold text-white">Add Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Form ────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Thumbnail */}
          <div>
            <Label>Product Thumbnail</Label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>

          {/* Title */}
          <div>
            <Label required>Title</Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dead Island 2 — Steam Key"
              className={inputCls}
              required
            />
          </div>

          {/* Price + Affiliate Fee — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Price (USD)</Label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputCls}
                required
              />
            </div>
            <div>
              <Label required>Affiliate Fee (%)</Label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={affiliateFee}
                onChange={(e) => setAffiliateFee(e.target.value)}
                placeholder="0"
                className={inputCls}
                required
              />
            </div>
          </div>

          {/* Category + Item Type — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Category</Label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Action, RPG, FPS"
                className={inputCls}
                required
              />
            </div>
            <div>
              <Label required>Type of Item</Label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as ItemType)}
                className={inputCls}
                required
              >
                {ITEM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description — TipTap */}
          <div>
            <Label required>Description</Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Write a product description…"
            />
          </div>

          {/* Content */}
          <div>
            <Label required>Content of the Item</Label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Steam activation key, account credentials, etc."
              className={textareaCls}
              required
            />
          </div>

          {/* Additional Info */}
          <div>
            <Label>Additional Information</Label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Optional extra details about the product"
              className={textareaCls}
            />
          </div>

          {/* Activation Instructions */}
          <div>
            <Label>Activation Instructions</Label>
            <textarea
              value={activationInstructions}
              onChange={(e) => setActivationInstructions(e.target.value)}
              placeholder="Step-by-step instructions for activating the product"
              className={textareaCls}
            />
          </div>

          {/* Languages */}
          <div>
            <Label required>Languages</Label>
            <LanguageTagInput value={languages} onChange={setLanguages} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ── Footer ──────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding…
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
