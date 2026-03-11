/**
 * DamnModz Content Loader
 * Fetches content from /data/content.json and renders it into the DOM.
 * All images and texts are editable via the JSON file for future panel integration.
 */

(async function () {
    'use strict';

    const CONTENT_URL = '/data/content.json';

    /* ── Fetch data ─────────────────────────────────────── */
    let data;
    try {
        const res = await fetch(CONTENT_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error('[content-loader] Failed to load content:', err);
        return;                       // keep static fallback visible
    }

    /* ── Helpers ────────────────────────────────────────── */
    function esc(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function stars(rating) {
        const max = 5;
        const filled = Math.min(Math.max(Math.round(rating), 0), max);
        return '★'.repeat(filled) + '☆'.repeat(max - filled);
    }

    /* ── Header: logo ───────────────────────────────────── */
    if (data.header) {
        const h = data.header;

        if (h.logo) {
            const logoEl = document.querySelector('[data-content="logo"]');
            if (logoEl) {
                logoEl.href = h.logo.href || '/';
                logoEl.innerHTML =
                    `<span class="logo-damn">${esc(h.logo.text_left)}</span>` +
                    `<span class="logo-modz">${esc(h.logo.text_right)}</span>`;
            }
        }

        /* ── Header: nav ────────────────────────────────── */
        if (h.nav) {
            const navEl = document.querySelector('[data-content="nav"]');
            if (navEl) {
                navEl.innerHTML = h.nav
                    .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`)
                    .join('\n');
            }
        }
    }

    /* ── Featured Banners ───────────────────────────────── */
    if (data.featured_banners && data.featured_banners.length) {
        const container = document.querySelector('[data-content="featured-banner"]');
        if (container) {
            const b = data.featured_banners[0];   // first banner (carousel-ready)

            // Background image
            const bgImg = container.querySelector('.banner-image');
            if (bgImg) {
                bgImg.src = b.background_image;
                bgImg.alt = b.background_alt || '';
            }

            // Logo image
            const logoImg = container.querySelector('.banner-logo');
            if (logoImg) {
                logoImg.src = b.logo_image;
                logoImg.alt = b.logo_alt || '';
            }

            // Title
            const titleEl = container.querySelector('.banner-title');
            if (titleEl) titleEl.textContent = b.title;

            // Platforms
            const platEl = container.querySelector('.platform-badges');
            if (platEl) {
                platEl.innerHTML =
                    `<span>${esc(b.platforms_label)}</span>` +
                    b.platforms.map(p => `<span class="badge">${esc(p)}</span>`).join('');
            }

            // Description
            const descEl = container.querySelector('.banner-description');
            if (descEl) descEl.textContent = b.description;

            // CTA
            const ctaBtn = container.querySelector('.cta-button');
            if (ctaBtn) {
                ctaBtn.textContent = b.cta_text;
                ctaBtn.href = b.cta_href || '#';
            }

            // Price
            const priceEl = container.querySelector('.banner-price');
            if (priceEl) {
                priceEl.innerHTML = `${esc(b.price_label)} <strong>${esc(b.price_value)}</strong>`;
            }

            // Carousel dots (match number of banners)
            const dotsEl = container.querySelector('.carousel-dots');
            if (dotsEl) {
                dotsEl.innerHTML = data.featured_banners
                    .map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`)
                    .join('');
            }
        }
    }

    /* ── Discounted Games Sidebar ───────────────────────── */
    if (data.discounted_games) {
        const dg = data.discounted_games;
        const sidebar = document.querySelector('[data-content="discounted-sidebar"]');

        if (sidebar) {
            // Section title
            const titleEl = sidebar.querySelector('.sidebar-header h3');
            if (titleEl) titleEl.textContent = dg.section_title;

            // Game list
            const listEl = sidebar.querySelector('.game-list');
            if (listEl && dg.games) {
                listEl.innerHTML = dg.games.map(g => `
                    <a href="${esc(g.href)}" class="game-card">
                        <img src="${esc(g.thumbnail)}" alt="${esc(g.name)}" class="game-thumb">
                        <div class="game-info">
                            <span class="game-name">${esc(g.name)}</span>
                            <div class="game-rating">
                                <span class="stars">${stars(g.rating)}</span>
                            </div>
                            <span class="game-price">${esc(g.price)}</span>
                        </div>
                    </a>
                `).join('');
            }
        }
    }
})();
