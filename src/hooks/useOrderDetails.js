import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderDetailService } from '../services/orderDetailService';

export function useOrderDetails() {
    const queryClient = useQueryClient();

    // Obtener todos los detalles de ordenes
    const orderDetailsQuery = useQuery({
        queryKey: ['orderDetails'],
        queryFn: () => orderDetailService.getAll(),
        select: (data) => data.data, // Extrae el objeto data de la respuesta
    });

    // Obtener un detalle de orden por ID
    const getOrderDetailById = (id) => {
        return useQuery({
            queryKey: ['orderDetails', id],
            queryFn: () => orderDetailService.getById(id),
            select: (data) => data.data,
            enabled: !!id, // Solo ejecuta si hay un ID
        });
    };

    // Obtener un detalle de orden por el ID de la orden (Los detalles de una orden)
    const fetchOrderDetailByOrderId = (id) => orderDetailService.getByOrderId(id);

    // Crear un nuevo detalle de orden
    const createOrderDetail = useMutation({
        mutationFn: (newOrder) => orderDetailService.create(newOrder),
        onSuccess: () => {
            // Invalida la consulta para que se vuelva a cargar
            queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
        },
    });

    // Actualizar un detalle de orden
    const updateOrderDetail = useMutation({
        mutationFn: ({ id, data }) => orderDetailService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
        },
    });

    // Eliminar un detalle de orden
    const deleteOrderDetail = useMutation({
        mutationFn: (id) => orderDetailService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
        },
    });

    return {
        orderDetails: orderDetailsQuery.data,
        isLoading: orderDetailsQuery.isLoading,
        isError: orderDetailsQuery.isError,
        error: orderDetailsQuery.error,
        fetchOrderDetailByOrderId,
        getOrderDetailById,
        createOrderDetail,
        updateOrderDetail,
        deleteOrderDetail,
    };
}
