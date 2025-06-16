import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authService';

function LoginSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    // Evitar múltiples llamadas
    const hasExchangedCode = useRef(false);

    useEffect(() => {
        const exchangeCode = async () => {
            if (hasExchangedCode.current) return;
            hasExchangedCode.current = true;

            const code = searchParams.get('code');

            if (!code) {
                setError('Código de autorización no proporcionado');
                return;
            }

            try {
                const response = await authApi.exchangeAuthCode(code);

                if (response.success && response.data?.accessToken && response.data?.user) {
                    await login(response.data);

                    const { role, hasCompletedSetup } = response.data.user;
                    let destination = '/login';

                    if (!hasCompletedSetup) {
                        destination = '/setup';
                    } else if (role === 'owner') {
                        destination = '/admin';
                    } else {
                        destination = '/';
                    }

                    navigate(destination, { replace: true });
                } else {
                    throw new Error('Respuesta inválida del servidor');
                }
            } catch (err) {
                console.error('Error intercambiando el código');
                setError('El código es inválido o ha expirado. Por favor, inicia sesión nuevamente.');
                setTimeout(() => {
                    navigate('/login?error=invalid_code', { replace: true });
                }, 2000);
            }
        };

        exchangeCode();
    }, [searchParams, login, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600 font-medium">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}

export default LoginSuccess;
