import { useState } from 'react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function EmployeeSetup({ onSubmit, onBack, isSubmitting = false }) {
    const [inviteCode, setInviteCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inviteCode);
    };

    return (
        <>
            <CardContent className="space-y-4 mt-6">
                <div className="flex items-center justify-center mb-4">
                    <Key size={48} />
                </div>
                <h3 className="text-xl font-medium text-center">Unirse a un negocio</h3>
                <p className="text-gray-500 text-center mb-4">
                    Ingresa el código de invitación proporcionado por tu empleador
                </p>
                <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
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
                </form>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                >
                    Volver
                </Button>
                <Button
                    type="submit"
                    form="employee-form"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                >
                    {isSubmitting ? 'Guardando...' : 'Finalizar configuración'}
                    {!isSubmitting && <ArrowRight className="ml-2" size={16} />}
                </Button>
            </CardFooter>
        </>
    );
}

export default EmployeeSetup;