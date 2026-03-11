'use client';

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type Step = 'form' | 'sent';

interface UserDropdownProps {
  /** Render prop for the trigger element. Receives toggle + open state. */
  renderTrigger?: (toggle: () => void, isOpen: boolean) => ReactNode;
}

export default function UserDropdown({ renderTrigger }: UserDropdownProps) {
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Form state ─────────────────────────────────────── */
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  /* ── Fetch current user on mount ────────────────────── */
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoadingUser(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  /* ── Close on click outside ─────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  /* ── Close on Escape ────────────────────────────────── */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

  /* ── Animate open/close ─────────────────────────────── */
  useEffect(() => {
    if (open) {
      // Clear any pending close timer
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      // Mount first, then animate in
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      // Trigger exit animation
      setVisible(false);
      // After exit animation completes, unmount and reset form
      closeTimerRef.current = setTimeout(() => {
        setMounted(false);
        setStep('form');
        setEmail('');
        setError('');
        setGoogleError('');
      }, 200);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open]);

  /* ── Send Magic Link ────────────────────────────────── */
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

  /* ── Google OAuth ───────────────────────────────────── */
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

  /* ── Sign Out ───────────────────────────────────────── */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    window.location.reload();
  };

  /* ── Toggle ─────────────────────────────────────────── */
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  /* ── Default trigger (user icon) ─────────────────────── */
  const defaultTrigger = (
    <button
      aria-label="Account"
      onClick={toggle}
      className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center group"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[18px] h-[18px] fill-none stroke-neutral-400 stroke-2 [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover:stroke-white"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </button>
  );

  return (
    <div ref={dropdownRef} className="relative flex items-center justify-center">
      {/* Trigger */}
      {renderTrigger ? renderTrigger(toggle, open) : defaultTrigger}

      {/* Dropdown Panel */}
      {mounted && (
        <div
          className={`absolute top-full -right-6 mt-5 w-72 z-50 transition-all duration-200 ease-out origin-top-right ${
            visible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-1'
          }`}
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
        >
          {/* Panel body */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="p-5 space-y-4">
              {loadingUser ? (
                /* Loading spinner */
                <div className="flex justify-center py-4">
                  <svg className="animate-spin h-5 w-5 text-neutral-400" viewBox="0 0 24 24">
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
                </div>
              ) : user ? (
                /* ── Logged-in state ──────────────────── */
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-none stroke-accent stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                      >
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-neutral-500">Signed in</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full py-2.5 bg-zinc-800 border border-zinc-600 text-neutral-300 text-sm font-medium rounded-lg transition-colors hover:bg-zinc-700 hover:text-white hover:border-zinc-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : step === 'form' ? (
                /* ── Sign-in form ─────────────────────── */
                <>
                  <p className="text-sm font-medium text-white text-center">
                    Sign In
                  </p>

                  <form onSubmit={handleSendLink} className="space-y-3">
                    <div>
                      <label
                        htmlFor="dropdown-email"
                        className="block text-xs font-medium text-neutral-400 mb-1"
                      >
                        Email Address:
                      </label>
                      <input
                        id="dropdown-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:opacity-50"
                      />
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full py-2.5 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
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
                        'Send Magic Link'
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-700" />
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">
                      or
                    </span>
                    <div className="flex-1 h-px bg-zinc-700" />
                  </div>

                  {/* Google Login */}
                  <div className="w-full space-y-2">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="w-full py-2.5 bg-zinc-800 border border-zinc-600 text-white text-sm font-medium rounded-lg transition-colors hover:bg-zinc-700 hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                    {googleError && (
                      <p className="text-red-400 text-xs text-center">{googleError}</p>
                    )}
                  </div>

                  {/* Sign up link */}
                  <p className="text-center text-xs text-neutral-500">
                    Don&apos;t have an account?{' '}
                    <a
                      href="/signup"
                      className="text-accent hover:text-accent-hover transition-colors font-medium"
                    >
                      Sign up
                    </a>
                  </p>
                </>
              ) : (
                /* ── Sent confirmation ────────────────── */
                <div className="space-y-3 text-center">
                  <div className="flex justify-center">
                    <svg
                      className="h-10 w-10 text-accent"
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
                    <p className="text-xs text-neutral-400">
                      We sent a login link to
                    </p>
                    <p className="text-sm text-white font-medium mt-0.5">{email}</p>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Check your inbox and click the link to sign in.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('form');
                      setError('');
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    ← Use a different email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

