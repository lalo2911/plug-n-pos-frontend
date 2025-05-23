import { Skeleton } from "@/components/ui/skeleton";
import {
    BadgeDollarSign,
    ShoppingBag,
    Calendar,
    CalendarDays
} from 'lucide-react';

export function LoadingState() {
    // Configuración de las tarjetas de estadísticas para el skeleton
    const statsCards = [
        {
            title: "Ventas Hoy",
            icon: BadgeDollarSign
        },
        {
            title: "Ventas Semana",
            icon: Calendar
        },
        {
            title: "Ventas Mes",
            icon: CalendarDays
        },
        {
            title: "Ticket Promedio",
            icon: ShoppingBag
        }
    ];

    return (
        <div className="space-y-6 select-none">
            {/* Page Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                                <Skeleton className="h-7 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-2">
                                <card.icon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-4">Productos Más Vendidos</h3>
                    <div className="space-y-4">
                        {Array(5).fill(0).map((_, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-10 w-10 rounded" />
                                    <div>
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-16 mt-1" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invite Employees Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-4">Invitar Empleados</h3>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex space-x-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Summary Skeleton */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-4">Resumen de Ventas</h3>
                    <div className="space-y-6">
                        {/* Stats row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array(4).fill(0).map((_, index) => (
                                <div key={index} className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}