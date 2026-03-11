'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Mode = 'login' | 'signup';
type Step = 'email' | 'sent';

interface AuthCardProps {
  initialMode: Mode;
}

export default function AuthCard({ initialMode }: AuthCardProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ── Animation state ──────────────────────────────── */
  const [animating, setAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);

  /* ── Switch mode with animation ───────────────────── */
  const switchMode = useCallback((newMode: Mode) => {
    if (animating || newMode === mode) return;

    setAnimating(true);
    setSlideDirection(newMode === 'signup' ? 'left' : 'right');
    setPhase('exit');

    // After exit animation completes, swap content and enter
    setTimeout(() => {
      setMode(newMode);
      setStep('email');
      setEmail('');
      setError('');

      // Update URL without navigation
      const newPath = newMode === 'login' ? '/login' : '/signup';
      window.history.replaceState(null, '', newPath);

      setPhase('enter');

      // After enter animation completes, reset
      setTimeout(() => {
        setPhase('idle');
        setAnimating(false);
      }, 300);
    }, 250);
  }, [animating, mode]);

  /* ── Send Magic Link ──────────────────────────────── */
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setStep('sent');
  };

  /* ── Google OAuth ─────────────────────────────────── */
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleLogin = async () => {
    setGoogleError('');
    setGoogleLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setGoogleError(oauthError.message);
      setGoogleLoading(false);
    }
  };

  /* ── Animation classes ────────────────────────────── */
  const getAnimationClass = () => {
    if (phase === 'idle') return 'translate-x-0 opacity-100';
    if (phase === 'exit') {
      return slideDirection === 'left'
        ? '-translate-x-8 opacity-0'
        : 'translate-x-8 opacity-0';
    }
    if (phase === 'enter') {
      // Start from opposite side
      return 'translate-x-0 opacity-100';
    }
    return '';
  };

  /* ── Set initial enter position for enter phase ──── */
  const [enterFrom, setEnterFrom] = useState('');

  useEffect(() => {
    if (phase === 'enter') {
      // Immediately set the "from" position (no transition), then animate to center
      setEnterFrom(
        slideDirection === 'left'
          ? 'translate-x-8 opacity-0'
          : '-translate-x-8 opacity-0'
      );
      // Force a reflow, then animate to center
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterFrom('translate-x-0 opacity-100');
        });
      });
    }
  }, [phase, slideDirection]);

  const animClass =
    phase === 'enter'
      ? enterFrom
      : phase === 'exit'
        ? getAnimationClass()
        : 'translate-x-0 opacity-100';

  /* ── Mode-dependent text ──────────────────────────── */
  const isLogin = mode === 'login';
  const subtitle = isLogin ? 'Sign in to your account' : 'Create your account';
  const submitLabel = isLogin ? 'Send Link' : 'Create Account';
  const sentMessage = isLogin
    ? 'Click the link in your inbox to sign in. You can close this tab.'
    : 'Click the link in your inbox to complete sign up. You can close this tab.';
  const switchText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const switchLabel = isLogin ? 'Sign up' : 'Log in';

  return (
    <main className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[2px] uppercase">
            <span className="text-white">DAMN</span>
            <span className="text-accent">MODZ</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">{subtitle}</p>
        </div>

        {/* Auth Error (e.g. expired magic link) */}
        {authError && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-4">
            <p className="text-red-400 text-sm text-center">{decodeURIComponent(authError)}</p>
          </div>
        )}

        {/* Animated Card */}
        <div
          ref={cardRef}
          className={`bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-6 transition-all duration-300 ease-in-out ${animClass}`}
        >
          {step === 'email' ? (
            <>
              {/* Email Magic Link Form */}
              <form onSubmit={handleSendLink} className="space-y-4">
                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-sm font-medium text-neutral-400 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    submitLabel
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-700" />
                <span className="text-xs text-neutral-500 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-zinc-700" />
              </div>

              {/* Google Login */}
              <div className="w-full space-y-2">
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full py-3 bg-zinc-800 border border-zinc-600 text-white text-sm font-medium rounded-lg transition-colors hover:bg-zinc-700 hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {googleLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Redirecting...
                    </span>
                  ) : (
                    <>
                      {/* Google "G" logo */}
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                {googleError && (
                  <p className="text-red-400 text-xs text-center">{googleError}</p>
                )}
              </div>
            </>
          ) : (
            /* ── Sent Confirmation ───────────────────────── */
            <div className="space-y-4 text-center">
              {/* Email icon */}
              <div className="flex justify-center">
                <svg
                  className="h-12 w-12 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm text-neutral-400">
                  Check your email! We sent a login link to
                </p>
                <p className="text-sm text-white font-medium mt-1">{email}</p>
              </div>

              <p className="text-xs text-neutral-500">{sentMessage}</p>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setError('');
                }}
                className="w-full text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>

        {/* Switch between Login / Sign Up */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          {switchText}{' '}
          <button
            type="button"
            onClick={() => switchMode(isLogin ? 'signup' : 'login')}
            disabled={animating}
            className="text-accent hover:text-accent-hover transition-colors font-medium disabled:opacity-50"
          >
            {switchLabel}
          </button>
        </p>
      </div>
    </main>
  );
}
