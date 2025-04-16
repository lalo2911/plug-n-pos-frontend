import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApiService';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";

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
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen select-none">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center mt-4">
                    <CardTitle className="text-3xl font-bold">Mi Perfil</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 mb-4">
                    <div className="flex items-center justify-center flex-col space-y-2">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                            <AvatarFallback className="text-lg">
                                {currentUser?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <p className="font-medium">{currentUser?.name}</p>
                            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Inicio de sesión: {currentUser?.authSource === 'google' ? 'Google' : 'Email y contraseña'}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Tu nombre"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                {...register('email')}
                                disabled={currentUser?.authSource === 'google'}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                            {currentUser?.authSource === 'google' && (
                                <p className="text-xs text-muted-foreground">El correo no se puede cambiar para cuentas de Google</p>
                            )}
                        </div>

                        {currentUser?.authSource === 'local' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Dejar en blanco para no cambiar"
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirma tu nueva contraseña"
                                        {...register('confirmPassword')}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {updateProfileMutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error al actualizar perfil</AlertTitle>
                                <AlertDescription>
                                    Ha ocurrido un error al guardar los cambios. Por favor, intente nuevamente.
                                </AlertDescription>
                            </Alert>
                        )}

                        {updateProfileMutation.isSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                                <AlertTitle className="text-green-800">Perfil actualizado</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Los cambios han sido guardados correctamente.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : 'Guardar Cambios'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;