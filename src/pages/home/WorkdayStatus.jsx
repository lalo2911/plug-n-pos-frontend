import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function WorkdayStatus({ isWorkdayActive, isLoading, workdayStatus }) {
    const [hasShownToast, setHasShownToast] = useState(false);

    // Show toast notification when workday status changes
    useEffect(() => {
        if (!isLoading && workdayStatus && !hasShownToast) {
            if (isWorkdayActive) {
                toast.success('¡Tu jornada laboral está activa!', {
                    description: 'Puedes registrar pedidos normalmente.',
                    duration: 4000,
                });
            } else {
                toast.warning('El día laboral no ha comenzado', {
                    description: 'Espera a que el dueño active el día laboral para poder registrar pedidos.',
                    duration: 6000,
                });
            }
            setHasShownToast(true);
        }
    }, [isWorkdayActive, isLoading, workdayStatus, hasShownToast]);

    // Reset toast flag when workday status changes
    useEffect(() => {
        setHasShownToast(false);
    }, [isWorkdayActive]);
}

export default WorkdayStatus;