import { apiClient } from './apiService';

export const workdayService = {
    // Iniciar jornada laboral para un negocio o empleado específico
    startWorkday: async (userId = null) => {
        const data = userId ? { userId } : {};
        const response = await apiClient.post('/workday/start', data);
        return response.data;
    },

    // Finalizar jornada laboral para un negocio o empleado específico
    endWorkday: async (userId = null) => {
        const data = userId ? { userId } : {};
        const response = await apiClient.post('/workday/end', data);
        return response.data;
    },

    // Obtener estado de jornada laboral para un negocio o empleado específico
    getWorkdayStatus: async (userId = null) => {
        const params = userId ? { userId } : {};
        const response = await apiClient.get('/workday/status', { params });
        return response.data;
    },

    // Obtener estado de jornada laboral para todos los empleados de un negocio
    getAllEmployeesWorkdayStatus: async () => {
        const response = await apiClient.get('/workday/employees');
        return response.data;
    }
};