'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function PasskeyLoginButton() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasskeyLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Attempt WebAuthn / Passkey login
      // Note: This requires Supabase project to have WebAuthn enabled
      const { error: passkeyError } = await (supabase.auth as any).signInWithPasskey?.() ?? 
        { error: { message: 'Passkey login is not available. Please use Email OTP.' } };

      if (passkeyError) {
        setError(typeof passkeyError === 'string' ? passkeyError : passkeyError.message);
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Passkey login failed. Please try Email OTP instead.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handlePasskeyLogin}
        disabled={loading}
        className="w-full py-3 bg-zinc-800 border border-zinc-600 text-white text-sm font-medium rounded-lg transition-colors hover:bg-zinc-700 hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Authenticating...
          </span>
        ) : (
          <>
            {/* Fingerprint Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
              <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
              <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
              <path d="M8.65 22c.21-.66.45-1.32.57-2" />
              <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
              <path d="M2 16h.01" />
              <path d="M21.8 16c.2-2 .131-5.354 0-6" />
              <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
            </svg>
            Login with Biometrics
          </>
        )}
      </button>

      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}
    </div>
  );
}
