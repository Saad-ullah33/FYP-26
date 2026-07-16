import api from "../utils/api";

export const BASE_URL = "/properties";

// ---------------- CREATE PROPERTY (MULTIPART) ----------------
// IMPORTANT: must send FormData (property JSON + images)
export const createProperty = async (propertyData, images = []) => {
  const formData = new FormData();

  // property JSON must be sent as Blob
  formData.append(
    "property",
    new Blob([JSON.stringify(propertyData)], {
      type: "application/json",
    })
  );

  // images array
  images.forEach((img) => {
    formData.append("images", img);
  });

  const res = await api.post(`${BASE_URL}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ---------------- GET ALL PROPERTIES ----------------
export const getAllProperties = async () => {
  const res = await api.get(`${BASE_URL}/getAllProperties`);
  return res.data;
};

// ---------------- PAGINATED SEARCH ----------------
export const searchProperties = async (params = {}) => {
  const res = await api.get(`${BASE_URL}`, {
    params,
  });

  return res.data;
};

// ---------------- GET PROPERTY BY ID ----------------
export const getPropertyById = async (id) => {
  const res = await api.get(`${BASE_URL}/id/${id}`);
  return res.data;
};

// ---------------- DELETE PROPERTY ----------------
export const deleteProperty = async (id) => {
  const res = await api.delete(`${BASE_URL}/id/${id}`);
  return res.data;
};

// ---------------- PROPERTY TYPES ----------------
export const getPropertyTypes = async () => {
  const res = await api.get(`${BASE_URL}/property-types`);
  return res.data;
};

// ---------------- PROPERTY BY TYPE ----------------
export const getPropertiesByType = async (type) => {
  const res = await api.get(`${BASE_URL}/type/${type}`);
  return res.data;
};

// ---------------- AI SCORE ----------------
export const getPropertyScore = async (id) => {
  const res = await api.get(`${BASE_URL}/${id}/score`);
  return res.data;
};