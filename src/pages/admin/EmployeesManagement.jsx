import { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { Loader2, Search, Plus, Copy, Check, Mail, User } from 'lucide-react';
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

    const {
        employees,
        isLoading,
        isError,
        error,
    } = useEmployees();

    // Filtrar empleados por término de búsqueda
    const filteredEmployees = employees?.filter(employee =>
        (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generar un código de invitación (simulado ya que no tenemos apiClient)
    const generateInviteCode = async () => {
        setIsGeneratingCode(true);
        try {
            // Simulamos la generación de un código aleatorio
            // En una implementación real, esto vendría de una API
            setTimeout(() => {
                const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                setInviteCode(randomCode);
                setIsCopied(false);
                toast({
                    title: "Código generado",
                    description: "El código de invitación ha sido generado exitosamente",
                });
                setIsGeneratingCode(false);
            }, 1000);
        } catch (error) {
            console.error('Error al generar código de invitación:', error);
            toast({
                title: "Error",
                description: "No se pudo generar el código de invitación",
                variant: "destructive"
            });
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

    // Determinar el tipo de cuenta (local o Google)
    const getAccountType = (employee) => {
        if (employee?.google_id) {
            return 'Google';
        }
        return 'Local';
    };

    // Formatear fecha de registro
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
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
                    placeholder="Buscar empleados por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista de empleados */}
            <Card>
                <CardHeader className="mt-4">
                    <CardTitle>Lista de Empleados</CardTitle>
                    <CardDescription>
                        {employees?.length} empleados registrados en tu negocio
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-red-500">
                            Error al cargar los empleados: {error?.message || "Error desconocido"}
                        </div>
                    ) : filteredEmployees?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron empleados
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuario</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Correo</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo de Cuenta</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rol</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredEmployees?.map((employee) => (
                                        <tr key={employee._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={employee.avatar || employee.picture} alt={employee.name} />
                                                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{employee.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                    {employee.email}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="outline">
                                                    {getAccountType(employee)}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={employee.role === 'owner' ? 'default' : 'outline'}>
                                                    {employee.role === 'owner' ? 'Dueño' : 'Empleado'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-gray-500">
                                                {formatDate(employee.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default EmployeesManagement;