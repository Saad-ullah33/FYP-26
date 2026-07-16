import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/admin`;

// Set up an Axios instance that grabs your secure JWT token on every transaction
const adminClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Grab your secure auth context token
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
    const res = await adminClient.post(`/users/${id}/verify`);
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
  },

  // Auctions Administration Pipes
  getAllAuctions: async () => {
    const res = await adminClient.get('/auctions');
    return res.data;
  },

  getAuctionById: async (id) => {
    const res = await adminClient.get(`/auctions/${id}`);
    return res.data;
  },

  approveAuction: async (id) => {
    const res = await adminClient.put(`/auctions/${id}/approve`);
    return res.data;
  },

  rejectAuction: async (id) => {
    const res = await adminClient.put(`/auctions/${id}/reject`);
    return res.data;
  },

  publishAuction: async (id) => {
    const res = await adminClient.put(`/auctions/${id}/publish`);
    return res.data;
  },

  finalizeAuction: async (id) => {
    const res = await adminClient.post(`/auctions/${id}/finalize`);
    return res.data;
  },

  deleteAuction: async (id) => {
    const res = await adminClient.delete(`/auctions/${id}`);
    return res.data;
  },

  getAuctionsByStatus: async (status) => {
    const res = await adminClient.get('/auctions/filter', {
      params: { status }
    });
    return res.data;
  }
};