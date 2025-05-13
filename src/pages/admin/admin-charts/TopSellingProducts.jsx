import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Componente de productos más vendidos
 * 
 * @param {Object} props
 * @param {Array} props.products - Lista de productos más vendidos
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 * @param {number} props.limit - Número máximo de productos a mostrar
 */
function TopSellingProducts({ products, isLoading, isError, limit = 3 }) {
    return (
        <Card>
            <CardHeader className="mt-4">
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top {limit} productos por ventas</CardDescription>
            </CardHeader>
            <CardContent className="mb-4">
                {isLoading ? (
                    <div className="h-24 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : isError ? (
                    <div className="h-24 flex items-center justify-center">
                        <p className="text-red-500">Error al cargar productos más vendidos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {products?.slice(0, limit).map((product, index) => (
                            <Card key={product._id} className={cn(
                                "border-0 shadow-md",
                                index === 0 ? "bg-amber-50" : index === 1 ? "bg-gray-50" : "bg-orange-50"
                            )}>
                                <CardHeader className="pb-2 mt-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                                        <div className={cn(
                                            "flex items-center justify-center rounded-full w-6 h-6 text-xs font-bold text-white",
                                            index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-500" : "bg-orange-500"
                                        )}>
                                            {index + 1}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="mb-4">
                                    <div className="text-lg font-bold">{formatCurrency(product.totalRevenue)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {product.totalQuantity} unidades vendidas
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default TopSellingProducts;