import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/authApiService';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

// Definir esquema de validación con Zod
const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'La confirmación de contraseña debe tener al menos 6 caracteres'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: (userData) => authApi.register(userData),
        onSuccess: (data) => {
            login(data.data);
            navigate('/');
        },
        onError: (error) => {
            console.error('Error de registro:', error);
        },
    });

    const onSubmit = (data) => {
        // Eliminar confirmPassword antes de enviar
        const { confirmPassword, ...userData } = data;
        registerMutation.mutate(userData);
    };

    const handleGoogleLogin = () => {
        window.location.href = authApi.getGoogleAuthUrl();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 select-none">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center mt-4">
                    <CardTitle className="text-3xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Regístrate para comenzar a usar nuestra plataforma
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Juan Pérez"
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
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {registerMutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error al registrarse</AlertTitle>
                                <AlertDescription>
                                    Ha ocurrido un error al crear la cuenta. Por favor, intente nuevamente.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? 'Registrando...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-2 text-muted-foreground text-sm">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                            />
                        </svg>
                        Continuar con Google
                    </Button>
                </CardContent>

                <CardFooter className="flex justify-center mb-4">
                    <p className="text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Inicia Sesión
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Register;