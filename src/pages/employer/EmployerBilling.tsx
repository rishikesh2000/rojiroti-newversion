import { useState } from "react";

const mockBillingHistory = [
  { date: "25 Jan 2026 3:02:29 AM", plan: "1 Month Plan", ordered: "Jan 25, 2026", amount: "₹ 2300", status: "Cancelled" },
  { date: "20 Jan 2026 11:15:00 AM", plan: "6 Months Plan", ordered: "Jan 20, 2026", amount: "₹ 6999", status: "Success" },
  { date: "15 Jan 2026 9:00:00 AM", plan: "1 Job Credit Package", ordered: "Jan 15, 2026", amount: "₹ 1399", status: "Success" },
];

const statusFilters = ["All", "Success", "Pending", "Failed"];

export default function EmployerBilling() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          🚀 Coming Soon
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-xl font-semibold text-amber-900">Feature Coming Soon</h2>
        <p className="mt-2 text-sm text-amber-800">The Billing system is currently under development and will be available in Phase 2.</p>
        <p className="mt-4 text-xs text-amber-700">Stay tuned for updates!</p>
      </div>

      <div className="mt-6 hidden rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                activeFilter === f
                  ? "border-primary text-primary"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-2 py-3">Date</th>
                <th className="px-2 py-3">Plan details</th>
                <th className="px-2 py-3">Applies until</th>
                <th className="px-2 py-3">Amount</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockBillingHistory.map((row, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-2 py-4 text-slate-600">{row.date}</td>
                  <td className="px-2 py-4">
                    <button type="button" className="font-medium text-primary hover:underline">
                      {row.plan}
                    </button>
                  </td>
                  <td className="px-2 py-4 text-slate-600">Ordered on: {row.ordered}</td>
                  <td className="px-2 py-4 font-semibold text-slate-900">{row.amount}</td>
                  <td className="px-2 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "Success"
                          ? "bg-green-100 text-green-700"
                          : row.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-2 py-4">
                    {row.status === "Cancelled" && (
                      <button type="button" className="text-sm font-semibold text-primary hover:underline">
                        Contact us
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
