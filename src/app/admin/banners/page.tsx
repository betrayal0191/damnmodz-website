'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import BannerEditor, { type BannerItem } from './_components/BannerEditor';
import { getBanners, saveBanners, type AllBannersData } from './actions';

/* ── Toast type ──────────────────────────────────────────── */
interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export default function AdminBannersPage() {
  const [heroSlides, setHeroSlides] = useState<BannerItem[]>([]);
  const [sideBanners, setSideBanners] = useState<BannerItem[]>([]);
  const [bottomBanners, setBottomBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  /* ── Toast state ───────────────────────────────────────── */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Collapsed sections ────────────────────────────────── */
  const [collapsed, setCollapsed] = useState({
    hero: false,
    side: false,
    bottom: false,
  });

  const toggleSection = (key: 'hero' | 'side' | 'bottom') => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ── Load banners ──────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getBanners();
      setHeroSlides(data.heroSlides as BannerItem[]);
      setSideBanners(data.sideBanners as BannerItem[]);
      setBottomBanners(data.bottomBanners as BannerItem[]);
      setLoading(false);
    })();
  }, []);

  /* ── Dirty tracking ────────────────────────────────────── */
  const handleHeroChange = useCallback((items: BannerItem[]) => {
    setHeroSlides(items);
    setDirty(true);
  }, []);

  const handleSideChange = useCallback((items: BannerItem[]) => {
    setSideBanners(items);
    setDirty(true);
  }, []);

  const handleBottomChange = useCallback((items: BannerItem[]) => {
    setBottomBanners(items);
    setDirty(true);
  }, []);

  /* ── Save all ──────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);

    const data: AllBannersData = {
      heroSlides: heroSlides.map((s) => ({
        id: s.id,
        title: s.title ?? '',
        subtitle: s.subtitle,
        buttonText: s.buttonText ?? 'Shop Now',
        image: s.image,
        href: s.href,
      })),
      sideBanners: sideBanners.map((b) => ({
        id: b.id,
        image: b.image,
        href: b.href,
        alt: b.alt ?? '',
        title: b.title,
        subtitle: b.subtitle,
      })),
      bottomBanners: bottomBanners.map((b) => ({
        id: b.id,
        image: b.image,
        href: b.href,
        alt: b.alt ?? '',
        title: b.title,
        subtitle: b.subtitle,
      })),
    };

    const result = await saveBanners(data);

    if (result.success) {
      setDirty(false);
      addToast('success', 'Banners saved successfully');
    } else {
      addToast('error', result.error ?? 'Failed to save banners');
    }

    setSaving(false);
  };

  return (
    <main className="p-8 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Banners</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage the homepage hero carousel, side banners, and bottom promo cards.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save All
            </>
          )}
        </button>
      </div>

      {/* ── Loading state ── */}
      {loading ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 flex justify-center">
          <svg className="animate-spin h-6 w-6 text-neutral-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── 1. Hero Carousel Slides ── */}
          <CollapsibleSection
            title="Hero Carousel Slides"
            count={heroSlides.length}
            collapsed={collapsed.hero}
            onToggle={() => toggleSection('hero')}
          >
            <BannerEditor
              label="Hero Carousel Slides"
              description="Main carousel at the top of the homepage. Recommended size: 1200×550px."
              items={heroSlides}
              onChange={handleHeroChange}
              fields={['title', 'subtitle', 'buttonText']}
            />
          </CollapsibleSection>

          {/* ── 2. Side Banners ── */}
          <CollapsibleSection
            title="Side Banners"
            count={sideBanners.length}
            collapsed={collapsed.side}
            onToggle={() => toggleSection('side')}
          >
            <BannerEditor
              label="Side Banners"
              description="Stacked banners to the right of the carousel (2 recommended). Size: 500×260px."
              items={sideBanners}
              onChange={handleSideChange}
              fields={['alt', 'title', 'subtitle']}
            />
          </CollapsibleSection>

          {/* ── 3. Bottom Banners ── */}
          <CollapsibleSection
            title="Bottom Banners"
            count={bottomBanners.length}
            collapsed={collapsed.bottom}
            onToggle={() => toggleSection('bottom')}
          >
            <BannerEditor
              label="Bottom Promo Cards"
              description="Row of promo cards below the carousel (3 recommended). Size: 500×280px."
              items={bottomBanners}
              onChange={handleBottomChange}
              fields={['alt', 'title', 'subtitle']}
            />
          </CollapsibleSection>
        </div>
      )}

      {/* ── Unsaved changes indicator ── */}
      {dirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm">
          You have unsaved changes
        </div>
      )}

      {/* ── Toast notifications ── */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg animate-[slideIn_0.2s_ease-out] ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {toast.type === 'success' ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 p-0.5 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ── Collapsible section wrapper ─────────────────────────── */

function CollapsibleSection({
  title,
  count,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] text-neutral-400 transition-transform ${
              collapsed ? '' : 'rotate-90'
            }`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
      </button>

      {!collapsed && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );
}
