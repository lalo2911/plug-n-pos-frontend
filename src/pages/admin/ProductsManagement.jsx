import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Search,
    Plus,
    ChevronDown,
    Loader2,
    Edit,
    Trash
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ProductsManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    // Obtener productos
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await apiClient.get('/products');
            return response.data.data;
        }
    });

    // Obtener categorías
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await apiClient.get('/categories');
            return response.data.data;
        }
    });

    // Filtrar productos por término de búsqueda
    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    // Encontrar el nombre de la categoría por ID
    const getCategoryName = (categoryId) => {
        const category = categories?.find(cat => cat._id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Productos</h1>
                    <p className="text-gray-500">Gestiona los productos de tu negocio</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    className="pl-10"
                    placeholder="Buscar productos por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista de productos */}
            <Card>
                <CardHeader className="mt-4">
                    <CardTitle>Inventario de Productos</CardTitle>
                    <CardDescription>
                        {products?.length} productos registrados en total
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            Error al cargar los productos
                        </div>
                    ) : filteredProducts?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron productos
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Producto</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Código</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Precio</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredProducts?.map((product) => (
                                        <tr key={product._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{product.name}</td>
                                            <td className="p-4 align-middle">
                                                <span className="font-mono">{product.code || '-'}</span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getCategoryName(product.category)}
                                            </td>
                                            <td className="p-4 align-middle">{formatPrice(product.price)}</td>
                                            <td className="p-4 align-middle">
                                                {product.stock > 0 ? (
                                                    <Badge variant={product.stock > 10 ? "outline" : "secondary"}>
                                                        {product.stock} unidades
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">Sin stock</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="flex items-center">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center text-red-500">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Eliminar</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ProductsManagement;