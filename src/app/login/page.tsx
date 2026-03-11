import { Suspense } from 'react';
import Link from 'next/link';
import EmailMagicLinkForm from '@/components/auth/EmailMagicLinkForm';
import AuthErrorBanner from '@/components/auth/AuthErrorBanner';

export const metadata = {
  title: 'Login — DamnModz',
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-50px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[2px] uppercase">
            <span className="text-white">DAMN</span>
            <span className="text-accent">MODZ</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Auth Error (e.g. expired magic link) */}
        <Suspense>
          <AuthErrorBanner />
        </Suspense>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-6">
          {/* Email Magic Link Form */}
          <EmailMagicLinkForm />
        </div>

        {/* Link to Sign Up */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
