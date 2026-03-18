import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/banner-img/[id]
 * Serves a banner image from the banner_images table with aggressive caching.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const { rows } = await pool.query(
      'SELECT data, content_type FROM banner_images WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const { data, content_type } = rows[0];
    const buffer = Buffer.from(data, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': content_type,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[GET /api/banner-img/[id]]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
