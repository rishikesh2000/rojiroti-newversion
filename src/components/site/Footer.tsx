import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const cols = [
    {
      title: "Job Seekers",
      links: [
        { label: "Browse Jobs", href: "/jobs" },
        { label: "Companies", href: "/" },
    
      ],
    },
    {
      title: "Employers",
      links: [
        { label: "Post a Job", href: "/employer" },
        { label: "Pricing", href: "/employer/#pricing" },
     
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about", note: "Coming soon" },
        { label: "Support", href: "/support", note: "Coming soon" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy", note: "Coming soon" },
        { label: "Terms", href: "/terms", note: "Coming soon" },
      ],
    },
  ];

  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com", label: "Twitter" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-100/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4 pr-4">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/src/assests/logo.png"
                alt="Roji Roti"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-slate-600">
              Roji Roti connects ambitious job seekers with the companies and teams shaping tomorrow.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((column) => (
            <div key={column.title} className="space-y-3">
              <h4 className="text-base font-semibold tracking-tight text-slate-900">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="flex items-center gap-2 text-sm text-slate-600 transition-colors duration-200 hover:text-slate-900"
                    >
                      <span>{link.label}</span>
                      {link.note && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
                          {link.note}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Roji Roti. All rights reserved.</p>
            <p>Designed & Developed by Gitecgo Pvt. Ltd.</p>
          </div>
         
        </div>
      </div>
    </footer>
  );
}
