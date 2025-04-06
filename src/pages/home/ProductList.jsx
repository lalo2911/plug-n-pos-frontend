import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

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
                        <Card
                            key={product._id}
                            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 relative aspect-square"
                            onClick={() => onAddToCart(product)}
                        >
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-xs">Sin imagen</span>
                                )}
                            </div>
                            {/* Overlay with gradient for product info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                <p className="font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
                            </div>
                        </Card>
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