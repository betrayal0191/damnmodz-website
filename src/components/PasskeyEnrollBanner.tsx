'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PasskeyEnrollBanner() {
  const supabase = createClient();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in and hasn't dismissed this banner
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Show banner if user hasn't enrolled a passkey yet
        // Check localStorage for dismissal
        const dismissed = localStorage.getItem('passkey_banner_dismissed');
        if (!dismissed) {
          setVisible(true);
        }
      }
    };
    checkSession();
  }, [supabase.auth]);

  const handleEnroll = async () => {
    setError('');
    setLoading(true);

    try {
      // Attempt to enroll a passkey via Supabase MFA
      const { error: enrollError } = await (supabase.auth.mfa as any).enroll?.({
        factorType: 'webauthn',
      }) ?? { error: { message: 'Passkey enrollment is not available on this Supabase plan.' } };

      if (enrollError) {
        setError(typeof enrollError === 'string' ? enrollError : enrollError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setVisible(false);
        localStorage.setItem('passkey_banner_dismissed', 'true');
      }, 3000);
    } catch {
      setError('Failed to register passkey. You can try again later.');
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('passkey_banner_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-zinc-800 border border-zinc-600 rounded-xl p-5 shadow-2xl animate-slide-up">
      {success ? (
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-white">Passkey registered successfully!</p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
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
              <h4 className="text-sm font-semibold text-white">Enable TouchID / FaceID</h4>
            </div>
            <button
              onClick={handleDismiss}
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
              aria-label="Dismiss"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-neutral-400 mb-3">
            Sign in faster next time with your fingerprint or face recognition.
          </p>

          {error && (
            <p className="text-red-400 text-xs mb-2">{error}</p>
          )}

          <button
            onClick={handleEnroll}
            disabled={loading}
            className="w-full py-2 bg-accent text-white text-xs font-semibold rounded-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Enable Biometrics'}
          </button>
        </>
      )}
    </div>
  );
}
