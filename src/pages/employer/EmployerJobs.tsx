import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import JobList from "@/components/employer/JobList";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "Active", label: "Active" },
   { key: "Draft", label: "Draft" },
  { key: "Under Review", label: "Under Review" },
  { key: "Expired", label: "Expired" },
 
];

export default function EmployerJobs() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [postMenuOpen, setPostMenuOpen] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <span className="font-medium">Pending Actions (1)</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          All Jobs
        </h1>

        <div
          className="relative"
          onMouseEnter={() => setPostMenuOpen(true)}
          onMouseLeave={() => setPostMenuOpen(false)}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft"
          >
            Post a new job
            <ChevronDown className="h-4 w-4" />
          </button>

          {postMenuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <Link
                to="/employer-dashboard/post-job"
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-50"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Start with new post</p>
                  <p className="text-xs text-slate-500">Use our blank form to create your job</p>
                </div>
                <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
        >
          All Filters
        </button>
        {statusFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              statusFilter === f.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <JobList statusFilter={statusFilter} />
    </div>
  );
}
