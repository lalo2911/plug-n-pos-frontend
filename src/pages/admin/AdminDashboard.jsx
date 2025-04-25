import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Package,
    Users,
    ShoppingBag,
    Tag,
    Copy,
    Check,
    TrendingUp,
    BadgeDollarSign
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

    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

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

    const generateInviteCode = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/business/invite-code');
            if (response.data && response.data.success) {
                setInviteCode(response.data.data.code);
                setIsCopied(false);
            }
        } catch (error) {
            console.error('Error al generar código de invitación:', error);
            toast({
                title: "Error",
                description: "No se pudo generar el código de invitación",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteCode)
            .then(() => {
                setIsCopied(true);
                toast({
                    title: "Código copiado",
                    description: "El código ha sido copiado al portapapeles",
                });
                setTimeout(() => setIsCopied(false), 3000);
            })
            .catch((error) => {
                console.error('Error al copiar:', error);
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
                                            <span className="font-mono text-lg tracking-wider">{inviteCode}</span>
                                            <Badge variant="outline" className="ml-2">Válido por 7 días</Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="ml-2"
                                        onClick={copyInviteCode}
                                    >
                                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={generateInviteCode}
                                    disabled={isLoading}
                                    className="mt-2"
                                >
                                    {isLoading ? 'Generando...' : 'Generar Código de Invitación'}
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