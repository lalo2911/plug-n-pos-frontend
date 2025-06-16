import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workdayService } from '../services/workdayService';
import { useAuth } from '../context/AuthContext';

export function useWorkday(userId = null) {
    const queryClient = useQueryClient();
    const { isAuthenticated, loading } = useAuth();

    // Solo habilitar las queries si el usuario está autenticado y la carga de autenticación ha terminado
    const isQueryEnabled = isAuthenticated && !loading;

    // Consulta para el estado de jornada laboral de un empleado específico
    const userWorkdayStatusQuery = useQuery({
        queryKey: ['workday', 'employee', userId], // queryKey única para el estado del empleado
        queryFn: () => workdayService.getWorkdayStatus(userId),
        select: (data) => data.data,
        refetchInterval: isQueryEnabled && userId ? 60000 : false, // Refetch cada minuto solo si está enabled Y hay userId
        enabled: isQueryEnabled && !!userId, // Habilitar solo si autenticado Y userId está presente
    });

    // Consulta para el estado general del negocio (sin userId)
    const generalWorkdayStatusQuery = useQuery({
        queryKey: ['workday', 'status', 'general'], // queryKey única para el estado general
        queryFn: () => workdayService.getWorkdayStatus(null), // Llama sin userId
        select: (data) => data.data,
        refetchInterval: false, // No hacer polling automático para consulta general
        enabled: isQueryEnabled && userId === null, // Solo habilitar cuando explícitamente userId sea null
    });

    // Iniciar jornada laboral
    const startWorkday = useMutation({
        mutationFn: (targetUserId = null) => workdayService.startWorkday(targetUserId || userId),
        onSuccess: () => {
            // Invalidar todas las consultas relacionadas con jornadas laborales
            // Esto invalidará tanto ['workday', 'employee', userId] como ['workday', 'status', 'general']
            queryClient.invalidateQueries({ queryKey: ['workday'] });
        },
    });

    // Finalizar jornada laboral
    const endWorkday = useMutation({
        mutationFn: (targetUserId = null) => workdayService.endWorkday(targetUserId || userId),
        onSuccess: () => {
            // Invalidar todas las consultas relacionadas con jornadas laborales
            queryClient.invalidateQueries({ queryKey: ['workday'] });
        },
    });

    // Determinar qué datos de estado de jornada laboral se deben retornar
    // Si se pasó un userId, priorizamos los datos de 'userWorkdayStatusQuery'.
    // De lo contrario, usamos los datos de 'generalWorkdayStatusQuery'.
    const currentWorkdayStatus = userId ? userWorkdayStatusQuery.data : generalWorkdayStatusQuery.data;
    const currentIsLoadingStatus = userId ? userWorkdayStatusQuery.isLoading : generalWorkdayStatusQuery.isLoading;
    const currentIsErrorStatus = userId ? userWorkdayStatusQuery.isError : generalWorkdayStatusQuery.isError;
    const currentErrorStatus = userId ? userWorkdayStatusQuery.error : generalWorkdayStatusQuery.error;
    const currentRefetchStatus = userId ? userWorkdayStatusQuery.refetch : generalWorkdayStatusQuery.refetch;


    return {
        // Queries para el estado de jornada laboral (específico de usuario o general)
        workdayStatus: currentWorkdayStatus,
        isWorkdayActive: currentWorkdayStatus?.isActive || false,
        isLoadingStatus: currentIsLoadingStatus,
        isErrorStatus: currentIsErrorStatus,
        errorStatus: currentErrorStatus,

        // Actions
        startWorkday,
        endWorkday,

        // Helpers para refetch
        refetchStatus: currentRefetchStatus,
    };
}