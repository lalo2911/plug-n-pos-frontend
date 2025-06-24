import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import {
    ChartContainer as RechartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import ChartContainer from './ChartContainer';
import { formatHour } from '@/utils/formatters';

/**
 * Componente de gráfica de ventas por hora
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos de ventas por hora
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function HourlySalesChart({ data, isLoading, isError }) {
    const chartConfig = {
        totalSales: {
            label: "Ganancias"
        }
    }

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
            <RechartContainer
                className="h-full w-full"
                config={chartConfig}
            >
                <AreaChart accessibilityLayer data={formattedData}>
                    <CartesianGrid />
                    <XAxis
                        dataKey="hourFormatted"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <Area
                        dataKey="totalSales"
                        type="monotone"
                        fill="#ffa733"
                        fillOpacity={0.4}
                        stroke="#ffa733"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
            </RechartContainer>
        </ChartContainer>
    );
}

export default HourlySalesChart;