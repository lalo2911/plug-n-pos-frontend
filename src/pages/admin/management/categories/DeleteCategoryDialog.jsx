import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/pages/admin/management/ResponsiveModal";

function DeleteCategoryDialog({ isOpen, setIsOpen, onDelete, isPending }) {
    const handleClose = () => setIsOpen(false);

    const footer = (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button variant="outline" onClick={handleClose}>
                Cancelar
            </Button>
            <Button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Eliminando...
                    </>
                ) : (
                    "Eliminar"
                )}
            </Button>
        </div>
    );

    return (
        <ResponsiveModal
            isOpen={isOpen}
            setIsOpen={handleClose}
            title="¿Estás seguro?"
            description="Esta acción no se puede deshacer."
            footer={footer}
            scrollable={false}
        >
            <p>Eliminar esta categoría afectará a todos los productos asociados.</p>
        </ResponsiveModal>
    );
}

export default DeleteCategoryDialog;