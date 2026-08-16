import { useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { JobCard } from "@/components/site/JobCard";
import useEmployeeStore from "@/store/employeeStore";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function SearchResults() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, isLoading, error, searchJobs, getApplyedJobs, appliedJobs } = useEmployeeStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const experienceSelections = searchParams.getAll("experience");
  const workModeSelections = searchParams.getAll("work_mode");
  const jobTypeSelections = searchParams.getAll("job_type");

  const normalizeExperience = (s: string) => {
    if (!s) return s;
    return s.replace(/\u2013/g, "-").replace(/\s+/g, " ").trim();
  };
  const displayExperience = experienceSelections.map(normalizeExperience).join(", ");

  useEffect(() => {
    const mappedExperience = experienceSelections.map(normalizeExperience).filter(Boolean);
    void searchJobs({
      keyword: keyword || undefined,
      location: location || undefined,
      experience: mappedExperience.length ? mappedExperience : undefined,
      work_mode: workModeSelections.length ? workModeSelections : undefined,
      job_type: jobTypeSelections.length ? jobTypeSelections : undefined,
      salary: undefined,
    });
  }, [keyword, location, experienceSelections.join("|"), workModeSelections.join("|"), jobTypeSelections.join("|"), searchJobs]);

  useEffect(() => {
    if (localStorage.getItem("token") && Array.isArray(appliedJobs) && appliedJobs.length === 0) {
      void getApplyedJobs();
    }
  }, [appliedJobs.length, getApplyedJobs]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Search results</p>
              <h1 className="text-2xl font-bold">{keyword || "Jobs"}</h1>
              {(location || displayExperience) && (
                <p className="text-sm text-muted-foreground">
                  {location ? `Location: ${location}` : ""}
                  {location && displayExperience ? " · " : ""}
                  {displayExperience ? `Experience: ${displayExperience}` : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-background px-3 py-2 shadow-sm">
              <button
                onClick={() => setView("grid")}
                className={`rounded-full p-2 transition ${view === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-full p-2 transition ${view === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

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
              ].map((group) => {
                const selected = searchParams.getAll(group.key);
                const toggle = (opt: string) => {
                  const current = new Set(searchParams.getAll(group.key));
                  if (current.has(opt)) current.delete(opt);
                  else current.add(opt);
                  const next = new URLSearchParams();
                  // preserve keyword and location
                  if (keyword) next.set("keyword", keyword);
                  if (location) next.set("location", location);
                  // preserve any other multi params besides this group
                  const otherGroups = ["experience", "work_mode", "job_type"].filter((k) => k !== group.key);
                  otherGroups.forEach((gk) => {
                    searchParams.getAll(gk).forEach((v) => next.append(gk, v));
                  });
                  // append current group's selections
                  Array.from(current).forEach((v) => next.append(group.key, v));
                  // keep queryDerived if present
                  if (searchParams.get("queryDerived")) next.set("queryDerived", "true");
                  setSearchParams(next, { replace: true });
                };

                return (
                  <div key={group.title} className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</p>
                    <div className="flex flex-col gap-1.5">
                      {group.opts.map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary/10 transition text-foreground">
                          <input
                            type="checkbox"
                            checked={selected.includes(opt)}
                            onChange={() => toggle(opt)}
                            className="accent-primary dark:accent-cyan-accent"
                          />
                          {opt}
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
              <p className="text-sm text-muted-foreground">{jobs.length} jobs found</p>
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
              <div className="rounded-3xl bg-card p-6 text-sm text-muted-foreground shadow-card">Loading search results…</div>
            ) : error ? (
              <div className="rounded-3xl bg-card p-6 text-sm text-amber-700 shadow-card">{error}</div>
            ) : jobs.length > 0 ? (
              <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2" : "flex flex-col gap-4"}>
                {jobs.map((job: any) => (
                  <JobCard key={String(job.id ?? job.job_id)} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-card p-6 text-sm text-muted-foreground shadow-card">No jobs matched your filters.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
