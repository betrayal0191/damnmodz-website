import type { User } from '@supabase/supabase-js';

/**
 * Check whether a Supabase user has the admin role.
 *
 * The role is stored in `app_metadata.role` and set via the
 * Supabase Dashboard (Authentication → Users → Edit user → app_metadata):
 *
 *   { "role": "admin" }
 */
export function isAdmin(user: User | null): boolean {
  return user?.app_metadata?.role === 'admin';
}
