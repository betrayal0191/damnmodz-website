import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Handle error params from Supabase (e.g. expired magic link)
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    const message = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${origin}/login?error=${message}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to login with a generic error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
