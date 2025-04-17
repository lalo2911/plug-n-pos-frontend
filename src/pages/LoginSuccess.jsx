import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';

function LoginSuccess() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();

    const totalTime = 800; // Duración total (en ms) para la barra y la redirección
    const interval = 40; // Cada cuánto se actualiza la barra
    const increment = 100 / (totalTime / interval); // Cantidad que se suma en cada paso

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + increment;
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, interval);

        // Redirección basada en si el usuario ha completado el setup
        const redirectTimer = setTimeout(() => {
            if (currentUser) {
                // Si hasCompletedSetup es false o undefined, redirigir a setup
                if (!currentUser.hasCompletedSetup) {
                    navigate('/setup');
                } else {
                    navigate('/');
                }
            } else {
                // Si no hay usuario, redirigir a login
                navigate('/login');
            }
        }, totalTime);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate, currentUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="mt-4">
                    <div className="flex justify-center mb-2">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-center text-2xl">Inicio de sesión exitoso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 mb-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground">
                        Redirigiendo en unos segundos...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginSuccess;