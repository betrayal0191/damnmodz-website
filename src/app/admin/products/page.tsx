export default function AdminProductsPage() {
  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Products</h1>
          <p className="text-neutral-400 text-sm">
            Manage your products here.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg transition-colors hover:bg-accent-hover">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── Empty state ────────────────────────────────── */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
        <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto mb-3 fill-none stroke-neutral-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <p className="text-neutral-500 text-sm">No products yet. Click &quot;Add Product&quot; to create one.</p>
      </div>
    </main>
  );
}
