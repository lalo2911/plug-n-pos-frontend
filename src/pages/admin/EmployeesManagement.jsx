import { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Mail } from 'lucide-react';

function EmployeesManagement() {
    const [searchTerm, setSearchTerm] = useState('');

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
        if (employee?.googleId) {
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