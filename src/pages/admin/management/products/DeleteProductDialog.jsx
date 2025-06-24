import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/pages/admin/management/ResponsiveModal";
import { toast } from 'sonner';

function DeleteProductDialog({ isOpen, setIsOpen, deleteProduct, selectedProduct }) {
    const handleClose = () => setIsOpen(false);

    // Manejar eliminar producto
    const handleDeleteProduct = () => {
        deleteProduct.mutate(selectedProduct?._id, {
            onSuccess: () => {
                toast.success("Producto eliminado", {
                    description: "El producto ha sido eliminado exitosamente",
                });
                setIsOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo eliminar el producto",
                });
            }
        });
    };

    const footer = (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button variant="outline" onClick={handleClose}>
                Cancelar
            </Button>
            <Button
                onClick={handleDeleteProduct}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={deleteProduct.isPending}
            >
                {deleteProduct.isPending ? (
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
            <p>¿Realmente deseas eliminar el producto "{selectedProduct?.name}"?</p>
        </ResponsiveModal>
    );
}

export default DeleteProductDialog;