import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItem from './CartItem';

const CartSidebar = ({ cart, cartTotal, onRemoveItem, onUpdateQuantity }) => {
    return (
        <div className="w-full bg-white rounded-lg shadow-lg border">
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
                    <ScrollArea className="h-[calc(100vh-280px)]">
                        <div className="p-4 space-y-4">
                            {cart.map(item => (
                                <CartItem
                                    key={item._id}
                                    item={item}
                                    onRemove={onRemoveItem}
                                    onUpdateQuantity={onUpdateQuantity}
                                />
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
    );
};

export default CartSidebar;