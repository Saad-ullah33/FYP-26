import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/admin';

// Set up an axial node instance that grabs your secure JWT token on every transaction
const adminClient = axios.create({
  baseURL: API_BASE,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Grab your secure auth context token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const adminService = {
  // Stats & Analytics Data Pipes
  getStatsSummary: async () => {
    const res = await adminClient.get('/dashboard/stats');
    return res.data;
  },
  
  getComprehensiveDashboard: async () => {
    const res = await adminClient.get('/analytics/dashboard');
    return res.data;
  },

  // User Administration Pipes
  getAllUsers: async () => {
    const res = await adminClient.get('/users');
    return res.data;
  },

  approveUserAccount: async (id) => {
    const res = await adminClient.post(`/users/${id}/approve`);
    return res.data;
  },

  blockUserAccount: async (id) => {
    const res = await adminClient.post(`/users/${id}/block`);
    return res.data;
  },

  unblockUserAccount: async (id) => {
    const res = await adminClient.post(`/users/${id}/unblock`);
    return res.data;
  },

  deleteUserAccount: async (id) => {
    const res = await adminClient.delete(`/users/${id}`);
    return res.data;
  }
};