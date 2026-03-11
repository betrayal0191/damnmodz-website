'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Step = 'email' | 'otp';

export default function SignUpOtpForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Send OTP ─────────────────────────────────────── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setStep('otp');
    // Focus first digit input after render
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  /* ── Verify OTP ───────────────────────────────────── */
  const verifyOtp = useCallback(
    async (token: string) => {
      setError('');
      setLoading(true);

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      setLoading(false);

      if (verifyError) {
        setError(verifyError.message);
        setOtp(Array(6).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
        return;
      }

      // Mark as first-time sign-up so the passkey enrollment banner shows
      localStorage.setItem('damnmodz_first_login', 'true');

      // Success — redirect to home
      router.push('/');
      router.refresh();
    },
    [email, router, supabase.auth]
  );

  /* ── Digit Input Handlers ─────────────────────────── */
  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (digit && index === 5) {
      const fullCode = newOtp.join('');
      if (fullCode.length === 6) {
        verifyOtp(fullCode);
      }
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const newOtp = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();

    // Auto-submit if all 6 digits pasted
    if (pasted.length === 6) {
      verifyOtp(pasted);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length === 6) {
      verifyOtp(fullCode);
    } else {
      setError('Please enter all 6 digits');
    }
  };

  /* ── Render ───────────────────────────────────────── */
  return (
    <div className="w-full">
      {step === 'email' ? (
        /* ── Email Step ──────────────────────────────── */
        <form onSubmit={handleSendOtp} className="space-y-4">
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
        /* ── OTP Step ────────────────────────────────── */
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="text-center mb-2">
            <p className="text-sm text-neutral-400">
              Enter the 6-digit code sent to
            </p>
            <p className="text-sm text-white font-medium">{email}</p>
          </div>

          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(i, e)}
                disabled={loading}
                className="w-12 h-14 text-center text-2xl font-bold bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:opacity-50"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('email');
              setOtp(Array(6).fill(''));
              setError('');
            }}
            className="w-full text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Back to email
          </button>
        </form>
      )}
    </div>
  );
}
