import { Link } from "react-router-dom";

type LegalType = "privacy" | "terms" | "security";

const legalContent: Record<LegalType, { title: string; subtitle: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we handle personal information and protect your data.",
    sections: [
      {
        heading: "Information we collect",
        body: "We collect the information required to operate the platform, including profile details, contact information, job preferences, and account activity needed for account management and hiring support.",
      },
      {
        heading: "How we use it",
        body: "This information is used to create and maintain your account, match candidates with opportunities, support employers, and improve the experience across our website and services.",
      },
      {
        heading: "Your choices",
        body: "You may review or update your information through your dashboard and can contact us to request clarification or assistance regarding your data preferences.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "The rules for using Roji Roti and related services.",
    sections: [
      {
        heading: "Use of the platform",
        body: "You agree to use the platform only for lawful purposes, and to not misuse, disrupt, or interfere with the service or other users.",
      },
      {
        heading: "Account responsibility",
        body: "You are responsible for the accuracy of the information you provide, the security of your account, and the activity that occurs under your login.",
      },
      {
        heading: "Changes to services",
        body: "We may update platform features, service terms, or policies from time to time to improve reliability, compliance, and user experience.",
      },
    ],
  },
  security: {
    title: "Security",
    subtitle: "Our approach to protecting user accounts and platform data.",
    sections: [
      {
        heading: "Account protection",
        body: "We implement reasonable technical safeguards, access controls, and verification steps to help protect accounts and sensitive user information.",
      },
      {
        heading: "Responsible handling",
        body: "Data is stored and processed using secure systems and internal controls designed to reduce unauthorized access, misuse, or loss.",
      },
      {
        heading: "Reporting concerns",
        body: "If you notice suspicious activity or an issue related to account security, please contact our support team immediately so we can investigate.",
      },
    ],
  },
};

export default function LegalPage({ type }: { type: LegalType }) {
  const content = legalContent[type];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            ← Back to home
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
            Legal
          </span>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{content.subtitle}</p>

          <div className="mt-8 space-y-5">
            {content.sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
