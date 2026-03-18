'use server';

import { auth } from '@/lib/auth';
import { isOwner } from '@/lib/auth/owner';
import pool from '@/lib/db';
import type { HeroSlide, PromoBanner } from '@/data/hero-banners';
import {
  defaultHeroSlides,
  defaultSideBanners,
  defaultBottomBanners,
} from '@/data/hero-banners';

/* ── Types ────────────────────────────────────────────────── */

interface ActionResult {
  success: boolean;
  error?: string;
}

export interface AllBannersData {
  heroSlides: HeroSlide[];
  sideBanners: PromoBanner[];
  bottomBanners: PromoBanner[];
}

/* ── Fetch all banner groups ──────────────────────────────── */

export async function getBanners(): Promise<AllBannersData> {
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
  } catch (error: any) {
    console.error('[getBanners]', error);
    return {
      heroSlides: defaultHeroSlides,
      sideBanners: defaultSideBanners,
      bottomBanners: defaultBottomBanners,
    };
  }
}

/* ── Save all banner groups ───────────────────────────────── */

export async function saveBanners(data: AllBannersData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !isOwner(session.user)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    /* Upsert each banner group */
    const queries = [
      {
        key: 'hero_slides',
        value: JSON.stringify(data.heroSlides),
      },
      {
        key: 'side_banners',
        value: JSON.stringify(data.sideBanners),
      },
      {
        key: 'bottom_banners',
        value: JSON.stringify(data.bottomBanners),
      },
    ];

    for (const q of queries) {
      await pool.query(
        `INSERT INTO site_content (key, value)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO UPDATE SET value = $2::jsonb`,
        [q.key, q.value],
      );
    }

    return { success: true };
  } catch (error: any) {
    console.error('[saveBanners]', error);
    return { success: false, error: error.message };
  }
}

/* ── Delete an uploaded banner image from DB ──────────────── */

export async function deleteBannerImage(imageId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !isOwner(session.user)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await pool.query('DELETE FROM banner_images WHERE id = $1', [imageId]);
    return { success: true };
  } catch (error: any) {
    console.error('[deleteBannerImage]', error);
    return { success: false, error: error.message };
  }
}
