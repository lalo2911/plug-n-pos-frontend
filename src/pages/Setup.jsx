import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Store, Users } from "lucide-react";
import { toast } from "sonner";

function Setup() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!selectedRole) return;

        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/users/setup', {
                role: selectedRole
            });

            if (response.data && response.data.success) {
                // Actualizar el usuario en el contexto
                updateUser({
                    ...response.data.data,
                    hasCompletedSetup: true
                });

                toast.success('Configuración completada exitosamente');
                navigate('/');
            }
        } catch (error) {
            console.error('Error al completar la configuración:', error);
            toast.error('Hubo un error al guardar tu configuración');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 select-none">
            <Card className="w-full max-w-3xl">
                <CardHeader className="mt-4">
                    <CardTitle className="text-2xl font-bold text-center">Configuración inicial</CardTitle>
                    <CardDescription className="text-center">
                        Bienvenido/a <b>{currentUser?.name}</b>. Para comenzar, selecciona tu rol en el sistema.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className={`cursor-pointer p-6 border rounded-lg hover:shadow-md transition-all ${selectedRole === 'owner' ? 'border-black bg-gray-100' : 'border-gray-200'
                                }`}
                            onClick={() => setSelectedRole('owner')}
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
                            className={`cursor-pointer p-6 border rounded-lg hover:shadow-md transition-all ${selectedRole === 'employee' ? 'border-blue-900 bg-blue-50' : 'border-gray-200'
                                }`}
                            onClick={() => setSelectedRole('employee')}
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

                <CardFooter className="mb-4">
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!selectedRole || isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Continuar'}
                        {!isSubmitting && <ArrowRight className="ml-2" size={16} />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Setup;