import axios from "axios";

export const BASE_URL = "http://localhost:8080/api/properties";

// ---------------- TOKEN HELPER ----------------
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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

  const res = await axios.post(
    `${BASE_URL}/create`,
    formData,
    {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// ---------------- GET ALL PROPERTIES ----------------
export const getAllProperties = async () => {
  const res = await axios.get(`${BASE_URL}/getAllProperties`, getAuthHeader());
  return res.data;
};

// ---------------- PAGINATED SEARCH ----------------
export const searchProperties = async (params = {}) => {
  const res = await axios.get(`${BASE_URL}`, {
    ...getAuthHeader(),
    params, // cityId, propertyType, purpose, minPrice, maxPrice, page, size
  });
  return res.data;
};

// ---------------- GET PROPERTY BY ID ----------------
export const getPropertyById = async (id) => {
  const res = await axios.get(`${BASE_URL}/id/${id}`, getAuthHeader());
  return res.data;
};

// ---------------- DELETE PROPERTY ----------------
export const deleteProperty = async (id) => {
  const res = await axios.delete(`${BASE_URL}/id/${id}`, getAuthHeader());
  return res.data;
};

// ---------------- PROPERTY TYPES ----------------
export const getPropertyTypes = async () => {
  const res = await axios.get(`${BASE_URL}/property-types`);
  return res.data;
};

// ---------------- PROPERTY BY TYPE ----------------
export const getPropertiesByType = async (type) => {
  const res = await axios.get(`${BASE_URL}/type/${type}`, getAuthHeader());
  return res.data;
};

// ---------------- AI SCORE ----------------
export const getPropertyScore = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}/score`, getAuthHeader());
  return res.data;
};
export default propertyApi;