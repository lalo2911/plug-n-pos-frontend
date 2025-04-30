import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import RoleSelection from './RoleSelection';
import OwnerSetup from './OwnerSetup';
import EmployeeSetup from './EmployeeSetup';

function Setup() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [step, setStep] = useState(1); // 1: Selección de rol, 2: Configuración específica
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirigir si el usuario ya completó el setup
    useEffect(() => {
        if (currentUser?.hasCompletedSetup && location.pathname === '/setup') {
            // Si el usuario es owner, redirigir a admin
            if (currentUser.role === 'owner') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [currentUser, navigate, location.pathname]);

    // Manejar la selección de rol
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep(2); // Avanzar al siguiente paso
    };

    // Manejar volver al paso anterior
    const handleBack = () => {
        setStep(1);
        setSelectedRole(null);
    };

    // Manejar la configuración para owner
    const handleOwnerSetup = async (businessName) => {
        if (!businessName.trim()) {
            toast.error('El nombre del negocio es requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/users/setup', {
                role: selectedRole,
                businessName: businessName.trim()
            });

            if (response.data && response.data.success) {
                // Actualizar el usuario en el contexto
                updateUser({
                    ...response.data.data,
                    hasCompletedSetup: true
                });

                toast.success('Configuración completada exitosamente');
                navigate('/admin');
            }
        } catch (error) {
            console.error('Error al completar la configuración:', error);
            toast.error('Hubo un error al guardar tu configuración');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejar la configuración para empleado
    const handleEmployeeSetup = async (inviteCode) => {
        if (!inviteCode.trim()) {
            toast.error('El código de invitación es requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/users/join-business', {
                inviteCode: inviteCode.trim()
            });

            if (response.data && response.data.success) {
                // Actualizar el usuario en el contexto
                updateUser({
                    ...response.data.data,
                    hasCompletedSetup: true
                });

                toast.success('Has sido añadido al negocio correctamente');
                navigate('/');
            }
        } catch (error) {
            console.error('Error al unirse al negocio:', error);
            toast.error(error.response?.data?.message || 'Error al procesar el código de invitación');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderizar el contenido según el paso actual
    const renderContent = () => {
        if (step === 1) {
            return <RoleSelection selectedRole={selectedRole} onRoleSelect={handleRoleSelect} />;
        } else if (step === 2 && selectedRole === 'owner') {
            return <OwnerSetup
                onSubmit={handleOwnerSetup}
                onBack={handleBack}
                isSubmitting={isSubmitting}
            />;
        } else if (step === 2 && selectedRole === 'employee') {
            return <EmployeeSetup
                onSubmit={handleEmployeeSetup}
                onBack={handleBack}
                isSubmitting={isSubmitting}
            />;
        }
        return null;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 select-none">
            <Card className="w-full max-w-3xl">
                {step === 1 && (
                    <CardHeader className="mt-4">
                        <CardTitle className="text-2xl font-bold text-center">Configuración inicial</CardTitle>
                        <CardDescription className="text-center">
                            Bienvenido/a <b>{currentUser?.name}</b>. Para comenzar, selecciona tu rol en el sistema.
                        </CardDescription>
                    </CardHeader>
                )}

                {renderContent()}
            </Card>
            <Toaster />
        </div>
    );
}

export default Setup;