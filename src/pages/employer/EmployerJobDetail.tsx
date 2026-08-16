import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Users,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileText,
  Clock,
  Copy,
  CheckCircle,
} from 'lucide-react';
import useEmployerStore from '@/store/employerStore';
import ApplicantsPanel from '@/components/employer/ApplicantsPanel';

export default function EmployerJobDetail() {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const getJobById = useEmployerStore((s: any) => s.getJobById);
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const fetchedJob = await getJobById(jobId);
        setJob(fetchedJob ?? null);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [jobId, getJobById]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColor = {
    draft: 'bg-amber-100 text-amber-800 border-amber-300',
    published: 'bg-green-100 text-green-800 border-green-300',
    active: 'bg-green-100 text-green-800 border-green-300',
    under_review: 'bg-blue-100 text-blue-800 border-blue-300',
    expired: 'bg-red-100 text-red-800 border-red-300',
  };

  const getStatusColor = (status: string) => {
    return statusColor[status as keyof typeof statusColor] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Job Not Found</h1>
          <p className="mt-2 text-slate-600">The job you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/employer-dashboard/jobs')}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/employer-dashboard/jobs')}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Jobs</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Title & Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{job.job_title}</h1>
              <p className="text-lg text-slate-600">{job.job_category}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className={`inline-block rounded-full px-4 py-2 text-sm font-semibold border-2 ${getStatusColor(job.status)}`}>
                {job.status?.charAt(0).toUpperCase() + job.status?.slice(1) || 'Draft'}
              </span>
              <button
                onClick={() => setShowApplicants(true)}
                className="rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
              >
                View Applicants
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            {job.is_urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800 border border-red-300">
                <AlertCircle className="h-4 w-4" />
                Urgent
              </span>
            )}
            {job.is_walk_in_interview && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 border border-blue-300">
                <Users className="h-4 w-4" />
                Walk-in Interview
              </span>
            )}
            {job.is_pan_india && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 border border-purple-300">
                <MapPin className="h-4 w-4" />
                Pan India
              </span>
            )}
            {job.is_active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 border border-green-300">
                <CheckCircle className="h-4 w-4" />
                Active
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{job.applicants_count ?? 0}</p>
            <p className="text-sm text-slate-600 mt-1">Applicants</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{job.shortlisted_count ?? 0}</p>
            <p className="text-sm text-slate-600 mt-1">Shortlisted</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{job.hires_count ?? 0}</p>
            <p className="text-sm text-slate-600 mt-1">Hires</p>
          </div>
        </div>

        {/* Location & Work Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Location & Work Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">City</p>
              <p className="text-lg text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-400" />
                {job.job_city || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Work Location Type</p>
              <p className="text-lg text-slate-900">{job.work_location_type || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Job Type</p>
              <p className="text-lg text-slate-900 capitalize">{job.job_type || '—'}</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm font-medium text-slate-600 mb-2">Address</p>
              <p className="text-lg text-slate-900">{job.address || '—'}</p>
            </div>
          </div>
        </div>

        {/* Salary & Compensation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Compensation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Pay Type</p>
              <p className="text-lg text-slate-900">{job.pay_type || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Salary Range</p>
              <p className="text-lg text-slate-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-slate-400" />
                {job.min_fixed_salary && job.max_fixed_salary
                  ? `₹${job.min_fixed_salary.toLocaleString()} - ₹${job.max_fixed_salary.toLocaleString()}`
                  : '—'}
              </p>
            </div>
            {job.average_incentive > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Average Incentive</p>
                <p className="text-lg text-slate-900">₹{job.average_incentive.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Requirements</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Minimum Education</p>
                <p className="text-lg text-slate-900">{job.minimum_education || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Experience Required</p>
                <p className="text-lg text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  {job.total_experience_required || '—'}
                </p>
              </div>
            </div>

            {job.skills_preference && job.skills_preference.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-3">Skills Preference</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills_preference.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 border border-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        {job.job_description && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="h-6 w-6 text-slate-400" />
              Job Description
            </h2>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">{job.job_description}</p>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Communication Preferences</p>
              <p className="text-lg text-slate-900 flex items-center gap-2">
                <Phone className="h-5 w-5 text-slate-400" />
                {job.communication_preferences || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Status</p>
              <p className="text-lg text-slate-900">
                {job.is_active ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    Active
                  </span>
                ) : (
                  <span className="text-slate-600">Inactive</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-slate-400" />
            Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Posted</p>
              <p className="text-slate-900">{formatDate(job.created_at)}</p>
            </div>
           
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Last Updated</p>
              <p className="text-slate-900">{formatDate(job.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Reference Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Reference Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Job ID</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-slate-900 break-all flex-1">{job._id}</p>
                <button
                  onClick={() => copyToClipboard(job._id)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                  title="Copy Job ID"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Slug</p>
              <p className="font-mono text-slate-900 break-all">{job.slug || '—'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <button
            onClick={() => navigate('/employer-dashboard/jobs')}
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Back to Jobs
          </button>
          <button
            onClick={() => setShowApplicants(true)}
            className="rounded-lg bg-gradient-primary  px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
          >
            View Applicants
          </button>
        </div>
      </div>

      {/* Applicants Panel */}
      {showApplicants && (
        <div className="fixed right-0 top-0 z-50 h-full w-full bg-white shadow-lg md:w-[420px]">
          <ApplicantsPanel
            jobId={jobId || ''}
            job={job}
            onClose={() => setShowApplicants(false)}
          />
        </div>
      )}
    </div>
  );
}
