import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * Componente reutilizable para los encabezados de página
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción o subtítulo de la página
 * @param {Function} [props.onAddNew] - Función a ejecutar cuando se hace clic en el botón "Nuevo"
 * @param {string} [props.addButtonText] - Texto para el botón de añadir (por defecto: "Nuevo")
 * @param {React.ReactNode} [props.addButtonIcon] - Icono para el botón de añadir
 * @param {React.ReactNode} [props.actions] - Acciones adicionales para mostrar a la derecha
 */
function PageHeader({
    title,
    description,
    onAddNew,
    addButtonText = "Nuevo",
    addButtonIcon = <Plus className="mr-2 h-4 w-4" />,
    actions
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-gray-500">{description}</p>
            </div>

            {(onAddNew || actions) && (
                <div className="flex items-center gap-2">
                    {actions}

                    {onAddNew && (
                        <Button onClick={onAddNew}>
                            {addButtonIcon}
                            {addButtonText}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default PageHeader;