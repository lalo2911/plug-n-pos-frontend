import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las solicitudes
apiClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Solo redirigir si:
        // 1. Es un error 401 (No autorizado)
        // 2. No estamos en la ruta de login (/auth/login)
        // 3. Hay un usuario almacenado localmente (token expirado)
        if (
            error.response?.status === 401 &&
            !error.config.url.includes('/auth/login') &&
            localStorage.getItem('user')
        ) {
            // Token expirado: eliminar usuario y redirigir a login
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);