import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function OwnerRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // Mientras se carga el usuario, mostrar nada
    if (loading) {
        return null;
    }

    // Si no hay usuario o no ha completado el setup, redirigir a login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario no ha completado el setup, redirigir a setup
    if (!currentUser.hasCompletedSetup) {
        return <Navigate to="/setup" replace />;
    }

    // Si el usuario no es owner, redirigir a la página principal
    if (currentUser.role !== 'owner') {
        return <Navigate to="/" replace />;
    }

    // Si es owner, permitir acceso a la ruta
    return children;
}

export default OwnerRoute;