import { useQuery } from '@tanstack/react-query';
import { businessService } from '../services/metricService';

export function useMetrics() {
    // Obtener el resumen del dashboard
    const dashboardSummaryQuery = useQuery({
        queryKey: ['metrics', 'dashboard'],
        queryFn: () => businessService.getDashboardSummary(),
        select: (data) => data.data, // Extrae el objeto data de la respuesta
    });

    // Obtener ventas totales
    const totalSalesQuery = useQuery({
        queryKey: ['metrics', 'sales'],
        queryFn: () => businessService.getTotalSales(),
        select: (data) => data.data,
    });

    // Obtener productos más vendidos
    const topSellingProductsQuery = useQuery({
        queryKey: ['metrics', 'top-products'],
        queryFn: () => businessService.getTopSellingProducts(),
        select: (data) => data.data,
    });

    // Obtener ventas por categoría
    const salesByCategoryQuery = useQuery({
        queryKey: ['metrics', 'sales-by-category'],
        queryFn: () => businessService.getSalesByCategory(),
        select: (data) => data.data,
    });

    // Obtener tendencia de ventas
    const salesTrendQuery = useQuery({
        queryKey: ['metrics', 'sales-trend'],
        queryFn: () => businessService.getSalesTrend(),
        select: (data) => data.data,
    });

    // Obtener ventas por hora del día
    const salesByHourQuery = useQuery({
        queryKey: ['metrics', 'sales-by-hour'],
        queryFn: () => businessService.getSalesByHourOfDay(),
        select: (data) => data.data,
    });

    // Obtener comparación mensual
    const monthlyComparisonQuery = useQuery({
        queryKey: ['metrics', 'monthly-comparison'],
        queryFn: () => businessService.getMonthlyComparison(),
        select: (data) => data.data,
    });

    // Obtener ventas por día de la semana
    const salesByDayOfWeekQuery = useQuery({
        queryKey: ['metrics', 'sales-by-day'],
        queryFn: () => businessService.getSalesByDayOfWeek(),
        select: (data) => data.data,
    });

    return {
        // Dashboard summary
        dashboardSummary: dashboardSummaryQuery.data,
        isDashboardLoading: dashboardSummaryQuery.isLoading,
        isDashboardError: dashboardSummaryQuery.isError,
        dashboardError: dashboardSummaryQuery.error,

        // Total sales
        totalSales: totalSalesQuery.data,
        isTotalSalesLoading: totalSalesQuery.isLoading,
        isTotalSalesError: totalSalesQuery.isError,
        totalSalesError: totalSalesQuery.error,

        // Top selling products
        topSellingProducts: topSellingProductsQuery.data,
        isTopSellingProductsLoading: topSellingProductsQuery.isLoading,
        isTopSellingProductsError: topSellingProductsQuery.isError,
        topSellingProductsError: topSellingProductsQuery.error,

        // Sales by category
        salesByCategory: salesByCategoryQuery.data,
        isSalesByCategoryLoading: salesByCategoryQuery.isLoading,
        isSalesByCategoryError: salesByCategoryQuery.isError,
        salesByCategoryError: salesByCategoryQuery.error,

        // Sales trend
        salesTrend: salesTrendQuery.data,
        isSalesTrendLoading: salesTrendQuery.isLoading,
        isSalesTrendError: salesTrendQuery.isError,
        salesTrendError: salesTrendQuery.error,

        // Sales by hour
        salesByHour: salesByHourQuery.data,
        isSalesByHourLoading: salesByHourQuery.isLoading,
        isSalesByHourError: salesByHourQuery.isError,
        salesByHourError: salesByHourQuery.error,

        // Monthly comparison
        monthlyComparison: monthlyComparisonQuery.data,
        isMonthlyComparisonLoading: monthlyComparisonQuery.isLoading,
        isMonthlyComparisonError: monthlyComparisonQuery.isError,
        monthlyComparisonError: monthlyComparisonQuery.error,

        // Sales by day of week
        salesByDayOfWeek: salesByDayOfWeekQuery.data,
        isSalesByDayOfWeekLoading: salesByDayOfWeekQuery.isLoading,
        isSalesByDayOfWeekError: salesByDayOfWeekQuery.isError,
        salesByDayOfWeekError: salesByDayOfWeekQuery.error,
    };
}