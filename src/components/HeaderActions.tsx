'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import UserDropdown from '@/components/UserDropdown';

export default function HeaderActions() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoaded(true);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="flex items-center gap-5">
      {/* Sign In (with dropdown) / Sign Up — only when NOT logged in */}
      {loaded && !user && (
        <div className="flex items-center gap-0 whitespace-nowrap">
          <UserDropdown
            mode="signin"
            renderTrigger={(toggle) => (
              <button
                onClick={toggle}
                className="bg-transparent border-none cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}
          />
          <span className="text-sm text-neutral-400 mx-1">/</span>
          <UserDropdown
            mode="signup"
            renderTrigger={(toggle) => (
              <button
                onClick={toggle}
                className="bg-transparent border-none cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Sign Up
              </button>
            )}
          />
        </div>
      )}

      {/* User dropdown (only when logged in — shows account info) */}
      {loaded && user && <UserDropdown />}

      {/* Wishlist — only when logged in */}
      {loaded && user && (
        <button
          aria-label="Wishlist"
          className="relative bg-transparent border-none cursor-pointer p-0 flex items-center justify-center group"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[20px] h-[20px] fill-none stroke-neutral-400 stroke-2 [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover:stroke-white"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </button>
      )}

      {/* Cart (always visible, rightmost) */}
      <Link href="#" className="flex items-center gap-2 no-underline group">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="w-[20px] h-[20px] fill-none stroke-neutral-400 stroke-2 [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover:stroke-white"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </div>
        <span className="text-sm text-neutral-400 transition-colors group-hover:text-white whitespace-nowrap">
          / $0.00
        </span>
      </Link>
    </div>
  );
}
