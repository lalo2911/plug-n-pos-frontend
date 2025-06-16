import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workdayService } from '@/services/workdayService';
import { useAuth } from '@/context/AuthContext';
import { useSSE } from './useSSE';

/**
 * Hook específico para manejar el estado de workday de todos los empleados
 * Solo debe usarse en componentes del owner (como EmployeesManagement)
 */
export function useEmployeesWorkday() {
    const queryClient = useQueryClient();
    const { isAuthenticated, loading } = useAuth();

    const isQueryEnabled = isAuthenticated && !loading;

    // Manejar mensajes SSE para actualizar lista de empleados
    const handleSSEMessage = (message) => {
        switch (message.type) {
            case 'workday_change':
                // Solo actualizar la lista de empleados en lugar de invalidar todo
                if (message.data && message.userId) {
                    queryClient.setQueryData(['employees', 'workday-status'], (oldData) => {
                        if (!oldData?.data) return oldData;

                        return {
                            ...oldData,
                            data: oldData.data.map(employee =>
                                employee._id === message.userId
                                    ? {
                                        ...employee,
                                        workdayStatus: message.data.isActive,
                                        activatedAt: message.data.activatedAt,
                                        deactivatedAt: message.data.deactivatedAt
                                    }
                                    : employee
                            )
                        };
                    });
                }
                break;
        }
    };

    // Una sola conexión SSE para el owner
    const { connectionState, isConnected } = useSSE(
        '/workday/stream',
        handleSSEMessage,
        isQueryEnabled
    );

    // Query para obtener todos los empleados con su estado de workday
    const employeesWorkdayQuery = useQuery({
        queryKey: ['employees', 'workday-status'],
        queryFn: () => workdayService.getAllEmployeesWorkdayStatus(),
        select: (data) => data.data,
        enabled: isQueryEnabled,
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchInterval: !isConnected ? 60000 : false, // Polling solo si SSE no está conectado
    });

    // Mutaciones para controlar workday individual
    const startEmployeeWorkday = useMutation({
        mutationFn: (userId) => workdayService.startWorkday(userId),
        onSuccess: () => {
            // Solo invalidar la lista de empleados
            queryClient.invalidateQueries({ queryKey: ['employees', 'workday-status'] });
        },
    });

    const endEmployeeWorkday = useMutation({
        mutationFn: (userId) => workdayService.endWorkday(userId),
        onSuccess: () => {
            // Solo invalidar la lista de empleados
            queryClient.invalidateQueries({ queryKey: ['employees', 'workday-status'] });
        },
    });

    // Mutaciones para controlar workday general
    const startAllWorkday = useMutation({
        mutationFn: () => workdayService.startWorkday(null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', 'workday-status'] });
            queryClient.invalidateQueries({ queryKey: ['workday', 'status', 'general'] });
        },
    });

    const endAllWorkday = useMutation({
        mutationFn: () => workdayService.endWorkday(null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', 'workday-status'] });
            queryClient.invalidateQueries({ queryKey: ['workday', 'status', 'general'] });
        },
    });

    return {
        employees: employeesWorkdayQuery.data,
        isLoading: employeesWorkdayQuery.isLoading,
        isError: employeesWorkdayQuery.isError,
        error: employeesWorkdayQuery.error,
        refetch: employeesWorkdayQuery.refetch,

        // Individual employee actions
        startEmployeeWorkday,
        endEmployeeWorkday,

        // Bulk actions
        startAllWorkday,
        endAllWorkday,

        // SSE status
        sseConnected: isConnected,
        sseConnectionState: connectionState,
    };
}