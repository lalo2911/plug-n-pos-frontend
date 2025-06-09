import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workdayService } from '@/services/workdayService';
import { useAuth } from '@/context/AuthContext';
import { useSSE } from './useSSE';
import { useState } from 'react';

export function useWorkday(options = {}) {
    const {
        userId = null,
        enableSSE = true,
        enablePolling = false,
        role = 'employee' // 'owner' | 'employee'
    } = options;

    const queryClient = useQueryClient();
    const { isAuthenticated, loading, currentUser } = useAuth();
    const [sseEnabled, setSseEnabled] = useState(enableSSE && role === 'employee');

    const isQueryEnabled = isAuthenticated && !loading;

    // Manejar mensajes SSE - Solo para employees
    const handleSSEMessage = (message) => {
        switch (message.type) {
            case 'initial_status':
                // Solo actualizar si es para este usuario específico o es estado general
                if (message.data) {
                    const queryKey = userId ? ['workday', 'employee', userId] : ['workday', 'status', 'general'];
                    queryClient.setQueryData(queryKey, { data: message.data });
                }
                break;

            case 'workday_change':
                const isGeneralChange = message.userId === null;
                const isSpecificForMe = message.userId === userId;
                const isForCurrentUser = message.userId === currentUser?._id;

                // Solo actualizar datos específicos, no invalidar todo
                if (message.data) {
                    const updatedData = {
                        isActive: message.data.isActive,
                        activatedAt: message.data.activatedAt,
                        deactivatedAt: message.data.deactivatedAt,
                        activatedBy: message.data.activatedBy,
                        deactivatedBy: message.data.deactivatedBy
                    };

                    // Actualizar queries específicas sin invalidar
                    if (isGeneralChange) {
                        // Cambio general - actualizar estado general y del usuario actual
                        queryClient.setQueryData(['workday', 'status', 'general'], { data: updatedData });
                        if (currentUser?._id) {
                            queryClient.setQueryData(['workday', 'employee', currentUser._id], { data: updatedData });
                        }
                    } else if (isSpecificForMe || isForCurrentUser) {
                        // Cambio específico para este usuario
                        const queryKey = userId ? ['workday', 'employee', userId] : ['workday', 'employee', message.userId];
                        queryClient.setQueryData(queryKey, { data: updatedData });
                    }
                }
                break;

            case 'heartbeat':
                // No hacer nada
                break;
        }
    };

    // SSE solo para employees
    const { connectionState, isConnected, reconnect } = useSSE(
        '/workday/stream',
        handleSSEMessage,
        isQueryEnabled && sseEnabled && role === 'employee'
    );

    // Query para empleado específico
    const userWorkdayStatusQuery = useQuery({
        queryKey: ['workday', 'employee', userId],
        queryFn: () => workdayService.getWorkdayStatus(userId),
        select: (data) => data.data,
        enabled: isQueryEnabled && !!userId,
        staleTime: isConnected && role === 'employee' ? 10 * 60 * 1000 : 2 * 60 * 1000,
        refetchInterval: enablePolling && (!isConnected || role === 'owner') ? 30000 : false,
        refetchOnWindowFocus: role === 'owner', // Solo para owners
    });

    // Query general
    const generalWorkdayStatusQuery = useQuery({
        queryKey: ['workday', 'status', 'general'],
        queryFn: () => workdayService.getWorkdayStatus(null),
        select: (data) => data.data,
        enabled: isQueryEnabled && userId === null,
        staleTime: isConnected && role === 'employee' ? 10 * 60 * 1000 : 2 * 60 * 1000,
        refetchInterval: enablePolling && (!isConnected || role === 'owner') ? 30000 : false,
        refetchOnWindowFocus: role === 'owner',
    });

    // Mutaciones con invalidación selectiva
    const startWorkday = useMutation({
        mutationFn: (targetUserId = null) => workdayService.startWorkday(targetUserId || userId),
        onSuccess: (data, variables) => {
            // Solo invalidar queries específicas
            const targetId = variables || userId;
            if (targetId) {
                queryClient.invalidateQueries({ queryKey: ['workday', 'employee', targetId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['workday', 'status', 'general'] });
            }
        },
    });

    const endWorkday = useMutation({
        mutationFn: (targetUserId = null) => workdayService.endWorkday(targetUserId || userId),
        onSuccess: (data, variables) => {
            // Solo invalidar queries específicas
            const targetId = variables || userId;
            if (targetId) {
                queryClient.invalidateQueries({ queryKey: ['workday', 'employee', targetId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['workday', 'status', 'general'] });
            }
        },
    });

    // Determinar datos actuales
    const currentWorkdayStatus = userId ? userWorkdayStatusQuery.data : generalWorkdayStatusQuery.data;
    const currentIsLoadingStatus = userId ? userWorkdayStatusQuery.isLoading : generalWorkdayStatusQuery.isLoading;
    const currentIsErrorStatus = userId ? userWorkdayStatusQuery.isError : generalWorkdayStatusQuery.isError;
    const currentErrorStatus = userId ? userWorkdayStatusQuery.error : generalWorkdayStatusQuery.error;
    const currentRefetchStatus = userId ? userWorkdayStatusQuery.refetch : generalWorkdayStatusQuery.refetch;

    return {
        workdayStatus: currentWorkdayStatus,
        isWorkdayActive: currentWorkdayStatus?.isActive || false,
        isLoadingStatus: currentIsLoadingStatus,
        isErrorStatus: currentIsErrorStatus,
        errorStatus: currentErrorStatus,

        // Actions
        startWorkday,
        endWorkday,

        // Helpers
        refetchStatus: currentRefetchStatus,

        // SSE status (solo relevante para employees)
        sseConnectionState: role === 'employee' ? connectionState : 'disabled',
        sseConnected: role === 'employee' ? isConnected : false,
        reconnectSSE: role === 'employee' ? reconnect : () => { },
        toggleSSE: (enabled) => setSseEnabled(enabled && role === 'employee')
    };
}