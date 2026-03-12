'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  getSiteContent,
  updateSiteContent,
  type FeaturedBanner,
  type DiscountedGamesData,
  type DiscountedGame,
} from './actions';

/* ── Toast ──────────────────────────────────────────────────── */
interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

/* ── Empty templates ────────────────────────────────────────── */
const EMPTY_BANNER: FeaturedBanner = {
  background_image: '',
  background_alt: '',
  logo_image: '',
  logo_alt: '',
  title: '',
  platforms: [],
  platforms_label: 'Available on:',
  description: '',
  cta_text: 'Take It Now!',
  cta_href: '#',
  price_label: 'Starting at',
  price_value: '',
};

const EMPTY_GAME: DiscountedGame = {
  thumbnail: '',
  name: '',
  rating: 5,
  price: '',
  href: '#',
};

/* ── Tabs ───────────────────────────────────────────────────── */
type Tab = 'banners' | 'deals';

export default function EditorPage() {
  /* ── State ─────────────────────────────────────────────────── */
  const [tab, setTab] = useState<Tab>('banners');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Featured banners
  const [banners, setBanners] = useState<FeaturedBanner[]>([]);
  const [activeBanner, setActiveBanner] = useState(0);

  // Discounted games
  const [dealsData, setDealsData] = useState<DiscountedGamesData>({ section_title: 'Discounted Games', games: [] });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Load data ─────────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [bannersRes, dealsRes] = await Promise.all([
      getSiteContent<FeaturedBanner[]>('featured_banners'),
      getSiteContent<DiscountedGamesData>('discounted_games'),
    ]);
    if (bannersRes.data) setBanners(bannersRes.data);
    if (dealsRes.data) setDealsData(dealsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Save helpers ──────────────────────────────────────────── */
  const saveBanners = async () => {
    setSaving(true);
    const res = await updateSiteContent('featured_banners', banners);
    setSaving(false);
    if (res.success) addToast('success', 'Featured banners saved successfully.');
    else addToast('error', res.error || 'Failed to save banners.');
  };

  const saveDeals = async () => {
    setSaving(true);
    const res = await updateSiteContent('discounted_games', dealsData);
    setSaving(false);
    if (res.success) addToast('success', 'Discounted games saved successfully.');
    else addToast('error', res.error || 'Failed to save deals.');
  };

  /* ── Banner helpers ────────────────────────────────────────── */
  const updateBanner = (idx: number, field: keyof FeaturedBanner, value: string | string[]) => {
    setBanners((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b)));
  };

  const addBanner = () => {
    setBanners((prev) => [...prev, { ...EMPTY_BANNER }]);
    setActiveBanner(banners.length);
  };

  const removeBanner = (idx: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== idx));
    if (activeBanner >= banners.length - 1) setActiveBanner(Math.max(0, banners.length - 2));
  };

  /* ── Deal helpers ──────────────────────────────────────────── */
  const updateGame = (idx: number, field: keyof DiscountedGame, value: string | number) => {
    setDealsData((prev) => ({
      ...prev,
      games: prev.games.map((g, i) => (i === idx ? { ...g, [field]: value } : g)),
    }));
  };

  const addGame = () => {
    setDealsData((prev) => ({ ...prev, games: [...prev.games, { ...EMPTY_GAME }] }));
  };

  const removeGame = (idx: number) => {
    setDealsData((prev) => ({ ...prev, games: prev.games.filter((_, i) => i !== idx) }));
  };

  const moveGame = (idx: number, dir: -1 | 1) => {
    setDealsData((prev) => {
      const games = [...prev.games];
      const target = idx + dir;
      if (target < 0 || target >= games.length) return prev;
      [games[idx], games[target]] = [games[target], games[idx]];
      return { ...prev, games };
    });
  };

  /* ── Platform tag input for banners ────────────────────────── */
  const [platformInput, setPlatformInput] = useState('');
  const handlePlatformKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, bannerIdx: number) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = platformInput.trim();
      if (val && !banners[bannerIdx].platforms.includes(val)) {
        updateBanner(bannerIdx, 'platforms', [...banners[bannerIdx].platforms, val]);
      }
      setPlatformInput('');
    }
  };

  const removePlatform = (bannerIdx: number, platform: string) => {
    updateBanner(bannerIdx, 'platforms', banners[bannerIdx].platforms.filter((p) => p !== platform));
  };

  /* ── Render ────────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="p-8">
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 flex justify-center">
          <svg className="animate-spin h-6 w-6 text-neutral-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </main>
    );
  }

  const banner = banners[activeBanner];

  return (
    <main className="p-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Featured, Deals &amp; Content Editor</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage homepage featured banners and discounted games sections</p>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 border-b border-dark-border">
        {([
          { key: 'banners' as Tab, label: 'Featured Banners' },
          { key: 'deals' as Tab, label: 'Discounted Games' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-accent text-accent'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Featured Banners Tab ────────────────────────────── */}
      {tab === 'banners' && (
        <div className="space-y-6">
          {/* Banner selector */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2 flex-wrap">
              {banners.map((b, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBanner(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    i === activeBanner
                      ? 'bg-accent text-white'
                      : 'bg-dark-card border border-dark-border text-neutral-400 hover:text-white'
                  }`}
                >
                  {b.title || `Banner ${i + 1}`}
                </button>
              ))}
            </div>
            <button
              onClick={addBanner}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-dark-card border border-dashed border-dark-border text-neutral-500 hover:text-white hover:border-accent transition-colors"
            >
              + Add Banner
            </button>
          </div>

          {/* Banner editor */}
          {banner && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-5">
              {/* Preview thumbnail */}
              {banner.background_image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={banner.background_image}
                    alt={banner.background_alt || 'Banner preview'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-bold text-lg">{banner.title || 'Untitled'}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Title <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => updateBanner(activeBanner, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="e.g. Dead Island 2"
                  />
                </div>

                {/* Background Image URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Background Image URL <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={banner.background_image}
                    onChange={(e) => updateBanner(activeBanner, 'background_image', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="https://..."
                  />
                </div>

                {/* Background Alt */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Background Alt Text</label>
                  <input
                    type="text"
                    value={banner.background_alt}
                    onChange={(e) => updateBanner(activeBanner, 'background_alt', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Alt text for background"
                  />
                </div>

                {/* Logo Image URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Logo Image URL</label>
                  <input
                    type="text"
                    value={banner.logo_image}
                    onChange={(e) => updateBanner(activeBanner, 'logo_image', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="/img/logo.png or https://..."
                  />
                </div>

                {/* Logo Alt */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Logo Alt Text</label>
                  <input
                    type="text"
                    value={banner.logo_alt}
                    onChange={(e) => updateBanner(activeBanner, 'logo_alt', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Alt text for logo"
                  />
                </div>

                {/* Platforms Label */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Platforms Label</label>
                  <input
                    type="text"
                    value={banner.platforms_label}
                    onChange={(e) => updateBanner(activeBanner, 'platforms_label', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Available on:"
                  />
                </div>

                {/* CTA Text */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">CTA Button Text</label>
                  <input
                    type="text"
                    value={banner.cta_text}
                    onChange={(e) => updateBanner(activeBanner, 'cta_text', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Take It Now!"
                  />
                </div>

                {/* CTA Href */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">CTA Link</label>
                  <input
                    type="text"
                    value={banner.cta_href}
                    onChange={(e) => updateBanner(activeBanner, 'cta_href', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="/product/..."
                  />
                </div>

                {/* Price Label */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Price Label</label>
                  <input
                    type="text"
                    value={banner.price_label}
                    onChange={(e) => updateBanner(activeBanner, 'price_label', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Starting at"
                  />
                </div>

                {/* Price Value */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Price Value</label>
                  <input
                    type="text"
                    value={banner.price_value}
                    onChange={(e) => updateBanner(activeBanner, 'price_value', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="USD 69.99+"
                  />
                </div>
              </div>

              {/* Description (full width) */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
                <textarea
                  value={banner.description}
                  onChange={(e) => updateBanner(activeBanner, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent resize-none"
                  placeholder="Short description of the game..."
                />
              </div>

              {/* Platforms tags */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Platforms</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {banner.platforms.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/15 text-accent text-xs font-medium rounded-full"
                    >
                      {p}
                      <button
                        onClick={() => removePlatform(activeBanner, p)}
                        className="text-accent/60 hover:text-accent"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={platformInput}
                  onChange={(e) => setPlatformInput(e.target.value)}
                  onKeyDown={(e) => handlePlatformKeyDown(e, activeBanner)}
                  className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                  placeholder="Type platform and press Enter (e.g. PC, XBOX, PS5)"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-dark-border">
                <button
                  onClick={saveBanners}
                  disabled={saving}
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  Save All Banners
                </button>

                {banners.length > 1 && (
                  <button
                    onClick={() => removeBanner(activeBanner)}
                    className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    Delete This Banner
                  </button>
                )}
              </div>
            </div>
          )}

          {banners.length === 0 && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
              <p className="text-neutral-500 text-sm">No banners yet. Click &quot;+ Add Banner&quot; to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Discounted Games Tab ────────────────────────────── */}
      {tab === 'deals' && (
        <div className="space-y-6">
          {/* Section title */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Section Title</label>
            <input
              type="text"
              value={dealsData.section_title}
              onChange={(e) => setDealsData((prev) => ({ ...prev, section_title: e.target.value }))}
              className="w-full px-3 py-2 bg-dark-body border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent max-w-md"
              placeholder="Discounted Games"
            />
          </div>

          {/* Game list */}
          <div className="space-y-3">
            {dealsData.games.map((game, idx) => (
              <div
                key={idx}
                className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-start gap-4"
              >
                {/* Thumbnail preview */}
                <div className="flex-shrink-0">
                  {game.thumbnail ? (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden">
                      <Image
                        src={game.thumbnail}
                        alt={game.name || 'Game'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-dark-body border border-dark-border flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-neutral-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="flex-1 grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={game.name}
                      onChange={(e) => updateGame(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-dark-body border border-dark-border rounded-md text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="Game name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Thumbnail URL</label>
                    <input
                      type="text"
                      value={game.thumbnail}
                      onChange={(e) => updateGame(idx, 'thumbnail', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-dark-body border border-dark-border rounded-md text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Price</label>
                    <input
                      type="text"
                      value={game.price}
                      onChange={(e) => updateGame(idx, 'price', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-dark-body border border-dark-border rounded-md text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="$49.99"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Rating</label>
                      <select
                        value={game.rating}
                        onChange={(e) => updateGame(idx, 'rating', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-dark-body border border-dark-border rounded-md text-white text-sm focus:outline-none focus:border-accent"
                      >
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Link</label>
                      <input
                        type="text"
                        value={game.href}
                        onChange={(e) => updateGame(idx, 'href', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-dark-body border border-dark-border rounded-md text-white text-sm focus:outline-none focus:border-accent"
                        placeholder="#"
                      />
                    </div>
                  </div>
                </div>

                {/* Move / Delete controls */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveGame(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveGame(idx, 1)}
                    disabled={idx === dealsData.games.length - 1}
                    className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeGame(idx)}
                    className="p-1.5 rounded-md text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Remove game"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add game + Save */}
          <div className="flex items-center gap-3">
            <button
              onClick={addGame}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-dark-card border border-dashed border-dark-border text-neutral-500 hover:text-white hover:border-accent transition-colors"
            >
              + Add Game
            </button>
            <button
              onClick={saveDeals}
              disabled={saving}
              className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Save Discounted Games
            </button>
          </div>

          {dealsData.games.length === 0 && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
              <p className="text-neutral-500 text-sm">No games yet. Click &quot;+ Add Game&quot; to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Toast container ─────────────────────────────────── */}
      <div className="fixed top-4 left-4 z-[80] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-600/90 text-white'
                : 'bg-red-600/90 text-white'
            }`}
            style={{ animation: 'slideIn 0.25s ease-out' }}
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
            {toast.message}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-70 hover:opacity-100"
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
