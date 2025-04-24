import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingBag,
    Search,
    Filter,
    Loader2,
    ChevronDown,
    Eye,
    Clock,
    Check,
    XCircle,
    Truck
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner"

function OrdersManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    // Obtener órdenes
    const { data: orders, isLoading, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await apiClient.get('/orders/business');
            return response.data.data;
        }
    });

    // Actualizar estado de orden
    const updateOrderStatus = async (orderId, status) => {
        try {
            await apiClient.put(`/orders/${orderId}/status`, { status });
            toast({
                title: "Estado actualizado",
                description: `La orden ha sido marcada como ${getStatusLabel(status)}`,
            });
            refetch();
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "No se pudo actualizar el estado",
                variant: "destructive"
            });
        }
    };

    // Filtrar órdenes por término de búsqueda y estado
    const filteredOrders = orders?.filter(order => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Obtener etiqueta y color para el estado
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
            case 'processing':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En proceso</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completada</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelada</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Entregada</Badge>;
            default:
                return <Badge variant="outline">Desconocido</Badge>;
        }
    };

    // Obtener etiqueta para el estado (texto)
    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'processing': return 'En proceso';
            case 'completed': return 'Completada';
            case 'cancelled': return 'Cancelada';
            case 'delivered': return 'Entregada';
            default: return 'Desconocido';
        }
    };

    // Ver detalles de la orden
    const handleViewOrder = (order) => {
        setCurrentOrder(order);
        setIsViewDialogOpen(true);
    };

    // Calcular total de la orden
    const calculateOrderTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Pedidos</h1>
                    <p className="text-gray-500">Gestiona los pedidos de tu negocio</p>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        className="pl-10"
                        placeholder="Buscar por número de orden o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            {statusFilter === 'all' ? 'Todos los estados' : getStatusLabel(statusFilter)}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                            Todos los estados
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                            Pendiente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            En proceso
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Completada
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('delivered')}>
                            <Truck className="mr-2 h-4 w-4 text-purple-500" />
                            Entregada
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Cancelada
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Lista de órdenes */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Pedidos</CardTitle>
                    <CardDescription>
                        {orders?.length} pedidos registrados en total
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            Error al cargar los pedidos
                        </div>
                    ) : filteredOrders?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron pedidos
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Orden</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredOrders?.map((order) => (
                                        <tr key={order._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {order.orderNumber || `#${order._id.substring(0, 8)}`}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {order.customer?.name || 'Cliente anónimo'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {formatPrice(calculateOrderTotal(order.items))}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="flex items-center"
                                                            onClick={() => handleViewOrder(order)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            <span>Ver detalles</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {order.status === 'pending' && (
                                                            <DropdownMenuItem
                                                                onClick={() => updateOrderStatus(order._id, 'processing')}
                                                            >
                                                                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                                                <span>Marcar en proceso</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {['pending', 'processing'].includes(order.status) && (
                                                            <DropdownMenuItem
                                                                onClick={() => updateOrderStatus(order._id, 'completed')}
                                                            >
                                                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                                                <span>Marcar completada</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {order.status === 'completed' && (
                                                            <DropdownMenuItem
                                                                onClick={() => updateOrderStatus(order._id, 'delivered')}
                                                            >
                                                                <Truck className="mr-2 h-4 w-4 text-purple-500" />
                                                                <span>Marcar entregada</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {['pending', 'processing'].includes(order.status) && (
                                                            <DropdownMenuItem
                                                                onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                                                className="text-red-500"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                <span>Cancelar orden</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog para ver detalles de la orden */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalles del Pedido</DialogTitle>
                        <DialogDescription>
                            {currentOrder?.orderNumber || (currentOrder && `#${currentOrder._id.substring(0, 8)}`)}
                        </DialogDescription>
                    </DialogHeader>
                    {currentOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Cliente</h3>
                                    <p>{currentOrder.customer?.name || 'Cliente anónimo'}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Fecha</h3>
                                    <p>{formatDate(currentOrder.createdAt)}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Estado</h3>
                                    <div className="mt-1">{getStatusBadge(currentOrder.status)}</div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Total</h3>
                                    <p className="font-medium">
                                        {formatPrice(calculateOrderTotal(currentOrder.items))}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Productos</h3>
                                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                                    {currentOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} x {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-medium">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 flex justify-between">
                                        <p className="font-medium">Total</p>
                                        <p className="font-medium">
                                            {formatPrice(calculateOrderTotal(currentOrder.items))}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {currentOrder.notes && (
                                <div>
                                    <h3 className="font-medium mb-2">Notas</h3>
                                    <p className="bg-gray-50 rounded-md p-4 text-gray-700">
                                        {currentOrder.notes}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4 justify-end">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Cerrar
                                </Button>
                                {currentOrder.status === 'pending' && (
                                    <Button
                                        onClick={() => {
                                            updateOrderStatus(currentOrder._id, 'processing');
                                            setIsViewDialogOpen(false);
                                        }}
                                    >
                                        Marcar en proceso
                                    </Button>
                                )}
                                {['pending', 'processing'].includes(currentOrder.status) && (
                                    <Button
                                        onClick={() => {
                                            updateOrderStatus(currentOrder._id, 'completed');
                                            setIsViewDialogOpen(false);
                                        }}
                                    >
                                        Marcar completada
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default OrdersManagement;