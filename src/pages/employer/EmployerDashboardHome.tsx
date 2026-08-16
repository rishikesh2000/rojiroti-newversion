import { useEffect } from "react";
import { Briefcase, Users, Coins, TrendingUp, Bell } from "lucide-react";
import useEmployerStore from "@/store/employerStore";
import { Link } from "react-router-dom";

export default function EmployerDashboardHome() {
  const { getDashboard, getMyJobs, dashboard, jobs } = useEmployerStore();

  useEffect(() => {
    getDashboard().catch(() => {});
    getMyJobs().catch(() => {});
  }, [getDashboard, getMyJobs]);

  const stats = dashboard ?? {
    company_name: "",
    subscription_tier: "free",
    is_active: true,
    days_left: 0,
    expiry_date: null,
    active_jobs_count: jobs?.length ?? 0,
    total_applicants_count: 0,
    shortlisted_count: 0,
    contacts_viewed: 0,
    job_posts_used: 0,
  };

  const statusText = stats.is_active === false ? "Inactive" : "Active";
  const subscriptionText = stats.subscription_tier === "free" ? "Free Tier" : stats.subscription_tier;
  const expiryText = stats.expiry_date
    ? new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(stats.expiry_date))
    : "Not available";

  const cards = [
    { label: "Total Jobs", value: stats.active_jobs_count ?? jobs?.length ?? 0, icon: Briefcase, link: "/employer-dashboard/jobs" },
    { label: "Total Applicants", value: stats.total_applicants_count ?? 0, icon: Users, link: "/employer-dashboard/jobs" },
    { label: "Subscription", value: subscriptionText, icon: Coins, link: "/employer-dashboard/billing" },
    { label: "Shortlisted", value: stats.shortlisted_count ?? 0, icon: TrendingUp, link: "/employer-dashboard/jobs" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Bell className="h-4 w-4 shrink-0" />
        <span className="font-medium">Pending Actions (1)</span>
        <span className="text-amber-700">— Complete your company profile to improve trust</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your hiring activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Quick stats</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Company</span>
              <span className="font-semibold text-slate-900">{stats.company_name || "Your company"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Subscription tier</span>
              <span className="font-semibold text-slate-900">{subscriptionText}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Status</span>
              <span className="font-semibold text-slate-900">{statusText}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Days left</span>
              <span className="font-semibold text-slate-900">{stats.days_left ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Expiry date</span>
              <span className="font-semibold text-slate-900">{expiryText}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Active jobs</span>
              <span className="font-semibold text-slate-900">{stats.active_jobs_count ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Total applicants</span>
              <span className="font-semibold text-slate-900">{stats.total_applicants_count ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Shortlisted</span>
              <span className="font-semibold text-slate-900">{stats.shortlisted_count ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Job posts used</span>
              <span className="font-semibold text-slate-900">{stats.job_posts_used ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Contacts viewed</span>
              <span className="font-semibold text-slate-900">{stats.contacts_viewed ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-primary to-accent p-6 text-white">
          <h2 className="text-lg font-semibold">Need more credits?</h2>
          <p className="mt-2 text-sm text-white/85">Buy credits to post jobs and unlock candidate profiles.</p>
          <Link
            to="/employer-dashboard/credits"
            className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Buy Credits
          </Link>
        </div>
      </div>
    </div>
  );
}
