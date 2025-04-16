import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen select-none">
            <Card className="w-full max-w-md">
                <CardHeader className="mt-4">
                    <div className="flex justify-center mb-2">
                        <XCircle className="h-16 w-16 text-red-400" />
                    </div>
                    <CardTitle className="text-center text-3xl font-bold">404</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-center">
                    <h2 className="text-xl font-semibold">Página No Encontrada</h2>
                    <p className="text-sm text-muted-foreground">
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-2 pb-6">
                    <Button asChild size="lg">
                        <Link to="/">
                            Volver al Inicio
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default NotFound;