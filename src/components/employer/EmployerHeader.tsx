import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Bot,
  Coins,
  Menu,
  Building2,
  LogOut,
  User,
  Users,
  Info,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clearSession, useSession } from "@/lib/session";
import useEmployerStore from "@/store/employerStore";
import logo from "../../assests/logo.png"

type EmployerHeaderProps = {
  onMenuToggle: () => void;
};

export function EmployerHeader({ onMenuToggle }: EmployerHeaderProps) {
  const session = useSession();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const { dashboard, employer, getDashboard } = useEmployerStore();

  useEffect(() => {
    getDashboard().catch(() => {});
  }, [getDashboard]);

  useEffect(() => {
    if (!profileOpen && !creditsOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (creditsRef.current && !creditsRef.current.contains(target)) {
        setCreditsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen, creditsOpen]);

  const jobCredits = dashboard?.credit_balance ?? dashboard?.job_credits ?? 0;
  const aiCredits = dashboard?.ai_calling_credits ?? 0;
  const dbCredits = dashboard?.database_credits ?? 0;

  const displayName = employer?.name ?? dashboard?.company_name ?? "Employer";
  const phone = employer?.phone ?? employer?.mobile ?? session?.mobile ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearSession();
    setProfileOpen(false);
    navigate("/");
  };

  const creditRows = [
    { label: "Job Credits", value: jobCredits, icon: Briefcase, iconBg: "bg-sky-500" },
    { label: "AI Job Calling Credits", value: aiCredits, icon: Bot, iconBg: "bg-gradient-to-b from-violet-500 to-indigo-600" },
    { label: "Database Credits", value: dbCredits, icon: Users, iconBg: "bg-violet-600" },
  ];

  return (
    <header className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/employer-dashboard" className="hidden items-center gap-2 lg:flex">
          <img
            src={logo}
            alt="Roji Roti"
            className="h-9 w-auto object-contain bg-transparent"
          />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div
          ref={creditsRef}
          className="relative"
          onMouseEnter={() => setCreditsOpen(true)}
          onMouseLeave={() => setCreditsOpen(false)}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Coins className="h-4 w-4 text-primary" />
            Available Credits
          </button>

          {creditsOpen && (
            <div className="absolute right-0 top-full z-50 pt-1">
              <div className="w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="font-semibold text-slate-900">Available Credits</span>
                  <button
                    type="button"
                    onClick={() => setCreditsOpen(false)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {creditRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div key={row.label} className="flex items-center gap-4 px-4 py-4">
                        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${row.iconBg}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold leading-none text-slate-900">{row.value}</p>
                          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                            {row.label}
                            <Info className="h-3.5 w-3.5 text-slate-400" />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 p-4">
                  <Link
                    to="/employer-dashboard/credits"
                    onClick={() => setCreditsOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-soft"
                  >
                    <Coins className="h-4 w-4" />
                    Buy credits
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-white"
          >
            {initial}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-lg font-semibold text-white">
                  {initial}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{displayName}</p>
                  {phone && <p className="text-sm text-slate-500">{phone}</p>}
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/employer-dashboard/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  View profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/employer-dashboard/company-profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Company profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
