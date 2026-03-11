import type { User } from '@supabase/supabase-js';

/** Emails that are always treated as owners (site administrators). */
const OWNER_EMAILS: string[] = [
  'business@opuskeys.com',
];

/**
 * Check whether a Supabase user is a site owner.
 *
 * A user is an owner if:
 *  1. Their email is in the `OWNER_EMAILS` list, OR
 *  2. Their `app_metadata.role` is `'owner'`
 */
export function isOwner(user: User | null): boolean {
  if (!user) return false;
  if (user.email && OWNER_EMAILS.includes(user.email.toLowerCase())) return true;
  return user.app_metadata?.role === 'owner';
}
