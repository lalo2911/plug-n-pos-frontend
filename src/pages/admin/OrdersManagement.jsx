import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { useProducts } from '../../hooks/useProducts';
import { useEmployees } from '../../hooks/useEmployees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ImageIcon,
    Search,
    Loader2,
    Eye,
    User,
    Calendar,
    Package
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function OrdersManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const {
        orders,
        isLoading,
        isError,
        error,
    } = useOrders();

    const { employees } = useEmployees();

    const { fetchOrderDetailByOrderId } = useOrderDetails();

    const { products } = useProducts();

    const getProductInfo = (id) => products?.find(p => p._id === id);

    const getEmployeeNameById = (id) => {
        const employee = employees?.find(e => e._id === id);
        return employee?.name || 'Empleado desconocido';
    };

    // Ver detalles de la orden
    const handleViewOrderDetails = async (order) => {
        setSelectedOrder(order);
        setIsLoadingDetails(true);

        try {
            const result = await fetchOrderDetailByOrderId(order._id);
            if (result.data) {
                setOrderDetails(result.data);
            } else {
                setOrderDetails([]);
            }
        } catch (error) {
            toast.error("Error", {
                description: "No se pudieron cargar los detalles de la orden",
            });
            setOrderDetails([]);
        } finally {
            setIsLoadingDetails(false);
            setIsOrderDetailsDialogOpen(true);
        }
    };

    // Filtrar órdenes por término de búsqueda
    const filteredOrders = orders?.filter(order => {
        const employeeName = getEmployeeNameById(order.user_id)?.toLowerCase() || '';
        const orderDate = new Date(order.createdAt).toLocaleDateString() || '';

        return (
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_id?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employeeName.includes(searchTerm.toLowerCase()) ||
            orderDate.includes(searchTerm.toLowerCase())
        );
    });


    // Formatear precio desde Decimal128
    const formatPrice = (price) => {
        if (!price) return '$0.00';

        // Si es un objeto Decimal128, extraer el valor
        const numericValue = price.$numberDecimal ? parseFloat(price.$numberDecimal) : parseFloat(price);

        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(numericValue);
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

    // Generar un ID corto para mostrar
    const getShortId = (id) => {
        return id ? `#${id.substring(0, 8)}` : 'N/A';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Pedidos</h1>
                    <p className="text-gray-500">Gestiona los pedidos de tu negocio</p>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    className="pl-10"
                    placeholder="Buscar por ID de orden, responsable o fecha..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista de órdenes */}
            <Card>
                <CardHeader className="mt-4">
                    <CardTitle>Historial de Pedidos</CardTitle>
                    <CardDescription>
                        {orders?.length} pedidos registrados en total
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-red-500">
                            Error al cargar los pedidos: {error?.message || "Error desconocido"}
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
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Responsable</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pago</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cambio</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredOrders?.map((order) => (
                                        <tr key={order._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {getShortId(order._id)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                                    {getEmployeeNameById(order.user_id)}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatDate(order.createdAt)}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex items-center">
                                                    {formatPrice(order.total)}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {formatPrice(order.payment)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {formatPrice(order.change)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewOrderDetails(order)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Detalles
                                                </Button>
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
            <Dialog open={isOrderDetailsDialogOpen} onOpenChange={setIsOrderDetailsDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Detalles del Pedido</DialogTitle>
                        <DialogDescription>
                            {selectedOrder && getShortId(selectedOrder._id)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Responsable</h3>
                                    <p className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        {getEmployeeNameById(selectedOrder.user_id)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Fecha</h3>
                                    <p className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        {formatDate(selectedOrder.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Total</h3>
                                    <p className="font-medium flex items-center">
                                        {formatPrice(selectedOrder.total)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500">Pago / Cambio</h3>
                                    <p>
                                        {formatPrice(selectedOrder.payment)} / {formatPrice(selectedOrder.change)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2 flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Productos en este pedido
                                </h3>
                                {isLoadingDetails ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                                    </div>
                                ) : orderDetails.length === 0 ? (
                                    <div className="bg-gray-50 rounded-md p-4 text-gray-500 text-center">
                                        No se encontraron detalles para esta orden
                                    </div>
                                ) : (
                                    <div className="bg-gray-50/75 rounded-md">
                                        <ScrollArea className="h-48">
                                            <div className="p-4 space-y-3">
                                                {orderDetails.map((detail) => {
                                                    const product = getProductInfo(detail.product_id);
                                                    return (
                                                        <div key={detail._id} className="flex justify-between items-center pb-2 last:pb-0">
                                                            <div className="flex items-center space-x-3">
                                                                {product?.image_url ? (
                                                                    <img
                                                                        src={product.image_url}
                                                                        alt={product.name}
                                                                        className="h-10 w-10 object-cover rounded-md"
                                                                    />
                                                                ) : (
                                                                    <ImageIcon className="h-10 w-10 text-gray-400" />
                                                                )}
                                                                <div>
                                                                    <p className="font-medium">{product?.name || 'Producto desconocido'}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        Cantidad: {detail.quantity}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="font-medium">
                                                                {formatPrice(detail.subtotal)}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                        <div className="border-t p-4 flex justify-between rounded-b-md">
                                            <p className="font-medium">Total</p>
                                            <p className="font-medium">
                                                {formatPrice(selectedOrder.total)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOrderDetailsDialogOpen(false)}>
                                    Cerrar
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default OrdersManagement;