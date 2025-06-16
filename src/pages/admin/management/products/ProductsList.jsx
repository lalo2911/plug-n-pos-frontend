import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import ProductListItem from './ProductListItem';

function ProductsList({
    filteredProducts,
    isLoading,
    error,
    openEditDialog,
    openDeleteDialog,
    productsCount
}) {
    return (
        <Card>
            <CardHeader className="mt-4">
                <CardTitle>Inventario de Productos</CardTitle>
                <CardDescription>
                    {productsCount} productos registrados en total
                </CardDescription>
            </CardHeader>
            <CardContent className="mb-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        Error al cargar los productos
                    </div>
                ) : filteredProducts?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron productos
                    </div>
                ) : (
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Producto</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Categoría</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Precio</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredProducts?.map((product) => (
                                    <ProductListItem
                                        key={product._id}
                                        product={product}
                                        openEditDialog={openEditDialog}
                                        openDeleteDialog={openDeleteDialog}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ProductsList;