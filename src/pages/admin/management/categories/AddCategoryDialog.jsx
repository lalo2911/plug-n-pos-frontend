import { Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from "@/pages/admin/management/ResponsiveModal";

function AddCategoryDialog({ isOpen, setIsOpen, categoryName, setCategoryName, onSave, isPending, resetForm }) {
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
            <Button onClick={onSave} disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    "Guardar"
                )}
            </Button>
        </div>
    )

    return (
        <ResponsiveModal
            isOpen={isOpen}
            setIsOpen={handleClose}
            title="Agregar Categoría"
            description="Crea una nueva categoría para organizar tus productos."
            footer={footer}
            scrollable={false}
        >
            <div className="space-y-2">
                <Label htmlFor="name">Nombre de la categoría</Label>
                <Input
                    id="name"
                    placeholder="Ingresa el nombre"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
            </div>
        </ResponsiveModal>
    );
}

export default AddCategoryDialog;