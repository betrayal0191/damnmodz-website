export default function AdminHomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Home</h1>
      <p className="text-neutral-400 text-sm">
        Welcome to the admin panel. Use the sidebar to navigate.
      </p>

      {/* ── Dashboard cards placeholder ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Total Users</p>
          <p className="text-2xl font-bold text-white">—</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Total Orders</p>
          <p className="text-2xl font-bold text-white">—</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Revenue</p>
          <p className="text-2xl font-bold text-white">—</p>
        </div>
      </div>
    </main>
  );
}
