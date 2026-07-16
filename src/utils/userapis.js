// src/api/userapis.js

import api from "../utils/api"; // Adjust the path if your api.js is elsewhere

const API_BASE = "/user/dashboard";

// ---------------- DASHBOARD STATS ----------------
export const getUserDashboardStats = async () => {
  const res = await api.get(`${API_BASE}/stats`);
  return res.data;
};

// ---------------- USER PROPERTIES ----------------
export const getMyProperties = async () => {
  const res = await api.get(`${API_BASE}/properties`);
  return res.data;
};

// ---------------- ALL USER AUCTIONS ----------------
export const getMyAuctions = async () => {
  const res = await api.get(`${API_BASE}/auctions`);
  return res.data;
};

// ---------------- ACTIVE AUCTIONS ----------------
export const getActiveAuctions = async () => {
  const res = await api.get(`${API_BASE}/auctions/active`);
  return res.data;
};

// ---------------- PENDING AUCTIONS ----------------
export const getPendingAuctions = async () => {
  const res = await api.get(`${API_BASE}/auctions/pending`);
  return res.data;
};

// ---------------- SOLD AUCTIONS ----------------
export const getSoldAuctions = async () => {
  const res = await api.get(`${API_BASE}/auctions/sold`);
  return res.data;
};

// ---------------- REJECTED AUCTIONS ----------------
export const getRejectedAuctions = async () => {
  const res = await api.get(`${API_BASE}/auctions/rejected`);
  return res.data;
};