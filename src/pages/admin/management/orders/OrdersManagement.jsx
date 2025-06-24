import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { useProducts } from '@/hooks/useProducts';
import { useEmployees } from '@/hooks/useEmployees';
import SearchBar from '../SearchBar';
import OrdersTable from './OrdersTable';
import PageHeader from '../../PageHeader';
import OrderDetailsDialog from './OrderDetailsDialog';
import { toast } from "sonner";

function OrdersManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const { orders, isLoading, isError, error } = useOrders();
    const { employees } = useEmployees();
    const { fetchOrderDetailByOrderId } = useOrderDetails();
    const { products } = useProducts();

    const getProductInfo = (id) => products?.find(p => p._id === id);
    const getEmployeeNameById = (id) => employees?.find(e => e._id === id)?.name || 'Empleado desconocido';

    const handleViewOrderDetails = async (order) => {
        setSelectedOrder(order);
        setIsLoadingDetails(true);
        try {
            const result = await fetchOrderDetailByOrderId(order._id);
            setOrderDetails(result.data || []);
        } catch {
            toast.error("Error", { description: "No se pudieron cargar los detalles de la orden" });
            setOrderDetails([]);
        } finally {
            setIsLoadingDetails(false);
            setIsOrderDetailsOpen(true);
        }
    };

    const filteredOrders = (orders?.filter(order => {
        const employeeName = getEmployeeNameById(order.user_id)?.toLowerCase() || '';
        const orderDate = new Date(order.createdAt).toLocaleDateString() || '';
        return (
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_id?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employeeName.includes(searchTerm.toLowerCase()) ||
            orderDate.includes(searchTerm.toLowerCase())
        );
    }) || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pedidos"
                description="Gestiona los pedidos de tu negocio"
            />

            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID de orden, responsable o fecha..."
            />

            <OrdersTable
                orders={orders}
                isLoading={isLoading}
                isError={isError}
                error={error}
                filteredOrders={filteredOrders}
                getEmployeeNameById={getEmployeeNameById}
                onViewDetails={handleViewOrderDetails}
            />

            <OrderDetailsDialog
                open={isOrderDetailsOpen}
                onClose={() => setIsOrderDetailsOpen(false)}
                selectedOrder={selectedOrder}
                orderDetails={orderDetails}
                isLoadingDetails={isLoadingDetails}
                getEmployeeNameById={getEmployeeNameById}
                getProductInfo={getProductInfo}
            />
        </div>
    );
}

export default OrdersManagement;
