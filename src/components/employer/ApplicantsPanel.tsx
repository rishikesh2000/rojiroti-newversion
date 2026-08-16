import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Phone, CalendarDays, BriefcaseBusiness, Eye, UserRound, ChevronRight, Mail } from 'lucide-react';
import useEmployerStore from '@/store/employerStore';

interface Applicant {
  _id?: string;
  id?: string;
  application_id?: string;
  name?: string;
  employee_name?: string;
  phone?: string;
  employee_phone?: string;
  email?: string;
  employee_email?: string;
  gender?: string;
  employee_gender?: string;
  title?: string;
  category?: string;
  employee_category?: string;
  status?: string;
  application_status?: string;
  applied_on?: string;
  applied_at?: string;
  resume_url?: string;
  candidate_id?: string;
  employee_id?: string;
}

interface ApplicantsPanelProps {
  jobId: string;
  job?: any;
  onClose?: () => void;
}

export default function ApplicantsPanel({ jobId, job, onClose = () => {} }: ApplicantsPanelProps) {
  const navigate = useNavigate();
  const getJobApplicants = useEmployerStore((s: any) => s.getJobApplicants);
  const [apps, setApps] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtering, setFiltering] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getJobApplicants(jobId);
        if (mounted) {
          setApps(res ?? []);
          setSelectedApplicant((current: Applicant | null) => {
            if (!current) return null;
            const next = (res ?? []).find(
              (item: Applicant) =>
                (item.application_id ?? item.id ?? item._id) ===
                (current.application_id ?? current.id ?? current._id)
            );
            return next ?? null;
          });
        }
      } catch (e: any) {
        console.error('Failed to fetch applicants:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (jobId) load();
    return () => {
      mounted = false;
    };
  }, [jobId, getJobApplicants]);

  const normalizeStatus = (status: string | undefined): string => {
    const value = String(status ?? 'applied').toLowerCase();
    if (['applied', 'new', 'pending'].includes(value)) return 'new';
    if (['shortlisted', 'shortlisted_candidate', 'shortlist'].includes(value)) return 'shortlisted';
    if (['hired', 'selected', 'accepted'].includes(value)) return 'hired';
    if (['rejected', 'declined', 'not_selected'].includes(value)) return 'rejected';
    return value;
  };

  const formatDate = (value: string | undefined): string => {
    if (!value) return 'Recently';
    try {
      return new Date(value).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  const getStatusClasses = (status: string): string => {
    switch (status) {
      case 'shortlisted':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'hired':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'new':
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const sortedApps = useMemo(() => {
    return [...apps].sort((a: Applicant, b: Applicant) => {
      const timeA = new Date(a.applied_at ?? a.applied_on ?? a.created_at ?? 0).getTime();
      const timeB = new Date(b.applied_at ?? b.applied_on ?? b.created_at ?? 0).getTime();
      return timeB - timeA;
    });
  }, [apps]);

  const filteredApps = useMemo(() => {
    return sortedApps.filter((a: Applicant) => {
      if (filtering === 'all') return true;
      return normalizeStatus(a.status ?? a.application_status) === filtering;
    });
  }, [sortedApps, filtering]);

  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-800">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Candidates</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Job Applicants</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close applicants panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {job && (
        <div className="border-b border-slate-200 bg-white px-5 py-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Role</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{job.job_title || 'Job Title'}</h3>
              </div>
              <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {filteredApps.length} Applied
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                {job.job_category || 'Category'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                {job.work_location_type || 'Work mode'}
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedApplicant && (
        <div className="border-b border-slate-200 bg-white px-5 py-4">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected</p>
                  <h4 className="text-lg font-bold text-slate-900">
                    {selectedApplicant.employee_name ?? selectedApplicant.name ?? 'Candidate'}
                  </h4>
                </div>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(normalizeStatus(selectedApplicant.status ?? selectedApplicant.application_status))}`}>
                {normalizeStatus(selectedApplicant.status ?? selectedApplicant.application_status)}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{selectedApplicant.employee_email ?? selectedApplicant.email ?? 'Email not added'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{selectedApplicant.employee_phone ?? selectedApplicant.phone ?? 'Phone not added'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span>Applied on {formatDate(selectedApplicant.applied_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-slate-400" />
                <span>{selectedApplicant.employee_gender ?? selectedApplicant.gender ?? 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-200 bg-white px-4 pb-2 pt-4">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'new', 'shortlisted', 'hired', 'rejected'].map((filter) => {
            const count =
              filter === 'all'
                ? apps.length
                : apps.filter((item: Applicant) => normalizeStatus(item.status ?? item.application_status) === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setFiltering(filter)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                  filtering === filter
                    ? 'bg-gradient-primary text-white shadow-soft'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p className="mt-3 text-sm text-slate-500">Loading applicants...</p>
            </div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
            <p className="text-sm text-slate-500">No {filtering === 'all' ? 'applicants' : filtering} candidates found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app: Applicant) => {
              const applicantId = app.application_id ?? app.id ?? app._id;
              const normalizedStatus = normalizeStatus(app.status ?? app.application_status);
              const candidateName = app.employee_name ?? app.name ?? 'Candidate';
              const employeeCategory = app.employee_category ?? app.category ?? 'N/A';

              return (
                <div
                  key={applicantId}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-base font-bold text-slate-900">{candidateName}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(normalizedStatus)}`}>
                          {normalizedStatus}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{app.employee_email ?? app.email ?? 'Email not available'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{app.employee_phone ?? app.phone ?? 'Phone not available'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          <span>Applied {formatDate(app.applied_at)}</span>
                        </div>
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-slate-400" />
                        <span>{app.employee_gender ?? app.gender ?? 'Not specified'}</span>
                      </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        const candidateId = app.employee_id ?? app.candidate_id ?? app.id;
                        const applicationId = app.application_id ?? app.id;
                        const currentStatus = app.status ?? app.application_status ?? 'applied';
                        navigate(
                          `/employer-dashboard/candidate/${candidateId}?applicationId=${applicationId}&status=${currentStatus}`
                        );
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
                    >
                      <Eye className="h-4 w-4" />
                      View Candidate
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
