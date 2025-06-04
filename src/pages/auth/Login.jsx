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

import { loginSchema } from './authSchemas';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: (credentials) => authApi.login(credentials),
        onSuccess: async (data) => {
            try {
                // data.data debe contener { accessToken, user }
                await login(data.data);
                navigate('/');
            } catch (error) {
                console.error('Error durante el proceso de login:', error);
            }
        },
        onError: (error) => {
            console.error('Error de inicio de sesión:', error);
        },
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    const handleGoogleLogin = () => {
        window.location.href = authApi.getGoogleAuthUrl();
    };

    const footerContent = (
        <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
                Regístrate
            </Link>
        </p>
    );

    return (
        <AuthLayout
            title="Iniciar Sesión"
            description="Ingresa tus credenciales para acceder a tu cuenta"
            footerContent={footerContent}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    id="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    tabIndex={1}
                    register={register('email')}
                    error={errors.email}
                />

                <FormField
                    id="password"
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    tabIndex={2}
                    register={register('password')}
                    error={errors.password}
                    // extraContent={
                    //     <Link to="/forgot-password" className="text-xs text-primary hover:underline" tabIndex={4}>
                    //         ¿Olvidaste tu contraseña?
                    //     </Link>
                    // }
                />

                {loginMutation.isError && (
                    <ErrorAlert
                        title="Error al iniciar sesión"
                        message="Verifica tus credenciales e intenta de nuevo."
                    />
                )}

                <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    tabIndex={3}
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Cargando...' : 'Iniciar Sesión'}
                </Button>
            </form>

            <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />
        </AuthLayout>
    );
}

export default Login;