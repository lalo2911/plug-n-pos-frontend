import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useWorkday } from '@/hooks/useWorkday';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CategoryTabs from './CategoryTabs';
import ProductList from './ProductList';
import CartSidebar from './CartSidebar';
import WorkdayStatus from './WorkdayStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    // Get auth context to get current user ID
    const { currentUser } = useAuth();

    // Get cart context
    const { cart, cartTotal, addToCart, removeFromCart, clearCart, updateQuantity } = useCart();

    // Get workday status for current user specifically
    const userId = currentUser?._id ?? null;
    const {
        isWorkdayActive,
        isLoadingStatus: isLoadingWorkday,
        workdayStatus
    } = useWorkday({
        userId,
        enableSSE: true,
        enablePolling: false,
        role: 'employee'
    });

    // Fetch categories
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Fetch products
    const { products, isLoading: productsLoading } = useProducts();

    // Filter products by category
    const filteredProducts = products?.filter(product =>
        activeCategory === 'all' || product.category_id === activeCategory
    );

    return (
        <div className="relative pb-16 md:pb-0 max-w-full select-none">
            <h1 className="text-3xl font-bold mb-6">Productos</h1>

            {/* Workday Status Banner */}
            <WorkdayStatus
                isWorkdayActive={isWorkdayActive}
                isLoading={isLoadingWorkday}
                workdayStatus={workdayStatus}
            />

            {isWorkdayActive || isLoadingWorkday ? (
                /* Two column layout for desktop */
                <div className="flex flex-col md:flex-row">
                    {/* Products column */}
                    <div className="w-full md:w-[calc(100%-18rem)] md:pr-6">
                        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                            {/* Categories Tabs */}
                            <CategoryTabs
                                categories={categories}
                                isLoading={categoriesLoading}
                            />

                            {/* Products Grid */}
                            <ProductList
                                products={filteredProducts}
                                isLoading={productsLoading}
                                onAddToCart={addToCart}
                                onUpdateQuantity={updateQuantity}
                                activeCategory={activeCategory}
                                cart={cart}
                            />
                        </Tabs>
                    </div>

                    {/* Desktop Cart column */}
                    <div className="hidden md:block md:w-72 md:flex-shrink-0">
                        <div className="sticky top-24 w-full">
                            <CartSidebar
                                cart={cart}
                                cartTotal={cartTotal}
                                onRemoveItem={removeFromCart}
                                onUpdateQuantity={updateQuantity}
                                onClearCart={clearCart}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Día laboral inactivo</h2>
                    <p className="text-gray-600 max-w-md mb-6">
                        No puedes registrar pedidos hasta que el dueño del negocio active el día laboral.
                    </p>
                </div>
            )}

            {/* Mobile Action Buttons - Only show when workday is active */}
            {isWorkdayActive && (
                <div className="md:hidden">
                    {cart.length > 0 && (
                        <div className="fixed bottom-4 right-4 flex items-center gap-3 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Clear Cart Button */}
                            <Button
                                size="lg"
                                className="w-14 h-14 rounded-full shadow-lg p-0 transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={clearCart}
                                title="Vaciar carrito"
                            >
                                <X className="h-6 w-6" />
                            </Button>

                            {/* Go to Summary Button */}
                            <Link to="/order-summary">
                                <Button
                                    size="lg"
                                    className="w-16 h-16 rounded-full shadow-lg p-0 transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <ArrowRight className="h-6 w-6" />
                                        <Badge className="absolute -top-2 -right-2 bg-gray-800 text-white min-w-[1.5rem] h-6 flex items-center justify-center">
                                            {cart.length}
                                        </Badge>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;