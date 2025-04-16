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

    getProfile: async () => {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await apiClient.get('/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    updateProfile: async (userData) => {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await apiClient.put('/auth/profile', userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    // Método para iniciar el flujo de autenticación con Google
    getGoogleAuthUrl: () => {
        return `${import.meta.env.VITE_API_URL}/auth/google`;
    }
};