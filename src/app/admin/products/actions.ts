'use server';

import { auth } from '@/lib/auth';
import { isOwner } from '@/lib/auth/owner';
import pool from '@/lib/db';
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
  try {
    const offset = (page - 1) * perPage;

    const [dataResult, countResult] = await Promise.all([
      pool.query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [perPage, offset]
      ),
      pool.query('SELECT COUNT(*) FROM products'),
    ]);

    return {
      products: dataResult.rows as Product[],
      total: parseInt(countResult.rows[0].count, 10),
    };
  } catch (error: any) {
    console.error('[getProducts]', error);
    return { products: [], total: 0, error: error.message };
  }
}

/* ── Create a new product ───────────────────────────────── */
export async function createProduct(input: CreateProductInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !isOwner(session.user)) {
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
  try {
    await pool.query(
      `INSERT INTO products (title, price, description, category, affiliate_fee, item_type, content, additional_info, activation_instructions, languages, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        input.title.trim(),
        input.price,
        input.description,
        input.category.trim(),
        input.affiliate_fee,
        input.item_type,
        input.content.trim(),
        input.additional_info?.trim() || null,
        input.activation_instructions?.trim() || null,
        input.languages,
        input.image_url || null,
      ]
    );
    return { success: true };
  } catch (error: any) {
    console.error('[createProduct]', error);
    return { success: false, error: error.message };
  }
}

/* ── Update an existing product ─────────────────────────── */
export async function updateProduct(id: string, input: CreateProductInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !isOwner(session.user)) {
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
  try {
    await pool.query(
      `UPDATE products SET title=$1, price=$2, description=$3, category=$4, affiliate_fee=$5, item_type=$6, content=$7, additional_info=$8, activation_instructions=$9, languages=$10, image_url=$11
       WHERE id=$12`,
      [
        input.title.trim(),
        input.price,
        input.description,
        input.category.trim(),
        input.affiliate_fee,
        input.item_type,
        input.content.trim(),
        input.additional_info?.trim() || null,
        input.activation_instructions?.trim() || null,
        input.languages,
        input.image_url || null,
        id,
      ]
    );
    return { success: true };
  } catch (error: any) {
    console.error('[updateProduct]', error);
    return { success: false, error: error.message };
  }
}

/* ── Delete a product ───────────────────────────────────── */
export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !isOwner(session.user)) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!id) {
    return { success: false, error: 'Product ID is required.' };
  }

  /* ── Delete ──────────────────────────────────────────── */
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return { success: true };
  } catch (error: any) {
    console.error('[deleteProduct]', error);
    return { success: false, error: error.message };
  }
}
