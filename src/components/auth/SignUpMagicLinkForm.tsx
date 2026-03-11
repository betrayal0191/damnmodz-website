'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Step = 'email' | 'sent';

export default function SignUpMagicLinkForm() {
  const supabase = createClient();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  /* ── Render ───────────────────────────────────────── */
  return (
    <div className="w-full">
      {step === 'email' ? (
        /* ── Email Step ──────────────────────────────── */
        <form onSubmit={handleSendLink} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-400 mb-1.5">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      ) : (
        /* ── Sent Confirmation ───────────────────────── */
        <div className="space-y-4 text-center">
          {/* Email icon */}
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <div>
            <p className="text-sm text-neutral-400">
              Check your email! We sent a login link to
            </p>
            <p className="text-sm text-white font-medium mt-1">{email}</p>
          </div>

          <p className="text-xs text-neutral-500">
            Click the link in your inbox to complete sign up. You can close this tab.
          </p>

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
  );
}
