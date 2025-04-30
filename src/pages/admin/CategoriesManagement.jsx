import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tag,
    Search,
    Plus,
    Loader2,
    Edit,
    Trash,
    Package
} from 'lucide-react';
import { toast } from "sonner"
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function CategoriesManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const {
        categories,
        isLoading,
        isError,
        error,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategories();

    // Filtrar categorías por término de búsqueda
    const filteredCategories = categories?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar crear categoría
    const handleCreateCategory = () => {
        if (!categoryName.trim()) {
            toast.error("Error", {
                description: "El nombre de la categoría es requerido",
            });
            return;
        }

        createCategory.mutate({ name: categoryName.trim() }, {
            onSuccess: () => {
                toast.success("Categoría creada", {
                    description: "La categoría ha sido creada exitosamente"
                });
                setCategoryName('');
                setIsAddDialogOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo crear la categoría",
                });
            }
        });
    };

    // Manejar actualizar categoría
    const handleUpdateCategory = () => {
        if (!categoryName.trim()) {
            toast.error("Error", {
                description: "El nombre de la categoría es requerido",
            });
            return;
        }

        updateCategory.mutate(
            {
                id: selectedCategory._id,
                data: { name: categoryName.trim() }
            },
            {
                onSuccess: () => {
                    toast.success("Categoría actualizada", {
                        description: "La categoría ha sido actualizada exitosamente",
                    });
                    setIsEditDialogOpen(false);
                },
                onError: (error) => {
                    toast.error("Error", {
                        description: error.response?.data?.message || "No se pudo actualizar la categoría",
                    });
                }
            }
        );
    };

    // Manejar eliminar categoría
    const handleDeleteCategory = () => {
        deleteCategory.mutate(selectedCategory._id, {
            onSuccess: () => {
                toast.success("Categoría eliminada", {
                    description: "La categoría ha sido eliminada exitosamente",
                });
                setIsDeleteDialogOpen(false);
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo eliminar la categoría",
                });
            }
        });
    };

    // Abrir modal de edición
    const openEditDialog = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.name);
        setIsEditDialogOpen(true);
    };

    // Abrir modal de eliminación
    const openDeleteDialog = (category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    // Contar productos por categoría
    const getProductCount = (categoryId) => {
        // Aquí deberías obtener la cantidad de productos por categoría
        // Esto es un placeholder
        return Math.floor(Math.random() * 20);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Categorías</h1>
                    <p className="text-gray-500">Gestiona las categorías de productos</p>
                </div>

                {/* Dialog para agregar categoría */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar Categoría</DialogTitle>
                            <DialogDescription>
                                Crea una nueva categoría para organizar tus productos.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Nombre de la categoría
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Ingresa el nombre"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCreateCategory}
                                disabled={createCategory.isPending}
                            >
                                {createCategory.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para editar categoría */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Categoría</DialogTitle>
                            <DialogDescription>
                                Actualiza el nombre de la categoría.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <label htmlFor="edit-name" className="text-sm font-medium">
                                    Nombre de la categoría
                                </label>
                                <Input
                                    id="edit-name"
                                    placeholder="Ingresa el nombre"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleUpdateCategory}
                                disabled={updateCategory.isPending}
                            >
                                {updateCategory.isPending ? (
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
                                Esta acción no se puede deshacer. Eliminar esta categoría afectará a todos los productos asociados.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteCategory}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                {deleteCategory.isPending ? (
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
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista de categorías */}
            <Card>
                <CardHeader className="mt-4">
                    <CardTitle>Lista de Categorías</CardTitle>
                    <CardDescription>
                        {categories?.length} categorías registradas en total
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            Error al cargar las categorías
                        </div>
                    ) : filteredCategories?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron categorías
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredCategories?.map((category) => (
                                <div key={category._id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-2 rounded-full">
                                            <Tag className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{category.name}</h3>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Package className="h-3 w-3 mr-1" />
                                                {getProductCount(category._id)} productos
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditDialog(category)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500"
                                            onClick={() => openDeleteDialog(category)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default CategoriesManagement;