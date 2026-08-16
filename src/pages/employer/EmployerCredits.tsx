import { useState } from "react";
import { Link } from "react-router-dom";
import { PiggyBank } from "lucide-react";
import useEmployerStore from "@/store/employerStore";

const mockTransactions = [
  { type: "Coins Added", detail: "Purchased", coins: "+ 399", status: "Success", date: "24 Jan 2024 5:05:16 PM" },
  { type: "Coins Spent", detail: "Posted Job #229241423", coins: "- 150", status: "Success", date: "22 Jan 2024 3:12:00 PM" },
  { type: "Coins Expired", detail: "Due to expiry of validity period", coins: "- 50", status: "Success", date: "20 Jan 2024 12:00:00 AM" },
  { type: "Coins Added", detail: "Complimentary from Roji Roti", coins: "+ 500", status: "Success", date: "15 Jan 2024 10:30:00 AM" },
  { type: "Coins Added", detail: "Purchased", coins: "+ 399", status: "Failed", date: "10 Jan 2024 2:45:00 PM", action: "Contact us" },
];

const filterChips = ["All", "Coins added", "Coins spent", "Coins returned", "Invoices", "Failed transactions", "Pending transactions"];

export default function EmployerCredits() {
  const { dashboard } = useEmployerStore();
  const creditBalance = dashboard?.credit_balance ?? 0;
  const [activeTab, setActiveTab] = useState<"credits" | "previous">("credits");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showBanner, setShowBanner] = useState(true);

  const hasCredits = creditBalance > 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Credits & Usage</h1>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          🚀 Coming Soon
        </span>
      </div>

      {!hasCredits && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-xl font-semibold text-amber-900">Feature Coming Soon</h2>
          <p className="mt-2 text-sm text-amber-800">The Credits & Usage system is currently under development and will be available in Phase 2.</p>
          <p className="mt-4 text-xs text-amber-700">Stay tuned for updates!</p>
        </div>
      )}

      {showBanner && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-600">
            This feature is currently in development and will be available soon.
          </p>
          <button type="button" onClick={() => setShowBanner(false)} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {hasCredits && (
        <>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("credits")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                activeTab === "credits" ? "text-slate-900" : "bg-primary/10 text-primary"
              }`}
            >
              Credits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("previous")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                activeTab === "previous" ? "text-slate-900" : "bg-primary/10 text-primary"
              }`}
            >
              Previous coins
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Available balance</p>
            <p className="text-3xl font-bold text-primary">{creditBalance} credits</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                  activeFilter === chip
                    ? "border-primary text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary/30"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Transaction details</th>
                  <th className="px-4 py-3">Coins</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{tx.type}</p>
                      <p className="text-xs text-slate-500">{tx.detail}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{tx.coins}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tx.status === "Success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{tx.date}</td>
                    <td className="px-4 py-4">
                      {tx.action && (
                        <button type="button" className="text-sm font-semibold text-primary hover:underline">
                          {tx.action}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
