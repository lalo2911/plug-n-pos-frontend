import { Button } from '@/components/ui/button';
import { Loader2, User, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatOrderDate, formatPrice, getShortId } from '../../../../utils/formatters';

function OrdersTable({ orders, isLoading, isError, error, filteredOrders, getEmployeeNameById, onViewDetails }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-center py-8 text-red-500">Error al cargar los pedidos: {error?.message || "Error desconocido"}</div>;
    }

    if (filteredOrders.length === 0) {
        return <div className="text-center py-8 text-gray-500">No se encontraron pedidos</div>;
    }

    return (
        <Card>
            <CardHeader className="mt-4">
                <CardTitle>Historial de Pedidos</CardTitle>
                <CardDescription>{orders.length} pedidos registrados en total</CardDescription>
            </CardHeader>
            <CardContent className="mb-4">
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
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{getShortId(order._id)}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-gray-400" />
                                            {getEmployeeNameById(order.user_id)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            {formatOrderDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex items-center">
                                            {formatPrice(order.total)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{formatPrice(order.payment)}</td>
                                    <td className="p-4 align-middle">{formatPrice(order.change)}</td>
                                    <td className="p-4 align-middle">
                                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(order)}>
                                            <Eye className="h-4 w-4 mr-1" /> Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export default OrdersTable;
