import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Blobs } from "@/components/site/Blobs";
import { ArrowRight, BadgeCheck, BrainCircuit, Building2, CheckCircle2, MessageSquare, Play, Sparkles, Users, Zap } from "lucide-react";

const tiers = [
  { name: "Starter", price: "₹4,999", tag: "For small teams", features: ["3 active job posts", "100 candidate views/month", "Basic AI matching", "Email support"], cta: "Start free trial", highlight: false },
  { name: "Growth", price: "₹12,999", tag: "Most popular", features: ["15 active job posts", "Unlimited candidate views", "Advanced AI matching", "Direct chat & calls", "Priority support"], cta: "Choose Growth", highlight: true },
  { name: "Enterprise", price: "₹24,999", tag: "Scale hiring", features: ["Unlimited job posts", "Dedicated CSM", "ATS integrations", "Bulk sourcing & exports", "SLA support"], cta: "Talk to sales", highlight: false },
];

export default function Employer() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-white text-foreground">
        <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-[#2d2bc7]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-soft">
              <Building2 className="h-4 w-4 text-blue-300" /> For Employers
            </div>

            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                Hire top talent in <span className="text-blue-600">48 hours</span> with Roji Roti.
              </h1>
              <p className="text-lg leading-8 text-slate-600 sm:text-xl">
                Smart hiring for growing teams: source verified candidates, shortlist faster, and close offers with confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Zap className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">Fast job posting</p>
                <p className="mt-2 text-sm text-slate-500">Create and publish roles in less than a minute.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">AI-powered matching</p>
                <p className="mt-2 text-sm text-slate-500">Receive candidates ranked by skills, experience, and intent.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Users className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">Verified candidate pool</p>
                <p className="mt-2 text-sm text-slate-500">Access screened profiles with verified credentials.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">End-to-end support</p>
                <p className="mt-2 text-sm text-slate-500">Dedicated assistance for every hiring campaign.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/employer-login" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-700">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50">
                <Play className="h-4 w-4" /> Watch demo
              </button>
            </div>

            <div className="grid max-w-md grid-cols-3 gap-4 text-center">
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <p className="text-2xl font-extrabold text-slate-900">6 Cr+</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Candidates</p>
              </div>
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <p className="text-2xl font-extrabold text-slate-900">7 L+</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Employers</p>
              </div>
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <p className="text-2xl font-extrabold text-slate-900">900+</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Cities</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200/70">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                <Building2 className="h-3 w-3" /> Employer login
              </span>
              <h3 className="mt-6 text-2xl font-bold text-slate-950">Start hiring in minutes.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Post jobs, shortlist candidates, and manage hiring from one smart employer dashboard.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Mobile OTP login</p>
                  <p className="mt-2 text-sm text-slate-500">Secure access with a single tap.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Verified candidate sourcing</p>
                  <p className="mt-2 text-sm text-slate-500">See the best matches first.</p>
                </div>
              </div>
              <Link to="/employer-login" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-600">
                Continue with Mobile OTP
              </Link>
              <p className="mt-4 text-xs text-slate-500">
                By clicking continue, you agree to our <span className="underline">Terms</span> & <span className="underline">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by 7 Lakh+ employers across India
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center md:grid-cols-6">
          {["Zomato", "Swiggy", "Flipkart", "Paytm", "Byju's", "Ola"].map((c) => (
            <div key={c} className="rounded-2xl bg-card py-4 text-sm font-bold text-muted-foreground shadow-card">{c}</div>
          ))}
        </div>
      </section> */}

      <section className="relative">
        <Blobs />
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#2d2bc7]">Why employers choose us</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">Everything you need to hire smarter</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: BrainCircuit, t: "AI Candidate Matching", d: "Our AI ranks the best-fit candidates instantly based on skills & intent." },
              { icon: BadgeCheck, t: "Verified Profiles", d: "Aadhaar, PAN & employment verified candidates — no ghost applications." },
              { icon: MessageSquare, t: "Direct Chat & Calls", d: "Skip emails. Talk to candidates inside Roji Roti." },
              { icon: Users, t: "Bulk Sourcing", d: "Search through 6 Cr+ profiles with powerful filters & saved searches." },
              { icon: Zap, t: "Lightning Fast Posts", d: "Post a job in under 60 seconds and reach lakhs of candidates." },
              { icon: Sparkles, t: "Smart Insights", d: "Track applications, conversions & funnel performance in real time." },
            ].map((f) => (
              <div key={f.t} className="gradient-border p-6 hover-lift">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#2d2bc7]">Pricing</p>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl">Plans that scale with your hiring</h2>
          <p className="mt-3 text-sm text-muted-foreground">Simple, transparent pricing. Cancel anytime. GST inclusive.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`relative rounded-3xl p-7 shadow-card hover-lift ${t.highlight ? "bg-gradient-primary text-white shadow-soft" : "gradient-border p-7 shadow-card hover-lift"}`}>
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white">Most popular</span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-wider ${t.highlight ? "text-white/80" : "text-[#2d2bc7]"}`}>{t.tag}</p>
              <h3 className="mt-2 text-2xl font-bold">{t.name}</h3>
              <p className="mt-4 text-4xl font-extrabold">
                {t.price}<span className={`text-sm font-medium ${t.highlight ? "opacity-80" : "text-muted-foreground"}`}>/month</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${t.highlight ? "text-emerald-300" : "text-emerald-600"}`} />
                    <span className={t.highlight ? "text-white/90" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/employer-login" className={`mt-7 grid place-items-center rounded-full px-5 py-3 text-sm font-semibold ${t.highlight ? "bg-white text-foreground hover:scale-[1.02]" : "bg-gradient-primary text-white hover:shadow-glow"}`}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero animate-gradient p-10 text-white shadow-soft md:p-14">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold md:text-5xl">Start hiring on Roji Roti today.</h2>
            <p className="mt-3 text-white/85">Join 7 Lakh+ employers hiring smarter, faster, better.</p>
            <Link to="/employer-login" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground hover:scale-[1.03]">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
