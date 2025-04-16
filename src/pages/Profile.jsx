import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApiService';
import { useAuth } from '../context/AuthContext';

// Definir esquema de validación con Zod
const profileSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
    confirmPassword: z.string().min(6, 'La confirmación de contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
}).refine(data => !data.password || !data.confirmPassword || data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

function Profile() {
    const { currentUser, login } = useAuth();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            password: '',
            confirmPassword: '',
        }
    });

    // Obtener datos del perfil
    const { data: profileData, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: authApi.getProfile,
        onSuccess: (data) => {
            reset({
                name: data.data.name,
                email: data.data.email,
                password: '',
                confirmPassword: '',
            });
        },
    });

    // Actualizar perfil
    const updateProfileMutation = useMutation({
        mutationFn: (userData) => authApi.updateProfile(userData),
        onSuccess: (data) => {
            login({
                ...currentUser,
                ...data.data,
            });
            reset({
                name: data.data.name,
                email: data.data.email,
                password: '',
                confirmPassword: '',
            });
        },
    });

    const onSubmit = (data) => {
        // Solo incluir contraseña si se proporcionó
        const userData = {
            name: data.name,
            email: data.email,
        };

        if (data.password) {
            userData.password = data.password;
        }

        updateProfileMutation.mutate(userData);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Cargando...</div>;
    }

    return (
        <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

            <div className="flex items-center mb-6">
                {currentUser?.avatar ? (
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-16 w-16 rounded-full mr-4"
                    />
                ) : (
                    <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-gray-600">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                <div>
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Inicio de sesión: {currentUser?.authSource === 'google' ? 'Google' : 'Email y contraseña'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre Completo
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo Electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled={currentUser?.authSource === 'google'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                    {currentUser?.authSource === 'google' && (
                        <p className="mt-1 text-xs text-gray-500">El correo no se puede cambiar para cuentas de Google</p>
                    )}
                </div>

                {currentUser?.authSource === 'local' && (
                    <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña (dejar en blanco para no cambiar)
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword')}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile;