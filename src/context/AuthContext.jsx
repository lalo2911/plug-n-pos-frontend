import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '@/services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Almacenar access token solo en memoria
    const accessTokenRef = useRef(null);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            setLoading(true);

            // Solo intentar silent login si NO estamos en rutas de auth públicas
            const publicAuthRoutes = ['/login', '/register'];
            const currentPath = window.location.pathname;

            if (!publicAuthRoutes.includes(currentPath)) {
                // Intentar obtener un nuevo access token usando el refresh token (silent login)
                await attemptSilentLogin();
            }
        } catch (error) {
            console.error('Error during auth initialization:', error);
            // Si falla la inicialización, limpiar cualquier estado de auth
            clearAuthState();
        } finally {
            setLoading(false);
        }
    };

    const attemptSilentLogin = async () => {
        try {
            // Intentar refrescar el token usando la cookie httpOnly
            const response = await authApi.refreshToken();

            if (response.success && response.data.accessToken) {
                accessTokenRef.current = response.data.accessToken;
                setCurrentUser(response.data.user);
                setIsAuthenticated(true);
                return true;
            }
        } catch (error) {
            // Si falla el refresh, no hay problema - usuario no está autenticado
            console.debug('Silent login failed:', error.message);
            return false;
        }
    };

    const login = async (userData) => {
        try {
            // userData debe contener { accessToken, user }
            if (!userData.accessToken || !userData.user) {
                throw new Error('Invalid login data format');
            }

            accessTokenRef.current = userData.accessToken;
            setCurrentUser(userData.user);
            setIsAuthenticated(true);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Llamar al endpoint de logout para invalidar el refresh token
            await authApi.logout();
        } catch (error) {
            console.error('Error during logout:', error);
            // Continuar con el logout local incluso si falla el servidor
        } finally {
            // Limpiar estado local
            clearAuthState();
            // Borrar carrito del localStorage
            localStorage.removeItem('cart');
            // Redirigir a login
            window.location.href = '/login';
        }
    };

    const clearAuthState = () => {
        accessTokenRef.current = null;
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        const updatedUser = { ...currentUser, ...userData };
        setCurrentUser(updatedUser);
    };

    const getAccessToken = () => {
        return accessTokenRef.current;
    };

    // Función para manejar cuando el access token expira
    const handleTokenExpired = async () => {
        try {
            // Intentar refrescar el token
            const refreshed = await attemptSilentLogin();

            if (!refreshed) {
                // Si no se puede refrescar, hacer logout
                await logout();
                return null;
            }

            return accessTokenRef.current;
        } catch (error) {
            console.error('Error refreshing expired token:', error);
            await logout();
            return null;
        }
    };

    const value = {
        currentUser,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        getAccessToken,
        handleTokenExpired,
        attemptSilentLogin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};