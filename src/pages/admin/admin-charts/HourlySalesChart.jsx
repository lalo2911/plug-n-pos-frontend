import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import ChartContainer from './ChartContainer';
import { formatHour } from '../../../utils/formatters';

/**
 * Componente de gráfica de ventas por hora
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos de ventas por hora
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function HourlySalesChart({ data, isLoading, isError }) {
    // Formatear horas para la gráfica
    const formattedData = data?.map(item => ({
        ...item,
        hourFormatted: formatHour(item.hour)
    })) || [];

    return (
        <ChartContainer
            title="Ventas por Hora"
            description="Distribución de ventas a lo largo del día"
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error al cargar datos por hora"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hourFormatted" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']}
                        labelFormatter={(label) => `Hora: ${label}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="totalSales"
                        name="Ventas"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default HourlySalesChart;