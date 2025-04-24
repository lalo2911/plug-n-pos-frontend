import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Store, Users, Building, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function Setup() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [step, setStep] = useState(1); // 1: Selección de rol, 2: Configuración específica
    const [businessName, setBusinessName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
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
    const handleOwnerSetup = async () => {
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
    const handleEmployeeSetup = async () => {
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

    // Renderizar el paso 1: Selección de rol
    const renderRoleSelection = () => (
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`cursor-pointer p-6 border rounded-lg transition-all hover:border-black hover:bg-gray-100 ${selectedRole === 'owner' ? 'border-black bg-gray-100' : 'border-gray-200'
                        }`}
                    onClick={() => handleRoleSelect('owner')}
                >
                    <div className="flex items-center justify-center mb-4">
                        <Store size={48} />
                    </div>
                    <h3 className="text-xl font-medium text-center">Dueño del negocio</h3>
                    <p className="text-gray-500 text-center mt-2">
                        Acceso completo a todas las funciones y configuraciones del sistema
                    </p>
                </div>

                <div
                    className={`cursor-pointer p-6 border rounded-lg transition-all hover:border-blue-900 hover:bg-blue-50 ${selectedRole === 'employee' ? 'border-blue-900 bg-blue-50' : 'border-gray-200'
                        }`}
                    onClick={() => handleRoleSelect('employee')}
                >
                    <div className="flex items-center justify-center mb-4">
                        <Users size={48} />
                    </div>
                    <h3 className="text-xl font-medium text-center">Empleado</h3>
                    <p className="text-gray-500 text-center mt-2">
                        Acceso a funciones básicas para la operación diaria
                    </p>
                </div>
            </div>
        </CardContent>
    );

    // Renderizar el paso 2: Configuración específica del rol
    const renderRoleSetup = () => (
        <CardContent className="space-y-4">
            {selectedRole === 'owner' ? (
                <>
                    <div className="flex items-center justify-center mb-4">
                        <Building size={48} />
                    </div>
                    <h3 className="text-xl font-medium text-center">Configurar tu negocio</h3>
                    <p className="text-gray-500 text-center mb-4">
                        Ingresa la información de tu negocio para comenzar
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del negocio
                            </label>
                            <Input
                                id="businessName"
                                type="text"
                                placeholder="Ingresa el nombre de tu negocio"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-center mb-4">
                        <Key size={48} />
                    </div>
                    <h3 className="text-xl font-medium text-center">Unirse a un negocio</h3>
                    <p className="text-gray-500 text-center mb-4">
                        Ingresa el código de invitación proporcionado por tu empleador
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Código de invitación
                            </label>
                            <Input
                                id="inviteCode"
                                type="text"
                                placeholder="Ingresa el código de 8 caracteres"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                            />
                        </div>
                    </div>
                </>
            )}
        </CardContent>
    );

    // Renderizar el footer según el paso actual
    const renderFooter = () => (
        <CardFooter className="flex flex-col md:flex-row gap-2">
            {step === 2 && (
                <Button variant="outline" className="w-full md:w-auto mb-4" onClick={handleBack} disabled={isSubmitting}>
                    Volver
                </Button>
            )}
            {step === 1 ? (
                <Button
                    className="w-full md:w-auto mb-4"
                    onClick={() => { }}
                    disabled={!selectedRole}
                >
                    Continuar
                    <ArrowRight className="ml-2" size={16} />
                </Button>
            ) : (
                <Button
                    className="w-full md:w-auto mb-4"
                    onClick={selectedRole === 'owner' ? handleOwnerSetup : handleEmployeeSetup}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Finalizar configuración'}
                    {!isSubmitting && <ArrowRight className="ml-2" size={16} />}
                </Button>
            )}
        </CardFooter>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 select-none">
            <Card className="w-full max-w-3xl">
                <CardHeader className="mt-4">
                    <CardTitle className="text-2xl font-bold text-center">Configuración inicial</CardTitle>
                    <CardDescription className="text-center">
                        Bienvenido/a <b>{currentUser?.name}</b>. {step === 1 ? 'Para comenzar, selecciona tu rol en el sistema.' : 'Completa la información requerida.'}
                    </CardDescription>
                </CardHeader>

                {step === 1 ? renderRoleSelection() : renderRoleSetup()}
                {renderFooter()}
            </Card>
        </div>
    );
}

export default Setup;