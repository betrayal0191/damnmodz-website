'use server';

import { createClient } from '@/lib/supabase/server';
import { isOwner } from '@/lib/auth/owner';
import { ITEM_TYPES, type Product, type CreateProductInput } from '@/types/product';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface GetProductsResult {
  products: Product[];
  total: number;
  error?: string;
}

/* ── Fetch paginated products (newest first) ────────────── */
export async function getProducts(
  page: number = 1,
  perPage: number = 20,
): Promise<GetProductsResult> {
  const supabase = await createClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[getProducts]', error);
    return { products: [], total: 0, error: error.message };
  }

  return { products: (data ?? []) as Product[], total: count ?? 0 };
}

/* ── Create a new product ───────────────────────────────── */
export async function createProduct(input: CreateProductInput): Promise<ActionResult> {
  /* ── Auth guard ──────────────────────────────────────── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isOwner(user)) {
    return { success: false, error: 'Unauthorized' };
  }

  /* ── Validation ──────────────────────────────────────── */
  if (!input.title.trim()) {
    return { success: false, error: 'Title is required.' };
  }
  if (input.price < 0 || isNaN(input.price)) {
    return { success: false, error: 'Price must be a positive number.' };
  }
  if (!input.description.trim() || input.description === '<p></p>') {
    return { success: false, error: 'Description is required.' };
  }
  if (!input.category.trim()) {
    return { success: false, error: 'Category is required.' };
  }
  if (input.affiliate_fee < 0 || input.affiliate_fee > 100 || isNaN(input.affiliate_fee)) {
    return { success: false, error: 'Affiliate fee must be between 0 and 100.' };
  }
  if (!ITEM_TYPES.includes(input.item_type)) {
    return { success: false, error: 'Invalid item type.' };
  }
  if (!input.content.trim()) {
    return { success: false, error: 'Content is required.' };
  }
  if (!input.languages || input.languages.length === 0) {
    return { success: false, error: 'At least one language is required.' };
  }
  for (const lang of input.languages) {
    if (!/^[a-z]{2}$/.test(lang)) {
      return { success: false, error: `Invalid language code: "${lang}". Must be 2 lowercase letters.` };
    }
  }

  /* ── Insert ──────────────────────────────────────────── */
  const { error } = await supabase.from('products').insert({
    title: input.title.trim(),
    price: input.price,
    description: input.description,
    category: input.category.trim(),
    affiliate_fee: input.affiliate_fee,
    item_type: input.item_type,
    content: input.content.trim(),
    additional_info: input.additional_info?.trim() || null,
    activation_instructions: input.activation_instructions?.trim() || null,
    languages: input.languages,
    image_url: input.image_url || null,
  });

  if (error) {
    console.error('[createProduct]', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/* ── Update an existing product ─────────────────────────── */
export async function updateProduct(id: string, input: CreateProductInput): Promise<ActionResult> {
  /* ── Auth guard ──────────────────────────────────────── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isOwner(user)) {
    return { success: false, error: 'Unauthorized' };
  }

  /* ── Validation (same as create) ─────────────────────── */
  if (!input.title.trim()) {
    return { success: false, error: 'Title is required.' };
  }
  if (input.price < 0 || isNaN(input.price)) {
    return { success: false, error: 'Price must be a positive number.' };
  }
  if (!input.description.trim() || input.description === '<p></p>') {
    return { success: false, error: 'Description is required.' };
  }
  if (!input.category.trim()) {
    return { success: false, error: 'Category is required.' };
  }
  if (input.affiliate_fee < 0 || input.affiliate_fee > 100 || isNaN(input.affiliate_fee)) {
    return { success: false, error: 'Affiliate fee must be between 0 and 100.' };
  }
  if (!ITEM_TYPES.includes(input.item_type)) {
    return { success: false, error: 'Invalid item type.' };
  }
  if (!input.content.trim()) {
    return { success: false, error: 'Content is required.' };
  }
  if (!input.languages || input.languages.length === 0) {
    return { success: false, error: 'At least one language is required.' };
  }
  for (const lang of input.languages) {
    if (!/^[a-z]{2}$/.test(lang)) {
      return { success: false, error: `Invalid language code: "${lang}". Must be 2 lowercase letters.` };
    }
  }

  /* ── Update ────────────────────────────────────────────── */
  const { error } = await supabase
    .from('products')
    .update({
      title: input.title.trim(),
      price: input.price,
      description: input.description,
      category: input.category.trim(),
      affiliate_fee: input.affiliate_fee,
      item_type: input.item_type,
      content: input.content.trim(),
      additional_info: input.additional_info?.trim() || null,
      activation_instructions: input.activation_instructions?.trim() || null,
      languages: input.languages,
      image_url: input.image_url || null,
    })
    .eq('id', id);

  if (error) {
    console.error('[updateProduct]', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
