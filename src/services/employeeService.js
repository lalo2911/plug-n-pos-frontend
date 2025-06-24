import { apiClient } from './apiService';

export const employeeService = {
    getByBusinessId: async () => {
        const response = await apiClient.get(`/users/business`);
        return response.data;
    }
};
