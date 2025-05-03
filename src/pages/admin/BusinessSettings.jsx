import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Building2,
    User,
    Info,
    Phone,
    MapPin,
    Save,
    Copy,
    Loader2,
    RefreshCw,
    CheckCircle,
    Clipboard,
    X
} from 'lucide-react';
import { toast } from "sonner"

function BusinessSettings() {
    const queryClient = useQueryClient();

    const [businessData, setBusinessData] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    // Obtener datos del negocio
    const { data: business, isLoading, error } = useQuery({
        queryKey: ['currentBusiness'],
        queryFn: async () => {
            const response = await apiClient.get('/business/me');
            return response.data.data;
        }
    });

    useEffect(() => {
        if (business) {
            setBusinessData({
                name: business.name || '',
                address: business.address || '',
                phone: business.phone || '',
                owner: business.owner.name || '',
                email: business.owner.email || '',
                noEmployees: business.employees?.length || 0,
                noCodes: business.inviteCodes?.length || 0
            });
        }
    }, [business]);

    // Mutación para actualizar negocio
    const updateMutation = useMutation({
        mutationFn: (updatedData) => apiClient.put(`/business/${business._id}`, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentBusiness'] });
            toast({
                title: "Negocio actualizado",
                description: "Los datos de tu negocio han sido actualizados exitosamente",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "No se pudo actualizar el negocio",
                variant: "destructive"
            });
        }
    });

    // Generar código de invitación
    const generateInviteCode = async () => {
        setIsGeneratingCode(true);
        try {
            const response = await apiClient.post('/business/invite-code');
            queryClient.invalidateQueries({ queryKey: ['currentBusiness'] });
            toast({
                title: "Código generado",
                description: "Se ha generado un nuevo código de invitación",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "No se pudo generar el código de invitación",
                variant: "destructive"
            });
        } finally {
            setIsGeneratingCode(false);
        }
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(businessData);
    };

    // Copiar código al portapapeles
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => {
            setCopiedCode(null);
        }, 3000);
        toast({
            title: "Código copiado",
            description: "El código ha sido copiado al portapapeles",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Configuración del Negocio</h1>
                <p className="text-gray-500">Administra la información de tu negocio y códigos de invitación</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Información del negocio */}
                <Card className="md:col-span-2">
                    <CardHeader className="mt-4">
                        <CardTitle className="flex items-center">
                            <Building2 className="mr-2 h-5 w-5" />
                            Información del Negocio
                        </CardTitle>
                        <CardDescription>
                            Actualiza los datos básicos de tu negocio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mb-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500">
                                Error al cargar los datos del negocio
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del negocio</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            className="pl-10"
                                            value={businessData.name}
                                            onChange={handleChange}
                                            placeholder="Nombre de tu negocio"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Textarea
                                            id="address"
                                            name="address"
                                            className="pl-10 min-h-[80px] resize-none"
                                            value={businessData.address}
                                            onChange={handleChange}
                                            placeholder="Dirección de tu negocio"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            className="pl-10"
                                            value={businessData.phone}
                                            onChange={handleChange}
                                            placeholder="Teléfono de contacto"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Información del propietario */}
                <Card>
                    <CardHeader className="mt-4">
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Propietario
                        </CardTitle>
                        <CardDescription>
                            Información del dueño del negocio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mb-4">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nombre</p>
                                <p>{businessData?.owner || 'No disponible'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p>{businessData?.email || 'No disponible'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Empleados</p>
                                <p>{businessData?.noEmployees || 'No disponible'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Códigos</p>
                                <p>{businessData?.noCodes || 'No disponible'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Códigos de invitación */}
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
                        <CardDescription>
                            Genera códigos para que tus empleados se unan al negocio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mb-4">
                        <Button
                            onClick={generateInviteCode}
                            disabled={isGeneratingCode}
                        >
                            {isGeneratingCode ? (
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

                            {business?.inviteCodes?.filter(code => !code.isUsed).length === 0 ? (
                                <p className="text-sm text-gray-500 py-2">
                                    No hay códigos de invitación activos
                                </p>
                            ) : (
                                <div className="grid gap-3">
                                    {business?.inviteCodes
                                        ?.filter(code => !code.isUsed)
                                        .map((inviteCode, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-100 p-2 rounded-full">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono font-medium">{inviteCode.code}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Generado el {new Date(inviteCode.createdAt).toLocaleDateString('es-MX')}
                                                        </p>
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
                                        ))}
                                </div>
                            )}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Códigos Utilizados</h3>

                            {business?.inviteCodes?.filter(code => code.isUsed).length === 0 ? (
                                <p className="text-sm text-gray-500 py-2">
                                    No hay códigos de invitación utilizados
                                </p>
                            ) : (
                                <div className="grid gap-3">
                                    {business?.inviteCodes
                                        ?.filter(code => code.isUsed)
                                        .map((inviteCode, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md opacity-70"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-gray-200 p-2 rounded-full">
                                                        <X className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono font-medium">{inviteCode.code}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Utilizado
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default BusinessSettings;