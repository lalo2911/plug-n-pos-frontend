import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Esta página es para la redirección después del login con Google
        // La lógica principal se maneja en AuthContext
        setTimeout(() => {
            navigate('/');
        }, 2000);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4">Inicio de sesión exitoso</h1>
                <p className="text-center">Redirigiendo a la página principal...</p>
            </div>
        </div>
    );
}

export default LoginSuccess;