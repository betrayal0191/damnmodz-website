import type { User } from '@supabase/supabase-js';

/**
 * ⚠️  TEMPORARY FLAG — set to `true` so every authenticated user is
 *     treated as an admin.  To revert, change back to `false` or
 *     delete the flag entirely.
 */
const TEMP_ALL_USERS_ARE_ADMIN = true;

/**
 * Check whether a Supabase user has the admin role.
 *
 * The role is stored in `app_metadata.role` and set via the
 * Supabase Dashboard (Authentication → Users → Edit user → app_metadata):
 *
 *   { "role": "admin" }
 *
 * While `TEMP_ALL_USERS_ARE_ADMIN` is `true`, any authenticated user
 * (non-null) is considered an admin regardless of app_metadata.
 */
export function isAdmin(user: User | null): boolean {
  if (TEMP_ALL_USERS_ARE_ADMIN && user) return true;
  return user?.app_metadata?.role === 'admin';
}
