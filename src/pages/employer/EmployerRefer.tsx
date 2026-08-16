import { Gift } from "lucide-react";

export default function EmployerRefer() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Refer & Earn</h1>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          🚀 Coming Soon
        </span>
      </div>
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-12 text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-amber-900">Feature Coming Soon</h2>
        <p className="mt-2 text-sm text-amber-800">The Refer & Earn program is currently under development and will be available in Phase 2.</p>
        <p className="mt-4 text-xs text-amber-700">Stay tuned for updates!</p>
      </div>
    </div>
  );
}
