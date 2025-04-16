import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

function EmptyCart() {
    return (
        <Card className="text-center py-12 px-4">
            <CardContent className="pt-6">
                <ShoppingBag className="mx-auto h-20 w-20 text-gray-300 mb-6" />
                <h2 className="text-2xl font-semibold mb-3">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Parece que aún no has agregado productos al carrito.
                </p>
                <Button size="lg" className="px-8" asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Regresar
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default EmptyCart;