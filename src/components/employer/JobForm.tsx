import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import useEmployerStore from '@/store/employerStore';

const locationTypes = ['Work From Office', 'Work From Home', 'Field Job'];
const payTypes = ['Fixed Only', 'Fixed + Incentive', 'Incentive Only'];
const educationOptions = ['10th pass', '12th pass', 'ITI', 'Diploma', 'Graduate', 'Post Graduate'];
const skillsOptions = [
  'Driving', 'HGV License', 'Electrical Wiring', 'Circuit Installation',
  'Plumbing', 'Pipe Fitting', 'Welding', 'Metal Fabrication',
  'Carpentry', 'Wood Finishing', 'HVAC Systems', 'Air Conditioning Repair',
  'Masonry', 'Concrete Work', 'Painting', 'Drywall Installation',
  'Machine Operation', 'Forklift Certification', 'Food Service', 'Customer Service',
  'Warehouse Management', 'Inventory Control', 'Data Entry', 'Sales'
];

const stepLabels = ['Job details', 'Compensation', 'Requirements', 'Interview', 'Publish'];

interface JobFormData {
  job_title: string;
  job_category: string;
  work_location_type: string;
  job_city: string;
  pay_type: string;
  min_fixed_salary: string | number;
  max_fixed_salary: string | number;
  average_incentive: string | number;
  minimum_education: string;
  total_experience_required: string;
  skills_preference: string[];
  is_walk_in_interview: boolean;
  address: string;
  communication_preferences: string;
  job_description: string;
  is_pan_india: boolean;
  job_type: string;
  is_urgent: boolean;
  status: string;
  _id?: string;
}

interface JobFormProps {
  initial?: JobFormData | null;
  onClose?: () => void;
  onSaved?: () => void;
  fullPage?: boolean;
}

