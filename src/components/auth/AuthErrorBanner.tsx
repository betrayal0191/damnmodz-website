'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) return null;

  return (
    <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-4">
      <p className="text-red-400 text-sm text-center">{decodeURIComponent(error)}</p>
    </div>
  );
}
