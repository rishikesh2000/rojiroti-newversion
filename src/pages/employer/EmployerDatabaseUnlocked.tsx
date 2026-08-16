export default function EmployerDatabaseUnlocked() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Unlocked Candidates</h1>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          🚀 Coming Soon
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-xl font-semibold text-amber-900">Feature Coming Soon</h2>
        <p className="mt-2 text-sm text-amber-800">Unlocked candidates will be available in Phase 2.</p>
        <p className="mt-4 text-xs text-amber-700">Stay tuned for updates!</p>
      </div>
    </div>
  );
}
