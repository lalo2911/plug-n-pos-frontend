import React, { createContext, useContext } from 'react';
import { useWorkday } from '@/hooks/useWorkday';

// Crear contexto
const WorkdayContext = createContext();

export const WorkdayProvider = ({ children }) => {
    const {
        startWorkday,
        endWorkday
    } = useWorkday(null);

    // Valor del contexto
    const value = {
        startWorkday: () => startWorkday.mutate(),
        endWorkday: () => endWorkday.mutate(),
    };

    return (
        <WorkdayContext.Provider value={value}>
            {children}
        </WorkdayContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useWorkdayContext = () => {
    const context = useContext(WorkdayContext);
    if (context === undefined) {
        throw new Error('useWorkdayContext debe ser usado dentro de un WorkdayProvider');
    }
    return context;
};