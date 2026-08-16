import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, X } from "lucide-react";
import JobForm from "@/components/employer/JobForm";

export default function EmployerPostJob() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/employer-dashboard/jobs"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-semibold text-slate-900">Post job</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </button>
          <Link
            to="/employer-dashboard/jobs"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
          <JobForm
            fullPage
            onClose={() => navigate("/employer-dashboard/jobs")}
            onSaved={() => navigate("/employer-dashboard/jobs")}
          />
        </div>
      </div>
    </div>
  );
}
