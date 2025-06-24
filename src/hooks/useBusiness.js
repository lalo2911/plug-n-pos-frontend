import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '@/services/businessService';

export function useBusiness() {
    const queryClient = useQueryClient();

    // Obtener el negocio del usuario actual
    const userBusinessQuery = useQuery({
        queryKey: ['business', 'me'],
        queryFn: () => businessService.getUserBusiness(),
        select: (data) => data.data,
    });

    // Obtener un negocio por ID
    const getBusinessById = (id) => {
        return useQuery({
            queryKey: ['business', id],
            queryFn: () => businessService.getById(id),
            select: (data) => data.data,
            enabled: !!id,
        });
    };

    // Crear un nuevo negocio
    const createBusiness = useMutation({
        mutationFn: (data) => businessService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business'] });
        },
    });

    // Actualizar un negocio existente
    const updateBusiness = useMutation({
        mutationFn: ({ id, data }) => businessService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business'] });
        },
    });

    // Generar código de invitación
    const generateInviteCode = useMutation({
        mutationFn: (data) => businessService.generateInviteCode(data),
    });

    return {
        userBusiness: userBusinessQuery.data,
        isLoading: userBusinessQuery.isLoading,
        isError: userBusinessQuery.isError,
        error: userBusinessQuery.error,
        getBusinessById,
        createBusiness,
        updateBusiness,
        generateInviteCode,
    };
}
