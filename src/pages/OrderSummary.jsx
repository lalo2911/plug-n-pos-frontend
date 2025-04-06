import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

function OrderSummary() {
    const { cart, cartTotal } = useCart();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Resumen del pedido</h1>

            {cart.length === 0 ? (
                <div className="text-center py-10">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mb-6">Parece que aún no has agregado productos a tu carrito.</p>
                    <Link to="/">
                        <Button>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Ir a comprar
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Productos ({cart.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex border-b pb-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} cada uno</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Envío</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Proceder al pago</Button>
                            </CardFooter>
                        </Card>

                        <div className="mt-4">
                            <Link to="/">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Continuar comprando
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderSummary;