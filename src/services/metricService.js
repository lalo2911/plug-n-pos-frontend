import { apiClient } from './apiService';
import queryString from 'query-string';

export const businessService = {
    // Función auxiliar para manejar parámetros
    buildUrlWithParams: (endpoint, params = {}) => {
        // Filtra los parámetros que tienen valores (ignora null, undefined, '')
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        // Si no hay parámetros, devuelve solo el endpoint
        if (Object.keys(filteredParams).length === 0) {
            return endpoint;
        }

        // Construye la URL con los parámetros
        return `${endpoint}?${queryString.stringify(filteredParams)}`;
    },

    getDashboardSummary: async () => {
        const response = await apiClient.get('/metrics/dashboard');
        return response.data;
    },

    getTotalSales: async (params = {}) => {
        const url = businessService.buildUrlWithParams('/metrics/sales', params);
        const response = await apiClient.get(url);
        return response.data;
    },

    getTopSellingProducts: async (params = {}) => {
        const url = businessService.buildUrlWithParams('/metrics/top-products', params);
        const response = await apiClient.get(url);
        return response.data;
    },

    getSalesByCategory: async (params = {}) => {
        const url = businessService.buildUrlWithParams('/metrics/sales-by-category', params);
        const response = await apiClient.get(url);
        return response.data;
    },

    getSalesTrend: async (params = {}) => {
        const url = businessService.buildUrlWithParams('/metrics/sales-trend', params);
        const response = await apiClient.get(url);
        return response.data;
    },

    getSalesByHourOfDay: async (params = {}) => {
        const url = businessService.buildUrlWithParams('/metrics/sales-by-hour', params);
        const response = await apiClient.get(url);
        return response.data;
    },

    getMonthlyComparison: async () => {
        const response = await apiClient.get('/metrics/monthly-comparison');
        return response.data;
    },

    getSalesByDayOfWeek: async (params = {}) => {
        const url = businessService.buildUrlWithParams('/metrics/sales-by-day', params);
        const response = await apiClient.get(url);
        return response.data;
    },
};