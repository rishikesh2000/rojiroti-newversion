import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader,
  Globe,
  Github,
  Linkedin,
} from 'lucide-react';
import useEmployerStore from '@/store/employerStore';

interface Candidate {
  id: string;
  name: string;
  title: string;
  phone: string;
  phone_verified: boolean;
  email: string | null;
  email_verified: boolean;
  gender?: string | null;
  summary: string;
  profile_picture_url: string;
  location_name: string;
  skills: Array<{ name: string }>;
  work_experience: Array<{
    job_title: string;
    job_role: string | null;
    company_name: string;
    start_year: number | null;
    end_year: number | null;
    currently_working_here: boolean | null;
  }>;
  education: Array<{
    institute: string;
    degree: string;
    field_of_study: string;
    start_year: number;
    end_year: number;
  }>;
  resume_url: string;
  languages: string[];
  expected_salary: number;
  availability: {
    is_available: boolean;
    notice_period_days: number;
  };
  preferences: {
    job_types: string[];
    locations: string[];
    remote_ok: boolean;
  };
  social_links: {
    linkedin: string | null;
    github: string | null;
    website: string | null;
  };
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'hired', label: 'Hired', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'completed', label: 'Completed', color: 'bg-slate-100 text-slate-700 border-slate-300' },
];

export default function CandidateDetail() {
  const { candidateId } = useParams<{
    candidateId: string;
  }>();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const initialStatus = searchParams.get('status') ?? 'applied';
  const navigate = useNavigate();
  const getCandidateDetail = useEmployerStore((s: any) => s.getCandidateDetail);
  const updateApplicationStatus = useEmployerStore((s: any) => s.updateApplicationStatus);
  const isLoading = useEmployerStore((s: any) => s.isLoading);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [status, setStatus] = useState(initialStatus);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Fetch candidate details
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) {
        return;
      }

      try {
        const candidateData = await getCandidateDetail(candidateId);
        setCandidate(candidateData);
      } catch (error) {
        console.error('Failed to fetch candidate:', error);
        setCandidate(null);
      }
    };

    fetchCandidate();
  }, [candidateId, getCandidateDetail]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!applicationId) {
      setStatusMessage({
        type: 'error',
        message: 'Application ID not found',
      });
      return;
    }

    setStatusLoading(true);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setStatus(newStatus);
      setShowStatusDropdown(false);
      setStatusMessage({
        type: 'success',
        message: `Status updated to ${newStatus}`,
      });

      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update status:', error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update status',
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusColor = (statusValue: string) => {
    const option = STATUS_OPTIONS.find((s) => s.value === statusValue);
    return option?.color || 'bg-slate-100 text-slate-700 border-slate-300';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Candidate Not Found</h1>
          <p className="mt-2 text-slate-600">
            The candidate you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-black-200 hover:text-black-700 font-medium transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 flex items-center gap-3 ${
              statusMessage.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="font-medium">{statusMessage.message}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Candidate Info */}
          <div className="md:col-span-2">
            {/* Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {candidate.profile_picture_url ? (
                    <img
                      src={candidate.profile_picture_url}
                      alt={candidate.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-slate-100"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-slate-900">{candidate.name}</h1>
                  <p className="mt-1 text-lg text-blue-600 font-semibold">{candidate.title}</p>

                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
                    {candidate.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span>{candidate.location_name}</span>
                      </div>
                    )}

                    {candidate.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span>{candidate.phone}</span>
                        {candidate.phone_verified && (
                          <span className="ml-1 inline-flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    )}

                    {candidate.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span>{candidate.email}</span>
                        {candidate.email_verified && (
                          <span className="ml-1 inline-flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    )}

                    {/* Gender */}
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span>{candidate.gender ? candidate.gender : 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {candidate.summary && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    About
                  </h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">{candidate.summary}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                  <Code className="h-5 w-5 text-blue-600" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {candidate.work_experience && candidate.work_experience.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {candidate.work_experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-400 pl-4 pb-4 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">{exp.job_title}</h4>
                          <p className="text-sm text-slate-600">{exp.company_name}</p>
                        </div>
                        {exp.currently_working_here && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-600"></span>
                            Currently Working
                          </span>
                        )}
                      </div>
                      {(exp.start_year || exp.end_year) && (
                        <p className="mt-1 text-xs text-slate-500">
                          {exp.start_year} - {exp.end_year || 'Present'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {candidate.education && candidate.education.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education
                </h3>
                <div className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-indigo-400 pl-4 pb-4 last:pb-0"
                    >
                      <h4 className="font-semibold text-slate-900">{edu.institute}</h4>
                      <p className="text-sm text-slate-600">
                        {edu.degree} in {edu.field_of_study}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {edu.start_year} - {edu.end_year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {candidate.languages && candidate.languages.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-span-1">
            {/* Status Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6 sticky top-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Application Status
              </h3>

              {/* Status Badge */}
              <button
                onClick={() => setShowStatusDropdown(true)}
                disabled={statusLoading}
                className={`w-full inline-flex items-center justify-between rounded-lg border-2 px-4 py-2.5 font-semibold transition disabled:opacity-50 ${getStatusColor(status)}`}
              >
                <span className="capitalize">{status}</span>
                {statusLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
              </button>

              <div className="text-xs text-slate-500 mt-3">
                Click to change the application status
              </div>
            </div>

            {/* Salary Expectation */}
            {candidate.expected_salary && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Expected Salary
                </h3>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{candidate.expected_salary.toLocaleString()}
                </p>
              </div>
            )}

            {/* Availability */}
            {candidate.availability && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                  Availability
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        candidate.availability.is_available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {candidate.availability.is_available ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Notice Period</span>
                    <span className="text-sm font-medium text-slate-900">
                      {candidate.availability.notice_period_days} days
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {candidate.preferences && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  {candidate.preferences.job_types && candidate.preferences.job_types.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-2">Job Types</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.preferences.job_types.map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.preferences.locations && candidate.preferences.locations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-2">Preferred Locations</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.preferences.locations.map((loc, index) => (
                          <span
                            key={index}
                            className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600">Remote OK</span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        candidate.preferences.remote_ok
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {candidate.preferences.remote_ok ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links & Resume */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Links
              </h3>
              <div className="space-y-2">
                {candidate.resume_url && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowResumeModal(true)}
                      className="flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                    >
                      <FileText className="h-4 w-4" />
                      Preview Resume
                    </button>
                    <a
                      href={candidate.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </>
                )}

                {candidate.social_links?.linkedin && (
                  <a
                    href={candidate.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}

                {candidate.social_links?.github && (
                  <a
                    href={candidate.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}

                {candidate.social_links?.website && (
                  <a
                    href={candidate.social_links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResumeModal && candidate?.resume_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-base font-semibold text-slate-900">Resume Preview</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={candidate.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-50">
              <iframe
                src={candidate.resume_url}
                title="Candidate resume preview"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusDropdown && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white shadow-xl animation-slide-up">
            {/* Modal Header */}
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Change Application Status</h2>
              <p className="mt-1 text-sm text-slate-600">
                Select a new status for {candidate?.name}
              </p>
            </div>

            {/* Modal Content */}
            <div className="max-h-96 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    disabled={statusLoading || status === option.value}
                    className={`w-full text-left rounded-lg border-2 px-4 py-3 font-medium transition ${
                      status === option.value
                        ? `${option.color} border-current cursor-default`
                        : `border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {status === option.value && (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowStatusDropdown(false)}
                disabled={statusLoading}
                className="flex-1 rounded-lg border-2 border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
