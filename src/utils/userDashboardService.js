import axios from "axios";

// Pull current origin to maintain perfect proxy context mapping
const BASE_URL = window.location.origin + "/api";

// Create an isolated instance wrapper targeting your backend route structure
const dashboardClient = axios.create({
  baseURL: BASE_URL
});

// Dynamically intercept every outgoing request right before transmission execution
dashboardClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || 
                localStorage.getItem("jwt") || 
                localStorage.getItem("accessToken");
                
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Dynamically configure multipart content-type if raw FormData payload is detected
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/* =========================================================================
   USER DASHBOARD METRICS & CORE METADATA
   ========================================================================= */

export const getDashboardStats = async () => {
  try {
    const response = await dashboardClient.get("/user/dashboard/stats");
    return response.data;
  } catch (err) {
    console.error("Stats endpoint unreachable:", err);
    return { totalProperties: 0, totalAuctions: 0, activeAuctions: 0, pendingAuctions: 0, rejectedAuctions: 0, soldAuctions: 0 };
  }
};

export const getMyProperties = async () => {
  try {
    const response = await dashboardClient.get("/user/dashboard/properties");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Properties endpoint unreachable:", err);
    return [];
  }
};

export const getMyAuctions = async () => {
  try {
    const response = await dashboardClient.get("/user/dashboard/auctions");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Auctions endpoint unreachable:", err);
    return [];
  }
};

/* =========================================================================
   PROPERTY MANAGEMENT CRUD ACTIONS (Directly utilizing our centralized proxy)
   ========================================================================= */

export const createPropertyListing = async (formData) => {
  // Uses multi-part form data implicitly due to our automated interceptor check
  const response = await dashboardClient.post("/properties/create", formData);
  return response.data;
};

export const updatePropertyListing = async (id, formData) => {
  const response = await dashboardClient.put(`/properties/id/${id}`, formData);
  return response.data;
};

export const deletePropertyListing = async (id) => {
  const response = await dashboardClient.delete(`/user/dashboard/properties/${id}`);
  return response.data;
};

export const enablePropertyAuction = async (id) => {
  const response = await dashboardClient.post(`/user/dashboard/properties/${id}/enable-auction`);
  return response.data;
};

/* =========================================================================
   ACCOUNT & PERSONAL IDENTITY SETTINGS
   ========================================================================= */

export const getUserProfile = async () => {
  try {
    const response = await dashboardClient.get("/user/dashboard/profile");
    return response.data;
  } catch (err) {
    console.error("Profile endpoint unreachable:", err);
    return { fullName: "", email: "", phone: "", city: "", address: "" };
  }
};

export const updateUserProfile = async (profileData) => {
  const response = await dashboardClient.put("/user/dashboard/profile", profileData);
  return response.data;
};