import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

export function TopProductsCard({ products = [], formatCurrency }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="mt-4">
                <CardTitle className="text-xl">Top Productos</CardTitle>
                <CardDescription>Los productos más vendidos este mes</CardDescription>
            </CardHeader>
            <CardContent className="mb-4 flex-grow">
                <div className="space-y-4">
                    {products.slice(0, 5).map((product, index) => (
                        <div key={product._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-700 mr-2">{index + 1}.</span>
                                <span>{product.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Badge variant="outline" className="bg-gray-50">
                                    {product.totalQuantity} uds.
                                </Badge>
                                <span className="font-semibold">{formatCurrency(product.totalRevenue)}</span>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No hay datos de productos disponibles
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}