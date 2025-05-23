import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return null;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    // Si el usuario no es employee, redirigir a la página de admin
    if (currentUser.role !== 'employee') {
        return <Navigate to="/admin" replace />;
    }

    // Verificar si el usuario necesita completar el setup
    // Solo redirigir si no está en la página de setup y si no ha completado el setup
    if (
        !currentUser.hasCompletedSetup &&
        location.pathname !== '/setup'
    ) {
        return <Navigate to="/setup" />;
    }

    return children;
};

export default ProtectedRoute;