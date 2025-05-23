import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../hooks/useBusiness';
import { useMetrics } from '../../hooks/useMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Package,
    ShoppingBag,
    Copy,
    CheckCircle,
    TrendingUp,
    BadgeDollarSign,
    RefreshCw,
    Loader2,
    CalendarDays,
    Calendar,
} from 'lucide-react';
import { toast } from "sonner"

function AdminDashboard() {
    const { currentUser } = useAuth();
    const [copiedCode, setCopiedCode] = useState(null);
    const [inviteCode, setInviteCode] = useState(null);
    const { generateInviteCode } = useBusiness();

    const {
        dashboardSummary,
        isDashboardLoading,
        isDashboardError,
        dashboardError
    } = useMetrics();

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Generar código de invitación
    const handleGenerateInviteCode = () => {
        generateInviteCode.mutate(
            {},
            {
                onSuccess: (data) => {
                    setInviteCode(data.data);
                    toast.success("Código generado", {
                        description: "Se ha generado un nuevo código de invitación",
                    });
                },
                onError: (error) => {
                    toast.error("Error", {
                        description: error.response?.data?.message || "No se pudo generar el código de invitación",
                    });
                }
            }
        );
    };

    // Copiar código al portapapeles
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => {
            setCopiedCode(null);
        }, 3000);
        toast.success("Código copiado", {
            description: "El código ha sido copiado al portapapeles",
        });
    };

    if (isDashboardLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Cargando datos del dashboard...</span>
            </div>
        );
    }

    if (isDashboardError) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-red-600">Error al cargar datos</h2>
                    <p className="text-gray-500">{dashboardError?.message || "No se pudieron cargar los datos del dashboard"}</p>
                    <Button className="mt-4" onClick={() => window.location.reload()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    // Datos del dashboard
    const salesData = dashboardSummary?.sales || {};
    const inventoryData = dashboardSummary?.inventory || {};
    const topProducts = dashboardSummary?.topProducts || [];

    return (
        <div className="space-y-6 select-none">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Bienvenido de nuevo, {currentUser?.name}</p>
                </div>
            </div>

            {/* Stats Cards - Prioridad a ventas y pedidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
                        <BadgeDollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{formatCurrency(salesData.today?.amount || 0)}</div>
                        <p className="text-xs text-gray-500">{salesData.today?.orderCount || 0} pedidos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Ventas Semana</CardTitle>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{formatCurrency(salesData.thisWeek?.amount || 0)}</div>
                        <p className="text-xs text-gray-500">{salesData.thisWeek?.orderCount || 0} pedidos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Ventas Mes</CardTitle>
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{formatCurrency(salesData.thisMonth?.amount || 0)}</div>
                        <p className="text-xs text-gray-500">{salesData.thisMonth?.orderCount || 0} pedidos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{formatCurrency(salesData.thisMonth?.averageOrder || 0)}</div>
                        <p className="text-xs text-gray-500">Este mes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="flex flex-col">
                    <CardHeader className="mt-4">
                        <CardTitle className="text-xl">Top Productos</CardTitle>
                        <CardDescription>Los productos más vendidos este mes</CardDescription>
                    </CardHeader>
                    <CardContent className="mb-4 flex-grow">
                        <div className="space-y-4">
                            {topProducts.slice(0, 5).map((product, index) => (
                                <div key={product._id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 mr-2">{index + 1}.</span>
                                        <span>{product.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Badge variant="outline" className="bg-gray-50">
                                            {product.totalQuantity} uds.
                                        </Badge>
                                        <span className="font-semibold">{formatCurrency(product.totalRevenue)}</span>
                                    </div>
                                </div>
                            ))}
                            {topProducts.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    No hay datos de productos disponibles
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Invite Employees Section */}
                <Card className="flex flex-col">
                    <CardHeader className="mt-4">
                        <CardTitle className="text-xl">Invitar Empleados</CardTitle>
                        <CardDescription>Genera un código único para que tus empleados se unan a tu negocio</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center mb-4">
                        <div className="flex flex-col space-y-2">
                            <span className="text-sm text-gray-500">Este código será válido por 7 días y solo puede ser usado una vez.</span>

                            {inviteCode ? (
                                <div className="flex items-center mt-2">
                                    <div className="relative flex-1">
                                        <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50">
                                            <span className="font-mono text-lg tracking-wider">{inviteCode.code}</span>
                                            <Badge variant="outline" className="ml-2">Válido por 7 días</Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(inviteCode.code)}
                                    >
                                        {copiedCode === inviteCode.code ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleGenerateInviteCode}
                                    disabled={generateInviteCode.isPending}
                                    className="mt-2"
                                >
                                    {generateInviteCode.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Generar Código de Invitación
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Summary Section */}
            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader className="mt-4">
                        <CardTitle className="text-xl">Resumen de Ventas</CardTitle>
                        <CardDescription>Datos generales de ventas y operación</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <BadgeDollarSign className="h-5 w-5 text-gray-700" />
                                <span className="text-sm font-medium">Ventas Totales</span>
                            </div>
                            <div className="text-2xl font-bold">{formatCurrency(salesData.total?.amount || 0)}</div>
                            <p className="text-xs text-gray-500 mt-1">{salesData.total?.orderCount || 0} pedidos totales</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="h-5 w-5 text-gray-700" />
                                <span className="text-sm font-medium">Ticket Promedio Total</span>
                            </div>
                            <div className="text-2xl font-bold">{formatCurrency(salesData.total?.averageOrder || 0)}</div>
                            <p className="text-xs text-gray-500 mt-1">Promedio histórico</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <Package className="h-5 w-5 text-gray-700" />
                                <span className="text-sm font-medium">Inventario</span>
                            </div>
                            <div className="text-2xl font-bold">{inventoryData.totalProducts || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">Productos en {inventoryData.totalCategories || 0} categorías</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminDashboard;