import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function ErrorState({ error }) {
    return (
        <div className="flex h-64 items-center justify-center">
            <div className="text-center">
                <h2 className="text-lg font-semibold text-red-600">Error al cargar datos</h2>
                <p className="text-gray-500">{error?.message || "No se pudieron cargar los datos del dashboard"}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reintentar
                </Button>
            </div>
        </div>
    );
}