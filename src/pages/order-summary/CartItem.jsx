import React from 'react';
import { useCart } from '../../context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

function CartItem({ item }) {
    const { removeFromCart, updateQuantity } = useCart();

    return (
        <div className="p-3 hover:bg-gray-50/75 transition-colors border-b last:border-b-0">
            {/* Vista de escritorio - una sola fila */}
            <div className="hidden md:flex md:items-center gap-3">
                {/* Imagen (solo en escritorio) */}
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                    )}
                </div>

                {/* Nombre y precio unitario */}
                <div className="flex-grow">
                    <h3 className="font-medium text-base mb-0">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)} c/u</p>
                </div>

                {/* Controles de cantidad y eliminar */}
                <div className="flex items-center gap-2">
                    <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(item._id, -1)}
                        onIncrease={() => updateQuantity(item._id, 1)}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeFromCart(item._id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Precio total */}
                <div className="font-semibold text-lg ml-2 w-20 text-right flex items-center justify-end">
                    ${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>

            {/* Vista de móvil - dos filas */}
            <div className="md:hidden flex flex-col gap-2">
                {/* Fila 1: Nombre del producto y precio total */}
                <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)} c/u</p>
                </div>

                {/* Fila 2: Precio unitario, controles, eliminar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <QuantityControl
                            quantity={item.quantity}
                            onDecrease={() => updateQuantity(item._id, -1)}
                            onIncrease={() => updateQuantity(item._id, 1)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFromCart(item._id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="font-semibold text-lg text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente de control de cantidad
function QuantityControl({ quantity, onDecrease, onIncrease }) {
    return (
        <div className="flex items-center border rounded-md">
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-r-none"
                onClick={onDecrease}
            >
                <Minus className="h-3 w-3" />
            </Button>
            <span className="w-7 text-center text-sm">{quantity}</span>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-l-none"
                onClick={onIncrease}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    );
}

export default CartItem;