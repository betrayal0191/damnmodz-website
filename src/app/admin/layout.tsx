import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { isOwner } from '@/lib/auth/owner';
import AdminSidebar from './_components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  /* Gate every /admin/* route server-side */
  if (!session?.user || !isOwner(session.user)) {
    redirect('/');
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      <AdminSidebar email={session.user.email ?? ''} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
