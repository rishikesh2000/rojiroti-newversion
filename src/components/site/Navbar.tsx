import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, X, DownloadCloud, LifeBuoy, Search, User, MapPin, Layers, Globe } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { clearSession, useSession } from "@/lib/session";
import useEmployeeStore from "@/store/employeeStore";
import useEmployerStore from "@/store/employerStore";
// Removed route-based i18n in favor of Google Translate widget
import GoogleTranslate from "@/components/GoogleTranslate";
import logo from "../../assests/logo.png";
import mlogo from "../../assests/mlogo.png";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const languageRef = useRef<HTMLDivElement | null>(null);
  const loginRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");

  const handleLanguageChange = (lang: "en" | "hi") => {
    setSelectedLanguage(lang);
    setLanguageMenuOpen(false);

    const cookieValue = lang === "hi" ? "/en/hi" : "/en/en";
    document.cookie = `googtrans=${cookieValue};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = lang;

    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = lang === "hi" ? "hi" : "en";
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      // Some browsers and the Google widget may need a full reload to apply translation reliably.
      if (typeof window !== "undefined") {
        setTimeout(() => window.location.reload(), 120);
      }
      return;
    }

    // If combo isn't present, ensure cookie is set and reload so Google Translate picks it up on load
    if (typeof window !== "undefined") {
      setTimeout(() => window.location.reload(), 120);
    }
  };

  const locale = selectedLanguage;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    const value = match ? decodeURIComponent(match[1]) : "";

    if (!match || value === "/en/en") {
      document.cookie = "googtrans=/en/en;path=/;max-age=31536000";
      setSelectedLanguage("en");
      return;
    }

    setSelectedLanguage(value.includes("/en/hi") ? "hi" : "en");
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const el = profileRef.current;
      if (el && !el.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!loginMenuOpen) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const el = loginRef.current;
      if (el && !el.contains(e.target as Node)) {
        setLoginMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLoginMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [loginMenuOpen]);

  const searchParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("keyword") || "");
  const [locationQuery, setLocationQuery] = useState(() => searchParams.get("location") || "");
  const [experienceQuery, setExperienceQuery] = useState(() => searchParams.get("experience") || "");
  const experienceOptions = [
    { value: "0-1", label: "0-1 yrs" },
    { value: "1-2", label: "1-2 yrs" },
    { value: "2-3", label: "2-3 yrs" },
    { value: "3-4", label: "3-4 yrs" },
    { value: "5+", label: "5+ yrs" },
  ];
  const { user } = useEmployeeStore();
  const { employer } = useEmployerStore();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const sessionRole = session?.role;
  const inferredRole = sessionRole ?? (employer ? "employer" : user ? "employee" : undefined);
  const isAuthenticated = Boolean(token && inferredRole);
  const profileName =
    session?.name ||
    user?.name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    employer?.name ||
    `${employer?.first_name || ""} ${employer?.last_name || ""}`.trim() ||
    "User";
  const profileInitial = profileName.charAt(0).toUpperCase();
  const avatarUrl = session?.avatar || user?.avatar || employer?.avatar;

  const links = [
    { to: "/jobs", label: "Find Jobs" },
    ...(inferredRole === "employee" ? [] : [{ to: "/employer", label: "For Employers" }]),
  ];

  const dashboardTo = inferredRole === "employer" ? "/employer-dashboard" : "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearSession();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };


  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    setSearchQuery(nextParams.get("keyword") || "");
    setLocationQuery(nextParams.get("location") || "");
    setExperienceQuery(nextParams.get("experience") || "");
  }, [location.search]);

  const clearSearchFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setExperienceQuery("");
  };

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const q = searchQuery.trim();
    const locationText = locationQuery.trim();
    const experience = experienceQuery.trim();

    const params = new URLSearchParams();
    if (q) params.set("keyword", q);
    if (locationText) params.set("location", locationText);
    if (experience) params.set("experience", experience);
    params.set("queryDerived", "true");

    const slug = (q || locationText || experience || "jobs")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);

    setSearchModalOpen(false);
    navigate(`/search/${slug || "jobs"}-jobs?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-card">
          <div className="flex flex-1 items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Roji Roti"
                className="hidden h-15 w-auto object-contain bg-transparent md:block"
              />
              <img
                src={mlogo}
                alt="Roji Roti mobile"
                className="block h-10 w-auto object-contain bg-transparent md:hidden"
              />
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links?.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-full px-4 py-2 text-sm font-semibold bg-white/80 text-foreground"
                      : "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-white/60 hover:text-foreground"
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            {isAuthenticated && (
              <div className="hidden md:block flex-1 max-w-[640px] min-w-0 mr-4">
                <div className="flex w-full items-center gap-3 rounded-full border border-border bg-background/80 px-4 py-2.5 shadow-sm transition hover:bg-white/80">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onFocus={() => setSearchModalOpen(true)}
                    onClick={() => setSearchModalOpen(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, keywords, company"
                    className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchModalOpen(true)}
                    className="rounded-full bg-gradient-primary p-2 text-white shadow-soft"
                    aria-label="Open search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <a href="#download" className="rounded-full border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50 inline-flex items-center gap-2">
              <DownloadCloud className="h-4 w-4" /> {locale === "hi" ? "ऐप डाउनलोड" : "Download App"}
            </a>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition hover:bg-slate-50"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>{locale === "hi" ? "सपोर्ट" : "Support"}</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                {locale === "hi" ? "जल्द" : "Soon"}
              </span>
            </button>
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setLanguageMenuOpen((v) => !v)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition hover:bg-slate-50"
                aria-label="Translate"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === "hi" ? "हिंदी" : "English"}</span>
                <span className={`text-[10px] transition-transform ${languageMenuOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("en")}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left ${locale === "en" ? "bg-blue-50 text-blue-600" : "text-foreground hover:bg-slate-50"}`}
                  >
                    <span>English</span>
                    {locale === "en" && <span className="text-xs">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("hi")}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left ${locale === "hi" ? "bg-blue-50 text-blue-600" : "text-foreground hover:bg-slate-50"}`}
                  >
                    <span>हिंदी</span>
                    {locale === "hi" && <span className="text-xs">✓</span>}
                  </button>
                </div>
              )}

              <div className="sr-only">
                <GoogleTranslate />
              </div>
            </div>
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setProfileOpen((v) => !v)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === "Enter" || e.key === " ") setProfileOpen((v) => !v);
                  }}
                  role="button"
                  tabIndex={0}
                  className="inline-flex items-center gap-2 cursor-pointer rounded-full px-2 py-1"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-primary text-white grid place-items-center overflow-hidden">
                    {session?.avatar ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img src={session.avatar} alt="profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-semibold">{profileInitial}</span>
                    )}
                  </div>
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to={dashboardTo}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background/50"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={loginRef}>
                <button
                  type="button"
                  onClick={() => setLoginMenuOpen((v) => !v)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.03]"
                  aria-label="Login menu"
                >
                  <User className="h-4 w-4" />
                  <span>{locale === "hi" ? "लॉगिन" : "Login"}</span>
                  <span className={`text-[10px] transition-transform ${loginMenuOpen ? "rotate-180" : ""}`}>▾</span>
                </button>

                {loginMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg bg-white shadow-md border border-border">
                    <Link
                      to="/employer-login"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-background/50 border-b border-border"
                    >
                      <Briefcase className="h-4 w-4" />
                      <div>
                        <div>Employer</div>
                        <div className="text-xs text-foreground/60">Login as employer</div>
                      </div>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <User className="h-4 w-4" />
                      <div>
                        <div>Candidate</div>
                        <div className="text-xs text-blue-500">Login as candidate</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setLanguageMenuOpen((v) => !v)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-slate-50"
                aria-label="Select language"
              >
                <Globe className="h-3 w-3" />
                <span>{locale === "hi" ? "हिंदी" : "English"}</span>
                <span className={`text-[9px] transition-transform ${languageMenuOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-lg bg-white shadow-md border border-border">
                  {(["en", "hi"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        handleLanguageChange(lang);
                      }}
                      className={`block w-full px-3 py-2.5 text-left text-xs font-medium transition ${
                        locale === lang
                          ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                          : "text-foreground hover:bg-background/50"
                      }`}
                    >
                      {lang === "en" ? "English" : "हिंदी"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:bg-slate-300"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {searchModalOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/20 pt-20 backdrop-blur-[2px]"
            onClick={() => setSearchModalOpen(false)}
          >
            <div
              className="w-full max-w-5xl rounded-[30px] border border-slate-200 bg-[#f4f7fb] p-4 shadow-[0_25px_80px_rgba(15,23,42,0.2)]"
              onClick={(event) => event.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
                  <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                    <Search className="h-4 w-4 text-slate-500" />
                    <input
                      type="search"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, keywords or company"
                      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <input
                      type="search"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="City or location"
                      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex min-w-[170px] items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                    <Layers className="h-4 w-4 text-slate-500" />
                    <Select value={experienceQuery || undefined} onValueChange={(value) => setExperienceQuery(value)}>
                      <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus:outline-none data-[placeholder]:text-slate-400">
                        <SelectValue placeholder="Experience" className="text-sm font-medium text-slate-700" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        {experienceOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchModalOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Popular searches</p>
                  <button
                    type="button"
                    onClick={clearSearchFilters}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {[
                    "Driver",
                    "Delivery Boy",
                    "Electrician",
                    "Plumber",
                    "Warehouse Staff",
                    "Security Guard",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        setLocationQuery("");
                        setExperienceQuery("");
                        setSearchModalOpen(false);
                        const slug = tag.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
                        navigate(`/search/${slug || "jobs"}-jobs?keyword=${encodeURIComponent(tag)}&queryDerived=true`);
                      }}
                      className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="glass mt-2 rounded-2xl p-3 md:hidden">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/70">
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <a href="#download" onClick={() => setMobileOpen(false)} className="rounded-full border border-border px-4 py-2 text-center text-sm font-semibold">Download App</a>
                <div className="rounded-full border border-border px-4 py-2 text-center text-sm font-semibold">
                  Support
                  <span className="ml-2 rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Soon
                  </span>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                {session ? (
                  <>
                    <Link
                      to={dashboardTo}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-semibold"
                    >
                      {session.role === "employer" ? "Employer Dashboard" : "My Dashboard"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 rounded-full bg-gradient-primary px-4 py-2 text-center text-sm font-semibold text-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/employer-login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-semibold">Employer Login</Link>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-full bg-gradient-primary px-4 py-2 text-center text-sm font-semibold text-white">Candidate Login</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
