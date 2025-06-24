import { apiClient } from './apiService';

export const orderService = {
    getAll: async () => {
        const response = await apiClient.get('/orders');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/orders', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/orders/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/orders/${id}`);
        return response.data;
    }
};
