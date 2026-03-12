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
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  /* animation */
  const [animClass, setAnimClass] = useState('');
  const [visible, setVisible] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const switchMode = useCallback((newMode: Mode) => {
    if (newMode === mode) return;

    setAnimClass('animate-fadeOut');

    const card = cardRef.current;
    if (card) {
      const handleEnd = () => {
        card.removeEventListener('animationend', handleEnd);
        setMode(newMode);
        setStep('email');
        setEmail('');
        setError('');
        setTimeout(() => {
          setAnimClass('animate-fadeIn');

          const inner = cardRef.current;
          if (inner) {
            const done = () => {
              inner.removeEventListener('animationend', done);
              setAnimClass('');
            };
            inner.addEventListener('animationend', done, { once: true });
          }
        }, 20);
      };
      card.addEventListener('animationend', handleEnd, { once: true });
    }
  }, [mode]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: mode === 'signup',
      },
    });

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setStep('sent');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (err) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };

  const getAnimationClass = () => {
    if (animClass) return animClass;
    return '';
  };

  /* Check for error_description from callback redirect */
  useEffect(() => {
    const errDesc = searchParams.get('error_description');
    if (errDesc) {
      setError(errDesc);
    }
  }, [searchParams]);

  /* fade in on first mount */
  useEffect(() => {
    setVisible(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
  }, []);

  const isLogin = mode === 'login';
  const title = isLogin ? 'Welcome back!' : 'Create an account';
  const subtitle = isLogin
    ? 'Sign in to your DamnModz account'
    : 'Join DamnModz today';
  const switchText = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';
  const switchLabel = isLogin ? 'Sign up' : 'Log in';

  return (
    <main className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div
        ref={cardRef}
        className={`w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-8
          transition-opacity duration-300
          ${visible ? 'opacity-100' : 'opacity-0'}
          ${getAnimationClass()}`}
      >
        <h1 className="text-2xl font-bold text-white mb-1 text-center">{title}</h1>
        <p className="text-neutral-400 text-sm mb-8 text-center">{subtitle}</p>

        {step === 'email' ? (
          <>
            {/* ── Email form ───────────────────────────── */}
            <form onSubmit={handleSendLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-dark-body border border-dark-border rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-xl transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Sending link…
                  </span>
                ) : (
                  `Send magic link`
                )}
              </button>
            </form>

            {/* ── Divider ──────────────────────────────── */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-neutral-500 text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-dark-border" />
            </div>

            {/* ── Google button ─────────────────────────── */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3 bg-dark-body border border-dark-border text-white text-sm font-semibold rounded-xl transition-colors hover:bg-dark-header disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Redirecting…
                </span>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24">
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

            {/* ── Switch mode ──────────────────────────── */}
            <p className="text-center text-neutral-400 text-sm mt-6">
              {switchText}{' '}
              <button
                onClick={() => {
                  switchMode(isLogin ? 'signup' : 'login');
                  window.history.replaceState(null, '', isLogin ? '/signup' : '/login');
                }}
                className="text-accent hover:underline font-medium"
              >
                {switchLabel}
              </button>
            </p>
          </>
        ) : (
          /* ── "Check your email" step ────────────────── */
          <>
            <div className="flex justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-accent fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white text-center mt-4">
              Check your email
            </h2>
            <p className="text-neutral-400 text-sm text-center mt-2 mb-6">
              We sent a magic link to <span className="text-white font-medium">{email}</span>.
              <br />
              Click it to {isLogin ? 'sign in' : 'create your account'}.
            </p>
            <button
              onClick={() => {
                setStep('email');
                setEmail('');
                setError('');
              }}
              className="w-full py-3 bg-dark-body border border-dark-border text-white text-sm font-semibold rounded-xl transition-colors hover:bg-dark-header"
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </main>
  );
}
