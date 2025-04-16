import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario almacenado en localStorage
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        // Verificar si hay un token en la URL (para la redirección de Google)
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');

        if (token && window.location.pathname === '/login/success') {
            // Obtener datos del usuario con el token
            fetchUserProfile(token);
        }

        setLoading(false);
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const user = { ...data.data, token };
                localStorage.setItem('user', JSON.stringify(user));
                setCurrentUser(user);
                // No usar navigate aquí - la redirección se manejará con window.location
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        // En lugar de usar navigate, usar window.location
        window.location.href = '/login';
    };

    const isAuthenticated = () => {
        return !!currentUser;
    };

    const value = {
        currentUser,
        loading,
        login,
        logout,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};