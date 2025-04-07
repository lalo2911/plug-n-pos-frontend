import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

function OrderSummary() {
    const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
    let payment = 100;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl select-none">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Resumen del pedido</h1>
                <Badge variant="outline" className="text-sm px-3 py-1">
                    {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                </Badge>
            </div>

            {cart.length === 0 ? (
                <Card className="text-center py-12 px-4">
                    <CardContent className="pt-6">
                        <ShoppingBag className="mx-auto h-20 w-20 text-gray-300 mb-6" />
                        <h2 className="text-2xl font-semibold mb-3">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Parece que aún no has agregado productos al carrito.
                        </p>
                        <Link to="/">
                            <Button size="lg" className="px-8">
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Volver al catálogo
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center pt-3">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Productos ({cart.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div>
                                    {cart.map((item, index) => (
                                        <div key={item._id} className="p-4 hover:bg-gray-50/75 transition-colors">
                                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    {item.image_url ? (
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ShoppingBag className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                                                    <p className="text-gray-500">${item.price.toFixed(2)} cada uno</p>

                                                    <div className="flex items-center mt-3 space-x-6">
                                                        <div className="flex items-center border rounded-md">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-r-none"
                                                                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-l-none"
                                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="px-2"
                                                            onClick={() => removeFromCart(item._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="font-semibold text-lg sm:text-right mt-2 sm:mt-0">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card>
                                <CardHeader className="mt-4">
                                    <CardTitle className="text-lg">Resumen de compra</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-base">
                                            <span>Total a pagar</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span>Paga con</span>
                                            <span>${payment.toFixed(2)}</span>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="flex justify-between text-base font-bold">
                                            <span>Cambio</span>
                                            <span>${(payment - cartTotal).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-3">
                                    <Button className="w-full py-6">
                                        Terminar pedido
                                    </Button>
                                    <Link to="/" className="w-full">
                                        <Button variant="outline" className="w-full mb-4">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Agregar productos
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderSummary;