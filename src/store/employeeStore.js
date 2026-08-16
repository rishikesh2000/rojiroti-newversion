import { create } from 'zustand'
import api from './api';
import axios from "axios";
import { clearSession } from '@/lib/session';

const extractErrorMessage = (error) => {
    if (error.response?.data) {
        const data = error.response.data;
        if (data.error) return data.error;
        if (data.message) return data.message;
        if (data.detail && typeof data.detail === 'string') return data.detail;
        if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg;
        if (data.error_type) return data.error_type;
    }
    return error.response?.statusText || "An error occurred";
};
const unwrapPayload = (data) => {
    if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
        return data.data;
    }
    return data;
};
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : { headers: {} };
};
// Optional auth headers - only add if token exists
const getOptionalAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};
const useEmployeeStore = create((set, get) => ({
    user: null,
    jobs: [],
    recommendations: [],
    nearbyJobs: [],
    dashboard: null,
    error: null,
    isLoading: false,
    isSavingJob: false,
    savedJobs: [],
    appliedJobs: [],

    // Profile endpoints
    getEmployee: async () => {
        set({ error: null, isLoading: true });
        const maxAttempts = 2;
        let attempt = 0;
        while (attempt < maxAttempts) {
            try {
                const response = await axios.get(`${api}/employees/profile`, getAuthHeaders());
                const payload = unwrapPayload(response.data);
                set({ user: payload?.user ?? payload?.employee ?? payload, isLoading: false });
                return response;
            } catch (error) {
                attempt += 1;
                if (attempt >= maxAttempts) {
                    const errorMsg = extractErrorMessage(error);
                    set({ error: errorMsg, user: null, isLoading: false });
                    try {
                        localStorage.removeItem('token');
                        clearSession();
                    } catch (e) {
                        // ignore
                    }
                    // final failure after retries - return a rejected promise
                    throw error;
                }
                // small delay between retries (optional)
                await new Promise((res) => setTimeout(res, 300));
            }
        }
    },

    completeProfile: async (profileData) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.patch(
                `${api}/employees/profile_update`,
                profileData,
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const nextUser = payload?.user ?? payload?.employee ?? payload?.data ?? payload;
            set({
                user: nextUser ?? get().user,
                dashboard: payload?.dashboard ?? payload?.data ?? payload,
                isLoading: false,
            });
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
            const response = await axios.post(
                `${api}/employees/profile_photo_upload`,
                formData,
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const nextUser = payload?.user ?? payload?.employee ?? payload?.data ?? payload;
            set({
                user: nextUser ?? get().user,
                isLoading: false,
            });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    deleteProfilePhoto: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.delete(
                `${api}/employees/profile_photo_delete`,
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const userWithPhotoRemoved = payload?.user ?? payload?.employee ?? payload?.data ?? get().user;
            const nextUser = userWithPhotoRemoved && typeof userWithPhotoRemoved === 'object'
                ? { ...userWithPhotoRemoved, avatar: null, profile_picture_url: null }
                : { ...get().user, avatar: null, profile_picture_url: null };
            set({
                user: nextUser,
                isLoading: false,
            });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    uploadResume: async (resumeFile) => {
        set({ error: null, isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", resumeFile);
            const response = await axios.post(
                `${api}/employees/profile/upload_resume`,
                formData,
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const nextUser = payload?.user ?? payload?.employee ?? payload?.data ?? payload;
            set({
                user: nextUser ?? get().user,
                dashboard: payload?.dashboard ?? payload?.data ?? get().dashboard,
                isLoading: false,
            });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    sendPhoneNoUpdateOtp: async (newPhone) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(
                `${api}/employees/profile/send_phone_no_update_otp`,
                { new_phone: newPhone },
                getAuthHeaders()
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    verifyPhoneNoUpdate: async (newPhone, otpCode) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.patch(
                `${api}/employees/profile/phone_no_update`,
                { new_phone: newPhone, otp_code: otpCode },
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
          
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    updateEmployeePhone: async (newPhone, otpCode) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.patch(
                `${api}/employees/me/phone`,
                { new_phone: newPhone, otp_code: otpCode },
                getAuthHeaders()
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Email update flow: send OTP and verify+update
    sendEmailUpdateOtp: async (email) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(
                `${api}/employees/profile/email/send_otp`,
                { email },
                getAuthHeaders()
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    verifyAndUpdateEmail: async (email, otpCode) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.patch(
                `${api}/employees/profile/email/verify_and_update`,
                { email, otp_code: otpCode },
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const nextUser = payload?.user ?? payload?.employee ?? payload?.data ?? payload;
            const mergedUser = nextUser && typeof nextUser === 'object' ? { ...get().user, ...nextUser } : { ...(get().user ?? {}) };
            set({
                user: mergedUser,
                isLoading: false,
            });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    updateAvailability: async (isAvailable) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.patch(
                `${api}/employees/availability`,
                { is_available: isAvailable },
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const nextUser = payload?.user ?? payload?.employee ?? payload?.data ?? payload;
            const mergedUser = nextUser && typeof nextUser === 'object'
                ? { ...get().user, ...nextUser, availability: { ...(get().user?.availability ?? {}), ...(nextUser.availability ?? {}), is_available: isAvailable } }
                : { ...(get().user ?? {}), availability: { ...(get().user?.availability ?? {}), is_available: isAvailable } };
            set({
                user: mergedUser,
                isLoading: false,
            });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Job feed endpoints - PUBLIC (work without login)
    getJobFeed: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(`${api}/jobs`, getOptionalAuthHeaders());
            const payload = unwrapPayload(response.data);
            const jobs = Array.isArray(payload) ? payload : payload?.jobs ?? payload?.results ?? [];
            set({ jobs, isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, jobs: [], isLoading: false });
            throw error;
        }
    },

    searchJobs: async ({ keyword = "", location = "", experience = undefined, work_mode = undefined, job_type = undefined, salary = undefined } = {}) => {
        set({ error: null, isLoading: true });
        try {
            const params = {};
            if (keyword) params.keyword = keyword;
            if (location) params.location = location;
            // allow experience/work_mode/job_type/salary to be string or array
            if (experience !== undefined) params.experience = Array.isArray(experience) ? experience : [experience].filter(Boolean);
            if (work_mode !== undefined) params.work_mode = Array.isArray(work_mode) ? work_mode : [work_mode].filter(Boolean);
            if (job_type !== undefined) params.job_type = Array.isArray(job_type) ? job_type : [job_type].filter(Boolean);
            if (salary !== undefined) params.salary = Array.isArray(salary) ? salary : [salary].filter(Boolean);

            const response = await axios.get(
                `${api}/jobs/search`,
                {
                    params,
                    ...getOptionalAuthHeaders(),
                }
            );
            const payload = unwrapPayload(response.data);
            const jobs = Array.isArray(payload) ? payload : payload?.jobs ?? payload?.results ?? [];
            set({ jobs, isLoading: false });
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
            const response = await axios.get(`${api}/jobs/${jobId}`, getOptionalAuthHeaders());
            const payload = unwrapPayload(response.data);
            const job = payload?.job ?? payload;
            set({ isLoading: false });
            return job;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },


    getSavedJobs: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(`${api}/employees/jobs/saved`, getAuthHeaders());
            const payload = unwrapPayload(response.data);
            const savedJobs = Array.isArray(payload)
                ? payload
                : payload?.jobs ?? payload?.saved_jobs ?? payload?.data ?? [];
            localStorage.setItem("saved_jobs", JSON.stringify(savedJobs));
            set({ savedJobs, isLoading: false });
            return savedJobs;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, savedJobs: [], isLoading: false });
            throw error;
        }
    },

    saveJob: async (job_id, refreshSaved = true) => {
        set({ error: null, isSavingJob: true });
        try {
            const response = await axios.post(`${api}/employees/jobs/${job_id}/save`, {}, getAuthHeaders());
            if (refreshSaved) {
                await get().getSavedJobs();
            }
            set({ isSavingJob: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isSavingJob: false });
            throw error;
        }
    },

    unsaveJob: async (job_id, refreshSaved = true) => {
        set({ error: null, isSavingJob: true });
        try {
            const response = await axios.delete(`${api}/employees/jobs/${job_id}/unsave`, getAuthHeaders());
            if (refreshSaved) {
                await get().getSavedJobs();
            }
            set({ isSavingJob: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isSavingJob: false });
            throw error;
        }
    },

    addSavedJob: (job) => {
        const existing = get().savedJobs || [];
        const jobId = String(job.id ?? job._id ?? job.job_id ?? "");
        if (!existing.some((item) => String(item.id ?? item._id ?? item.job_id) === jobId)) {
            const next = [...existing, job];
            localStorage.setItem("saved_jobs", JSON.stringify(next));
            set({ savedJobs: next });
            return next;
        }
        return existing;
    },

    removeSavedJob: (jobId) => {
        const next = (get().savedJobs || []).filter((item) => String(item.id ?? item._id ?? item.job_id) !== String(jobId));
        localStorage.setItem("saved_jobs", JSON.stringify(next));
        set({ savedJobs: next });
        return next;
    },
    isJobSaved: (jobId) => {
        return (get().savedJobs || []).some((item) => String(item.id ?? item._id ?? item.job_id) === String(jobId));
    },

    getRecommendations: async ({ page = 1, limit = 10, category = null, skills = [] } = {}) => {
        set({ error: null, isLoading: true });
        try {
            const params = {
                page,
                limit,
            };
            if (category) params.category = category;
            if (Array.isArray(skills) && skills.length > 0) params.skills = skills;

            const response = await axios.get(
                `${api}/jobs/recommendations`,
                {
                    params,
                    ...getOptionalAuthHeaders(),
                }
            );
            const payload = unwrapPayload(response.data);
            const recommendations = Array.isArray(payload) ? payload : payload?.recommendations ?? payload?.results ?? [];
            set({ recommendations, isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, recommendations: [], isLoading: false });
            throw error;
        }
    },

    getNearbyJobs: async (lat = null, lon = null) => {
        set({ error: null, isLoading: true });
        try {
            let url = `${api}/jobs/feed?radius_km=25`;
            if (lat !== null && lon !== null) {
                url += `&lat=${lat}&lon=${lon}`;
            }
            const response = await axios.get(
                url,
                getOptionalAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const nearbyJobs = Array.isArray(payload)
                ? payload
                : payload?.recommended_jobs ?? payload?.jobs ?? payload?.results ?? [];
            set({
                nearbyJobs,
                isLoading: false
            });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, nearbyJobs: [], isLoading: false });
            throw error;
        }
    },

    // Dashboard
    getDashboard: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(`${api}/employees/dashboard`, getAuthHeaders());
            const payload = unwrapPayload(response.data);
            set({ dashboard: payload?.dashboard ?? payload?.data ?? payload, isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, dashboard: null, isLoading: false });
            throw error;
        }
    },

    // Job application
    applyForJob: async (jobId) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(
                `${api}/employees/jobs/apply/${jobId}`,
                {},
                getAuthHeaders()
            );
            set({ isLoading: false });
            console.log(response)
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    getApplyedJobs: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(
                `${api}/employees/jobs/applied`,
                getAuthHeaders()
            );
            const payload = unwrapPayload(response.data);
            const appliedJobs = Array.isArray(payload)
                ? payload
                : payload?.jobs ?? payload?.applied_jobs ?? payload?.data ?? [];
            set({ appliedJobs, isLoading: false });
            return appliedJobs;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, appliedJobs: [], isLoading: false });
            throw error;
        }
    },

    getJobCompanyProfile: async (employer_id) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(
                `${api}/employees/company_profile/${employer_id}`,
                getAuthHeaders()
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Reviews - PUBLIC
    getWorkerReviews: async (workerId) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(
                `${api}/employees/${workerId}/reviews`,
                getOptionalAuthHeaders()
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Location - PUBLIC
    reverseGeocode: async (lat, lng) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(
                `${api}/employees/reverse-geocode?lat=${lat}&lng=${lng}`,
                getOptionalAuthHeaders()
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Resume - PUBLIC
    downloadResume: async (employeeId) => {
        set({ error: null, isLoading: true });
        try {
            const config = { ...getOptionalAuthHeaders(), responseType: 'blob' };
            const response = await axios.get(
                `${api}/employees/resume/download/${employeeId}`,
                config
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Categories - PUBLIC (work without login)
    getCategories: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.get(`${api}/employees/categories`, getOptionalAuthHeaders());
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));

export default useEmployeeStore;