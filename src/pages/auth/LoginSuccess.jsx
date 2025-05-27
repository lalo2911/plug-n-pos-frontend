import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

function LoginSuccess() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            if (currentUser) {
                if (!currentUser.hasCompletedSetup) {
                    navigate('/setup');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/login');
            }
        }, 800);

        return () => {
            clearTimeout(redirectTimer);
        };
    }, [navigate, currentUser]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}

export default LoginSuccess;