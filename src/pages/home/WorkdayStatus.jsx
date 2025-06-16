import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function WorkdayStatus({
    isWorkdayActive,
    isLoading,
    workdayStatus
}) {
    const [hasShownToast, setHasShownToast] = useState(false);

    // Show toast notification when workday status changes
    useEffect(() => {
        const justCompleted = sessionStorage.getItem('orderJustCompleted');

        if (justCompleted) {
            setTimeout(() => {
                sessionStorage.removeItem('orderJustCompleted');
            }, 300);
            return;
        }

        if (!isLoading && workdayStatus && !hasShownToast) {
            if (isWorkdayActive) {
                toast.success('¡Tu jornada laboral está activa!', {
                    id: 'workday-toast',
                    description: 'Puedes registrar pedidos normalmente.'
                });
            } else {
                toast.warning('El día laboral no ha comenzado', {
                    id: 'workday-toast',
                    description: 'Espera a que el dueño active el día laboral para poder registrar pedidos.'
                });
            }
            setHasShownToast(true);
        }
    }, [isWorkdayActive, isLoading, workdayStatus, hasShownToast]);

    // Reset toast flag when workday status changes
    useEffect(() => {
        setHasShownToast(false);
    }, [isWorkdayActive]);

    return null;
}

export default WorkdayStatus;