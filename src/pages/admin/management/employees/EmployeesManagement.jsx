import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
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
    } = useEmployees();

    const {
        isWorkdayActive,
        startWorkday,
        endWorkday
    } = useWorkday(null);

    // Filtrar empleados por término de búsqueda
    const filteredEmployees = employees?.filter(employee =>
        (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStartAllWorkday = async () => {
        try {
            await startWorkday.mutateAsync();
            toast.success('La jornada laboral ha sido iniciada para todos los empleados.')
        } catch (error) {
            toast.error('No se pudo iniciar la jornada laboral.')
        }
    };

    const handleEndAllWorkday = async () => {
        try {
            await endWorkday.mutateAsync();
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
                                isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading
                                    ? "secondary"
                                    : "default"
                            }
                            title="Iniciar Jornada"
                            className="cursor-pointer"
                            onClick={handleStartAllWorkday}
                            disabled={isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading}
                        >
                            {startWorkday.isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Play className="h-4 w-4 mr-2" />
                            )}
                            Iniciar
                        </Button>
                        <Button
                            variant={
                                !isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading
                                    ? "secondary"
                                    : "default"
                            }
                            title="Finalizar Jornada"
                            className="cursor-pointer"
                            onClick={handleEndAllWorkday}
                            disabled={!isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading}
                        >
                            {endWorkday.isLoading ? (
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
                        {employees?.length} empleados registrados en tu negocio
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    <EmployeesList
                        employees={filteredEmployees}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default EmployeesManagement;