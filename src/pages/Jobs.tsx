import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { JobCard } from "@/components/site/JobCard";
import useEmployeeStore from "@/store/employeeStore";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";

export default function Jobs() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const { jobs, isLoading, error, getJobFeed, searchJobs, getApplyedJobs, appliedJobs } = useEmployeeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const filtered = jobs;

  useEffect(() => {
    // initial load - fetch public job feed
    void getJobFeed();
  }, [getJobFeed]);

  useEffect(() => {
    if (localStorage.getItem("token") && Array.isArray(appliedJobs) && appliedJobs.length === 0) {
      void getApplyedJobs();
    }
  }, [appliedJobs.length, getApplyedJobs]);

  const experienceSelections = searchParams.getAll("experience");
  const workModeSelections = searchParams.getAll("work_mode");
  const jobTypeSelections = searchParams.getAll("job_type");

  useEffect(() => {
    const normalized = (arr: string[]) => arr.map((s) => s.replace(/\u2013/g, "-").trim());
    const exp = normalized(experienceSelections);
    void searchJobs({
      keyword: undefined,
      location: undefined,
      experience: exp.length ? exp : undefined,
      work_mode: workModeSelections.length ? workModeSelections : undefined,
      job_type: jobTypeSelections.length ? jobTypeSelections : undefined,
      salary: undefined,
    });
  }, [experienceSelections.join("|"), workModeSelections.join("|"), jobTypeSelections.join("|"), searchJobs]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className={`mt-8 grid gap-6 ${showFilters ? "lg:grid-cols-[280px_1fr]" : "lg:grid-cols-[1fr]"}`}>
          {showFilters && (
            <aside className="rounded-3xl bg-card p-5 shadow-card lg:sticky lg:top-24 lg:self-start border border-border/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="rounded-full bg-secondary/10 p-2 text-muted-foreground transition hover:bg-secondary/20"
                  aria-label="Hide filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
              {[
                { key: "experience", title: "Experience", opts: ["0-1", "1-2", "2-3", "3-4", "5+"] },
                { key: "work_mode", title: "Work mode", opts: ["Remote", "Hybrid", "Onsite"] },
                { key: "job_type", title: "Job type", opts: ["Full-time", "Part-time", "Contract", "Internship"] },
              ].map((g) => {
                const selected = searchParams.getAll(g.key);
                const toggle = (opt: string) => {
                  const current = new Set(searchParams.getAll(g.key));
                  if (current.has(opt)) current.delete(opt);
                  else current.add(opt);
                  const next = new URLSearchParams();
                  // preserve other filter groups
                  const otherGroups = ["experience", "work_mode", "job_type"].filter((k) => k !== g.key);
                  otherGroups.forEach((gk) => searchParams.getAll(gk).forEach((v) => next.append(gk, v)));
                  // append current group's selections
                  Array.from(current).forEach((v) => next.append(g.key, v));
                  setSearchParams(next, { replace: true });
                };

                return (
                  <div key={g.title} className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</p>
                    <div className="flex flex-col gap-1.5">
                      {g.opts.map((o) => (
                        <label key={o} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary/10 transition text-foreground">
                          <input
                            type="checkbox"
                            checked={selected.includes(o)}
                            onChange={() => toggle(o)}
                            className="accent-primary dark:accent-cyan-accent"
                          />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </aside>
          )}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filtered.length} jobs found</p>
              <div className="flex items-center gap-2">
                {!showFilters && (
                  <button
                    type="button"
                    onClick={() => setShowFilters(true)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-secondary/10 text-muted-foreground transition hover:bg-secondary/20"
                    aria-label="Show filters"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                )}
                <div className="flex items-center gap-1 rounded-full bg-secondary/10 dark:bg-secondary/20 p-1 border border-border/20">
                  <button onClick={() => setView("grid")} className={`grid h-8 w-8 place-items-center rounded-full transition ${view === "grid" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}>
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setView("list")} className={`grid h-8 w-8 place-items-center rounded-full transition ${view === "list" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-3xl bg-card p-6 text-sm text-muted-foreground shadow-card">Loading jobs from the server…</div>
            ) : error ? (
              <div className="rounded-3xl bg-card p-6 text-sm text-amber-700 shadow-card">{error}</div>
            ) : filtered.length > 0 ? (
              <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2" : "flex flex-col gap-4"}>
                {filtered.map((job: any, index: number) => (
                  <JobCard key={String(job._id ?? job.id ?? job.job_id ?? `job-${index}`)} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-card p-6 text-sm text-muted-foreground shadow-card">No jobs are available right now. Please check back later.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
