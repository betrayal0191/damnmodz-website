import type { User } from '@supabase/supabase-js';

/** Emails that are always treated as admin. */
const ADMIN_EMAILS: string[] = [
  'business@opuskeys.com',
];

/**
 * Check whether a Supabase user has the admin role.
 *
 * A user is admin if:
 *  1. Their email is in the `ADMIN_EMAILS` list, OR
 *  2. Their `app_metadata.role` is `'admin'`
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  return user.app_metadata?.role === 'admin';
}
