import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiService';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from "sonner"
import { Loader2, Search, Plus, Copy, Check, X, Mail, User } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function EmployeesManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Obtener la lista de empleados
    const { data: employees, isLoading, error, refetch } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await apiClient.get('/business/employees');
            return response.data.data;
        }
    });

    const filteredEmployees = employees?.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generar un código de invitación
    const generateInviteCode = async () => {
        setIsGeneratingCode(true);
        try {
            const response = await apiClient.post('/business/invite-code');
            if (response.data && response.data.success) {
                setInviteCode(response.data.data.code);
                setIsCopied(false);
                toast({
                    title: "Código generado",
                    description: "El código de invitación ha sido generado exitosamente",
                });
            }
        } catch (error) {
            console.error('Error al generar código de invitación:', error);
            toast({
                title: "Error",
                description: "No se pudo generar el código de invitación",
                variant: "destructive"
            });
        } finally {
            setIsGeneratingCode(false);
        }
    };

    // Copiar el código de invitación al portapapeles
    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteCode)
            .then(() => {
                setIsCopied(true);
                toast({
                    title: "Código copiado",
                    description: "El código ha sido copiado al portapapeles",
                });
                setTimeout(() => setIsCopied(false), 3000);
            })
            .catch((error) => {
                console.error('Error al copiar:', error);
            });
    };

    // Función para obtener las iniciales de un nombre
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Empleados</h1>
                    <p className="text-gray-500">Gestiona los empleados de tu negocio</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Invitar Empleado
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invitar Nuevo Empleado</DialogTitle>
                            <DialogDescription>
                                Genera un código único para que un nuevo empleado se una a tu negocio.
                                Este código será válido por 7 días.
                            </DialogDescription>
                        </DialogHeader>

                        {inviteCode ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-md border">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 mb-2">Código de invitación:</p>
                                        <div className="font-mono text-xl tracking-wider mb-2">{inviteCode}</div>
                                        <div className="text-xs text-gray-500">Válido por 7 días</div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm text-gray-500">
                                        Comparte este código con tu empleado para que pueda unirse a tu negocio.
                                    </p>

                                    <Button
                                        onClick={copyInviteCode}
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                        {isCopied ? 'Código copiado' : 'Copiar código'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <p className="text-sm text-gray-500">
                                    Genera un código de invitación para que un nuevo empleado se una a tu negocio.
                                    Cada código solo puede ser utilizado una vez.
                                </p>
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
                                            <Plus className="mr-2 h-4 w-4" />
                                            Generar Código
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    setInviteCode('');
                                }}
                            >
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    className="pl-10"
                    placeholder="Buscar empleados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista de empleados */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Empleados</CardTitle>
                    <CardDescription>
                        {employees?.length} empleados registrados en tu negocio
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            Error al cargar los empleados
                        </div>
                    ) : filteredEmployees?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron empleados
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredEmployees?.map((employee) => (
                                <div key={employee._id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={employee.avatar} alt={employee.name} />
                                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{employee.name}</div>
                                            <div className="text-sm text-gray-500 flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {employee.email}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={employee.role === 'owner' ? 'default' : 'outline'}>
                                        {employee.role === 'owner' ? 'Dueño' : 'Empleado'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default EmployeesManagement;