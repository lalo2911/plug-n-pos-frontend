import { Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from "@/pages/admin/management/ResponsiveModal";

function EditCategoryDialog({ isOpen, setIsOpen, categoryName, setCategoryName, onUpdate, isPending, resetForm }) {
    // Manejar cierre del diálogo
    const handleClose = () => {
        resetForm();
        setIsOpen(false);
    };

    const footer = (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button variant="outline" onClick={handleClose}>
                Cancelar
            </Button>
            <Button onClick={onUpdate} disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                    </>
                ) : (
                    "Actualizar"
                )}
            </Button>
        </div>
    )

    return (
        <ResponsiveModal
            isOpen={isOpen}
            setIsOpen={handleClose}
            title="Editar Categoría"
            description="Actualiza el nombre de la categoría."
            footer={footer}
            scrollable={false}
        >
            <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre de la categoría</Label>
                <Input
                    id="edit-name"
                    placeholder="Ingresa el nombre"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
            </div>
        </ResponsiveModal>
    );
}

export default EditCategoryDialog;