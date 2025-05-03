import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../hooks/useBusiness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Package,
    Users,
    ShoppingBag,
    Tag,
    Copy,
    CheckCircle,
    TrendingUp,
    BadgeDollarSign,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { toast } from "sonner"

function AdminDashboard() {
    const { currentUser } = useAuth();

    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        employees: 0,
        orders: 0
    });

    const [copiedCode, setCopiedCode] = useState(null);

    // Estado para almacenar el código de invitación
    const [inviteCode, setInviteCode] = useState(null);

    const { generateInviteCode } = useBusiness();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // En una implementación real, estas solicitudes deberían hacerse a endpoints específicos
                // Por ahora simulamos datos estáticos
                setStats({
                    products: 24,
                    categories: 6,
                    employees: 3,
                    orders: 158
                });
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
            }
        };

        fetchStats();
    }, []);

    // Generar código de invitación
    const handleGenerateInviteCode = () => {
        generateInviteCode.mutate(
            {},
            {
                onSuccess: (data) => {
                    // Guardar el código generado en el estado
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

    return (
        <div className="space-y-6 select-none">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Bienvenido de nuevo, {currentUser?.name}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Productos</CardTitle>
                        <Package className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{stats.products}</div>
                        <p className="text-xs text-gray-500">Productos registrados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Categorías</CardTitle>
                        <Tag className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{stats.categories}</div>
                        <p className="text-xs text-gray-500">Categorías activas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Empleados</CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{stats.employees}</div>
                        <p className="text-xs text-gray-500">Equipo de trabajo</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                        <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="text-2xl font-bold">{stats.orders}</div>
                        <p className="text-xs text-gray-500">Total de pedidos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Invite Code Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Overview */}
                <Card>
                    <CardHeader className="mt-4">
                        <CardTitle className="text-xl">Resumen de Ventas</CardTitle>
                        <CardDescription>Ventas y tendencias de los últimos 30 días</CardDescription>
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <BadgeDollarSign className="h-5 w-5 mr-2" />
                                    <span>Ingresos totales</span>
                                </div>
                                <span className="font-semibold">$14,580.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    <span>Pedidos completados</span>
                                </div>
                                <span className="font-semibold">126</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2" />
                                    <span>Ticket promedio</span>
                                </div>
                                <span className="font-semibold">$115.71</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Invite Employees Section */}
                <Card>
                    <CardHeader className="mt-6">
                        <CardTitle className="text-xl">Invitar Empleados</CardTitle>
                        <CardDescription>Genera un código único para que tus empleados se unan a tu negocio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
        </div>
    );
}

export default AdminDashboard;