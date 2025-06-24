import { Activity } from 'lucide-react';
import SummaryCard from './SummaryCard';
import { formatCurrency } from '@/utils/formatters';

/**
 * Componente de tarjeta de ventas totales
 * 
 * @param {Object} props
 * @param {Object} props.data - Datos de ventas totales
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function TotalSalesCard({ data, isLoading, isError }) {
    const amount = data?.amount || 0;
    const orderCount = data?.orderCount || 0;

    return (
        <SummaryCard
            title="Ventas Totales"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            value={formatCurrency(amount)}
            subtitle={`${orderCount} pedidos`}
            isLoading={isLoading}
            isError={isError}
        />
    );
}

export default TotalSalesCard;