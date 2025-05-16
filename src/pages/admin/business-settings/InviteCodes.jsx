import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clipboard, RefreshCw, Info, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import InviteCodeItem from "./InviteCodeItem";

const InviteCodes = ({ business, handleGenerateInviteCode, copyToClipboard, generateInviteCode, copiedCode }) => {
    const activeCodes = business?.inviteCodes?.filter(code => !code.isUsed) || [];
    const usedCodes = business?.inviteCodes?.filter(code => code.isUsed) || [];

    return (
        <Card className="md:col-span-3">
            <CardHeader className="mt-4">
                <CardTitle className="flex items-center gap-2">
                    <Clipboard className="h-5 w-5" />
                    Códigos de Invitación
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="text-gray-500 hover:text-black">
                                    <Info className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-sm">
                                Los códigos de invitación permiten a tus empleados unirse a tu negocio.
                                Comparte un código con cada empleado y ellos deberán ingresarlo durante
                                el proceso de registro. Los códigos son válidos por 7 días y solo se
                                pueden usar una vez.
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
                <CardDescription>Genera códigos para que tus empleados se unan al negocio</CardDescription>
            </CardHeader>
            <CardContent className="mb-4">
                <Button onClick={handleGenerateInviteCode} disabled={generateInviteCode.isPending}>
                    {generateInviteCode.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generar Nuevo Código
                        </>
                    )}
                </Button>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Códigos Activos</h3>
                    {activeCodes.length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">No hay códigos de invitación activos</p>
                    ) : (
                        activeCodes.map((code, index) => (
                            <InviteCodeItem key={index} code={code} onCopy={copyToClipboard} copied={copiedCode === code.code} />
                        ))
                    )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Códigos Utilizados</h3>
                    {usedCodes.length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">No hay códigos de invitación utilizados</p>
                    ) : (
                        usedCodes.map((code, index) => (
                            <InviteCodeItem key={index} code={code} used />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default InviteCodes;
