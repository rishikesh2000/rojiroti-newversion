import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useEmployerStore from "@/store/employerStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import JobForm from "./JobForm";

// Map API status values to UI display labels
const mapApiStatusToUI = (apiStatus: string | undefined): string => {
  if (!apiStatus) return "Active";
  const statusMap: Record<string, string> = {
    published: "Active",
    active: "Active",
    draft: "Draft",
    under_review: "Under Review",
    underreview: "Under Review",
    expired: "Expired",
  };
  return statusMap[apiStatus.toLowerCase()] ?? "Active";
};

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Expired: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-700",
};

type JobListProps = {
  statusFilter?: string;
};

export default function JobList({ statusFilter = "all" }: JobListProps) {
  const getMyJobs = useEmployerStore((s) => s.getMyJobs);
  const deleteJob = useEmployerStore((s) => s.deleteJob);
  const jobsFromStore = useEmployerStore((s) => s.jobs);
  const [jobs, setJobs] = useState<any[]>(jobsFromStore || []);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState<any>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [pendingDeleteJob, setPendingDeleteJob] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      await getMyJobs();
      setJobs(useEmployerStore.getState().jobs || []);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!menuOpenId) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpenId]);

  const openEdit = (job: any) => {
    setEditJob(job);
    setShowJobForm(true);
    setMenuOpenId(null);
  };

  const handleDelete = (job: any) => {
    setPendingDeleteJob(job);
    setMenuOpenId(null);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteJob) return;

    const jobId = String(pendingDeleteJob._id ?? pendingDeleteJob.id ?? pendingDeleteJob.job_id ?? "");
    if (!jobId) {
      setPendingDeleteJob(null);
      return;
    }

    try {
      setDeletingId(jobId);
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => String(j._id ?? j.id ?? j.job_id) !== String(jobId)));
      await load();
    } catch {
      // keep error handled by store
    } finally {
      setDeletingId(null);
      setPendingDeleteJob(null);
    }
  };

  const onSaved = () => load();
  const allJobs = jobs;

  const filteredJobs =
    statusFilter === "all"
      ? allJobs
      : allJobs.filter((j) => mapApiStatusToUI(j.status) === statusFilter);

  const getStatusStyle = (status: string) =>
    statusStyles[status] ?? "bg-slate-100 text-slate-700";

  const getPrimaryAction = (status: string) => {
    if (status === "Select Plan") return "Finish posting";
    if (status === "Expired") return "Repost now";
    return "View applicants";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Showing {filteredJobs.length} jobs</p>

      <div className="grid gap-4">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            <p className="font-medium text-slate-600">No jobs found</p>
            <p className="mt-1 text-xs">You haven't posted any jobs yet. Create your first job to get started.</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const jobId = String(job._id ?? job.id ?? job.job_id ?? `job-${index}`);
            const status = mapApiStatusToUI(job.status);
            return (
              <div
                key={jobId}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/employer-dashboard/jobs/${jobId}`}
                        className="text-lg font-semibold text-slate-900 hover:text-primary transition text-left cursor-pointer hover:underline"
                      >
                        {String(job.job_title || "")}
                      </Link>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(status)}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {String(job.job_city || "Unknown")} · {String(job.work_location_type || "—")} · Posted on: {String(job.created_at
 ? new Date(job.created_at).toLocaleDateString() : "—")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.is_walk_in_interview && (
                        <div className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          Walk-in Interview
                        </div>
                      )}
                      {job.is_urgent && (
                        <div className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Urgent
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">
                        {job.applicants_count ?? 0}
                      </p>
                      <p className="text-xs text-slate-500">Applied to job</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">
                        {job.shortlisted_count ?? 0}
                      </p>
                      <p className="text-xs text-slate-500">Shortlisted</p>
                    </div>
                    <Link
                      to={`/employer-dashboard/jobs/${jobId}`}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 inline-block"
                    >
                      {getPrimaryAction(status)}
                    </Link>

                    <div className="relative" ref={menuOpenId === jobId ? menuRef : undefined}>
                      <button
                        type="button"
                        onClick={() => setMenuOpenId(menuOpenId === jobId ? null : jobId)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {menuOpenId === jobId && (
                        <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => openEdit(job)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit job
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(job)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            disabled={deletingId === jobId}
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingId === jobId ? "Deleting..." : "Delete job"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showJobForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <JobForm
              initial={editJob}
              onSaved={onSaved}
              onClose={() => {
                setShowJobForm(false);
                setEditJob(null);
              }}
            />
          </div>
        </div>
      )}

      <AlertDialog open={!!pendingDeleteJob} onOpenChange={(open) => !open && setPendingDeleteJob(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">Delete this job?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              This action will permanently remove {pendingDeleteJob?.job_title || "this job"} from your dashboard and it cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
              disabled={!!deletingId}
            >
              {deletingId ? "Deleting..." : "Delete job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
