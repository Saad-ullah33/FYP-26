import api from "../utils/api"; // Adjust the path if needed

/* =========================================================================
   USER ANALYTICS & INSIGHTS (NEW ENDPOINTS ADDED)
   ========================================================================= */

/**
 * Fetches personalized financial turnover, successful wins, and listing performance
 * GET /api/user/analytics/overview
 */
export const getPersonalAnalyticsOverview = async () => {
  try {
    const response = await api.get("/user/analytics/overview");
    return response.data;
  } catch (err) {
    console.error("Personal analytics dashboard service unreachable:", err);
    return {
      totalBidsPlaced: 0,
      successfulAuctionsWon: 0,
      totalCapitalExpended: 0.0,
      myTotalAuctionsCreated: 0,
      myActiveAuctions: 0,
      mySoldAuctions: 0
    };
  }
};

/* =========================================================================
   USER DASHBOARD METRICS & CORE METADATA
   ========================================================================= */

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/user/dashboard/stats");
    return response.data;
  } catch (err) {
    console.error("Stats endpoint unreachable:", err);
    return { totalProperties: 0, totalAuctions: 0, activeAuctions: 0, pendingAuctions: 0, rejectedAuctions: 0, soldAuctions: 0 };
  }
};

export const getMyProperties = async () => {
  try {
    const response = await api.get("/user/dashboard/properties");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Properties endpoint unreachable:", err);
    return [];
  }
};

/**
 * Fetches auctions linked to the user. Optionally filters by status via request params.
 * GET /api/user/dashboard/auctions?status=ACTIVE
 */
export const getMyAuctions = async (status = null) => {
  try {
    const url = status ? `/user/dashboard/auctions?status=${status}` : "/user/dashboard/auctions";
    const response = await api.get(url);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error(`Auctions endpoint unreachable (filter: ${status}):`, err);
    return [];
  }
};

/* =========================================================================
   PROPERTY MANAGEMENT & AUCTION WORKFLOWS
   ========================================================================= */

export const createPropertyListing = async (formData) => {
  const response = await api.post("/properties/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePropertyListing = async (id, formData) => {
  const response = await api.put(`/properties/id/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePropertyListing = async (id) => {
  const response = await api.delete(`/user/dashboard/properties/${id}`);
  return response.data;
};

/**
 * Places an existing owned property listing onto the auction block.
 * POST /api/user/dashboard/properties/{id}/enable-auction
 * @param {number} id - The Property ID
 * @param {Object} auctionData - The AuctionRequestDTO object { startingPrice, reservePrice, startTime, endTime }
 */
export const enablePropertyAuction = async (id, auctionData) => {
  const response = await api.post(`/user/dashboard/properties/${id}/enable-auction`, auctionData);
  return response.data;
};

/* =========================================================================
   ACCOUNT & PERSONAL IDENTITY SETTINGS
   ========================================================================= */

export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/dashboard/profile");
    return response.data;
  } catch (err) {
    console.error("Profile endpoint unreachable:", err);
    return { fullName: "", email: "", phone: "", city: "", address: "" };
  }
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/user/dashboard/profile", profileData);
  return response.data;
};