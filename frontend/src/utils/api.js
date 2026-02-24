import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Real Estate
export const getProperties = (params) => API.get('/real', { params });
export const getProperty = (id) => API.get(`/real/${id}`);
export const createProperty = (data) => API.post('/real', data);
export const updateProperty = (id, data) => API.put(`/real/${id}`, data);
export const deleteProperty = (id) => API.delete(`/real/${id}`);
export const getMyProperties = () => API.get('/real/my');
export const getDashboardStats = () => API.get('/real/stats');

// Users
export const getUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const toggleUserStatus = (id) => API.patch(`/users/${id}/toggle`);

// Reports
export const generateReport = (data) => API.post('/reports', data);
export const getReports = () => API.get('/reports');
export const deleteReport = (id) => API.delete(`/reports/${id}`);

// Settings
export const getSettings = () => API.get('/settings');
export const updateBulkSettings = (data) => API.post('/settings/bulk', data);

export default API;
