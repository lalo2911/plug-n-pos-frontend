import { useState } from 'react';
import { useEmployeesWorkday } from '@/hooks/useEmployeesWorkday';
import { useWorkday } from '@/hooks/useWorkday';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import SearchBar from '../SearchBar';
import PageHeader from '../../PageHeader';
import EmployeesList from './EmployeesList';
import { Loader2, Play, Square } from 'lucide-react';
import { toast } from "sonner"

function EmployeesManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        employees,
        isLoading,
        isError,
        error,
        startAllWorkday,
        endAllWorkday,
        startEmployeeWorkday,
        endEmployeeWorkday,
    } = useEmployeesWorkday();

    const {
        isWorkdayActive
    } = useWorkday({
        userId: null,
        enableSSE: false,
        enablePolling: true,
        role: 'owner'
    });

    // Filtrar empleados excluyendo al owner y por término de búsqueda
    const filteredEmployees = employees
        ?.filter(employee => employee.role !== 'owner')
        .filter(employee =>
            (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleStartAllWorkday = async () => {
        try {
            await startAllWorkday.mutateAsync();
            toast.success('La jornada laboral ha sido iniciada para todos los empleados.')
        } catch (error) {
            toast.error('No se pudo iniciar la jornada laboral.')
        }
    };

    const handleEndAllWorkday = async () => {
        try {
            await endAllWorkday.mutateAsync();
            toast.info('La jornada laboral ha sido finalizada para todos los empleados.')
        } catch (error) {
            toast.error('No se pudo finalizar la jornada laboral.')
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Empleados"
                description="Gestiona los empleados de tu negocio"
                actions={
                    <>
                        <Button
                            variant={
                                isWorkdayActive || startAllWorkday.isLoading || endAllWorkday.isLoading
                                    ? "secondary"
                                    : "default"
                            }
                            title="Iniciar Jornada"
                            className="cursor-pointer"
                            onClick={handleStartAllWorkday}
                            disabled={isWorkdayActive || startAllWorkday.isLoading || endAllWorkday.isLoading}
                        >
                            {startAllWorkday.isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Play className="h-4 w-4 mr-2" />
                            )}
                            Iniciar
                        </Button>
                        <Button
                            variant={
                                !isWorkdayActive || startAllWorkday.isLoading || endAllWorkday.isLoading
                                    ? "secondary"
                                    : "default"
                            }
                            title="Finalizar Jornada"
                            className="cursor-pointer"
                            onClick={handleEndAllWorkday}
                            disabled={!isWorkdayActive || startAllWorkday.isLoading || endAllWorkday.isLoading}
                        >
                            {endAllWorkday.isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Square className="h-4 w-4 mr-2" />
                            )}
                            Finalizar
                        </Button>
                    </>
                }
            />

            <SearchBar.withSearchTerm
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Buscar empleados por nombre o correo..."
            />

            {/* Lista de empleados */}
            <Card>
                <CardHeader className="mt-4">
                    <CardTitle>Lista de Empleados</CardTitle>
                    <CardDescription>
                        {filteredEmployees?.length} empleados registrados en tu negocio
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    <EmployeesList
                        employees={filteredEmployees}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onStartWorkday={startEmployeeWorkday.mutateAsync}
                        onEndWorkday={endEmployeeWorkday.mutateAsync}
                        isUpdating={startEmployeeWorkday.isLoading || endEmployeeWorkday.isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default EmployeesManagement;