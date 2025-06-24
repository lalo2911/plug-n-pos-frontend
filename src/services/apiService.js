import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Importante: incluir cookies en las solicitudes
});

// Variable para almacenar la referencia al contexto de auth
let authContextRef = null;

// Función para establecer la referencia del contexto de auth
export const setAuthContextRef = (authContext) => {
    authContextRef = authContext;
};

// Interceptor para agregar el token a las solicitudes
apiClient.interceptors.request.use(
    (config) => {
        // Evitar agregar Authorization en /auth/exchange-code
        if (
            config.url.includes('/auth/exchange-code')
        ) {
            return config;
        }

        // Obtener el access token desde el contexto de auth
        if (authContextRef && typeof authContextRef.getAccessToken === 'function') {
            const token = authContextRef.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Variable para rastrear si ya estamos en proceso de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptor para manejar errores de autenticación y refresh automático
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Verificar si es un error 401 y no es una solicitud de login, register o refresh
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/login') &&
            !originalRequest.url.includes('/auth/register') &&
            !originalRequest.url.includes('/auth/refresh')
        ) {

            // Si ya estamos refrescando, agregar la solicitud a la cola
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Intentar refrescar el token
                if (authContextRef && typeof authContextRef.handleTokenExpired === 'function') {
                    const newToken = await authContextRef.handleTokenExpired();

                    if (newToken) {
                        // Token refrescado exitosamente
                        processQueue(null, newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return apiClient(originalRequest);
                    } else {
                        // No se pudo refrescar el token
                        processQueue(error, null);
                        return Promise.reject(error);
                    }
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Para otros errores, simplemente rechazar
        return Promise.reject(error);
    }
);