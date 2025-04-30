import { useState } from 'react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function OwnerSetup({ onSubmit, onBack, isSubmitting = false }) {
    const [businessName, setBusinessName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(businessName);
    };

    return (
        <>
            <CardContent className="space-y-4 mt-6">
                <div className="flex items-center justify-center mb-4">
                    <Building size={48} />
                </div>
                <h3 className="text-xl font-medium text-center">Configurar tu negocio</h3>
                <p className="text-gray-500 text-center mb-4">
                    Ingresa la información de tu negocio para comenzar
                </p>
                <form id="owner-form" onSubmit={handleSubmit} className="space-y-4">
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
                    form="owner-form"
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

export default OwnerSetup;