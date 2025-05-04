import { apiClient } from './apiService';

export const businessService = {
    getDashboardSummary: async () => {
        const response = await apiClient.get('/metrics/dashboard');
        return response.data;
    },

    getTotalSales: async () => {
        const response = await apiClient.get(`/metrics/sales`);
        return response.data;
    },

    getTopSellingProducts: async () => {
        const response = await apiClient.get(`/metrics/top-products`);
        return response.data;
    },

    getSalesByCategory: async () => {
        const response = await apiClient.get(`/metrics/sales-by-category`);
        return response.data;
    },

    getSalesTrend: async () => {
        const response = await apiClient.get(`/metrics/sales-trend`);
        return response.data;
    },
    
    getSalesByHourOfDay: async () => {
        const response = await apiClient.get(`/metrics/sales-by-hour`);
        return response.data;
    },

    getMonthlyComparison: async () => {
        const response = await apiClient.get(`/metrics/monthly-comparison`);
        return response.data;
    },

    getSalesByDayOfWeek: async () => {
        const response = await apiClient.get(`/metrics/sales-by-day`);
        return response.data;
    },
};