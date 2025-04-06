import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';
import CategoryTabs from './CategoryTabs';
import ProductList from './ProductList';
import CartSidebar from './CartSidebar';
import MobileCart from './MobileCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Get cart context
    const { cart, cartTotal, addToCart, removeFromCart, clearCart, updateQuantity } = useCart();

    // Fetch categories
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Fetch products
    const { products, isLoading: productsLoading } = useProducts();

    // Filter products by category
    const filteredProducts = products?.filter(product =>
        activeCategory === 'all' || product.category_id === activeCategory
    );

    // Toggle cart view on mobile
    const toggleCart = (isOpen) => {
        setIsCartOpen(isOpen ?? !isCartOpen);
    };

    return (
        <div className="relative pb-16 md:pb-0 max-w-full select-none">
            <h1 className="text-3xl font-bold mb-6">Productos</h1>

            {/* Two column layout for desktop */}
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
                            activeCategory={activeCategory}
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
            <MobileCart
                isOpen={isCartOpen}
                cart={cart}
                cartTotal={cartTotal}
                onClose={toggleCart}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
            />
        </div>
    );
};

export default Home;