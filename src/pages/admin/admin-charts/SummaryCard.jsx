import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * Componente de tarjeta de resumen genérica
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la tarjeta
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {string} props.value - Valor principal a mostrar
 * @param {string} props.subtitle - Texto secundario/descriptivo
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 * @param {React.ReactNode} props.children - Contenido adicional opcional
 */
function SummaryCard({
    title,
    icon,
    value,
    subtitle,
    isLoading = false,
    isError = false,
    children
}) {
    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="p-6">
                <p className="text-red-500">Error al cargar datos</p>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mt-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold">{value}</div>
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="ml-4">{children}</div>
                </div>
            </CardContent>
        </Card>
    );
}

export default SummaryCard;