import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ejemplo de servicio para categorías
export const categoryService = {
    getAll: async () => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/categories', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    }
};