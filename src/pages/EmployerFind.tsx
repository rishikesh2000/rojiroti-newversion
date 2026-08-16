import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Navbar } from '@/components/site/Navbar';
import useEmployerStore from '@/store/employerStore';
import { Link } from 'react-router-dom';

export default function EmployerFind() {
  const searchWorkers = useEmployerStore((s) => s.searchWorkers);
  const unlockWorker = useEmployerStore((s) => s.unlockWorker);
  const downloadResume = useEmployerStore((s) => s.downloadResume);
  const [filters, setFilters] = useState({ category: '', location: '', min_experience: 0 });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const onChange = (k: keyof typeof filters, v: string | number) => setFilters((f) => ({ ...f, [k]: v }));

  const doSearch = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await searchWorkers({ category: filters.category || undefined, location: filters.location || undefined, min_experience: filters.min_experience || 0 });
      setResults(Array.isArray(res) ? res : []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-bold">Find candidates</h2>
          <form onSubmit={doSearch} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Category" value={filters.category} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('category', e.target.value)} className="rounded-md border px-3 py-2" />
            <input placeholder="Location" value={filters.location} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('location', e.target.value)} className="rounded-md border px-3 py-2" />
            <input type="number" placeholder="Min experience (years)" value={filters.min_experience} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('min_experience', Number(e.target.value))} className="rounded-md border px-3 py-2" />
            <div className="md:col-span-3 flex gap-2 justify-end">
              <button type="button" onClick={() => { setFilters({ category: '', location: '', min_experience: 0 }); setResults([]); }} className="rounded-md border px-4 py-2">Clear</button>
              <button type="submit" className="rounded-md bg-gradient-primary px-4 py-2 text-white">Search</button>
            </div>
          </form>

          <div className="mt-6">
            {loading ? <p>Searching...</p> : (
              <div className="space-y-3">
                {results.length === 0 && <p className="text-sm text-muted-foreground">No results</p>}
                {results.map((r: any) => (
                  <div key={r.id ?? r._id ?? r.worker_id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-semibold">{r.name ?? r.full_name ?? r.worker_name ?? 'Candidate'}</p>
                      <p className="text-xs text-muted-foreground">{r.category ?? r.trade} · {r.location_name ?? r.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => unlockWorker(r.id ?? r._id ?? r.worker_id)} className="rounded-md border px-3 py-1">Unlock</button>
                      <button onClick={() => downloadResume(r.id ?? r._id ?? r.worker_id)} className="rounded-md border px-3 py-1">Download Resume</button>
                      <Link to={`/jobs/${r.job_id ?? ''}`} className="rounded-md border px-3 py-1">View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
