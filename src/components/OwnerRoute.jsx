import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OwnerRoute({ children }) {
    const { user, isLoading } = useAuth();

    // Mientras se carga el usuario, mostrar nada
    if (isLoading) {
        return null;
    }

    // Si no hay usuario o no ha completado el setup, redirigir a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario no ha completado el setup, redirigir a setup
    if (!user.hasCompletedSetup) {
        return <Navigate to="/setup" replace />;
    }

    // Si el usuario no es owner, redirigir a la página principal
    if (user.role !== 'owner') {
        return <Navigate to="/" replace />;
    }

    // Si es owner, permitir acceso a la ruta
    return children;
}

export default OwnerRoute;