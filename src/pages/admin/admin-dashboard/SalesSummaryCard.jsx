import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BadgeDollarSign, TrendingUp, Package } from 'lucide-react';

export function SalesSummaryCard({ salesData, inventoryData, formatCurrency }) {
    return (
        <Card>
            <CardHeader className="mt-4">
                <CardTitle className="text-xl">Resumen de Ventas</CardTitle>
                <CardDescription>Datos generales de ventas y operación</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <BadgeDollarSign className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium">Ventas Totales</span>
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(salesData.total?.amount || 0)}</div>
                    <p className="text-xs text-gray-500 mt-1">{salesData.total?.orderCount || 0} pedidos totales</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium">Ticket Promedio Total</span>
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(salesData.total?.averageOrder || 0)}</div>
                    <p className="text-xs text-gray-500 mt-1">Promedio histórico</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium">Inventario</span>
                    </div>
                    <div className="text-2xl font-bold">{inventoryData.totalProducts || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Productos en {inventoryData.totalCategories || 0} categorías</p>
                </div>
            </CardContent>
        </Card>
    );
}