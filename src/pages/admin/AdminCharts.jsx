import React, { useState } from 'react';
import { useMetrics } from '../../hooks/useMetrics';
import {
    Loader2,
    Activity,
    TrendingUp,
    Calendar,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Colores para las gráficas
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

function AdminCharts() {
    // Estado para limitar productos top
    const [topProductsLimit, setTopProductsLimit] = useState(3);

    // Estado para limitar los dias de la tendencia de ventas
    const [salesTrendDays, setSalesTrendDays] = useState(6);

    const [selectedTrendView, setSelectedTrendView] = useState('sales');

    // Usar el hook con los parámetros
    const {
        totalSales,
        isTotalSalesLoading,
        isTotalSalesError,

        topSellingProducts,
        isTopSellingProductsLoading,
        isTopSellingProductsError,

        salesByCategory,
        isSalesByCategoryLoading,
        isSalesByCategoryError,

        salesTrend,
        isSalesTrendLoading,
        isSalesTrendError,

        salesByHour,
        isSalesByHourLoading,
        isSalesByHourError,

        monthlyComparison,
        isMonthlyComparisonLoading,
        isMonthlyComparisonError,

        salesByDayOfWeek,
        isSalesByDayOfWeekLoading,
        isSalesByDayOfWeekError,

        // // Funciones de recarga
        // refetchTopSellingProducts,
        // refetchSalesTrend
    } = useMetrics({
        topProducts: {
            limit: topProductsLimit
        },
        trendDays: {
            days: salesTrendDays
        }
    });

    // Formatear fechas para ventas por tendencia
    const formattedSalesTrend = salesTrend?.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' })
    }));

    // Formatear horas para ventas por hora
    const formattedSalesByHour = salesByHour?.map(item => ({
        ...item,
        hourFormatted: `${item.hour}:00`
    }));

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="space-y-6 select-none">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Panel de Métricas</h1>
                    <p className="text-gray-500">Visualiza los datos clave de tu negocio</p>
                </div>
            </div>

            {/* Resumen de ventas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isTotalSalesLoading ? (
                    <Card className="flex items-center justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </Card>
                ) : isTotalSalesError ? (
                    <Card className="p-6">
                        <p className="text-red-500">Error al cargar datos de ventas</p>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mt-4">
                                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="mb-4">
                                <div className="text-2xl font-bold">{formatCurrency(totalSales?.amount || 0)}</div>
                                <p className="text-xs text-muted-foreground">
                                    {totalSales?.orderCount || 0} pedidos
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mt-4">
                                <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="mb-4">
                                <div className="text-2xl font-bold">{formatCurrency(totalSales?.averageOrder || 0)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Por pedido
                                </p>
                            </CardContent>
                        </Card>

                        {isMonthlyComparisonLoading ? (
                            <Card className="flex items-center justify-center p-6">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </Card>
                        ) : isMonthlyComparisonError ? (
                            <Card className="p-6">
                                <p className="text-red-500">Error al cargar comparación mensual</p>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mt-4">
                                    <CardTitle className="text-sm font-medium">Comparación Mensual</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="mb-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl font-bold">{formatCurrency(monthlyComparison?.currentMonth?.amount || 0)}</div>
                                        <div className={cn(
                                            "ml-2 flex items-center text-sm",
                                            monthlyComparison?.changes?.salesChange > 0 ? "text-green-500" : "text-red-500"
                                        )}>
                                            {monthlyComparison?.changes?.salesChange > 0 ? (
                                                <ArrowUp className="h-4 w-4 mr-1" />
                                            ) : (
                                                <ArrowDown className="h-4 w-4 mr-1" />
                                            )}
                                            {Math.abs(monthlyComparison?.changes?.salesChange || 0).toFixed(1)}%
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Comparado con {monthlyComparison?.lastMonth?.name || 'mes anterior'}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>

            {/* Gráficas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tendencia de ventas */}
                <Card className="col-span-1 h-96">
                    <CardHeader className="mt-4">
                        <CardTitle>Tendencia de Ventas</CardTitle>
                        <CardDescription>Últimos 7 días</CardDescription>
                        <Tabs defaultValue="sales" className="w-full">
                            <TabsList className="grid grid-cols-2 w-64">
                                <TabsTrigger value="sales" onClick={() => setSelectedTrendView('sales')}>Ventas</TabsTrigger>
                                <TabsTrigger value="orders" onClick={() => setSelectedTrendView('orders')}>Pedidos</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="h-72 mb-4">
                        {isSalesTrendLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : isSalesTrendError ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-red-500">Error al cargar tendencia de ventas</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={formattedSalesTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => selectedTrendView === 'sales' ?
                                            [`$${value.toLocaleString('es-MX')}`, 'Ventas'] :
                                            [value, 'Pedidos']}
                                        labelFormatter={(label) => `Fecha: ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={selectedTrendView === 'sales' ? 'totalSales' : 'orderCount'}
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Ventas por categoría */}
                <Card className="col-span-1 h-96">
                    <CardHeader className="mt-4">
                        <CardTitle>Ventas por Categoría</CardTitle>
                        <CardDescription>Distribución de ventas por categoría</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 mb-4">
                        {isSalesByCategoryLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : isSalesByCategoryError ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-red-500">Error al cargar datos de categorías</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartPieChart>
                                    <Pie
                                        data={salesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="totalSales"
                                        nameKey="name"
                                    >
                                        {salesByCategory?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']}
                                    />
                                    <Legend />
                                </RechartPieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Ventas por día de la semana */}
                <Card className="col-span-1 h-96">
                    <CardHeader className="mt-4">
                        <CardTitle>Ventas por Día de la Semana</CardTitle>
                        <CardDescription>Distribución de ventas por día</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 mb-4">
                        {isSalesByDayOfWeekLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : isSalesByDayOfWeekError ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-red-500">Error al cargar datos por día</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesByDayOfWeek?.sort((a, b) => a.dayNumber - b.dayNumber)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']}
                                        labelFormatter={(label) => `Día: ${label}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="totalSales" name="Ventas" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Ventas por hora */}
                <Card className="col-span-1 h-96">
                    <CardHeader className="mt-4">
                        <CardTitle>Ventas por Hora</CardTitle>
                        <CardDescription>Distribución de ventas a lo largo del día</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 mb-4">
                        {isSalesByHourLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : isSalesByHourError ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-red-500">Error al cargar datos por hora</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={formattedSalesByHour}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hourFormatted" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']}
                                        labelFormatter={(label) => `Hora: ${label}`}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalSales" name="Ventas" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Productos más vendidos */}
            <Card>
                <CardHeader className="mt-4">
                    <CardTitle>Productos Más Vendidos</CardTitle>
                    <CardDescription>Top 3 productos por ventas</CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    {isTopSellingProductsLoading ? (
                        <div className="h-24 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : isTopSellingProductsError ? (
                        <div className="h-24 flex items-center justify-center">
                            <p className="text-red-500">Error al cargar productos más vendidos</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topSellingProducts?.map((product, index) => (
                                <Card key={product._id} className={cn(
                                    "border-0 shadow-md",
                                    index === 0 ? "bg-amber-50" : index === 1 ? "bg-gray-50" : "bg-orange-50"
                                )}>
                                    <CardHeader className="pb-2 mt-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                                            <div className={cn(
                                                "flex items-center justify-center rounded-full w-6 h-6 text-xs font-bold text-white",
                                                index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-500" : "bg-orange-500"
                                            )}>
                                                {index + 1}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="mb-4">
                                        <div className="text-lg font-bold">{formatCurrency(product.totalRevenue)}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {product.totalQuantity} unidades vendidas
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminCharts;