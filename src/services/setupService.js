import { apiClient } from './apiService';

export const setupService = {
    setOwner: async (data) => {
        const response = await apiClient.post('/users/setup', data);
        return response.data;
    },

    setEmployee: async (data) => {
        const response = await apiClient.post('/users/join-business', data);
        return response.data;
    },
};