import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { JobCard } from "@/components/site/JobCard";
import useEmployeeStore from "@/store/employeeStore";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Building2,
  Clock,
  GraduationCap,
  IndianRupee,
  MapPin,
  Share2,
  Sparkles,
  Users,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  Calendar,
  Briefcase,
} from "lucide-react";

const formatSalary = (value: any) => {
  if (value === null || value === undefined || value === "") return "Not disclosed";
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return String(value);
  return `₹${numberValue.toLocaleString()}`;
};

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const {
    recommendations,
    isLoading,
    error,
    getJobById,
    applyForJob,
    getJobCompanyProfile,
    saveJob,
    unsaveJob,
    getRecommendations,
    getSavedJobs,
    getApplyedJobs,
    appliedJobs,
    isJobSaved,
  } = useEmployeeStore();
  const [jobDetail, setJobDetail] = useState<any>(null);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSaveAction, setPendingSaveAction] = useState<null | "saving" | "removing">(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const job = jobDetail;
  const currentJobId = String(jobId ?? job?.id ?? job?._id ?? job?.job_id ?? "");
  const isSaved = isJobSaved(currentJobId);
  const isAlreadyApplied = Array.isArray(appliedJobs)
    ? appliedJobs.some((item: any) => String(item.job_id ?? item.jobId ?? item.id ?? item._id ?? item.job_id) === currentJobId)
    : false;
  const recommendedJobs = recommendations
    .filter((item: any) => String(item.id ?? item._id ?? item.job_id) !== String(jobId))
    .slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;

    let isActive = true;
    setJobDetail(null);
    setCompanyProfile(null);
    setActionMessage(null);
    setIsLoadingDetail(true);

    const loadJob = async () => {
      try {
        const fetchedJob = await getJobById(jobId);
        if (isActive) {
          setJobDetail(fetchedJob);
        }
      } catch {
        if (isActive) {
          setJobDetail(null);
        }
      } finally {
        if (isActive) {
          setIsLoadingDetail(false);
        }
      }
    };

    void loadJob();

    return () => {
      isActive = false;
    };
  }, [jobId, getJobById]);

  useEffect(() => {
    if (!jobId) return;
    void getApplyedJobs();
  }, [jobId, getApplyedJobs]);

  useEffect(() => {
    if (!job) return;

    const category = job.job_category ?? job.category ?? null;
    const skills = Array.isArray(job.skills_preference)
      ? job.skills_preference
      : typeof job.skills_preference === "string"
      ? job.skills_preference.split(",").map((skill: string) => skill.trim()).filter(Boolean)
      : Array.isArray(job.skills)
      ? job.skills
      : typeof job.skills === "string"
      ? job.skills.split(",").map((skill: string) => skill.trim()).filter(Boolean)
      : [];

    void getRecommendations({ limit: 15, category, skills });
  }, [job, getRecommendations]);

  useEffect(() => {
    void getSavedJobs();
    const employerId = job?.employer_id ?? job?.company_id ?? job?.employerId;
    if (!employerId) {
      setCompanyProfile(null);
      return;
    }

    const loadCompanyProfile = async () => {
      try {
        const response = await getJobCompanyProfile(employerId);
        const payload = response?.data?.data ?? response?.data;
        setCompanyProfile(payload?.company ?? payload?.profile ?? payload);
      } catch {
        setCompanyProfile(null);
      }
    };

    void loadCompanyProfile();
  }, [job?.employer_id, job?.company_id, job?.employerId, getJobCompanyProfile]);

  const handleApply = async () => {
    const id = String(jobId ?? job?.id ?? job?._id ?? job?.job_id ?? "");
    if (!id) {
      setActionMessage("Unable to determine job ID for application.");
      return;
    }

    if (!localStorage.getItem("token")) {
      setActionMessage("Please log in to apply for this job.");
      return;
    }

    setActionMessage(null);
    setIsApplying(true);

    try {
      await applyForJob(id);
      setActionMessage("Application submitted successfully.");
      await getApplyedJobs();
    } catch (err: any) {
      const message = err?.response?.data?.detail?.[0]?.msg || err?.response?.data?.message || err?.message || error;
      setActionMessage(message ?? "Failed to submit your application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    const id = String(jobId ?? job?.id ?? job?._id ?? job?.job_id ?? "");
    if (!id) {
      setActionMessage("Unable to determine job ID for saving.");
      return;
    }

    setActionMessage(null);
    setIsSaving(true);
    setPendingSaveAction(isSaved ? "removing" : "saving");

    try {
      if (isSaved) {
        await unsaveJob(id);
        setActionMessage("Job removed from saved list.");
      } else {
        await saveJob(id);
        setActionMessage("Job saved for later.");
      }
      await getSavedJobs();
    } catch (err: any) {
      const message = err?.response?.data?.detail?.[0]?.msg || err?.response?.data?.message || err?.message || error;
      setActionMessage(message ?? (isSaved ? "Failed to remove saved job. Please try again." : "Failed to save this job. Please try again."));
    } finally {
      setIsSaving(false);
      setPendingSaveAction(null);
    }
  };

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl p-10 text-center">
          <h1 className="text-2xl font-bold">Loading job details…</h1>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const responsibilities = Array.isArray(job?.responsibilities)
    ? job.responsibilities
    : typeof job?.responsibilities === "string"
      ? job.responsibilities.split("\n").filter(Boolean)
      : [];
  const skills = Array.isArray(job?.skills_preference)
    ? job.skills_preference
    : typeof job?.skills === "string"
      ? job.skills.split(",").map((skill: string) => skill.trim()).filter(Boolean)
      : [];

  const locationValue =
    job?.job_city ??
    (Array.isArray(job?.locations) ? job.locations.join(", ") : null) ??
    job?.address ??
    "Remote";

  const salaryLabel =
    job?.min_fixed_salary || job?.max_fixed_salary
      ? job?.min_fixed_salary && job?.max_fixed_salary && Number(job.min_fixed_salary) === Number(job.max_fixed_salary)
        ? formatSalary(job.min_fixed_salary)
        : `${formatSalary(job?.min_fixed_salary)} - ${formatSalary(job?.max_fixed_salary)}`
      : "Salary on request";

  const companyName = job?.company_name ?? job?.company ?? companyProfile?.company_name ?? "the company";
  const companyDescription =
    companyProfile?.description ??
    companyProfile?.company_description ??
    companyProfile?.about ??
    `${companyName} is a trusted employer offering ${job?.job_category ?? "this role"} opportunities.`;
  const companyLocation = companyProfile?.location ?? companyProfile?.city ?? job?.job_city ?? "India";
  const companyIndustry = companyProfile?.industry ?? job?.job_category ?? "Recruitment";
  const companyEmail = companyProfile?.email ?? job?.email ?? "Not available";
  const recruiterName = companyProfile?.recruiter_name ?? job?.recruiter_name ?? "Not available";
  const companyLogoUrl = companyProfile?.logo_url ?? job?.logo_url ?? job?.logo ?? "";
  const companyWebsite = companyProfile?.website ?? companyProfile?.company_website ?? job?.website ?? "";
  const companyFoundedYear = companyProfile?.founded_year ?? companyProfile?.founding_year ?? "";
  const companySize = companyProfile?.company_size ?? companyProfile?.size ?? "";
  const socialProfiles = companyProfile?.social_profiles ?? companyProfile?.socials ?? {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white shadow-soft"
                    style={{ background: job?.logo ?? "linear-gradient(135deg, #2d2bc7, #8b5cf6)" }}
                  >
                    {(companyName || "C")[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold md:text-3xl">{job.job_title}</h1>
                      {job?.is_urgent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                          <Sparkles className="h-3 w-3" /> Urgent
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">{job.job_category ?? "General role"}</p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        {locationValue}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                        {salaryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                        <Clock className="h-3.5 w-3.5 text-sky-500" />
                        {String(job?.total_experience_required ?? "Experience not specified")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Job type</p>
                  <p className="font-semibold text-slate-800">
                    {job?.job_type ? job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1) : "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={handleApply}
                  disabled={isApplying || isAlreadyApplied}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-soft transition duration-200 ${isAlreadyApplied ? "border border-primary bg-white text-primary cursor-not-allowed" : "bg-gradient-primary text-white hover:shadow-glow"}`}
                >
                  {isAlreadyApplied ? (
                    <>
                      <BadgeCheck className="h-4 w-4" /> Applied
                    </>
                  ) : isApplying ? (
                    "Applying…"
                  ) : (
                    "Apply now"
                  )}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isApplying || isSaving}
                  className={`inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium ${isSaving ? "opacity-60" : "hover:bg-secondary/10"}`}
                >
                  {pendingSaveAction ? (
                    pendingSaveAction === "saving" ? (
                      <BookmarkCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )
                  ) : isSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {pendingSaveAction
                    ? pendingSaveAction === "saving"
                      ? "Saving…"
                      : "Removing…"
                    : isSaved
                    ? "Saved"
                    : "Save"}
                </button>
                <button className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium hover:bg-secondary/10">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
              {actionMessage && <p className="mt-3 text-sm text-slate-600">{actionMessage}</p>}
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-bold">About the role</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {job.job_description ?? "The employer will share detailed responsibilities soon."}
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Work mode</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{job?.work_location_type ?? "Not specified"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pay type</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{job?.pay_type ?? "Fixed Only"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Education</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{job?.minimum_education ?? "Not specified"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Interview</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {job?.is_walk_in_interview ? "Walk-in interview" : "Online/phone screening"}
                  </p>
                </div>
              </div>

              {/* <h3 className="mt-6 text-base font-bold">Responsibilities</h3>
              {responsibilities.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                  {responsibilities.map((item: string, index: number) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Responsibilities will be shared once the employer publishes the role.</p>
              )} */}

              <h3 className="mt-6 text-base font-bold">Required skills</h3>
              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Skills will be listed when the role is published.</p>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-primary p-6 text-white shadow-soft">
              {/* <Building2 className="h-6 w-6" /> */}
              <div className="mt-2 flex items-center gap-3">
                {companyLogoUrl ? (
                  <img
                    src={companyLogoUrl}
                    alt={companyName}
                    className="h-10 w-10 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-lg font-bold">
                    {companyName?.[0]?.toUpperCase() ?? "C"}
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/75">Company</p>
                  <h3 className="text-lg font-bold">{companyName}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/85">{companyDescription}</p>
              <div className="mt-4 space-y-2 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{recruiterName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{companyLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  <span>{companyIndustry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{companyEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{job?.applicants_count ?? 0} applicants</span>
                </div>
              </div>

              {/* Additional Company Details */}
              <div className="mt-5 border-t border-white/20 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {companyFoundedYear && (
                    <div className="rounded-xl bg-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <p className="text-xs uppercase tracking-[0.15em] text-white/70">Founded</p>
                      </div>
                      <p className="mt-1 font-semibold">{companyFoundedYear}</p>
                    </div>
                  )}
                  {companySize && (
                    <div className="rounded-xl bg-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <p className="text-xs uppercase tracking-[0.15em] text-white/70">Company Size</p>
                      </div>
                      <p className="mt-1 font-semibold">{companySize}</p>
                    </div>
                  )}
                </div>

                {/* Website Link */}
                {companyWebsite && (
                  <a
                    href={companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}

                {/* Social Media Links */}
                {Object.keys(socialProfiles).length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs uppercase tracking-[0.15em] text-white/70">Follow Us</p>
                    <div className="flex gap-2">
                      {socialProfiles?.facebook && (
                        <a
                          href={socialProfiles.facebook.startsWith("http") ? socialProfiles.facebook : `https://${socialProfiles.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
                          title="Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {socialProfiles?.instagram && (
                        <a
                          href={socialProfiles.instagram.startsWith("http") ? socialProfiles.instagram : `https://${socialProfiles.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
                          title="Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {socialProfiles?.linkedin && (
                        <a
                          href={socialProfiles.linkedin.startsWith("http") ? socialProfiles.linkedin : `https://${socialProfiles.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {socialProfiles?.telegram && (
                        <a
                          href={socialProfiles.telegram.startsWith("http") ? socialProfiles.telegram : `https://${socialProfiles.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
                          title="Telegram"
                        >
                          <Send className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-800">Role highlights</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-indigo-500" />
                  <span>{job?.minimum_education ?? "Education preference shared by the employer"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-sky-500" />
                  <span>{job?.total_experience_required ?? "Experience requirement available soon"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>{job?.address ?? locationValue}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Recommended jobs</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((item: any) => <JobCard key={String(item.id ?? item._id ?? item.job_id)} job={item} />)
            ) : (
              <p className="text-sm text-slate-600">No recommended jobs available right now.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
