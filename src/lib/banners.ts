import pool from '@/lib/db';
import {
  defaultHeroSlides,
  defaultSideBanners,
  defaultBottomBanners,
  type HeroSlide,
  type PromoBanner,
} from '@/data/hero-banners';

export interface AllBanners {
  heroSlides: HeroSlide[];
  sideBanners: PromoBanner[];
  bottomBanners: PromoBanner[];
}

/**
 * Fetch all banner groups from DB.
 * Falls back to static defaults when rows are missing.
 */
export async function getBannersForDisplay(): Promise<AllBanners> {
  try {
    const { rows } = await pool.query(
      `SELECT key, value FROM site_content WHERE key IN ('hero_slides', 'side_banners', 'bottom_banners')`,
    );

    const map = new Map<string, unknown>();
    for (const row of rows) {
      map.set(row.key, row.value);
    }

    return {
      heroSlides: (map.get('hero_slides') as HeroSlide[] | undefined) ?? defaultHeroSlides,
      sideBanners: (map.get('side_banners') as PromoBanner[] | undefined) ?? defaultSideBanners,
      bottomBanners: (map.get('bottom_banners') as PromoBanner[] | undefined) ?? defaultBottomBanners,
    };
  } catch (error) {
    console.error('[getBannersForDisplay]', error);
    // Return static defaults when DB is unavailable
    return {
      heroSlides: defaultHeroSlides,
      sideBanners: defaultSideBanners,
      bottomBanners: defaultBottomBanners,
    };
  }
}
