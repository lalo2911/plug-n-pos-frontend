import { useQuery } from '@tanstack/react-query';
import { businessService } from '../services/metricService';

export function useMetrics(options = {}) {
    const {
        filters = {}, // Filtros globales (startDate, endDate)
        topProducts = {}, // Opciones específicas para productos top
        trendDays = {}, // Dias que muestra salesTrend
        enabled = {
            dashboard: true,
            totalSales: true,
            topSellingProducts: true,
            salesByCategory: true,
            salesTrend: true,
            salesByHour: true,
            monthlyComparison: true,
            salesByDayOfWeek: true,
        }
    } = options;

    // Preparar parámetros globales
    const globalParams = {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
    };

    // Obtener el resumen del dashboard
    const dashboardSummaryQuery = useQuery({
        queryKey: ['metrics', 'dashboard'],
        queryFn: () => businessService.getDashboardSummary(),
        select: (data) => data.data, // Extrae el objeto data de la respuesta
        enabled: enabled.dashboard,
    });

    // Obtener ventas totales
    const totalSalesQuery = useQuery({
        queryKey: ['metrics', 'sales', globalParams],
        queryFn: () => businessService.getTotalSales(globalParams),
        select: (data) => data.data,
        enabled: enabled.totalSales,
    });

    // Obtener productos más vendidos
    const topSellingProductsQuery = useQuery({
        queryKey: ['metrics', 'top-products', { ...globalParams, limit: topProducts.limit }],
        queryFn: () => businessService.getTopSellingProducts({
            ...globalParams,
            limit: topProducts.limit
        }),
        select: (data) => data.data,
        enabled: enabled.topSellingProducts,
    });

    // Obtener ventas por categoría
    const salesByCategoryQuery = useQuery({
        queryKey: ['metrics', 'sales-by-category', globalParams],
        queryFn: () => businessService.getSalesByCategory(globalParams),
        select: (data) => data.data,
        enabled: enabled.salesByCategory,
    });

    // Obtener tendencia de ventas
    const salesTrendQuery = useQuery({
        queryKey: ['metrics', 'sales-trend', {...globalParams, days: trendDays.days }],
        queryFn: () => businessService.getSalesTrend({
            ...globalParams,
            days: trendDays.days
        }),
        select: (data) => data.data,
        enabled: enabled.salesTrend,
    });

    // Obtener ventas por hora del día
    const salesByHourQuery = useQuery({
        queryKey: ['metrics', 'sales-by-hour', globalParams],
        queryFn: () => businessService.getSalesByHourOfDay(globalParams),
        select: (data) => data.data,
        enabled: enabled.salesByHour,
    });

    // Obtener comparación mensual
    const monthlyComparisonQuery = useQuery({
        queryKey: ['metrics', 'monthly-comparison'],
        queryFn: () => businessService.getMonthlyComparison(),
        select: (data) => data.data,
        enabled: enabled.monthlyComparison,
    });

    // Obtener ventas por día de la semana
    const salesByDayOfWeekQuery = useQuery({
        queryKey: ['metrics', 'sales-by-day', globalParams],
        queryFn: () => businessService.getSalesByDayOfWeek(globalParams),
        select: (data) => data.data,
        enabled: enabled.salesByDayOfWeek,
    });

    return {
        // Dashboard summary
        dashboardSummary: dashboardSummaryQuery.data,
        isDashboardLoading: dashboardSummaryQuery.isLoading,
        isDashboardError: dashboardSummaryQuery.isError,
        dashboardError: dashboardSummaryQuery.error,
        refetchDashboard: dashboardSummaryQuery.refetch,

        // Total sales
        totalSales: totalSalesQuery.data,
        isTotalSalesLoading: totalSalesQuery.isLoading,
        isTotalSalesError: totalSalesQuery.isError,
        totalSalesError: totalSalesQuery.error,
        refetchTotalSales: totalSalesQuery.refetch,

        // Top selling products
        topSellingProducts: topSellingProductsQuery.data,
        isTopSellingProductsLoading: topSellingProductsQuery.isLoading,
        isTopSellingProductsError: topSellingProductsQuery.isError,
        topSellingProductsError: topSellingProductsQuery.error,
        refetchTopSellingProducts: topSellingProductsQuery.refetch,

        // Sales by category
        salesByCategory: salesByCategoryQuery.data,
        isSalesByCategoryLoading: salesByCategoryQuery.isLoading,
        isSalesByCategoryError: salesByCategoryQuery.isError,
        salesByCategoryError: salesByCategoryQuery.error,
        refetchSalesByCategory: salesByCategoryQuery.refetch,

        // Sales trend
        salesTrend: salesTrendQuery.data,
        isSalesTrendLoading: salesTrendQuery.isLoading,
        isSalesTrendError: salesTrendQuery.isError,
        salesTrendError: salesTrendQuery.error,
        refetchSalesTrend: salesTrendQuery.refetch,

        // Sales by hour
        salesByHour: salesByHourQuery.data,
        isSalesByHourLoading: salesByHourQuery.isLoading,
        isSalesByHourError: salesByHourQuery.isError,
        salesByHourError: salesByHourQuery.error,
        refetchSalesByHour: salesByHourQuery.refetch,

        // Monthly comparison
        monthlyComparison: monthlyComparisonQuery.data,
        isMonthlyComparisonLoading: monthlyComparisonQuery.isLoading,
        isMonthlyComparisonError: monthlyComparisonQuery.isError,
        monthlyComparisonError: monthlyComparisonQuery.error,
        refetchMonthlyComparison: monthlyComparisonQuery.refetch,

        // Sales by day of week
        salesByDayOfWeek: salesByDayOfWeekQuery.data,
        isSalesByDayOfWeekLoading: salesByDayOfWeekQuery.isLoading,
        isSalesByDayOfWeekError: salesByDayOfWeekQuery.isError,
        salesByDayOfWeekError: salesByDayOfWeekQuery.error,
        refetchSalesByDayOfWeek: salesByDayOfWeekQuery.refetch,
    };
}