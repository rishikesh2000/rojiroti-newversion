import { useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  AlertCircle,
} from "lucide-react";
import useEmployeeStore from "@/store/employeeStore";
import { useEffect, useState } from "react";

interface JobCardProps {
  job: any;
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  // No route-based translation — rely on Google Translate widget for client-side translation
  const { isJobSaved, saveJob, unsaveJob, addSavedJob, removeSavedJob, appliedJobs } = useEmployeeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [translatedJob, setTranslatedJob] = useState(job);
  const [copy, setCopy] = useState({
    urgent: "Urgent",
    featured: "Featured",
    defaultTitle: "Untitled Role",
    defaultCategory: "General",
    defaultLocation: "Remote",
    defaultExperience: "Any",
    defaultType: "Full Time",
    noSalary: "Salary on request",
    today: "Today",
    dayAgo: "1 day ago",
    daysAgo: "days ago",
    recently: "Recently",
    applicants: "Applicants",
    applied: "Applied",
    applyNow: "Apply Now",
  });

  useEffect(() => {
    // keep a simple English copy and job data — Google Translate will handle DOM translation
    setTranslatedJob(job);
    setCopy({
      urgent: "Urgent",
      featured: "Featured",
      defaultTitle: "Untitled Role",
      defaultCategory: "General",
      defaultLocation: "Remote",
      defaultExperience: "Any",
      defaultType: "Full Time",
      noSalary: "Salary on request",
      today: "Today",
      dayAgo: "1 day ago",
      daysAgo: "days ago",
      recently: "Recently",
      applicants: "Applicants",
      applied: "Applied",
      applyNow: "Apply Now",
    });
  }, [job]);

  const safeJob = translatedJob ?? job;
  const jobId = String(safeJob?._id ?? safeJob?.id ?? safeJob?.job_id ?? "");
  const saved = isJobSaved(jobId);
  const isAlreadyApplied = Array.isArray(appliedJobs)
    ? appliedJobs.some((item: any) => String(item.job_id ?? item.jobId ?? item.id ?? item._id ?? item.job_id) === jobId)
    : false;

  const title = safeJob?.job_title ?? copy.defaultTitle;
  const category = safeJob?.job_category ?? copy.defaultCategory;

  const locationText =
    safeJob?.job_city ??
    (Array.isArray(safeJob?.locations) ? safeJob.locations.join(", ") : null) ??
    safeJob?.address ??
    copy.defaultLocation;

  const experience =
    safeJob?.total_experience_required ?? copy.defaultExperience;

  const jobType =
    safeJob?.job_type
      ? safeJob.job_type.charAt(0).toUpperCase() + safeJob.job_type.slice(1)
      : copy.defaultType;

  const applicants = safeJob?.applicants_count ?? 0;

  const skills = Array.isArray(safeJob?.skills_preference)
    ? safeJob.skills_preference
    : [];

  const featured = Boolean(safeJob?.featured ?? safeJob?.is_featured);
  const urgent = Boolean(safeJob?.is_urgent);

  let salary = copy.noSalary;

  if (safeJob?.min_fixed_salary && safeJob?.max_fixed_salary) {
    if (safeJob.min_fixed_salary === safeJob.max_fixed_salary) {
      salary = `₹${Number(safeJob.min_fixed_salary).toLocaleString()}/month`;
    } else {
      salary = `₹${Number(safeJob.min_fixed_salary).toLocaleString()} - ₹${Number(safeJob.max_fixed_salary).toLocaleString()}/month`;
    }
  }

  const postedText = safeJob?.created_at
    ? (() => {
        const created = new Date(safeJob.created_at);
        const now = new Date();
        const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

        if (diff <= 0) return copy.today;
        if (diff === 1) return copy.dayAgo;
        return `${diff} ${copy.daysAgo}`;
      })()
    : copy.recently;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/jobs/${jobId}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/jobs/${jobId}`);
        }
      }}
      className="group relative w-full cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Top Badges */}
      <div className="absolute right-15 top-6 flex gap-2">
        {urgent && (
          <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            <AlertCircle className="h-3 w-3" />
            {copy.urgent}
          </span>
        )}

        {featured && (
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {copy.featured}
          </span>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white bg-gradient-primary"
      
        >
          {category.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-slate-900 transition-colors">
            {title}
          </h3>
          <p className="text-xs font-medium text-slate-500">
            {category}
          </p>

        
        </div>

        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (isSaving) return;
            setIsSaving(true);
            try {
              if (saved) {
                await unsaveJob(jobId, false);
                removeSavedJob(jobId);
              } else {
                await saveJob(jobId, false);
                addSavedJob(job);
              }
            } catch (err) {
              // ignore, store will set error
            } finally {
              setIsSaving(false);
            }
          }}
          className="rounded-full p-2 transition hover:bg-slate-100"
          aria-label={saved ? "Saved job" : "Save job"}
        >
          {isSaving ? (
            <BookmarkCheck className="h-4 w-4 text-emerald-400 animate-pulse" />
          ) : saved ? (
            <BookmarkCheck className="h-4 w-4 text-emerald-500" />
          ) : (
            <Bookmark className="h-4 w-4 text-slate-500" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-indigo-500" />
          {locationText}
        </span>

        <span className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-green-600" />
          {salary}
        </span>

        <span className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-orange-500" />
          {experience}
        </span>

        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-500" />
          {jobType}
        </span>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">
            {applicants} {copy.applicants}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {postedText}
          </p>
        </div>

        <span className={`inline-flex items-center justify-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${isAlreadyApplied ? "border border-primary bg-white text-primary shadow-sm" : "bg-gradient-primary text-white shadow-soft hover:shadow-glow"}`}>
          {isAlreadyApplied ? (
            <>
              <BadgeCheck className="h-3.5 w-3.5" /> {copy.applied}
            </>
          ) : (
            copy.applyNow
          )}
        </span>
      </div>
    </div>
  );
}