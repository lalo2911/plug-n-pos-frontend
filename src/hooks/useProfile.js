import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { profileSchema } from '@/pages/profile/profileSchema';
import { toast } from 'sonner';

export function useProfile() {
    const { currentUser, updateUser } = useAuth();
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            currentPassword: '',
            password: '',
            confirmPassword: '',
        }
    });

    const { reset, watch, setError } = form;
    const watchPassword = watch('password');

    const updateProfileMutation = useMutation({
        mutationFn: async (userData) => {
            return await authApi.updateProfile(userData);
        },
        retry: false,
        onSuccess: (data) => {
            updateUser(data.data);
            queryClient.setQueryData(['profile'], data.data);
            reset({
                name: data.data.name,
                email: data.data.email,
                currentPassword: '',
                password: '',
                confirmPassword: '',
            });
            toast.success('Perfil actualizado correctamente');
        },
        onError: (error) => {
            const message = error?.response?.data?.message;
            toast.error(message || 'Error al actualizar perfil');

            if (message?.toLowerCase().includes('contraseña actual')) {
                setError('currentPassword', {
                    type: 'manual',
                    message: message
                });
            }
        }
    });

    const onSubmit = useCallback((data) => {
        const userData = {
            name: data.name,
            email: data.email,
        };

        if (data.password && data.password.length > 0) {
            userData.password = data.password;
            if (currentUser?.authSource === 'local') {
                userData.currentPassword = data.currentPassword;
            }
        }

        updateProfileMutation.mutate(userData);
    }, [currentUser?.authSource, updateProfileMutation]);

    return {
        form,
        updateProfileMutation,
        onSubmit,
        watchPassword,
        currentUser
    };
}