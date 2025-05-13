import { useAuth } from '../../../context/AuthContext';
import { useBusiness } from '../../../hooks/useBusiness';
import { useMetrics } from '../../../hooks/useMetrics';
import {
    BadgeDollarSign,
    ShoppingBag,
    Calendar,
    CalendarDays
} from 'lucide-react';

// Componentes modulares
import { StatsCard } from './StatsCard';
import { TopProductsCard } from './TopProductsCard';
import { InviteEmployeesCard } from './InviteEmployeesCard';
import { SalesSummaryCard } from './SalesSummaryCard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

// Utilidades
import { formatCurrency } from '../../../utils/formatters';

function AdminDashboard() {
    const { currentUser } = useAuth();
    const { generateInviteCode } = useBusiness();

    const {
        dashboardSummary,
        isDashboardLoading,
        isDashboardError,
        dashboardError
    } = useMetrics({
        enabled: {
            dashboard: true
        }
    });

    if (isDashboardLoading) {
        return <LoadingState />;
    }

    if (isDashboardError) {
        return <ErrorState error={dashboardError} />;
    }

    // Datos del dashboard
    const salesData = dashboardSummary?.sales || {};
    const inventoryData = dashboardSummary?.inventory || {};
    const topProducts = dashboardSummary?.topProducts || [];

    // Configuración de las tarjetas de estadísticas
    const statsCards = [
        {
            title: "Ventas Hoy",
            value: formatCurrency(salesData.today?.amount || 0),
            subtitle: `${salesData.today?.orderCount || 0} pedidos`,
            icon: BadgeDollarSign
        },
        {
            title: "Ventas Semana",
            value: formatCurrency(salesData.thisWeek?.amount || 0),
            subtitle: `${salesData.thisWeek?.orderCount || 0} pedidos`,
            icon: Calendar
        },
        {
            title: "Ventas Mes",
            value: formatCurrency(salesData.thisMonth?.amount || 0),
            subtitle: `${salesData.thisMonth?.orderCount || 0} pedidos`,
            icon: CalendarDays
        },
        {
            title: "Ticket Promedio",
            value: formatCurrency(salesData.thisMonth?.averageOrder || 0),
            subtitle: "Este mes",
            icon: ShoppingBag
        }
    ];

    return (
        <div className="space-y-6 select-none">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Bienvenido de nuevo, {currentUser?.name}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => (
                    <StatsCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        icon={card.icon}
                    />
                ))}
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <TopProductsCard products={topProducts} formatCurrency={formatCurrency} />

                {/* Invite Employees */}
                <InviteEmployeesCard generateInviteCode={generateInviteCode} />
            </div>

            {/* Sales Summary */}
            <div className="grid grid-cols-1 gap-6">
                <SalesSummaryCard
                    salesData={salesData}
                    inventoryData={inventoryData}
                    formatCurrency={formatCurrency}
                />
            </div>
        </div>
    );
}

export default AdminDashboard;