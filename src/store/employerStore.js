import { create } from 'zustand'
import api from './api';
import axios from 'axios';

const extractErrorMessage = (error) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (data.detail && typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg;
    if (data.error_type) return data.error_type;
  }
  return error.response?.statusText || 'An error occurred';
};

const unwrapPayload = (data) => {
  if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
    return data.data;
  }
  return data;
};

const normalizeEmployerProfilePayload = (profileData = {}) => {
  const allowedKeys = [
    'name',
    'email',
    'employer_type',
    'company_name',
    'gstin',
    'logo_url',
    'founded_year',
    'website',
    'company_size',
    'company_type',
    'industry',
    'description',
    'social_profiles',
    'company_address',
    'address',
  ];

  const payload = {};

  allowedKeys.forEach((key) => {
    const value = profileData[key];
    if (value !== undefined && value !== null && value !== '') {
      payload[key] = value;
    }
  });

  return payload;
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : { headers: {} };
};

const getOptionalAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const useEmployerStore = create((set, get) => ({
  employer: null,
  companyProfile: null,
  jobs: [],
  notifications: [],
  dashboard: null,
  error: null,
  isLoading: false,

  clearError: () => set({ error: null }),

  updateEmployerProfile: async (profileData) => {
    set({ error: null, isLoading: true });
    try {
      const payload = normalizeEmployerProfilePayload(profileData);
      const response = await axios.patch(`${api}/employers/profile_update`, payload, getAuthHeaders());
      const nextEmployer = unwrapPayload(response.data);
      set({ employer: nextEmployer ?? get().employer, isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  uploadProfilePhoto: async (photoFile) => {
    set({ error: null, isLoading: true });
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      const response = await axios.post(`${api}/employees/profile_photo_upload`, formData, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      const nextEmployer = payload?.user ?? payload?.employee ?? payload?.data ?? payload;
      set({
        employer: nextEmployer ?? get().employer,
        companyProfile: payload?.company_profile ?? payload?.companyProfile ?? get().companyProfile,
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  getDashboard: async () => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/employers/dashboard`, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      set({ dashboard: payload?.dashboard ?? payload?.data ?? payload, isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, dashboard: null, isLoading: false });
      throw error;
    }
  },

  getMyJobs: async () => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/employers/my_jobs`, getAuthHeaders());
      const payload = response.data;
      const jobsData = Array.isArray(payload) ? payload : (payload?.data ?? payload?.jobs ?? []);
      set({ jobs: jobsData, isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, jobs: [], isLoading: false });
      throw error;
    }
  },

  getJobById: async (jobId) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/jobs/${jobId}`, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      const job = payload?.job ?? payload?.data ?? payload;
      set({ isLoading: false });
      return job;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  getJobApplicants: async (jobId) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/employers/jobs/${jobId}/applicants`, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      set({ isLoading: false });
      return Array.isArray(payload) ? payload : payload?.applicants ?? payload;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  getCandidateDetail: async (candidateId) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/candidate/${candidateId}`, getAuthHeaders());
      
      // const payload = unwrapPayload({
      //   "id": "6a7c5506c557d1f9b6300865",
      //   "phone": "1112223333",
      //   "phone_verified": true,
      //   "email": "aman.joshi@tech.com",
      //   "email_verified": true,
      //   "title": "Cyber Security Analyst",
      //   "name": "Aman Joshi",
      //   "summary": "I am a cyber security analyst specializing in threat intelligence, vulnerability assessment, and secure network infrastructure.",
      //   "profile_picture_url": "https://res.cloudinary.com/xuzp4qgu/image/upload/v1786535513/employees/solc8r7kiev0ymxiujq8.jpg",
      //   "location_name": "Indore, Madhya Pradesh, India",
      //   "skills": [
      //     { "name": "Cyber Security" },
      //     { "name": "Network Security" },
      //     { "name": "Vulnerability Assessment" },
      //     { "name": "Python" },
      //     { "name": "Linux" },
      //     { "name": "FastAPI" },
      //     { "name": "MongoDB" },
      //     { "name": "AWS" }
      //   ],
      //   "work_experience": [
      //     {
      //       "job_title": "Backend Developer",
      //       "job_role": "Software Development",
      //       "company_name": "Tech Corp",
      //       "start_year": 2022,
      //       "end_year": 2024,
      //       "currently_working_here": null
      //     }
      //   ],
      //   "education": [
      //     {
      //       "institute": "Holkar Science College",
      //       "degree": "Graduate",
      //       "field_of_study": "Computer Science",
      //       "start_year": 2021,
      //       "end_year": 2024
      //     }
      //   ],
      //   "resume_url": "https://res.cloudinary.com/xuzp4qgu/image/upload/v1786535550/resumes/bpjiey44vjvoponp2ftg.pdf",
      //   "languages": ["English", "Hindi"],
      //   "expected_salary": 95000.0,
      //   "availability": {
      //     "is_available": true,
      //     "notice_period_days": 30
      //   },
      //   "preferences": {
      //     "job_types": ["Full-time"],
      //     "locations": ["Indore", "Bhopal", "Remote"],
      //     "remote_ok": true
      //   },
      //   "social_links": {
      //     "linkedin": null,
      //     "github": null,
      //     "website": null
      //   }
      // });

      const payload = unwrapPayload(response.data);
      set({ isLoading: false });
      return payload;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  updateApplicationStatus: async (applicationId, newStatus) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.patch(`${api}/employers/applications/${applicationId}/status`, { new_status: newStatus }, getAuthHeaders());
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  searchWorkers: async ({ category = undefined, location = undefined, min_experience = 0 } = {}) => {
    set({ error: null, isLoading: true });
    try {
      const params = {};
      if (category !== undefined) params.category = category;
      if (location !== undefined) params.location = location;
      if (min_experience !== undefined) params.min_experience = min_experience;
      const response = await axios.get(`${api}/employers/search-workers`, { params, ...getOptionalAuthHeaders() });
      const payload = unwrapPayload(response.data);
      set({ isLoading: false });
      return Array.isArray(payload) ? payload : payload?.results ?? payload;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  unlockWorker: async (workerId) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${api}/employers/unlock-worker/${workerId}`, {}, getAuthHeaders());
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  getNotifications: async () => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/employers/notifications`, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      set({ notifications: Array.isArray(payload) ? payload : payload?.notifications ?? [], isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, notifications: [], isLoading: false });
      throw error;
    }
  },

  getEmployer: async () => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/employers/profile/personal`, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      set({ employer: payload ?? get().employer, isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, employer: null, isLoading: false });
      throw error;
    }
  },

  getEmployerCompanyProfile: async () => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${api}/employers/profile/company`, getAuthHeaders());
      const payload = unwrapPayload(response.data);
      set({ companyProfile: payload ?? get().companyProfile, isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, companyProfile: null, isLoading: false });
      throw error;
    }
  },

  downloadResume: async (workerId) => {
    set({ error: null, isLoading: true });
    try {
      const config = { ...getAuthHeaders(), responseType: 'blob' };
      const response = await axios.get(`${api}/employers/download-resume/${workerId}`, config);
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  rateWorker: async (workerId, rating, comment) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${api}/employers/rate-worker/${workerId}`, { rating, comment }, getAuthHeaders());
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  updatePhone: async (newPhone, otpCode) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.patch(`${api}/employers/me/phone`, { new_phone: newPhone, otp_code: otpCode }, getAuthHeaders());
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  createJob: async (jobData) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${api}/jobs/create`, jobData, getAuthHeaders());
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  updateJob: async (jobId, jobData) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.put(`${api}/jobs/update_job/${jobId}`, jobData, getAuthHeaders());
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  deleteJob: async (jobId) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.delete(`${api}/jobs/${jobId}`, getAuthHeaders());
      set((state) => ({
        jobs: (state.jobs || []).filter((job) => String(job._id ?? job.id ?? job.job_id) !== String(jobId)),
        isLoading: false,
      }));
      return response;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  getJobsFeed: async ({ lat = undefined, lon = undefined, radius_km = 25 } = {}) => {
    set({ error: null, isLoading: true });
    try {
      const params = {};
      if (lat !== undefined) params.lat = lat;
      if (lon !== undefined) params.lon = lon;
      if (radius_km !== undefined) params.radius_km = radius_km;
      const response = await axios.get(`${api}/jobs/feed`, { params, ...getOptionalAuthHeaders() });
      const payload = unwrapPayload(response.data);
      set({ isLoading: false });
      return Array.isArray(payload) ? payload : payload?.results ?? payload;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  searchJobs: async (body) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${api}/jobs/search`, body, getOptionalAuthHeaders());
      const payload = unwrapPayload(response.data);
      set({ isLoading: false });
      return Array.isArray(payload) ? payload : payload?.results ?? payload;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },
}));

export default useEmployerStore;
