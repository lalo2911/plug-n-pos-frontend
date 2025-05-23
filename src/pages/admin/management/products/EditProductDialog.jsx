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

function EditProductDialog({
    isOpen,
    setIsOpen,
    formData,
    setFormData,
    updateProduct,
    selectedProduct
}) {
    // Manejar actualizar producto
    const handleUpdateProduct = () => {
        if (!formData.name.trim() || !formData.price || !formData.category_id) {
            toast.error("Error", {
                description: "Nombre, precio y categoría son campos requeridos",
            });
            return;
        }

        updateProduct.mutate(
            {
                id: selectedProduct?._id,
                data: formData
            },
            {
                onSuccess: () => {
                    toast.success("Producto actualizado", {
                        description: "El producto ha sido actualizado exitosamente",
                    });
                    setIsOpen(false);
                },
                onError: (error) => {
                    toast.error("Error", {
                        description: error.response?.data?.message || "No se pudo actualizar el producto",
                    });
                }
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                    <DialogDescription>
                        Actualiza la información del producto.
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
                        onClick={handleUpdateProduct}
                        disabled={updateProduct.isPending}
                    >
                        {updateProduct.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                            </>
                        ) : 'Actualizar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditProductDialog;