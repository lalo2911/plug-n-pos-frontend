import { useState } from 'react';
import { useEmployees } from '../../../../hooks/useEmployees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeesHeader from './EmployeesHeader';
import SearchBar from './SearchBar';
import EmployeesList from './EmployeesList';

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

    return (
        <div className="space-y-6">
            <EmployeesHeader />

            {/* Barra de búsqueda */}
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
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