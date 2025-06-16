import { useState } from 'react';
import useDashboardData from '@/hooks/useDashboardData';

import PageHeader from '../PageHeader';

// Componentes de tarjetas
import TotalSalesCard from './TotalSalesCard';
import AverageTicketCard from './AverageTicketCard';
import MonthlyComparisonCard from './MonthlyComparisonCard';

// Componentes de gráficas
import SalesTrendChart from './SalesTrendChart';
import CategorySalesChart from './CategorySalesChart';
import WeekdaySalesChart from './WeekdaySalesChart';
import HourlySalesChart from './HourlySalesChart';

// Componente de productos
import TopSellingProducts from './TopSellingProducts';

function AdminCharts() {
    // Estado para limitar productos top
    const [topProductsLimit] = useState(3);

    // Estado para limitar los dias de la tendencia de ventas
    const [salesTrendDays] = useState(6);

    // Usar el hook con los parámetros
    const {
        // Datos
        totalSales,
        topSellingProducts,
        salesByCategory,
        salesTrend,
        salesByHour,
        monthlyComparison,
        salesByDayOfWeek,

        // Estados de carga
        isTotalSalesLoading,
        isTopSellingProductsLoading,
        isSalesByCategoryLoading,
        isSalesTrendLoading,
        isSalesByHourLoading,
        isMonthlyComparisonLoading,
        isSalesByDayOfWeekLoading,

        // Estados de error
        isTotalSalesError,
        isTopSellingProductsError,
        isSalesByCategoryError,
        isSalesTrendError,
        isSalesByHourError,
        isMonthlyComparisonError,
        isSalesByDayOfWeekError,
    } = useDashboardData({
        enabled: {
            totalSales: true,
            topSellingProducts: true,
            salesByCategory: true,
            salesTrend: true,
            salesByHour: true,
            monthlyComparison: true,
            salesByDayOfWeek: true,
        },
        topProductsLimit,
        salesTrendDays
    });

    return (
        <div className="space-y-6 select-none">
            <PageHeader
                title="Panel de Métricas"
                description="Visualiza los datos clave de tu negocio"
            />

            {/* Resumen de ventas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TotalSalesCard
                    data={totalSales}
                    isLoading={isTotalSalesLoading}
                    isError={isTotalSalesError}
                />

                <AverageTicketCard
                    data={totalSales}
                    isLoading={isTotalSalesLoading}
                    isError={isTotalSalesError}
                />

                <MonthlyComparisonCard
                    data={monthlyComparison}
                    isLoading={isMonthlyComparisonLoading}
                    isError={isMonthlyComparisonError}
                />
            </div>

            {/* Gráficas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tendencia de ventas */}
                <SalesTrendChart
                    data={salesTrend}
                    isLoading={isSalesTrendLoading}
                    isError={isSalesTrendError}
                />

                {/* Ventas por categoría */}
                <CategorySalesChart
                    data={salesByCategory}
                    isLoading={isSalesByCategoryLoading}
                    isError={isSalesByCategoryError}
                />

                {/* Ventas por día de la semana */}
                <WeekdaySalesChart
                    data={salesByDayOfWeek}
                    isLoading={isSalesByDayOfWeekLoading}
                    isError={isSalesByDayOfWeekError}
                />

                {/* Ventas por hora */}
                <HourlySalesChart
                    data={salesByHour}
                    isLoading={isSalesByHourLoading}
                    isError={isSalesByHourError}
                />
            </div>

            {/* Productos más vendidos */}
            <TopSellingProducts
                products={topSellingProducts}
                isLoading={isTopSellingProductsLoading}
                isError={isTopSellingProductsError}
                limit={topProductsLimit}
            />
        </div>
    );
}

export default AdminCharts;