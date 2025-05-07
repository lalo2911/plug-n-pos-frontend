import { useMutation } from '@tanstack/react-query';
import { setupService } from '../services/setupService';

export function useSetup() {
    // Mutación para configurar un propietario
    const setOwner = useMutation({
        mutationFn: (ownerData) => setupService.setOwner(ownerData),
        onSuccess: (data) => {
            // Aquí puedes manejar acciones posteriores al éxito
            // Por ejemplo, almacenar tokens o redirigir al usuario
            return data;
        },
    });

    // Mutación para configurar un empleado
    const setEmployee = useMutation({
        mutationFn: (employeeData) => setupService.setEmployee(employeeData),
        onSuccess: (data) => {
            // Aquí puedes manejar acciones posteriores al éxito
            return data;
        },
    });

    return {
        // Mutación de propietario
        setOwner,
        isSettingOwner: setOwner.isPending,
        isOwnerError: setOwner.isError,
        ownerError: setOwner.error,
        ownerData: setOwner.data,

        // Mutación de empleado
        setEmployee,
        isSettingEmployee: setEmployee.isPending,
        isEmployeeError: setEmployee.isError,
        employeeError: setEmployee.error,
        employeeData: setEmployee.data,
    };
}