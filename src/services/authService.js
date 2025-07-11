import { apiClient } from './apiService';

export const authApi = {
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    logoutAllDevices: async () => {
        const response = await apiClient.post('/auth/logout-all');
        return response.data;
    },

    refreshToken: async () => {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    },

    // Intercambiar código temporal por datos de autenticación
    exchangeAuthCode: async (code) => {
        const response = await apiClient.post('/auth/exchange-code', { code });
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/profile', config);
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await apiClient.put('/auth/profile', userData);
        return response.data;
    },

    // Método para iniciar el flujo de autenticación con Google
    getGoogleAuthUrl: () => {
        return `${import.meta.env.VITE_API_URL}/auth/google`;
    }
};