import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { User, Calendar, Package, ImageIcon, Loader2 } from "lucide-react";
import { formatOrderDate, formatPrice, getShortId } from "../../../../utils/formatters";

function OrderDetailsDialog({ open, onClose, selectedOrder, orderDetails, isLoadingDetails, getEmployeeNameById, getProductInfo }) {
    if (!selectedOrder) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Detalles del Pedido</DialogTitle>
                    <DialogDescription>{getShortId(selectedOrder._id)}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-sm text-gray-500">Responsable</h3>
                            <p className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-400" />{getEmployeeNameById(selectedOrder.user_id)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm text-gray-500">Fecha</h3>
                            <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-400" />{formatOrderDate(selectedOrder.createdAt)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm text-gray-500">Total</h3>
                            <p className="font-medium">{formatPrice(selectedOrder.total)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm text-gray-500">Pago / Cambio</h3>
                            <p>{formatPrice(selectedOrder.payment)} / {formatPrice(selectedOrder.change)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2 flex items-center"><Package className="h-5 w-5 mr-2" />Productos en este pedido</h3>
                        {isLoadingDetails ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            </div>
                        ) : orderDetails.length === 0 ? (
                            <div className="bg-gray-50 rounded-md p-4 text-gray-500 text-center">
                                No se encontraron detalles para esta orden
                            </div>
                        ) : (
                            <div className="bg-gray-50/75 rounded-md">
                                <ScrollArea className="h-48">
                                    <div className="p-4 space-y-3">
                                        {orderDetails.map((detail) => {
                                            const product = getProductInfo(detail.product_id);
                                            return (
                                                <div key={detail._id} className="flex justify-between items-center pb-2">
                                                    <div className="flex items-center space-x-3">
                                                        {product?.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="h-10 w-10 object-cover rounded-md" />
                                                        ) : (
                                                            <ImageIcon className="h-10 w-10 text-gray-400" />
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{product?.name || 'Producto desconocido'}</p>
                                                            <p className="text-sm text-gray-500">Cantidad: {detail.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium">{formatPrice(detail.subtotal)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                                <div className="border-t p-4 flex justify-between">
                                    <p className="font-medium">Total</p>
                                    <p className="font-medium">{formatPrice(selectedOrder.total)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cerrar</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default OrderDetailsDialog;
