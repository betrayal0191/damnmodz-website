import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isOwner } from '@/lib/auth/owner';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  /* Re-check owner role server-side before rendering */
  if (!user || !isOwner(user)) {
    redirect('/');
  }

  return (
    <main className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="text-neutral-400 text-sm">
          Welcome, <span className="text-white font-medium">{user.email}</span>
        </p>
        <p className="text-neutral-500 text-xs">This page is under construction.</p>
      </div>
    </main>
  );
}
