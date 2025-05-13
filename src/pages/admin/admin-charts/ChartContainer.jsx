import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * Contenedor para las gráficas con manejo de estados de carga y error
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la gráfica
 * @param {string} props.description - Descripción de la gráfica
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 * @param {string} props.errorMessage - Mensaje de error personalizado
 * @param {Object} props.className - Clases adicionales para el componente
 * @param {React.ReactNode} props.children - Contenido de la gráfica
 */
function ChartContainer({
    title,
    description,
    isLoading = false,
    isError = false,
    errorMessage = "Error al cargar datos",
    className = "",
    children
}) {
    return (
        <Card className={`h-96 ${className}`}>
            <CardHeader className="mt-4">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="h-72 mb-4">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : isError ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-red-500">{errorMessage}</p>
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

export default ChartContainer;