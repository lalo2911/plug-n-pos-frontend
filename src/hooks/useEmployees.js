import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';

export function useEmployees() {
    const employeesQuery = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.getByBusinessId(),
        select: (data) => data.data,
    });

    return {
        employees: employeesQuery.data,
        isLoading: employeesQuery.isLoading,
        isError: employeesQuery.isError,
        error: employeesQuery.error,
    };
}
