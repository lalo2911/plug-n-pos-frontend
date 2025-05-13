import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import {
    ChartContainer as RechartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import ChartContainer from './ChartContainer';
import { formatShortDate, formatLongDate } from '../../../utils/formatters';

/**
 * Componente de gráfica de tendencia de ventas
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos de tendencia de ventas
 * @param {boolean} props.isLoading - Indica si los datos están cargando
 * @param {boolean} props.isError - Indica si hubo un error al cargar los datos
 */
function SalesTrendChart({ data, isLoading, isError }) {
    const chartConfig = {
        totalSales: {
            label: "Ventas",
            color: "var(--chart-2)",
        },
        orderCount: {
            label: "Pedidos",
            color: "var(--chart-1)",
        },
    }

    // Formatear fechas para la gráfica
    const formattedData = data?.map(item => ({
        ...item,
        dateFormatted: formatShortDate(item.date)
    })) || [];

    return (
        <ChartContainer
            title="Tendencia de Ventas"
            description="Últimos 7 días"
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error al cargar tendencia de ventas"
        >
            <RechartContainer
                className="h-full w-full"
                config={chartConfig}
            >
                <LineChart
                    accessibilityLayer
                    data={formattedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateFormatted" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `$${value.toLocaleString("es-MX")}`}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <Line
                        yAxisId="left"
                        dataKey="totalSales"
                        type="monotone"
                        stroke="var(--color-totalSales)"
                        strokeWidth={1}
                        dot={false}
                    />
                    <Line
                        yAxisId="right"
                        dataKey="orderCount"
                        type="monotone"
                        stroke="var(--color-orderCount)"
                        strokeWidth={1}
                        dot={false}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent
                            indicator="line"
                            labelFormatter={(_, payload) => {
                                // payload es un array de elementos, accede al primero
                                const originalDate = payload?.[0]?.payload?.date;
                                return formatLongDate(originalDate);
                            }}
                        />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
            </RechartContainer>
        </ChartContainer>
    );
}

export default SalesTrendChart;