import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isOwner } from '@/lib/auth/owner';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  /* Gate every /admin/* route server-side */
  if (!user || !isOwner(user)) {
    redirect('/');
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      <AdminSidebar email={user.email ?? ''} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
