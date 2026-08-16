import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { JobCard } from "@/components/site/JobCard";
import { Blobs } from "@/components/site/Blobs";
import { COMPANIES, STATS, TESTIMONIALS } from "@/lib/mock-data";
// route-based i18n removed; using English UI and Google Translate widget for client-side translation
import useEmployeeStore from "@/store/employeeStore";
import { Search, MapPin, Sparkles, ArrowRight, Apple, Smartphone, ShieldCheck, Zap, BrainCircuit, MessageSquare } from "lucide-react";
import hero from "@/assests/heroimgage.png";

export default function Landing() {
  const { nearbyJobs, isLoading, error, getNearbyJobs, getApplyedJobs, appliedJobs } = useEmployeeStore();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [translatedUi, setTranslatedUi] = useState({
    badge: "AI-powered job matching, now live",
    heroTitle1: "Find Your",
    heroTitle2: "Dream Job",
    heroTitle3: "Faster Than Ever.",
    subtitle: "Connect job seekers and recruiters on one powerful, modern hiring platform built for the next generation of work.",
    findJobs: "Find Jobs",
    hireTalent: "Hire Talent",
    searchPlaceholder: "Job title, skill, or company",
    locationPlaceholder: "City, state, or remote",
    searchJobs: "Search Jobs",
    trending: "Trending now",
    hotJobs: "Hot jobs this week",
    viewAll: "View all",
    topEmployers: "Top employers",
    employersHiring: "Featured companies hiring now",
    whyTitle: "Built for ambitious careers & teams",
    loadingJobs: "Loading hot jobs…",
    noJobs: "No hot jobs are available right now.",
  });
  const navigate = useNavigate();
  const routeLocation = useLocation();
  // route-based i18n removed; always use English UI text. Google Translate widget will handle client-side translations.

  // First: Get location
  useEffect(() => {
    const englishTexts = {
      badge: "AI-powered job matching, now live",
      heroTitle1: "Find Your",
      heroTitle2: "Dream Job",
      heroTitle3: "Faster Than Ever.",
      subtitle: "Connect job seekers and recruiters on one powerful, modern hiring platform built for the next generation of work.",
      findJobs: "Find Jobs",
      hireTalent: "Hire Talent",
      searchPlaceholder: "Job title, skill, or company",
      locationPlaceholder: "City, state, or remote",
      searchJobs: "Search Jobs",
      trending: "Trending now",
      hotJobs: "Hot jobs this week",
      viewAll: "View all",
      topEmployers: "Top employers",
      employersHiring: "Featured companies hiring now",
      whyTitle: "Built for ambitious careers & teams",
      loadingJobs: "Loading hot jobs…",
      noJobs: "No hot jobs are available right now.",
    };

    setTranslatedUi(englishTexts);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setLocationError("Geolocation not supported");
      return;
    }

    // console.log("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location obtained:", { latitude, longitude });
        setLocation({ lat: latitude, lon: longitude });
        setLocationError(null);
      },
      (error) => {
        console.log("Location error:", error.message);
        setLocationError(error.message);
      }
    );
  }, []);

  // Second: Fetch jobs when location is available or after a timeout
  useEffect(() => {
    if (location) {
      console.log("Fetching nearby jobs with location:", location);
      void getNearbyJobs(location.lat, location.lon);
    } else {
      // Fallback: fetch without location after 3 seconds
      const timer = setTimeout(() => {
        if (!location) {
          console.log("Fetching jobs without location (fallback)");
          void getNearbyJobs(5);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location, getNearbyJobs]);

  useEffect(() => {
    if (localStorage.getItem("token") && Array.isArray(appliedJobs) && appliedJobs.length === 0) {
      void getApplyedJobs();
    }
  }, [appliedJobs.length, getApplyedJobs]);

  // console.log("Current location state:", location);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const loc = locationQuery.trim();
    if (!q && !loc) return navigate("/jobs");
    
    const slug = (q || loc)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);
    
    const params = new URLSearchParams();
    if (q) params.set("keyword", q);
    if (loc) params.set("location", loc);
    params.set("queryDerived", "true");
    
    navigate(`/search/${slug}-jobs?${params.toString()}`);
    setSearchQuery("");
    setLocationQuery("");
  };

  const hotJobs = nearbyJobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${hero})` }}>
        <Blobs />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-3xl text-left md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 text-[#2d2bc7]" />
              {translatedUi.badge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl animate-fade-up [animation-delay:80ms]">
              {translatedUi.heroTitle1} <span className="text-gradient">{translatedUi.heroTitle2}</span>
              <br />{translatedUi.heroTitle3}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg animate-fade-up [animation-delay:160ms]">
              {translatedUi.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:240ms]">
              <Link to="/jobs" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.03] hover:shadow-glow">
                {translatedUi.findJobs} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/employer" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold hover:bg-white">
                {translatedUi.hireTalent}
              </Link>
            </div>
          </div>

          <div className="mt-12 max-w-4xl animate-fade-up [animation-delay:320ms]">
            <form onSubmit={handleSearch} className="glass rounded-3xl p-2 shadow-soft">
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
                    placeholder={translatedUi.searchPlaceholder} 
                  />
                </label>
                <label className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="search"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
                    placeholder={translatedUi.locationPlaceholder} 
                  />
                </label>
                <button type="submit" className="grid place-items-center rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-soft hover:shadow-glow">
                  {translatedUi.searchJobs}
                </button>
              </div>
            </form>
            {/* <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Popular:</span>
              {["React Developer", "Product Designer", "Data Scientist", "DevOps", "Remote"].map((t) => (
                <span key={t} className="cursor-pointer rounded-full bg-white px-3 py-1 shadow-card hover:bg-secondary/10">{t}</span>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3 rounded-3xl bg-gradient-primary p-6 shadow-soft md:grid-cols-4 md:gap-6 md:p-10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center text-white">
              <p className="text-3xl font-extrabold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider opacity-80 md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2d2bc7]">{translatedUi.trending}</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">{translatedUi.hotJobs}</h2>
          </div>
          <Link to="/jobs" className="hidden text-sm font-semibold text-foreground hover:text-gradient md:inline-flex items-center gap-1">
            {translatedUi.viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-3xl bg-card p-6 text-sm text-muted-foreground shadow-card">{translatedUi.loadingJobs}</div>
          ) : error ? (
            <div className="col-span-full rounded-3xl bg-card p-6 text-sm text-amber-700 shadow-card">{error}</div>
          ) : hotJobs.length > 0 ? (
            hotJobs.map((job: any, index: number) => <JobCard key={String(job.id ?? job.job_id ?? job._id ?? index)} job={job} />)
          ) : (
            <div className="col-span-full rounded-3xl bg-card p-6 text-sm text-muted-foreground shadow-card">{translatedUi.noJobs}</div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-[#2d2bc7]">{translatedUi.topEmployers}</p>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl">{translatedUi.employersHiring}</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {COMPANIES.map((c) => (
            <div key={c.name} className="group gradient-border rounded-2xl bg-card p-5 text-center shadow-card hover-lift">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl text-white font-bold" style={{ background: c.color }}>{c.name[0]}</div>
              <p className="mt-3 text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.roles} open roles</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-[#2d2bc7]">Why Roji Roti</p>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl">{translatedUi.whyTitle}</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: BrainCircuit, title: "AI Recommendations", desc: "Match with roles tailored to your skills, experience, and salary goals." },
            { icon: ShieldCheck, title: "Verified Employers", desc: "Every employer is reviewed and verified. No spam, no ghost jobs." },
            { icon: Zap, title: "Apply in Seconds", desc: "One-tap applications with your saved profile and parsed resume." },
            { icon: MessageSquare, title: "Direct Recruiter Chat", desc: "Skip the inbox. Chat with hiring managers in real time." },
            { icon: Sparkles, title: "Resume Score Analyzer", desc: "Instant feedback to make your resume recruiter-ready." },
            { icon: Smartphone, title: "Mobile-first Experience", desc: "Beautiful native-feel apps on iOS & Android. Apply on the go." },
          ].map((f) => (
            <div key={f.title} className="gradient-border p-6 hover-lift">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-[#2d2bc7]">Loved worldwide</p>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl">Stories from people who got hired</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-3xl gradient-border bg-card p-6 shadow-card hover-lift">
              <p className="text-base leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-white">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero animate-gradient p-10 text-white shadow-soft md:p-14">
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-5xl">Take Roji Roti anywhere.</h2>
              <p className="mt-3 max-w-md text-white/85">Get job alerts, chat with recruiters, and apply with one tap from our beautifully crafted mobile apps.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#" className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold">
                  <Apple className="h-5 w-5" /> App Store
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-foreground">
                  <Smartphone className="h-5 w-5" /> Google Play
                </a>
              </div>
            </div>
            <div className="relative hidden h-72 md:block">
              <div className="absolute right-4 top-4 h-64 w-40 rounded-3xl glass-dark shadow-glow animate-float" />
              <div className="absolute right-32 top-12 h-64 w-40 rounded-3xl glass-dark shadow-glow animate-float [animation-delay:-2s]" />
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl gradient-border bg-card p-10 shadow-card hover-lift">
            <h3 className="text-2xl font-bold">For Job Seekers</h3>
            <p className="mt-2 text-sm text-muted-foreground">Get matched to jobs that actually fit. Free forever.</p>
            <Link to="/signup" className="mt-5 inline-flex rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white">Create profile</Link>
          </div>
          <div className="rounded-3xl bg-gradient-primary p-10 text-white shadow-soft hover-lift">
            <h3 className="text-2xl font-bold">For Employers</h3>
            <p className="mt-2 text-sm text-white/85">Post jobs, source candidates, and hire faster with AI.</p>
            <Link to="/employer" className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-foreground">Start hiring</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
