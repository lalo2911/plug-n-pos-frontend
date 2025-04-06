import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItem from './CartItem';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from '@/components/ui/badge';

const MobileCart = ({ isOpen, cart, cartTotal, onClose, onRemoveItem, onUpdateQuantity, onClearCart }) => {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="md:hidden flex flex-col max-h-[90vh]">
                <DrawerHeader className="border-b bg-white flex-shrink-0">
                    <DrawerTitle>Carrito<Badge className="ml-2">{cart.length}</Badge></DrawerTitle>
                </DrawerHeader>

                {cart.length === 0 ? (
                    <div className="p-6 text-center flex-grow">
                        <p className="text-gray-500">Tu carrito está vacío.</p>
                    </div>
                ) : (
                    <ScrollArea className="flex-grow overflow-y-auto py-2">
                        <div className="px-4 space-y-4">
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
                )}

                <div className="border-t bg-white p-4 flex flex-col gap-2 flex-shrink-0">
                    {cart.length > 0 && (
                        <>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold">${cartTotal.toFixed(2)}</span>
                            </div>
                            <Button className="w-full">Confirmar pedido</Button>
                        </>
                    )}
                    <div className="flex gap-2 w-full">
                        {cart.length > 0 ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="w-1/2"
                                    onClick={onClearCart}
                                >
                                    Vaciar
                                </Button>
                                <DrawerClose asChild>
                                    <Button
                                        variant="outline"
                                        className="w-1/2"
                                    >
                                        Cerrar
                                    </Button>
                                </DrawerClose>
                            </>
                        ) : (
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                >
                                    Cerrar
                                </Button>
                            </DrawerClose>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default MobileCart;