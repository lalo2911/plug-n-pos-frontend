import { Loader2 } from 'lucide-react';
import EmployeeRow from './EmployeeRow';

function EmployeesList({
    employees,
    isLoading,
    isError,
    error,
    onStartWorkday,
    onEndWorkday,
    isUpdating
}) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-8 text-red-500">
                Error al cargar los empleados: {error?.message || "Error desconocido"}
            </div>
        );
    }

    if (!employees || employees.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No se encontraron empleados
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuario</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Correo</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Tipo de Cuenta</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Rol</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Registro</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {employees.map((employee) => (
                        <EmployeeRow
                            key={employee._id}
                            employee={employee}
                            onStartWorkday={onStartWorkday}
                            onEndWorkday={onEndWorkday}
                            isUpdating={isUpdating}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeesList;