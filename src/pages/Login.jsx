import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react"

// Definir esquema de validación con Zod
const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: (credentials) => authApi.login(credentials),
        onSuccess: (data) => {
            login(data.data);
            navigate('/');
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 select-none">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center mt-4">
                    <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                tabIndex={1}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                {/* <Link to="/forgot-password" className="text-xs text-primary hover:underline" tabIndex={4}>
                                    ¿Olvidaste tu contraseña?
                                </Link> */}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                tabIndex={2}
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        {loginMutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error al iniciar sesión</AlertTitle>
                                <AlertDescription>
                                    Verifica tus credenciales e intenta de nuevo.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full" 
                            tabIndex={3}
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Cargando...' : 'Iniciar Sesión'}
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
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Login;