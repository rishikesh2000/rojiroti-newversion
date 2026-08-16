import React from 'react';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Calendar,
  Eye,
  Users,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileText,
  Clock,
} from 'lucide-react';

interface JobDetailsModalProps {
  job: any;
  onClose: () => void;
  onViewApplicants?: () => void;
}

export default function JobDetailsModal({ job, onClose, onViewApplicants }: JobDetailsModalProps) {
  if (!job) return null;

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
    draft: 'bg-amber-100 text-amber-800',
    published: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    under_review: 'bg-blue-100 text-blue-800',
    expired: 'bg-red-100 text-red-800',
  };

  const getStatusColor = (status: string) => {
    return statusColor[status as keyof typeof statusColor] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-200 bg-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{job.job_title || 'Job Title'}</h1>
            <p className="mt-1 text-slate-600">{job.job_category || 'Category'}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Key Info Bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(job.status)}`}>
              {job.status?.charAt(0).toUpperCase() + job.status?.slice(1) || 'Draft'}
            </span>
            {job.is_urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                <AlertCircle className="h-4 w-4" />
                Urgent
              </span>
            )}
            {job.is_walk_in_interview && (
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                Walk-in Interview
              </span>
            )}
            {job.is_pan_india && (
              <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800">
                Pan India
              </span>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{job.applicants_count ?? 0}</p>
              <p className="text-xs text-slate-600">Applicants</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{job.shortlisted_count ?? 0}</p>
              <p className="text-xs text-slate-600">Shortlisted</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{job.views_count ?? 0}</p>
              <p className="text-xs text-slate-600">Views</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{job.hires_count ?? 0}</p>
              <p className="text-xs text-slate-600">Hires</p>
            </div>
          </div>

          {/* Location & Work Details */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Location & Work Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">City</p>
                <p className="text-slate-900 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {job.job_city || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Work Location Type</p>
                <p className="text-slate-900 font-medium">{job.work_location_type || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-slate-600">Address</p>
                <p className="text-slate-900 font-medium">{job.address || '—'}</p>
              </div>
            </div>
          </div>

          {/* Job Type & Salary */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Job Type & Compensation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600">Job Type</p>
                <p className="text-slate-900 font-medium capitalize">{job.job_type || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Pay Type</p>
                <p className="text-slate-900 font-medium">{job.pay_type || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Salary Range</p>
                <p className="text-slate-900 font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  {job.min_fixed_salary && job.max_fixed_salary
                    ? `₹${job.min_fixed_salary.toLocaleString()} - ₹${job.max_fixed_salary.toLocaleString()}`
                    : '—'}
                </p>
              </div>
              {job.average_incentive > 0 && (
                <div>
                  <p className="text-sm text-slate-600">Average Incentive</p>
                  <p className="text-slate-900 font-medium">₹{job.average_incentive.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Minimum Education</p>
                <p className="text-slate-900 font-medium">{job.minimum_education || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Experience Required</p>
                <p className="text-slate-900 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {job.total_experience_required || '—'}
                </p>
              </div>
              {job.skills_preference && job.skills_preference.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-2">Skills Preference</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_preference.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {job.job_description && (
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                Job Description
              </h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{job.job_description}</p>
            </div>
          )}

          {/* Additional Info */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Communication Preferences</p>
                <p className="text-slate-900 font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {job.communication_preferences || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <p className="text-slate-900 font-medium">
                  {job.is_active ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Active
                    </span>
                  ) : (
                    <span className="text-slate-600">Inactive</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Posted</p>
                <p className="text-slate-900 font-medium">{formatDate(job.posted_at)}</p>
              </div>
              <div>
                <p className="text-slate-600">Created</p>
                <p className="text-slate-900 font-medium">{formatDate(job.created_at)}</p>
              </div>
              <div>
                <p className="text-slate-600">Last Updated</p>
                <p className="text-slate-900 font-medium">{formatDate(job.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Job ID & Slug */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Reference Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Job ID</p>
                <p className="font-mono text-slate-900 break-all">{job._id}</p>
              </div>
              <div>
                <p className="text-slate-600">Slug</p>
                <p className="font-mono text-slate-900 break-all">{job.slug || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
          {onViewApplicants && (
            <button
              onClick={onViewApplicants}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
            >
              View Applicants
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
