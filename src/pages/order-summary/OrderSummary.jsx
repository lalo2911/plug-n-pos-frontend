import React from 'react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import EmptyCart from './EmptyCart';
import OrderItems from './OrderItems';
import PaymentSummary from './PaymentSummary';

function OrderSummary() {
    const { cart } = useCart();

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl select-none">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Resumen del pedido</h1>
                <Badge variant="outline" className="text-sm px-3 py-1">
                    {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                </Badge>
            </div>

            {cart.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Resumen de pago - Aparece primero en móvil, tercero en desktop */}
                    <div className="order-first lg:order-last lg:col-span-1">
                        <div className="sticky top-6">
                            <PaymentSummary />
                        </div>
                    </div>

                    {/* Lista de productos - Aparece segundo en móvil, primero y segundo en desktop */}
                    <div className="order-last lg:order-first lg:col-span-2">
                        <OrderItems />
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderSummary;