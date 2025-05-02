import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useOrders() {
    const queryClient = useQueryClient();

    // Obtener todas las ordenes
    const ordersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: () => orderService.getAll(),
        select: (data) => data.data, // Extrae el objeto data de la respuesta
    });

    // Obtener una orden por ID
    const getOrderById = (id) => {
        return useQuery({
            queryKey: ['orders', id],
            queryFn: () => orderService.getById(id),
            select: (data) => data.data,
            enabled: !!id, // Solo ejecuta si hay un ID
        });
    };

    // Crear una nueva orden
    const createOrder = useMutation({
        mutationFn: (newOrder) => orderService.create(newOrder),
        onSuccess: () => {
            // Invalida la consulta para que se vuelva a cargar
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    // Actualizar una orden
    const updateOrder = useMutation({
        mutationFn: ({ id, data }) => orderService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    // Eliminar una orden
    const deleteOrder = useMutation({
        mutationFn: (id) => orderService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        orders: ordersQuery.data,
        isLoading: ordersQuery.isLoading,
        isError: ordersQuery.isError,
        error: ordersQuery.error,
        getOrderById,
        createOrder,
        updateOrder,
        deleteOrder,
    };
}