export default function JobForm({ initial = null, onClose = () => {}, onSaved = () => {}, fullPage = false }: JobFormProps) {
  const createJob = useEmployerStore((s: any) => s.createJob);
  const updateJob = useEmployerStore((s: any) => s.updateJob);
  const deleteJob = useEmployerStore((s: any) => s.deleteJob);
  const [step, setStep] = useState(1);
  const [loadingType, setLoadingType] = useState<'draft' | 'published' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [form, setForm] = useState<JobFormData>({
    job_title: '',
    job_category: '',
    work_location_type: 'Work From Office',
    job_city: '',
    pay_type: 'Fixed Only',
    min_fixed_salary: '',
    max_fixed_salary: '',
    average_incentive: '',
    minimum_education: '10th pass',
    total_experience_required: 'Any',
    skills_preference: [],
    is_walk_in_interview: false,
    address: '',
    communication_preferences: 'Yes, to myself',
    job_description: '',
    is_pan_india: false,
    job_type: 'full_time',
    is_urgent: false,
    status: 'draft',
  });

  useEffect(() => {
    if (initial) {
      setForm((prev) => ({
        ...prev,
        job_title: initial.job_title || '',
        job_category: initial.job_category || '',
        work_location_type: initial.work_location_type || 'Work From Office',
        job_city: initial.job_city || '',
        pay_type: initial.pay_type || 'Fixed Only',
        min_fixed_salary: initial.min_fixed_salary || '',
        max_fixed_salary: initial.max_fixed_salary || '',
        average_incentive: initial.average_incentive || '',
        minimum_education: initial.minimum_education || '10th pass',
        total_experience_required: initial.total_experience_required || 'Any',
        skills_preference: initial.skills_preference || [],
        is_walk_in_interview: initial.is_walk_in_interview || false,
        address: initial.address || '',
        communication_preferences: initial.communication_preferences || 'Yes, to myself',
        job_description: initial.job_description || '',
        is_pan_india: initial.is_pan_india || false,
        job_type: initial.job_type || 'full_time',
        is_urgent: initial.is_urgent || false,
        status: initial.status || 'draft',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const setField = (key: keyof JobFormData, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const customSkills = form.skills_preference.filter((skill) => !skillsOptions.includes(skill));

  const toggleArray = (key: keyof JobFormData, value: string) => {
    setForm((prev) => {
      const list = (prev[key] as string[]) || [];
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  const onNext = () => setStep((prev) => Math.min(5, prev + 1));
  const onBack = () => setStep((prev) => Math.max(1, prev - 1));

  const submit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>, publishStatus = 'draft') => {
    e.preventDefault();
    if (step < 5) {
      onNext();
      return;
    }

    setLoadingType(publishStatus as 'draft' | 'published');
    setMessage(null);

    try {
      const jobData = {
        job_title: form.job_title,
        job_category: form.job_category,
        work_location_type: form.work_location_type,
        job_city: form.job_city,
        pay_type: form.pay_type,
        min_fixed_salary: parseInt(String(form.min_fixed_salary)) || 0,
        max_fixed_salary: parseInt(String(form.max_fixed_salary)) || 0,
        average_incentive: parseInt(String(form.average_incentive)) || 0,
        minimum_education: form.minimum_education,
        total_experience_required: form.total_experience_required,
        skills_preference: form.skills_preference,
        is_walk_in_interview: form.is_walk_in_interview,
        address: form.address,
        communication_preferences: form.communication_preferences,
        job_description: form.job_description,
        is_pan_india: form.is_pan_india,
        job_type: form.job_type,
        is_urgent: form.is_urgent,
        status: publishStatus,
      };

      if (initial && initial._id) {
        // Update existing job
        await updateJob(initial._id, jobData);
        setMessage({ type: 'success', text: `✓ Job updated successfully as ${publishStatus}!` });
      } else {
        // Create new job
        await createJob(jobData);
        setMessage({ type: 'success', text: `✓ Job ${publishStatus === 'published' ? 'published' : 'saved as draft'} successfully!` });
      }

      setTimeout(() => {
        onSaved();
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: `✗ Failed to ${initial ? 'update' : 'create'} job. Please try again.` });
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg border-2 p-4 flex items-start gap-3 ${message.type === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-800 font-medium' : 'text-red-800 font-medium'}>
            {message.text}
          </p>
          <button onClick={() => setMessage(null)} className="ml-auto flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Post a new job</h2>
          <p className="mt-1 text-sm text-slate-500">We use this information to find the best candidates. *Marked fields are mandatory.</p>
        </div>
        {!fullPage && (
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold">Close</button>
        )}
      </div>

      <div className="flex items-center gap-0">
        {[1, 2, 3, 4, 5].map((index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${step >= index ? 'bg-primary text-white' : 'border-2 border-slate-200 text-slate-400'}`}>
                {index}
              </div>
              {fullPage && (
                <span className={`mt-1 hidden text-[10px] font-medium sm:block ${step === index ? 'text-primary' : 'text-slate-400'}`}>
                  {stepLabels[index - 1]}
                </span>
              )}
            </div>
            {index < 5 && (
              <div className={`mx-1 h-0.5 flex-1 ${step > index ? 'bg-primary' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Job title / Designation *</label>
              <input value={form.job_title} onChange={(e) => setField('job_title', e.target.value)} placeholder="Enter job title" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Job category *</label>
              <input value={form.job_category} onChange={(e) => setField('job_category', e.target.value)} placeholder="e.g. Telesales, Customer Care" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Work location type *</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {locationTypes.map((option) => (
                  <button key={option} type="button" onClick={() => setField('work_location_type', option)} className={`rounded-full border px-4 py-2 text-sm ${form.work_location_type === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Job city *</label>
              <input value={form.job_city} onChange={(e) => setField('job_city', e.target.value)} placeholder="Select City" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Pan India Job</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['Yes', 'No'].map((option) => (
                  <button key={option} type="button" onClick={() => setField('is_pan_india', option === 'Yes')} className={`rounded-full border px-4 py-2 text-sm ${form.is_pan_india === (option === 'Yes') ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700">What is the pay type? *</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {payTypes.map((option) => (
                  <button key={option} type="button" onClick={() => setField('pay_type', option)} className={`rounded-full border px-4 py-2 text-sm ${form.pay_type === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {form.pay_type !== 'Incentive Only' && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Minimum fixed salary/month *</label>
                  <input value={form.min_fixed_salary} onChange={(e) => setField('min_fixed_salary', e.target.value)} placeholder="Minimum fixed salary" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Maximum fixed salary/month *</label>
                  <input value={form.max_fixed_salary} onChange={(e) => setField('max_fixed_salary', e.target.value)} placeholder="Maximum fixed salary" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
                </div>
              </div>
            )}
            {form.pay_type !== 'Fixed Only' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Average incentive/month *</label>
                <input value={form.average_incentive} onChange={(e) => setField('average_incentive', e.target.value)} placeholder="Eg. ₹2000" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
              </div>
            )}
            <div className="rounded-3xl bg-amber-50 p-4 text-sm text-slate-700">
              <p className="font-semibold">Salary breakup shown to candidates</p>
              <div className="mt-3 space-y-2">
                <p>Fixed Salary / Month: {form.pay_type !== 'Incentive Only' ? `₹${form.min_fixed_salary || '0'} - ₹${form.max_fixed_salary || '0'}` : '—'}</p>
                <p>Average Incentive / Month: {form.pay_type !== 'Fixed Only' ? `₹${form.average_incentive || '0'}` : '₹0'}</p>
                <p className="font-semibold">Earning Potential / Month: ₹{form.min_fixed_salary || '0'} - ₹{form.max_fixed_salary || '0'}</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700">Minimum education *</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {educationOptions.map((option) => (
                  <button key={option} type="button" onClick={() => setField('minimum_education', option)} className={`rounded-full border px-4 py-2 text-sm ${form.minimum_education === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Total experience required *</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['0-1', '1-2', '2-3', '5-10', '5+'].map((option) => (
                  <button key={option} type="button" onClick={() => setField('total_experience_required', option)} className={`rounded-full border px-4 py-2 text-sm ${form.total_experience_required === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option} years
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Skills preference</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {skillsOptions.map((option) => (
                  <button key={option} type="button" onClick={() => toggleArray('skills_preference', option)} className={`rounded-full border px-4 py-2 text-sm ${form.skills_preference.includes(option) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}

                {customSkills.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleArray('skills_preference', option)}
                    className="rounded-full border border-blue-600 bg-blue-50 px-4 py-2 text-sm text-blue-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700">Add custom skill</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    id="customSkill"
                    placeholder="Enter a skill and press Add"
                    className="flex-1 rounded-3xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !form.skills_preference.includes(value)) {
                          toggleArray('skills_preference', value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('customSkill') as HTMLInputElement;
                      const value = input?.value.trim();
                      if (value && !form.skills_preference.includes(value)) {
                        toggleArray('skills_preference', value);
                        if (input) input.value = '';
                      }
                    }}
                    className="rounded-3xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Job Type</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['full_time', 'part_time', 'contract'].map((option) => (
                  <button key={option} type="button" onClick={() => setField('job_type', option)} className={`rounded-full border px-4 py-2 text-sm capitalize ${form.job_type === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Is this an urgent job?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['Yes', 'No'].map((option) => (
                  <button key={option} type="button" onClick={() => setField('is_urgent', option === 'Yes')} className={`rounded-full border px-4 py-2 text-sm ${form.is_urgent === (option === 'Yes') ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700">Is this a walk-in interview? *</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['Yes', 'No'].map((option) => (
                  <button key={option} type="button" onClick={() => setField('is_walk_in_interview', option === 'Yes')} className={`rounded-full border px-4 py-2 text-sm ${form.is_walk_in_interview === (option === 'Yes') ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {form.is_walk_in_interview ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Walk-in interview address *</label>
                <input value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Search for your address/locality" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Company address *</label>
                <input value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Search for your address/locality" className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-700">Communication preferences *</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['Yes, to myself', 'Yes, to other recruiter', 'No, I will contact candidates first'].map((option) => (
                  <button key={option} type="button" onClick={() => setField('communication_preferences', option)} className={`rounded-full border px-4 py-2 text-sm ${form.communication_preferences === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border bg-white text-slate-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700">Job description</p>
              <textarea value={form.job_description} onChange={(e) => setField('job_description', e.target.value)} placeholder="Enter the job description, including the main responsibility and tasks..." className="mt-3 w-full rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none" rows={6} />
            </div>
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-900">✓ All set to publish!</p>
              <p className="mt-2 text-sm text-green-800">Review your job posting details above. You can save it as draft and publish later, or publish immediately.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onBack} disabled={step === 1} className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
            Back
          </button>
          <div className="flex gap-3">
            {step < 5 ? (
              <button type="submit" className="rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-soft">
                Continue
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => submit(e, 'draft')}
                  disabled={loadingType !== null}
                  className="rounded-full border-2 border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 disabled:opacity-50"
                >
                  {loadingType === 'draft' ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={(e) => submit(e, 'published')}
                  disabled={loadingType !== null}
                  className="rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-soft hover:shadow-lg disabled:opacity-50"
                >
                  {loadingType === 'published' ? 'Publishing...' : 'Publish'}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
