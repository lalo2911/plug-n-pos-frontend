import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from './ProductForm';
import { ResponsiveModal } from "@/pages/admin/management/ResponsiveModal";

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
            <Button onClick={handleCreateProduct} disabled={createProduct.isPending}>
                {createProduct.isPending ? (
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
            title="Agregar Producto"
            description="Crea un nuevo producto para tu inventario."
            footer={footer}
            maxHeight="95vh"
            scrollable={true}
        >
            <ProductForm formData={formData} setFormData={setFormData} />
        </ResponsiveModal>
    );
}

export default AddProductDialog;