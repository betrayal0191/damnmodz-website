import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isOwner } from '@/lib/auth/owner';
import pool from '@/lib/db';

/**
 * POST /api/banner-img
 * Accepts a file upload (multipart/form-data), stores base64 in banner_images table,
 * returns the serving URL.
 */
export async function POST(request: NextRequest) {
  /* ── Auth gate ──────────────────────────────────────── */
  const session = await auth();
  if (!session?.user || !isOwner(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    /* Validate file type */
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: PNG, JPG, WebP, GIF, SVG` },
        { status: 400 },
      );
    }

    /* Validate file size (max 5MB) */
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
    }

    /* Convert to base64 */
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');

    /* Store in DB */
    const { rows } = await pool.query(
      `INSERT INTO banner_images (data, content_type, filename)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [base64, file.type, file.name],
    );

    const id = rows[0].id;
    const url = `/api/banner-img/${id}`;

    return NextResponse.json({ url, id });
  } catch (error: any) {
    console.error('[POST /api/banner-img]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
