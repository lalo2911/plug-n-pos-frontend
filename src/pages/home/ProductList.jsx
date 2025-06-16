import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import ProductCard from './ProductCard';

const ProductList = ({ products, isLoading, onAddToCart, activeCategory }) => {
    return (
        <TabsContent value={activeCategory} className="mt-0">
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array(12).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden aspect-square">
                            <Skeleton className="h-full w-full" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {products?.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    ))}

                    {products?.length === 0 && (
                        <div className="col-span-full text-center py-6">
                            <p className="text-gray-500">No hay productos en esta categoría.</p>
                        </div>
                    )}
                </div>
            )}
        </TabsContent>
    );
};

export default ProductList;
