// src/api/userapis.js
import axios from "axios";

const API_BASE = "http://localhost:8080/api/user/dashboard";

// ---------------- TOKEN HELPER ----------------
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ---------------- DASHBOARD STATS ----------------
export const getUserDashboardStats = async () => {
  const res = await axios.get(`${API_BASE}/stats`, getAuthHeader());
  return res.data;
};

// ---------------- USER PROPERTIES ----------------
export const getMyProperties = async () => {
  const res = await axios.get(`${API_BASE}/properties`, getAuthHeader());
  return res.data;
};

// ---------------- ALL USER AUCTIONS ----------------
export const getMyAuctions = async () => {
  const res = await axios.get(`${API_BASE}/auctions`, getAuthHeader());
  return res.data;
};

// ---------------- ACTIVE AUCTIONS ----------------
export const getActiveAuctions = async () => {
  const res = await axios.get(`${API_BASE}/auctions/active`, getAuthHeader());
  return res.data;
};

// ---------------- PENDING AUCTIONS ----------------
export const getPendingAuctions = async () => {
  const res = await axios.get(`${API_BASE}/auctions/pending`, getAuthHeader());
  return res.data;
};

// ---------------- SOLD AUCTIONS ----------------
export const getSoldAuctions = async () => {
  const res = await axios.get(`${API_BASE}/auctions/sold`, getAuthHeader());
  return res.data;
};

// ---------------- REJECTED AUCTIONS ----------------
export const getRejectedAuctions = async () => {
  const res = await axios.get(`${API_BASE}/auctions/rejected`, getAuthHeader());
  return res.data;
};