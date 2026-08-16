import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Blobs } from "@/components/site/Blobs";
import { Navbar } from "@/components/site/Navbar";
import { OtpAuthForm } from "@/components/site/OtpAuthForm";
import { Briefcase, User, Building2, Sparkles } from "lucide-react";
import seekerBg from "@/assests/img1.png";
import employerBg from "@/assests/img2.png";
import { getSession, setSession } from "@/lib/session";

const roleCopy = {
  seeker: {
    badge: "For job seekers",
    title: "Your next role starts here.",
    subtitle:
      "Create your profile, unlock curated opportunities, and move closer to the role you deserve.",
    quote: "Helping candidates land better roles.",
    cardEyebrow: "Create your account",
    cardHeading: "Build a profile that gets noticed.",
  },
  employer: {
    badge: "For employers",
    title: "Hire verified talent in 48 hours.",
    subtitle:
      "Post openings, review strong profiles, and connect with candidates who are ready to contribute.",
    quote: "A modern hiring experience for teams that want speed, quality, and confidence.",
    cardEyebrow: "Grow your team",
    cardHeading: "Find the right people without the usual hassle.",
  },
} as const;

export default function Signup() {
  const location = useLocation();
  const [role, setRole] = useState<"seeker" | "employer">("seeker");
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      navigate(session.role === "employer" ? "/employer-dashboard" : "/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextRole = params.get("role");

    if (nextRole === "employer") {
      setRole("employer");
      return;
    }

    if (nextRole === "seeker") {
      setRole("seeker");
    }
  }, [location.search]);

  const copy = roleCopy[role];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url(${role === "seeker" ? seekerBg : employerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Blobs />

      <div className="relative z-20 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 lg:justify-end lg:px-10 xl:px-16">
          <div className="flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl lg:pr-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg shadow-slate-950/5">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span>{copy.badge}</span>
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-700 sm:text-xl">
                {copy.subtitle}
              </p>

              <div className="mt-8 rounded-2xl border border-blue-100/80 bg-slate-950/95 p-5 text-slate-100 shadow-lg shadow-slate-950/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                  <p className="text-sm leading-6">{copy.quote}</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xl rounded-[2rem] border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700">
              <button
                onClick={() => setRole("seeker")}
                className={`flex items-center justify-center rounded-full px-4 py-2 transition ${
                  role === "seeker" ? "bg-slate-950 text-white shadow-sm" : "text-slate-500"
                }`}
              >
                <User className="mr-2 h-4 w-4" /> Job seeker
              </button>
              <button
                onClick={() => setRole("employer")}
                className={`flex items-center justify-center rounded-full px-4 py-2 transition ${
                  role === "employer" ? "bg-slate-950 text-white shadow-sm" : "text-slate-500"
                }`}
              >
                <Building2 className="mr-2 h-4 w-4" /> Employer
              </button>
            </div>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                    {copy.cardEyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-950">
                    {copy.cardHeading}
                  </h2>
                </div>
                <div className="mt-4">
                  <OtpAuthForm
                    title=""
                    subtitle=""
                    ctaLabel="Send OTP"
                    accent="primary"
                    showNameField={true}
                    isSignup={true}
                    appRole={role === "seeker" ? "employee" : "employer"}
                    onSuccess={(data) => {
                      setSession({
                        role: role === "seeker" ? "employee" : "employer",
                        name: data?.user?.name ?? data?.name,
                        first_name: data?.user?.first_name ?? data?.first_name,
                        last_name: data?.user?.last_name ?? data?.last_name,
                        avatar: data?.user?.avatar ?? data?.avatar,
                      });
                      navigate(role === "seeker" ? "/dashboard" : "/employer-dashboard");
                    }}
                  />
                </div>
                <p className="text-center text-sm text-slate-600">
                  Already have an account? {" "}
                  <Link
                    to={role === "seeker" ? "/login" : "/employer-login"}
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
