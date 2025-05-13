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

    // Obtener fecha de hoy en la zona horaria local (del navegador)
    // No necesitamos ajustar a UTC, ya que el backend hará los cálculos adecuados
    const [todayDates] = useState(() => {
        const today = new Date();

        // La fecha tal como es - el backend se encargará de interpretarla en la zona horaria correcta
        return {
            startDate: today.toISOString(),
            endDate: today.toISOString()
        };
    });

    // Usar el hook de métricas con los parámetros
    const metricsData = useMetrics({
        filtersPerQuery: {
            salesByHour: {
                startDate: todayDates.startDate,
                endDate: todayDates.endDate
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