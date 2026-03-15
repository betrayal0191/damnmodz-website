import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/i18n/config';

/** Paths that should never be locale-prefixed */
const BYPASS_PREFIXES = ['/admin', '/auth', '/_next', '/api', '/img'];
const BYPASS_FILES = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|json)$/;

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? '';
  // Parse first matching locale from Accept-Language
  for (const part of acceptLang.split(',')) {
    const lang = part.split(';')[0].trim().substring(0, 2).toLowerCase();
    if (isValidLocale(lang)) return lang;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip bypass paths and static files
  if (
    BYPASS_PREFIXES.some((p) => pathname.startsWith(p)) ||
    BYPASS_FILES.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if path already starts with a valid locale
  const segments = pathname.split('/');
  const maybeLocale = segments[1]; // e.g. "en" from "/en/..."

  if (isValidLocale(maybeLocale)) {
    // Valid locale prefix — continue
    return NextResponse.next();
  }

  // No locale prefix — detect and redirect
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale)
      ? cookieLocale
      : getLocaleFromHeaders(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|img/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
