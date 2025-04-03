import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
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
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Fetch categories
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Fetch products
    const { products, isLoading: productsLoading } = useProducts();

    // Filter products by category
    const filteredProducts = products?.filter(product =>
        activeCategory === 'all' || product.category_id === activeCategory
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

            {/* Desktop Cart (Right sidebar) */}
            <CartSidebar
                cart={cart}
                cartTotal={cartTotal}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
            />

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
            />
        </div>
    );
};

export default Home;