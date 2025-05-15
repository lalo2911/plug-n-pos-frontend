import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import ProductForm from './ProductForm';

function AddProductDialog({
    isOpen,
    setIsOpen,
    formData,
    setFormData,
    createProduct,
    resetForm
}) {
    // Manejar crear producto
    const handleCreateProduct = () => {
        if (!formData.name.trim() || !formData.price || !formData.category_id) {
            toast.error("Error", {
                description: "Nombre, precio y categoría son campos requeridos",
            });
            return;
        }

        createProduct.mutate(formData, {
            onSuccess: () => {
                toast.success("Producto creado", {
                    description: "El producto ha sido creado exitosamente"
                });
                resetForm();
                setIsOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo crear el producto",
                });
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar Producto</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo producto para tu inventario.
                    </DialogDescription>
                </DialogHeader>

                <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreateProduct}
                        disabled={createProduct.isPending}
                    >
                        {createProduct.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddProductDialog;