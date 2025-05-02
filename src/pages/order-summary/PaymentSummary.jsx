import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function PaymentSummary() {
    const { cart, cartTotal, clearCart } = useCart();
    const [payment, setPayment] = useState('');
    const navigate = useNavigate();

    // Convertir payment a número para cálculos (o 0 si está vacío)
    const paymentAmount = payment === '' ? 0 : parseFloat(payment);

    // Calcular el cambio (puede ser negativo)
    const changeAmount = paymentAmount - cartTotal;

    // Determinar si es cambio o falta
    const isShortage = changeAmount < 0;

    const { createOrder } = useOrders();

    const handleFinishOrder = () => {
        if (payment === '' || isNaN(paymentAmount) || isShortage) {
            toast.error("Error", {
                description: "El monto ingresado es insuficiente",
            });
            return;
        }

        const paymentData = {
            productos: cart.map(item => ({
                id: item._id,
                nombre: item.name,
                precio_unitario: item.price,
                cantidad: item.quantity,
                subtotal: (item.price * item.quantity).toFixed(2),
            })),
            total: cartTotal.toFixed(2),
            pago_con: paymentAmount.toFixed(2),
            cambio: changeAmount.toFixed(2),
        };

        createOrder.mutate(paymentData, {
            onSuccess: () => {
                toast.success("Pedido creado", {
                    description: "El pedido ha sido registrado exitosamente",
                });
                clearCart();
                navigate('/');
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo crear el pedido",
                });
            }
        });
    };


    return (
        <Card>
            <CardHeader className="py-4">
                <CardTitle className="text-lg">Resumen de pago</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-base font-bold">
                        <span>Total a pagar</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                        <span>Paga con</span>
                        <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={payment}
                                onChange={(e) => setPayment(e.target.value)}
                                className="w-24 h-8 text-right"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between text-base font-medium">
                        <span>{isShortage ? 'Falta' : 'Cambio'}</span>
                        <span className={isShortage ? 'text-red-600' : 'text-green-600'}>
                            ${Math.abs(changeAmount).toFixed(2)}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 mb-4">
                <Button
                    className="w-full py-5"
                    disabled={isShortage || payment === ''}
                    onClick={handleFinishOrder}
                >
                    Terminar pedido
                </Button>
                <Button variant="outline" className="w-full" asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Agregar productos
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default PaymentSummary;