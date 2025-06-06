import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newOrder) => orderService.create(newOrder),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}
