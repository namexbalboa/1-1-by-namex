import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const language = localStorage.getItem('i18nextLng') || 'pt';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['Accept-Language'] = language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Tenants
  tenants: {
    getAll: () => api.get('/tenants'),
    getById: (id: string) => api.get(`/tenants/${id}`),
    create: (data: any) => api.post('/tenants', data),
    update: (id: string, data: any) => api.patch(`/tenants/${id}`, data),
    delete: (id: string) => api.delete(`/tenants/${id}`),
  },

  // Collaborators
  collaborators: {
    getAll: (tenantId?: string) =>
      api.get('/collaborators', { params: { tenantId } }),
    getById: (id: string) => api.get(`/collaborators/${id}`),
    getByFirebaseUid: (uid: string) => api.get(`/collaborators/firebase/${uid}`),
    getByManager: (managerId: string) =>
      api.get(`/collaborators/manager/${managerId}`),
    create: (data: any) => api.post('/collaborators', data),
    update: (id: string, data: any) => api.patch(`/collaborators/${id}`, data),
    updateLanguage: (id: string, language: string) =>
      api.patch(`/collaborators/${id}/language`, { preferredLanguage: language }),
    delete: (id: string) => api.delete(`/collaborators/${id}`),
  },

  // Meetings
  meetings: {
    createJourney: (data: any) => api.post('/meetings/journeys', data),
    getJourney: (collaboratorId: string, year: number) =>
      api.get(`/meetings/journeys/${collaboratorId}/${year}`),
    getJourneysByManager: (managerId: string) =>
      api.get(`/meetings/journeys/manager/${managerId}`),
    addMeeting: (journeyId: string, data: any) =>
      api.post(`/meetings/journeys/${journeyId}/meetings`, data),
    getMeeting: (journeyId: string, meetingNumber: number) =>
      api.get(`/meetings/journeys/${journeyId}/meetings/${meetingNumber}`),
    updateMeeting: (journeyId: string, meetingNumber: number, data: any) =>
      api.patch(`/meetings/journeys/${journeyId}/meetings/${meetingNumber}`, data),
    deleteMeeting: (journeyId: string, meetingNumber: number) =>
      api.delete(`/meetings/journeys/${journeyId}/meetings/${meetingNumber}`),
  },

  // Analytics
  analytics: {
    getAnnualReport: (collaboratorId: string, year: number) =>
      api.get(`/analytics/annual-report/${collaboratorId}/${year}`),
    getTeamOverview: (managerId: string) =>
      api.get(`/analytics/team-overview/${managerId}`),
    getTrends: (collaboratorId: string, startYear: number, endYear: number) =>
      api.get(`/analytics/trends/${collaboratorId}`, {
        params: { startYear, endYear },
      }),
  },

  // Auth
  auth: {
    register: (data: {
      name: string;
      email: string;
      password: string;
      companyName: string;
      preferredLanguage?: string;
    }) => api.post('/auth/register', data),
  },

  // Health check
  health: () => api.get('/health'),
};

export default apiClient;
