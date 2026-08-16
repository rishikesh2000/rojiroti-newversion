import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto flex max-w-4xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_12px_35px_rgba(15,23,42,0.08)] sm:p-12">
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
            Coming soon
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
            This page is currently being prepared. The Roji Roti team is working on it and it will be available soon.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
