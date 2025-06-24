import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export function InviteEmployeesCard({ generateInviteCode }) {
    const [copiedCode, setCopiedCode] = useState(null);
    const [inviteCode, setInviteCode] = useState(null);

    // Generar código de invitación
    const handleGenerateInviteCode = () => {
        generateInviteCode.mutate(
            {},
            {
                onSuccess: (data) => {
                    setInviteCode(data.data);
                    toast.success("Código generado", {
                        description: "Se ha generado un nuevo código de invitación",
                    });
                },
                onError: (error) => {
                    toast.error("Error", {
                        description: error.response?.data?.message || "No se pudo generar el código de invitación",
                    });
                }
            }
        );
    };

    // Copiar código al portapapeles
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => {
            setCopiedCode(null);
        }, 3000);
        toast.success("Código copiado", {
            description: "El código ha sido copiado al portapapeles",
        });
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="mt-4">
                <CardTitle className="text-xl">Invitar Empleados</CardTitle>
                <CardDescription>Genera un código único para que tus empleados se unan a tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center mb-4">
                <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-500">Este código será válido por 7 días y solo puede ser usado una vez.</span>

                    {inviteCode ? (
                        <div className="flex items-center mt-2">
                            <div className="relative flex-1">
                                <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50">
                                    <span className="font-mono text-lg tracking-wider">{inviteCode.code}</span>
                                    <Badge variant="outline" className="ml-2">Válido por 7 días</Badge>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(inviteCode.code)}
                            >
                                {copiedCode === inviteCode.code ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleGenerateInviteCode}
                            disabled={generateInviteCode.isPending}
                            className="mt-2 cursor-pointer"
                        >
                            {generateInviteCode.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generando...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Generar Código de Invitación
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
