import { Loader2 } from 'lucide-react';

export function LoadingState() {
    return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Cargando datos del dashboard...</span>
        </div>
    );
}