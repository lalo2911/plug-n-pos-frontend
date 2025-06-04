import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";

import AuthLayout from './AuthLayout';
import FormField from './FormField';
import GoogleLoginButton from './GoogleLoginButton';
import ErrorAlert from './ErrorAlert';

import { registerSchema } from './authSchemas';

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: (userData) => authApi.register(userData),
        onSuccess: async (data) => {
            try {
                // data.data debe contener { accessToken, user }
                await login(data.data);
                navigate('/');
            } catch (error) {
                console.error('Error durante el proceso de registro:', error);
            }
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

    const footerContent = (
        <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia Sesión
            </Link>
        </p>
    );

    return (
        <AuthLayout
            title="Crear Cuenta"
            description="Regístrate para comenzar a usar nuestra plataforma"
            footerContent={footerContent}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    id="name"
                    label="Nombre Completo"
                    type="text"
                    placeholder="Juan Pérez"
                    register={register('name')}
                    error={errors.name}
                />

                <FormField
                    id="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    register={register('email')}
                    error={errors.email}
                />

                <FormField
                    id="password"
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    register={register('password')}
                    error={errors.password}
                />

                <FormField
                    id="confirmPassword"
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="••••••••"
                    register={register('confirmPassword')}
                    error={errors.confirmPassword}
                />

                {registerMutation.isError && (
                    <ErrorAlert
                        title="Error al registrarse"
                        message="Ha ocurrido un error al crear la cuenta. Por favor, intente nuevamente."
                    />
                )}

                <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={registerMutation.isPending}
                >
                    {registerMutation.isPending ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
            </form>

            <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />
        </AuthLayout>
    );
}

export default Register;