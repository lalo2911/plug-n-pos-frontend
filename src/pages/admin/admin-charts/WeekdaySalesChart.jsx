import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid
} from 'recharts';
import {
    ChartContainer as RechartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
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
    const chartConfig = {
        totalSales: {
            label: "Ganancias",
        }
    }

    // Reordenar para que Lunes sea el primero (día 2)
    const reorderedData = [...(data || [])].sort((a, b) => {
        const getCustomOrder = (n) => (n === 1 ? 7 : n - 1);
        return getCustomOrder(a.dayNumber) - getCustomOrder(b.dayNumber);
    });

    return (
        <ChartContainer
            title="Ventas por Día de la Semana"
            description="Distribución de ventas por día"
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error al cargar datos por día"
        >
            <RechartContainer
                className="h-full w-full"
                config={chartConfig}
            >
                <BarChart accessibilityLayer data={reorderedData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="totalSales" fill="#8884d8" radius={8} />
                </BarChart>
            </RechartContainer>
        </ChartContainer>
    );
}

export default WeekdaySalesChart;