import { apiClient } from './apiService';

export const orderDetailService = {
    getAll: async () => {
        const response = await apiClient.get('/order-details');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/order-details/${id}`);
        return response.data;
    },

    getByOrderId: async (id) => {
        const response = await apiClient.get(`/order-details/order/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/order-details', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/order-details/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/order-details/${id}`);
        return response.data;
    }
};
