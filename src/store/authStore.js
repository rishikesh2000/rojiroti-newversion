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

const useAuthStore = create((set) => ({
    user: null,
    error: null,
    isLoading: false,

    // Login flow - request OTP
    reqOtp: async (mobile, appRole) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(`${api}/auth/login/request_otp`, {
                identifier: mobile,
                app_role: appRole
            });
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            console.error("Request OTP error:", error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Login flow - verify OTP
    verifyOtp: async (mobile, otp, appRole) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(`${api}/auth/login`, {
                identifier: mobile,
                otp_code: otp,
                app_role: appRole
            });
            if (response?.data?.access_token) {
                localStorage.setItem('token', response.data.access_token);
            }
            set({ user: response.data, isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            console.error("Verify OTP error:", error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Signup flow - request OTP
    reqSignupOtp: async (mobile, appRole,name) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(`${api}/auth/register/request_otp`, {
                identifier: mobile,
                app_role: appRole,
                name:name
            });
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            console.error("Signup OTP error:", error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Signup flow - verify OTP
    verifySignupOtp: async (mobile, otp, appRole,name) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axios.post(`${api}/auth/register/verify_otp`, {
                identifier: mobile,
                otp_code: otp,
                app_role: appRole,
                name:name
            });
            if (response?.data?.access_token) {
                localStorage.setItem('token', response.data.access_token);
            }
            set({ user: response.data, isLoading: false });
            return response;
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            console.error("Verify signup OTP error:", error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    // Logout
    logout: async () => {
        set({ error: null, isLoading: true });
        try {
            await axios.post(`${api}/auth/logout`);
            localStorage.removeItem('token');
            clearSession();
            set({ user: null, isLoading: false });
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            console.error("Logout error:", error);
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;