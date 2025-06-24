import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
    const statsCards = [
        "Ventas Hoy",
        "Ventas Semana",
        "Ventas Mes",
        "Ticket Promedio"
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
                {statsCards.map((title, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WorkdayControls Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-60" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-40" />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Skeleton className="h-10 w-full sm:w-1/2" />
                        <Skeleton className="h-10 w-full sm:w-1/2" />
                    </div>
                </div>

                {/* InviteEmployees Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>

            {/* Sales Summary Skeleton */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array(4).fill(0).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
