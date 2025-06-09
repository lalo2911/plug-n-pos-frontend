import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Mail, Power } from 'lucide-react';
import { getInitials, getAccountType, formatRegisterDate } from '@/utils/formatters';
import { toast } from "sonner"

function EmployeeRow({ employee, onStartWorkday, onEndWorkday, isUpdating }) {
    const isActive = employee.workdayStatus || false;

    // Manejar cambio de estado
    const handleToggleWorkday = async () => {
        try {
            if (isActive) {
                await onEndWorkday(employee._id);
                toast.info(`La jornada laboral de ${employee.name} ha sido finalizada.`)
            } else {
                await onStartWorkday(employee._id);
                toast.success(`La jornada laboral de ${employee.name} ha sido iniciada.`)
            }
        } catch (error) {
            toast.error('No se pudo actualizar el estado de la jornada.')
        }
    };

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
            <td className="p-4 align-middle">
                <Badge variant={isActive ? "success" : "secondary"} className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {isActive ? 'Activo' : 'Inactivo'}
                </Badge>
            </td>
            <td className="p-4 align-middle text-right">
                <div className="flex items-center justify-end space-x-2">
                    <Switch
                        className="cursor-pointer"
                        checked={isActive}
                        onCheckedChange={handleToggleWorkday}
                        disabled={employee.role === 'owner' || isUpdating}
                        aria-label="Toggle workday status"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={handleToggleWorkday}
                        disabled={employee.role === 'owner' || isUpdating}
                    >
                        <Power className={`h-4 w-4 ${isActive ? 'text-red-500' : 'text-green-500'}`} />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default EmployeeRow;