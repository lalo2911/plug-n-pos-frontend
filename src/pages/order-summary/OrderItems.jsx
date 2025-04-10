import React from 'react';
import { useCart } from '../../context/CartContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import CartItem from './CartItem';

function OrderItems() {
    const { cart } = useCart();

    return (
        <Card>
            <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center pt-4">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Productos ({cart.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div>
                    {cart.map((item) => (
                        <CartItem key={item._id} item={item} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default OrderItems;