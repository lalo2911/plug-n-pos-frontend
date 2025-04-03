import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import CartItem from './CartItem';

const MobileCart = ({ isOpen, cart, cartTotal, onClose, onRemoveItem, onUpdateQuantity }) => {
    if (!isOpen) return null;

    return (
        <div className="md:hidden fixed inset-0 bg-black/50 z-20 flex items-end justify-center">
            <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="font-semibold">Carrito</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
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
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onRemove={onRemoveItem}
                                        onUpdateQuantity={onUpdateQuantity}
                                    />
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
    );
};

export default MobileCart;