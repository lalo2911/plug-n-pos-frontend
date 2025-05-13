import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import ChartContainer from './ChartContainer';

/**
 * Componente de gráfica de ventas por día de la semana
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos de ventas por día de la semana
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function WeekdaySalesChart({ data, isLoading, isError }) {
    // Ordenar los datos por número de día
    const sortedData = data?.sort((a, b) => a.dayNumber - b.dayNumber) || [];

    return (
        <ChartContainer
            title="Ventas por Día de la Semana"
            description="Distribución de ventas por día"
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error al cargar datos por día"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']}
                        labelFormatter={(label) => `Día: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="totalSales" name="Ventas" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default WeekdaySalesChart;