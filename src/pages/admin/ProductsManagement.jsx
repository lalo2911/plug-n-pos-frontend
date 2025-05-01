import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Search,
    Plus,
    Loader2,
    Edit,
    Trash,
    ImageIcon
} from 'lucide-react';
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function ProductsManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { categories } = useCategories();

    const {
        products,
        isLoading,
        isError,
        error,
        createProduct,
        updateProduct,
        deleteProduct
    } = useProducts();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        category_id: ''
    });

    // Manejar crear producto
    const handleCreateProduct = () => {
        if (!formData.name.trim() || !formData.price || !formData.category_id) {
            toast.error("Error", {
                description: "Nombre, precio y categoría son campos requeridos",
            });
            return;
        }

        createProduct.mutate(formData, {
            onSuccess: () => {
                toast.success("Producto creado", {
                    description: "El producto ha sido creado exitosamente"
                });
                resetForm();
                setIsAddDialogOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo crear el producto",
                });
            }
        });
    };

    // Manejar actualizar producto
    const handleUpdateProduct = () => {
        if (!formData.name.trim() || !formData.price || !formData.category_id) {
            toast.error("Error", {
                description: "Nombre, precio y categoría son campos requeridos",
            });
            return;
        }

        updateProduct.mutate(
            {
                id: selectedProduct._id,
                data: formData
            },
            {
                onSuccess: () => {
                    toast.success("Producto actualizado", {
                        description: "El producto ha sido actualizado exitosamente",
                    });
                    setIsEditDialogOpen(false);
                },
                onError: (error) => {
                    toast.error("Error", {
                        description: error.response?.data?.message || "No se pudo actualizar el producto",
                    });
                }
            }
        );
    };

    // Manejar eliminar producto
    const handleDeleteProduct = () => {
        deleteProduct.mutate(selectedProduct._id, {
            onSuccess: () => {
                toast.success("Producto eliminado", {
                    description: "El producto ha sido eliminado exitosamente",
                });
                setIsDeleteDialogOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo eliminar el producto",
                });
            }
        });
    };

    // Filtrar productos por término de búsqueda
    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(typeof price === 'object' && price.$numberDecimal ? price.$numberDecimal : price);
    };

    // Encontrar el nombre de la categoría por ID
    const getCategoryName = (categoryId) => {
        const category = categories?.find(cat => cat._id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    // Manejar cambios en el formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    // Manejar cambio de categoría en el Select
    const handleCategoryChange = (value) => {
        setFormData(prev => ({
            ...prev,
            category_id: value
        }));
    };

    // Resetear formulario
    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            image_url: '',
            category_id: ''
        });
    };

    // Abrir modal de edición
    const openEditDialog = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price.$numberDecimal || product.price,
            description: product.description || '',
            image_url: product.image_url || '',
            category_id: product.category_id
        });
        setIsEditDialogOpen(true);
    };

    // Abrir modal de eliminación
    const openDeleteDialog = (product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Productos</h1>
                    <p className="text-gray-500">Gestiona los productos de tu negocio</p>
                </div>

                {/* Dialog para agregar producto */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Agregar Producto</DialogTitle>
                            <DialogDescription>
                                Crea un nuevo producto para tu inventario.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del producto</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Ingresa el nombre del producto"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Precio</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select
                                    onValueChange={handleCategoryChange}
                                    value={formData.category_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map(category => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción (opcional)</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe tu producto"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">URL de imagen (opcional)</Label>
                                <Input
                                    id="image_url"
                                    name="image_url"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={formData.image_url}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCreateProduct}
                                disabled={createProduct.isPending}
                            >
                                {createProduct.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para editar producto */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                            <DialogDescription>
                                Actualiza la información del producto.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nombre del producto</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    placeholder="Ingresa el nombre del producto"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Precio</Label>
                                <Input
                                    id="edit-price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Categoría</Label>
                                <Select
                                    onValueChange={handleCategoryChange}
                                    value={formData.category_id}
                                    defaultValue={formData.category_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map(category => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Descripción (opcional)</Label>
                                <Textarea
                                    id="edit-description"
                                    name="description"
                                    placeholder="Describe tu producto"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-image_url">URL de imagen (opcional)</Label>
                                <Input
                                    id="edit-image_url"
                                    name="image_url"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={formData.image_url}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleUpdateProduct}
                                disabled={updateProduct.isPending}
                            >
                                {updateProduct.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
                                ) : 'Actualizar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para confirmar eliminación */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. ¿Realmente deseas eliminar el producto "{selectedProduct?.name}"?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteProduct}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                {deleteProduct.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Eliminando...
                                    </>
                                ) : 'Eliminar'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    className="pl-10"
                    placeholder="Buscar productos por nombre o descripción..."
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
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Precio</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredProducts?.map((product) => (
                                        <tr key={product._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-10 w-10 object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        {product.description && (
                                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="outline">
                                                    {getCategoryName(product.category_id)}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(product)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500"
                                                        onClick={() => openDeleteDialog(product)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
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