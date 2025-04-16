import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <h2 className="text-xl font-semibold text-center">Cargando</h2>
                        <p className="text-sm text-muted-foreground text-center">
                            Por favor espera mientras verificamos tu sesión...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;