import { Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import SummaryCard from './SummaryCard';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

/**
 * Componente de tarjeta de comparación mensual
 * 
 * @param {Object} props
 * @param {Object} props.data - Datos de comparación mensual
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function MonthlyComparisonCard({ data, isLoading, isError }) {
    if (!data) {
        return (
            <SummaryCard
                title="Comparación Mensual"
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                value={formatCurrency(0)}
                subtitle="Sin datos para comparar"
                isLoading={isLoading}
                isError={isError}
            />
        );
    }

    const currentMonthAmount = data?.currentMonth?.amount || 0;
    const lastMonthName = data?.lastMonth?.name || 'mes anterior';
    const salesChange = data?.changes?.salesChange || 0;
    const isPositiveChange = salesChange > 0;

    return (
        <SummaryCard
            title="Comparación Mensual"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            value={formatCurrency(currentMonthAmount)}
            subtitle={`Comparado con ${lastMonthName}`}
            isLoading={isLoading}
            isError={isError}
        >
            <div className={cn(
                "flex items-center text-sm",
                isPositiveChange ? "text-green-500" : "text-red-500"
            )}>
                {isPositiveChange ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(salesChange).toFixed(1)}%
            </div>
        </SummaryCard>
    );
}

export default MonthlyComparisonCard;