import {
    PieChart,
    Pie,
    Cell
} from "recharts";
import {
    ChartContainer as RechartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import ChartContainer from "./ChartContainer";

// Paleta de colores reutilizable
const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
    "#A28DFF", "#FF6B6B", "#6BCB77", "#4D96FF"
];

// Función para obtener color por índice
const getCategoryColor = (index) => COLORS[index % COLORS.length];

// Genera config dinámico para shadcn/ui
const generateChartConfig = (data) => {
    const config = {
        totalSales: { label: "Ventas" },
    };

    data.forEach((item, index) => {
        config[item.name] = {
            label: item.name,
            color: getCategoryColor(index),
        };
    });

    return config;
};

/**
 * Gráfica de ventas por categoría
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos dinámicos de categorías
 * @param {boolean} props.isLoading - Estado de carga
 * @param {boolean} props.isError - Estado de error
 */
function CategorySalesChart({ data = [], isLoading, isError }) {
    const chartConfig = generateChartConfig(data);

    return (
        <ChartContainer
            title="Ventas por Categoría"
            description="Distribución de ventas por categoría"
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error al cargar datos de categorías"
        >
            <RechartContainer className="h-full w-full" config={chartConfig}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="totalSales"
                        nameKey="name"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}% ${name}`}
                        outerRadius={100}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
                        ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
            </RechartContainer>
        </ChartContainer>
    );
}

export default CategorySalesChart;
