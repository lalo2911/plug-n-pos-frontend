import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function ProductsHeader({ setIsAddDialogOpen }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">Productos</h1>
                <p className="text-gray-500">Gestiona los productos de tu negocio</p>
            </div>

            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
            </Button>
        </div>
    );
}

export default ProductsHeader;