import api from "./api"; // Adjust the path if your api.js is in a different folder

const API_BASE_URL = "/predictions";

export const predictionService = {
    // Get single prediction
    getPrediction: async (propertyId) => {
        const response = await api.get(`${API_BASE_URL}/${propertyId}`);
        return response.data;
    },

    // Get predictive breakdown matrices
    getExplanation: async (propertyId) => {
        const response = await api.get(`${API_BASE_URL}/${propertyId}/explanation`);
        return response.data;
    },

    // Batch compare properties
    getBatchPredictions: async (propertyIds) => {
        const response = await api.post(`${API_BASE_URL}/batch`, { propertyIds });
        return response.data;
    },

    // Model accuracy badge data
    getModelAccuracy: async () => {
        const response = await api.get(`${API_BASE_URL}/model/accuracy`);
        return response.data;
    },

    // Admin/Agent: Submit real closed transaction numbers
    recordActualPrice: async (propertyId, actualPrice) => {
        const response = await api.post(
            `${API_BASE_URL}/${propertyId}/record-actual-price`,
            { actualPrice }
        );
        return response.data;
    }
};