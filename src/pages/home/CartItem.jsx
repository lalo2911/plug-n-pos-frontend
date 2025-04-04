import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, X } from 'lucide-react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <div className="flex justify-between pb-2 border-b">
            <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                <div className="flex items-center mt-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(item._id, -1)}
                        title="Quitar un elemento"
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 text-sm">{item.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(item._id, 1)}
                        title="Sumar un elemento"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 self-start"
                onClick={() => onRemove(item._id)}
                title="Quitar producto"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default CartItem;