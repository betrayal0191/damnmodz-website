interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string;
}

/** Emails that are always treated as owners (site administrators). */
const OWNER_EMAILS: string[] = [
  'business@opuskeys.com',
];

/**
 * Check whether a user is a site owner.
 *
 * A user is an owner if:
 *  1. Their role is `'owner'`, OR
 *  2. Their email is in the `OWNER_EMAILS` list
 */
export function isOwner(user: SessionUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  if (user.email && OWNER_EMAILS.includes(user.email.toLowerCase())) return true;
  return false;
}
