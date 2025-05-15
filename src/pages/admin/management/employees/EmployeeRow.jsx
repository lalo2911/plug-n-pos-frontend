import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';
import { getInitials, getAccountType, formatRegisterDate } from '../../../../utils/formatters'

function EmployeeRow({ employee }) {
    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
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
                {formatRegisterDate(employee.createdAt)}
            </td>
        </tr>
    );
}

export default EmployeeRow;