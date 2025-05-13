import { useQuery } from '@tanstack/react-query';
import { metricService } from '../services/metricService';

export function useMetrics(options = {}) {
    const {
        filters = {}, // Filtros globales (startDate, endDate)
        filtersPerQuery = {}, // Filtros específicos por query
        topProducts = {},
        trendDays = {},
        enabled: userEnabled = {}
    } = options;

    const defaultEnabled = {
        dashboard: false,
        totalSales: false,
        topSellingProducts: false,
        salesByCategory: false,
        salesTrend: false,
        salesByHour: false,
        monthlyComparison: false,
        salesByDayOfWeek: false,
    };

    const enabled = { ...defaultEnabled, ...userEnabled };

    console.log("Merged enabled flags:", enabled);

    // Filtros generales
    const globalParams = {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
    };

    // Parámetros por cada consulta (combinan global + específicos)
    const totalSalesParams = { ...globalParams, ...(filtersPerQuery.totalSales || {}) };
    const topProductsParams = { ...globalParams, ...(filtersPerQuery.topSellingProducts || {}), limit: topProducts.limit };
    const salesByCategoryParams = { ...globalParams, ...(filtersPerQuery.salesByCategory || {}) };
    const salesTrendParams = { ...globalParams, ...(filtersPerQuery.salesTrend || {}), days: trendDays.days };
    const salesByHourParams = { ...globalParams, ...(filtersPerQuery.salesByHour || {}) };
    const salesByDayParams = { ...globalParams, ...(filtersPerQuery.salesByDayOfWeek || {}) };

    // Queries
    const dashboardSummaryQuery = useQuery({
        queryKey: ['metrics', 'dashboard'],
        queryFn: () => metricService.getDashboardSummary(),
        select: (data) => data.data,
        enabled: enabled.dashboard,
    });

    const totalSalesQuery = useQuery({
        queryKey: ['metrics', 'sales', totalSalesParams],
        queryFn: () => metricService.getTotalSales(totalSalesParams),
        select: (data) => data.data,
        enabled: enabled.totalSales,
    });

    const topSellingProductsQuery = useQuery({
        queryKey: ['metrics', 'top-products', topProductsParams],
        queryFn: () => metricService.getTopSellingProducts(topProductsParams),
        select: (data) => data.data,
        enabled: enabled.topSellingProducts,
    });

    const salesByCategoryQuery = useQuery({
        queryKey: ['metrics', 'sales-by-category', salesByCategoryParams],
        queryFn: () => metricService.getSalesByCategory(salesByCategoryParams),
        select: (data) => data.data,
        enabled: enabled.salesByCategory,
    });

    const salesTrendQuery = useQuery({
        queryKey: ['metrics', 'sales-trend', salesTrendParams],
        queryFn: () => metricService.getSalesTrend(salesTrendParams),
        select: (data) => data.data,
        enabled: enabled.salesTrend,
    });

    const salesByHourQuery = useQuery({
        queryKey: ['metrics', 'sales-by-hour', salesByHourParams],
        queryFn: () => metricService.getSalesByHourOfDay(salesByHourParams),
        select: (data) => data.data,
        enabled: enabled.salesByHour,
    });

    const monthlyComparisonQuery = useQuery({
        queryKey: ['metrics', 'monthly-comparison'],
        queryFn: () => metricService.getMonthlyComparison(),
        select: (data) => data.data,
        enabled: enabled.monthlyComparison,
    });

    const salesByDayOfWeekQuery = useQuery({
        queryKey: ['metrics', 'sales-by-day', salesByDayParams],
        queryFn: () => metricService.getSalesByDayOfWeek(salesByDayParams),
        select: (data) => data.data,
        enabled: enabled.salesByDayOfWeek,
    });

    // Retorno estructurado
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
