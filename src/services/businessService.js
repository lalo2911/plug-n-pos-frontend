import { apiClient } from './apiService';

export const businessService = {
    getUserBusiness: async () => {
        const response = await apiClient.get('/business/me');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/business/${id}`);
        return response.data;
    },

    generateInviteCode: async (data) => {
        const response = await apiClient.post('/business/invite-code', data);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/business', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/business/${id}`, data);
        return response.data;
    },
};