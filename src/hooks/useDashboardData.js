import { useState } from 'react';
import { useMetrics } from './useMetrics';

/**
 * Hook personalizado para gestionar todos los datos del dashboard
 * 
 * @param {Object} options - Opciones para el hook
 * @param {number} options.topProductsLimit - Límite de productos top
 * @param {number} options.salesTrendDays - Días para la tendencia de ventas
 * @returns {Object} - Estado de los datos y funciones de control
 */
export function useDashboardData({
    topProductsLimit = 3,
    salesTrendDays = 6
} = {}) {
    // Estado para controlar los filtros
    const [filters, setFilters] = useState({
        topProductsLimit,
        salesTrendDays
    });

    // Obtener fecha de hoy solo una vez (cuando se monta el componente)
    const [todayDate] = useState(() => {
        const today = new Date();
        return today.toISOString();
    });

    // Usar el hook de métricas con los parámetros
    const metricsData = useMetrics({
        filtersPerQuery: {
            salesByHour: {
                startDate: todayDate,
                endDate: todayDate
            }
        },
        topProducts: {
            limit: filters.topProductsLimit
        },
        trendDays: {
            days: filters.salesTrendDays
        }
    });

    // Funciones para actualizar filtros
    const updateTopProductsLimit = (limit) => {
        setFilters(prev => ({ ...prev, topProductsLimit: limit }));
    };

    const updateSalesTrendDays = (days) => {
        setFilters(prev => ({ ...prev, salesTrendDays: days }));
    };

    return {
        // Datos y estados de carga/error
        ...metricsData,

        // Filtros actuales
        filters,

        // Funciones para actualizar filtros
        updateTopProductsLimit,
        updateSalesTrendDays
    };
}

export default useDashboardData;