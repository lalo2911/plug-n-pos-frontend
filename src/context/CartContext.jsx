import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// Opcionalmente podemos usar localStorage para persistencia entre sesiones
const loadCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(loadCartFromStorage);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        // Actualizar el total del carrito cada vez que cambie
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);

        // Persistir el carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item._id === product._id);

            if (existingItem) {
                return currentCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...currentCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item._id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (productId, amount) => {
        setCart(currentCart =>
            currentCart.map(item => {
                if (item._id === productId) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean)
        );
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartTotal,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);