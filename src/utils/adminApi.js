import api from "./api";

/* ============================================================
   DASHBOARD
============================================================ */

export const getDashboardStats = async () => {
  const response = await api.get("/api/admin/dashboard/stats");
  return response.data;
};

/* ============================================================
   ANALYTICS
============================================================ */

export const getAnalyticsDashboard = async () => {
  const response = await api.get("/api/admin/analytics/dashboard");
  return response.data;
};

export const getSystemStats = async () => {
  const response = await api.get("/api/admin/analytics/system-stats");
  return response.data;
};

export const getDailyMetrics = async () => {
  const response = await api.get("/api/admin/analytics/daily-metrics");
  return response.data;
};

export const getMostViewedProperties = async (
  limit = 10,
  days = 30
) => {
  const response = await api.get("/api/admin/analytics/most-viewed", {
    params: {
      limit,
      days,
    },
  });

  return response.data;
};

export const getMostActiveAuctions = async (limit = 10) => {
  const response = await api.get("/api/admin/analytics/most-active-auctions", {
    params: {
      limit,
    },
  });

  return response.data;
};

export const getTopBidders = async (limit = 10) => {
  const response = await api.get("/api/admin/analytics/top-bidders", {
    params: {
      limit,
    },
  });

  return response.data;
};

/* ============================================================
   USERS
============================================================ */

export const getAllUsers = async () => {
  const response = await api.get("/api/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/admin/users/${id}`);
  return response.data;
};

export const approveUser = async (id) => {
  const response = await api.post(`/api/admin/users/${id}/approve`);
  return response.data;
};

export const rejectUser = async (id) => {
  const response = await api.post(`/api/admin/users/${id}/reject`);
  return response.data;
};

export const verifyUser = async (id) => {
  const response = await api.post(`/api/admin/users/${id}/verify`);
  return response.data;
};

export const blockUser = async (id) => {
  const response = await api.post(`/api/admin/users/${id}/block`);
  return response.data;
};

export const unblockUser = async (id) => {
  const response = await api.post(`/api/admin/users/${id}/unblock`);
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.patch(
    `/api/admin/users/${id}/toggle-status`
  );
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/admin/users/${id}`);
  return response.data;
};

/* ============================================================
   SUBSCRIPTIONS
============================================================ */

export const getSubscriptionStats = async () => {
  const response = await api.get("/api/admin/subscription/stats");
  return response.data;
};

export const getAllSubscriptions = async (
  page = 0,
  size = 10
) => {
  const response = await api.get("/api/admin/subscription/all", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const getUserSubscription = async (userId) => {
  const response = await api.get(
    `/api/admin/subscription/user/${userId}`
  );

  return response.data;
};

export const upgradeSubscription = async (
  userId,
  newPlan
) => {
  const response = await api.post(
    `/api/admin/subscription/user/${userId}/upgrade`,
    null,
    {
      params: {
        newPlan,
      },
    }
  );

  return response.data;
};

export const getSubscriptionsByPlan = async (
  plan,
  page = 0,
  size = 10
) => {
  const response = await api.get(
    `/api/admin/subscription/by-plan/${plan}`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return response.data;
};

/* ============================================================
   EXPORT
============================================================ */

export default {
  getDashboardStats,

  getAnalyticsDashboard,
  getSystemStats,
  getDailyMetrics,
  getMostViewedProperties,
  getMostActiveAuctions,
  getTopBidders,

  getAllUsers,
  getUserById,
  approveUser,
  rejectUser,
  verifyUser,
  blockUser,
  unblockUser,
  toggleUserStatus,
  deleteUser,

  getSubscriptionStats,
  getAllSubscriptions,
  getUserSubscription,
  upgradeSubscription,
  getSubscriptionsByPlan,
};