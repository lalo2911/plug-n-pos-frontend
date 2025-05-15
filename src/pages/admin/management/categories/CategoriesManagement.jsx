import { useState } from 'react';
import { useCategories } from '../../../../hooks/useCategories';
import { useProducts } from '../../../../hooks/useProducts';
import CategorySearchBar from './CategorySearchBar';
import PageHeader from '../PageHeader';
import CategoryList from './CategoryList';
import AddCategoryDialog from './AddCategoryDialog';
import EditCategoryDialog from './EditCategoryDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import { toast } from "sonner";

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

    const { products } = useProducts();

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

    // Filtrar categorías por término de búsqueda
    const filteredCategories = categories?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="space-y-6">
            <PageHeader
                title="Categorías"
                description="Gestiona las categorías de productos"
                onAddNew={() => setIsAddDialogOpen(true)}
                addButtonText="Nueva Categoría"
            />

            <AddCategoryDialog
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                onSave={handleCreateCategory}
                isPending={createCategory.isPending}
            />

            <EditCategoryDialog
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                onUpdate={handleUpdateCategory}
                isPending={updateCategory.isPending}
            />

            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onDelete={handleDeleteCategory}
                isPending={deleteCategory.isPending}
            />

            <CategorySearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <CategoryList
                categories={filteredCategories}
                products={products}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                totalCount={categories?.length || 0}
            />
        </div>
    );
}

export default CategoriesManagement;