import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Fetch categories
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Fetch products
    const { products, isLoading: productsLoading } = useProducts();

    // Filter products by category
    const filteredProducts = products?.filter(product =>
        activeCategory === 'all' || product.category === activeCategory
    );

    // Cart functions
    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, amount) => {
        setCart(cart.map(item => {
            if (item._id === productId) {
                const newQuantity = item.quantity + amount;
                return newQuantity > 0
                    ? { ...item, quantity: newQuantity }
                    : null;
            }
            return item;
        }).filter(Boolean));
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Toggle cart view on mobile
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div className="relative pb-16 md:pb-0">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Productos</h1>

                {/* Categories Tabs */}
                <Tabs
                    defaultValue="all"
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                    className="w-full"
                >
                    <div className="mb-4 overflow-x-auto pb-2">
                        <TabsList className="h-auto flex-nowrap min-w-max">
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            {categoriesLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="px-8 py-2">
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))
                            ) : (
                                categories?.map(category => (
                                    <TabsTrigger
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </TabsTrigger>
                                ))
                            )}
                        </TabsList>
                    </div>

                    {/* Products Grid */}
                    <TabsContent value={activeCategory} className="mt-0">
                        {productsLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array(8).fill(0).map((_, i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <Skeleton className="h-48 w-full" />
                                        <CardContent className="p-4">
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Skeleton className="h-10 w-full" />
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts?.map(product => (
                                    <Card key={product._id} className="overflow-hidden flex flex-col">
                                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400">Sin imagen</span>
                                            )}
                                        </div>
                                        <CardContent className="p-4 flex-grow">
                                            <h3 className="font-medium text-lg">{product.name}</h3>
                                            <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                                            <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Button
                                                className="w-full"
                                                onClick={() => addToCart(product)}
                                            >
                                                Agregar al carrito
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}

                                {filteredProducts?.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-gray-500">No hay productos en esta categoría.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Desktop Cart (Right sidebar) */}
            <div className="hidden md:block w-64 fixed right-4 top-24 bottom-4 bg-white rounded-lg shadow-lg border">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold">Carrito</h2>
                    <Badge>{cart.length}</Badge>
                </div>

                {cart.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">Tu carrito está vacío.</p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[calc(100%-140px)]">
                            <div className="p-4 space-y-4">
                                {cart.map(item => (
                                    <div key={item._id} className="flex justify-between pb-2 border-b">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                            <div className="flex items-center mt-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="mx-2 text-sm">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 self-start"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                            <div className="flex justify-between mb-4">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold">${cartTotal.toFixed(2)}</span>
                            </div>
                            <Button className="w-full">Finalizar compra</Button>
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Cart Button */}
            <div className="md:hidden fixed bottom-4 right-4 left-4 z-10">
                <Button
                    className="w-full rounded-full shadow-lg"
                    onClick={toggleCart}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Carrito <Badge className="ml-2">{cart.length}</Badge>
                </Button>
            </div>

            {/* Mobile Cart Modal */}
            {isCartOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-20 flex items-end justify-center">
                    <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom">
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="font-semibold">Carrito</h2>
                            <Button variant="ghost" size="icon" onClick={toggleCart}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">Tu carrito está vacío.</p>
                            </div>
                        ) : (
                            <>
                                <ScrollArea className="flex-grow">
                                    <div className="p-4 space-y-4">
                                        {cart.map(item => (
                                            <div key={item._id} className="flex justify-between pb-2 border-b">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                                    <div className="flex items-center mt-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => updateQuantity(item._id, -1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="mx-2 text-sm">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => updateQuantity(item._id, 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 self-start"
                                                    onClick={() => removeFromCart(item._id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="p-4 border-t sticky bottom-0 bg-white">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold">Total:</span>
                                        <span className="font-bold">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <Button className="w-full">Finalizar compra</Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;