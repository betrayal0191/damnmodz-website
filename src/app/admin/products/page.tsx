'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AddProductModal from '@/components/admin/AddProductModal';
import { getProducts } from './actions';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getProducts();
    if (result.error) {
      setError(result.error);
    }
    setProducts(result.products);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Format helpers ──────────────────────────────────── */
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(price);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <main className="p-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Products</h1>
          <p className="text-neutral-400 text-sm">
            Manage your products here.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── Loading state ──────────────────────────────── */}
      {loading && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 flex justify-center">
          <svg className="animate-spin h-6 w-6 text-neutral-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* ── Error state ────────────────────────────────── */}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 text-sm mb-3">Failed to load products: {error}</p>
          <button
            onClick={fetchProducts}
            className="text-sm text-red-300 underline hover:text-red-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Empty state ────────────────────────────────── */}
      {!loading && !error && products.length === 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto mb-3 fill-none stroke-neutral-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <p className="text-neutral-500 text-sm">No products yet. Click &quot;Add Product&quot; to create one.</p>
        </div>
      )}

      {/* ── Product table ──────────────────────────────── */}
      {!loading && !error && products.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border text-neutral-400 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
                <th className="px-5 py-3 font-medium">Languages</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {/* ── Product (image + title) ──────── */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="rounded-md object-cover w-10 h-10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-dark-border flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-neutral-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                      <span className="text-white text-sm font-medium truncate max-w-[200px]">
                        {product.title}
                      </span>
                    </div>
                  </td>

                  {/* ── Category ──────────────────────── */}
                  <td className="px-5 py-3">
                    <span className="text-neutral-300 text-sm">{product.category}</span>
                  </td>

                  {/* ── Item type ─────────────────────── */}
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                      {product.item_type}
                    </span>
                  </td>

                  {/* ── Price ─────────────────────────── */}
                  <td className="px-5 py-3 text-right">
                    <span className="text-white text-sm font-medium">
                      {formatPrice(product.price)}
                    </span>
                  </td>

                  {/* ── Languages ─────────────────────── */}
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {product.languages.slice(0, 4).map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-300 uppercase"
                        >
                          {lang}
                        </span>
                      ))}
                      {product.languages.length > 4 && (
                        <span className="text-neutral-500 text-[10px]">
                          +{product.languages.length - 4}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ── Created date ──────────────────── */}
                  <td className="px-5 py-3">
                    <span className="text-neutral-400 text-sm">{formatDate(product.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Product Modal ──────────────────────────── */}
      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchProducts();
        }}
      />
    </main>
  );
}
