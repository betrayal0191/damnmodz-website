'use server';

import { createClient } from '@/lib/supabase/server';
import { isOwner } from '@/lib/auth/owner';

/* ── Types ──────────────────────────────────────────────────── */

export interface FeaturedBanner {
  background_image: string;
  background_alt: string;
  logo_image: string;
  logo_alt: string;
  title: string;
  platforms: string[];
  platforms_label: string;
  description: string;
  cta_text: string;
  cta_href: string;
  price_label: string;
  price_value: string;
}

export interface DiscountedGame {
  thumbnail: string;
  name: string;
  rating: number;
  price: string;
  href: string;
}

export interface DiscountedGamesData {
  section_title: string;
  games: DiscountedGame[];
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ── Read ───────────────────────────────────────────────────── */

export async function getSiteContent<T>(key: string): Promise<{ data: T | null; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`[getSiteContent] key=${key}`, error);
    return { data: null, error: error.message };
  }

  return { data: data.value as T };
}

/* ── Write ──────────────────────────────────────────────────── */

export async function updateSiteContent(key: string, value: unknown): Promise<ActionResult> {
  const supabase = await createClient();

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isOwner(user)) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    console.error(`[updateSiteContent] key=${key}`, error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
