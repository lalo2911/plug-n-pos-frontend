import { useWorkday } from '@/hooks/useWorkday';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Square } from 'lucide-react';
import { toast } from "sonner"

function WorkdayControls() {
    const {
        workdayStatus,
        isWorkdayActive,
        isLoadingStatus,
        startWorkday,
        endWorkday
    } = useWorkday(null);

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
        <Card>
            <CardHeader className="mt-4">
                <CardTitle className="flex items-center justify-between text-xl">
                    <span>Control de Jornada</span>
                    {isLoadingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Badge variant={isWorkdayActive ? "success" : "secondary"} className={isWorkdayActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {isWorkdayActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    Controla la jornada laboral de todos los empleados
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                    {isWorkdayActive
                        ? "La jornada laboral está activa. Los empleados pueden registrar pedidos."
                        : "La jornada laboral está inactiva. Los empleados no pueden registrar pedidos."}
                </p>
                {workdayStatus?.activatedAt && (
                    <p className="text-xs text-gray-500">
                        Iniciada: {new Date(workdayStatus.activatedAt).toLocaleString()}
                    </p>
                )}
                {workdayStatus?.deactivatedAt && (
                    <p className="text-xs text-gray-500">
                        Finalizada: {new Date(workdayStatus.deactivatedAt).toLocaleString()}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                <Button
                    variant={
                        isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading
                            ? "secondary"
                            : "default"
                    }
                    className="w-full sm:w-1/2 cursor-pointer"
                    onClick={handleStartAllWorkday}
                    disabled={isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading}
                >
                    {startWorkday.isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Play className="h-4 w-4 mr-2" />
                    )}
                    Iniciar Jornada
                </Button>
                <Button
                    variant={
                        !isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading
                            ? "secondary"
                            : "default"
                    }
                    className="w-full sm:w-1/2 cursor-pointer"
                    onClick={handleEndAllWorkday}
                    disabled={!isWorkdayActive || startWorkday.isLoading || endWorkday.isLoading}
                >
                    {endWorkday.isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Square className="h-4 w-4 mr-2" />
                    )}
                    Finalizar Jornada
                </Button>
            </CardFooter>
        </Card>
    );
}

export default WorkdayControls;