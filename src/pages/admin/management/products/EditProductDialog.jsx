import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from './ProductForm';
import { ResponsiveModal } from "@/pages/admin/management/ResponsiveModal";

function EditProductDialog({
    isOpen,
    setIsOpen,
    formData,
    setFormData,
    updateProduct,
    selectedProduct,
    resetForm
}) {
    // Manejar actualizar producto
    const handleUpdateProduct = () => {
        if (!formData.name.trim() || !formData.price || !formData.category_id) {
            toast.error("Error", {
                description: "Nombre, precio y categoría son campos requeridos",
            });
            return;
        }

        updateProduct.mutate({ id: selectedProduct?._id, data: formData }, {
            onSuccess: () => {
                toast.success("Producto actualizado", {
                    description: "El producto ha sido actualizado exitosamente",
                });
                resetForm();
                setIsOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo actualizar el producto",
                });
            }
        });
    };

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
            <Button onClick={handleUpdateProduct} disabled={updateProduct.isPending}>
                {updateProduct.isPending ? (
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
            title="Editar Producto"
            description="Actualiza la información del producto."
            footer={footer}
            maxHeight="95vh"
            scrollable={true}
        >
            <ProductForm formData={formData} setFormData={setFormData} />
        </ResponsiveModal>
    );
}

export default EditProductDialog;