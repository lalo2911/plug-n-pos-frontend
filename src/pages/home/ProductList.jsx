import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import ProductCard from './ProductCard';

const ProductList = ({ products, isLoading, onAddToCart, onUpdateQuantity, activeCategory, cart }) => {
    // Función para verificar si un producto está en el carrito
    const isProductInCart = (productId) => {
        return cart.some(item => item._id === productId);
    };

    // Función para obtener la cantidad de un producto en el carrito
    const getCartQuantity = (productId) => {
        const cartItem = cart.find(item => item._id === productId);
        return cartItem ? cartItem.quantity : 0;
    };

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
                            onUpdateQuantity={onUpdateQuantity}
                            isInCart={isProductInCart(product._id)}
                            cartQuantity={getCartQuantity(product._id)}
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
