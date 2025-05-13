import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import ChartContainer from './ChartContainer';

// Colores para las gráficas
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

/**
 * Componente de gráfica de ventas por categoría
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos de ventas por categoría
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function CategorySalesChart({ data, isLoading, isError }) {
    return (
        <ChartContainer
            title="Ventas por Categoría"
            description="Distribución de ventas por categoría"
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error al cargar datos de categorías"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalSales"
                        nameKey="name"
                    >
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CategorySalesChart;