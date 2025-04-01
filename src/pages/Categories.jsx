import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';

function Categories() {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const {
        categories,
        isLoading,
        isError,
        error,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategories();

    const handleCreateCategory = () => {
        if (newCategoryName.trim()) {
            createCategory.mutate({ name: newCategoryName.trim() }, {
                onSuccess: () => {
                    setNewCategoryName('');
                }
            });
        }
    };

    const handleUpdateCategory = () => {
        if (editingCategory && editingCategory.name.trim()) {
            updateCategory.mutate(
                {
                    id: editingCategory._id,
                    data: { name: editingCategory.name.trim() }
                },
                {
                    onSuccess: () => {
                        setEditingCategory(null);
                    }
                }
            );
        }
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            deleteCategory.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Categorías</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Cargando categorías...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[1, 2, 3].map((index) => (
                                <Skeleton key={index} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Categorías</h1>
                <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-700">Error al cargar categorías</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">{error.message || 'Ha ocurrido un error al cargar las categorías'}</p>
                        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Categorías</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Agregar nueva categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2">
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nombre de la categoría"
                            className="flex-1"
                        />
                        <Button
                            onClick={handleCreateCategory}
                            disabled={createCategory.isPending || !newCategoryName.trim()}
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Agregar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de categorías</CardTitle>
                </CardHeader>
                <CardContent>
                    {categories && categories.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Fecha de creación</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell>
                                            {editingCategory && editingCategory._id === category._id ? (
                                                <Input
                                                    value={editingCategory.name}
                                                    onChange={(e) => setEditingCategory({
                                                        ...editingCategory,
                                                        name: e.target.value
                                                    })}
                                                />
                                            ) : (
                                                category.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(category.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {editingCategory && editingCategory._id === category._id ? (
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEditingCategory(null)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleUpdateCategory}
                                                        disabled={updateCategory.isPending || !editingCategory.name.trim()}
                                                    >
                                                        Guardar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setEditingCategory(category)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleDeleteCategory(category._id)}
                                                        disabled={deleteCategory.isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay categorías disponibles.</p>
                            <p className="text-sm text-gray-400">Agrega una nueva categoría para comenzar.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Categories;