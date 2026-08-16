import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Blobs } from "@/components/site/Blobs";
import { Navbar } from "@/components/site/Navbar";
import { OtpAuthForm } from "@/components/site/OtpAuthForm";
import { Briefcase, CheckCircle2, UserRound } from "lucide-react";
import { getSession, setSession } from "@/lib/session";
import logo from "../assests/logo.png";



const perks = [
  "Apply to 1 Lakh+ verified jobs",
  "AI-matched roles based on your skills",
  "Chat directly with recruiters",
  "Free resume score & feedback",
];

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      navigate(session.role === "employer" ? "/employer-dashboard" : "/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="relative h-screen min-h-screen bg-slate-200 overflow-hidden">
      <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[#2d2bc7]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <Blobs />
      <Navbar />
      <div className="relative mx-auto grid h-full max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-2">
        <div className="hidden text-foreground md:block">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Roji Roti"
              className="h-18 w-auto object-contain bg-transparent"
            />
          </Link>
          <h2 className="mt-10 text-4xl font-extrabold leading-tight">
            Land your <span className="text-gradient">dream job</span> faster
          </h2>
          <p className="mt-3 max-w-md text-foreground/75">
            Roji Roti helps candidates discover the right opportunities, connect with recruiters, and get hired in days — not months.
          </p>
          <ul className="mt-6 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-foreground/85">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-6 text-foreground">
            <div><p className="text-2xl font-extrabold">1 L+</p><p className="text-xs text-foreground/60">Live jobs</p></div>
            <div><p className="text-2xl font-extrabold">7 L+</p><p className="text-xs text-foreground/60">Employers</p></div>
            <div><p className="text-2xl font-extrabold">900+</p><p className="text-xs text-foreground/60">Cities</p></div>
          </div>
        </div>

        <div className="w-full">
          <Link to="/" className="mx-auto mb-6 flex w-fit items-center gap-2 md:hidden">
            <img
              src={logo}
              alt="Roji Roti"
              className="h-12 w-auto object-contain bg-transparent"
            />
          </Link>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft md:p-10 text-slate-950">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
              <UserRound className="h-3 w-3" /> Candidate Login
            </span>
            <div className="mt-4 space-y-4">
              <div>
                <h2 className="text-3xl font-bold">Sign in and start applying</h2>
                <p className="mt-2 text-sm text-slate-600">Secure OTP login for candidates. No password, no friction.</p>
              </div>
              <OtpAuthForm
                title=""
                subtitle=""
                ctaLabel="Send OTP"
                accent="primary"
                showNameField={false}
                isSignup={false}
                appRole="employee"
                onSuccess={(data) => {
                  setSession({
                    role: "employee",
                    name: data?.user?.name ?? data?.name,
                    first_name: data?.user?.first_name ?? data?.first_name,
                    last_name: data?.user?.last_name ?? data?.last_name,
                    avatar: data?.user?.avatar ?? data?.avatar,
                  });
                  navigate("/dashboard");
                }}
              />
            </div>
            <div className="mt-6 grid gap-3 text-center text-xs text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                Don&#39;t have an account? <Link to="/signup?role=seeker" className="font-semibold text-primary">Create one</Link>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                Are you hiring? <Link to="/employer-login" className="font-semibold text-primary">Employer Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
