import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

const ProductList = ({ products, isLoading, onAddToCart, activeCategory }) => {
    return (
        <TabsContent value={activeCategory} className="mt-0">
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array(12).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-32 w-full" />
                            <CardContent className="p-2">
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {products?.map(product => (
                        <Card
                            key={product._id}
                            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                            onClick={() => onAddToCart(product)}
                        >
                            <div className="h-32 bg-gray-100 flex items-center justify-center">
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
                            <CardContent className="p-2">
                                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                <p className="font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
                            </CardContent>
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