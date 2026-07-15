import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/predictions';

// Set up interceptor to automatically attach JWT tokens if stored in localStorage
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const predictionService = {
    // Get single prediction
    getPrediction: async (propertyId) => {
        const response = await axios.get(`${API_BASE_URL}/${propertyId}`);
        return response.data;
    },

    // Get predictive breakdown matrices
    getExplanation: async (propertyId) => {
        const response = await axios.get(`${API_BASE_URL}/${propertyId}/explanation`);
        return response.data;
    },

    // Batch compare properties
    getBatchPredictions: async (propertyIds) => {
        const response = await axios.post(`${API_BASE_URL}/batch`, { propertyIds });
        return response.data;
    },

    // Model accuracy badge data
    getModelAccuracy: async () => {
        const response = await axios.get(`${API_BASE_URL}/model/accuracy`);
        return response.data;
    },

    // Admin/Agent: Submit real closed transaction numbers
    recordActualPrice: async (propertyId, actualPrice) => {
        const response = await axios.post(`${API_BASE_URL}/${propertyId}/record-actual-price`, { actualPrice });
        return response.data;
    }
};