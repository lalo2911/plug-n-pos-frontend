import { TrendingUp } from 'lucide-react';
import SummaryCard from './SummaryCard';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Componente de tarjeta de ticket promedio
 * 
 * @param {Object} props
 * @param {Object} props.data - Datos de ventas totales (incluye averageOrder)
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function AverageTicketCard({ data, isLoading, isError }) {
    const averageOrder = data?.averageOrder || 0;

    return (
        <SummaryCard
            title="Ticket Promedio"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            value={formatCurrency(averageOrder)}
            subtitle="Por pedido"
            isLoading={isLoading}
            isError={isError}
        />
    );
}

export default AverageTicketCard;