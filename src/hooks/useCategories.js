import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/apiService';

export function useCategories() {
    const queryClient = useQueryClient();

    // Obtener todas las categorías
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll(),
        select: (data) => data.data, // Extrae el objeto data de la respuesta
    });

    // Obtener una categoría por ID
    const getCategoryById = (id) => {
        return useQuery({
            queryKey: ['categories', id],
            queryFn: () => categoryService.getById(id),
            select: (data) => data.data,
            enabled: !!id, // Solo ejecuta si hay un ID
        });
    };

    // Crear una nueva categoría
    const createCategory = useMutation({
        mutationFn: (newCategory) => categoryService.create(newCategory),
        onSuccess: () => {
            // Invalida la consulta para que se vuelva a cargar
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    // Actualizar una categoría
    const updateCategory = useMutation({
        mutationFn: ({ id, data }) => categoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    // Eliminar una categoría
    const deleteCategory = useMutation({
        mutationFn: (id) => categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    return {
        categories: categoriesQuery.data,
        isLoading: categoriesQuery.isLoading,
        isError: categoriesQuery.isError,
        error: categoriesQuery.error,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}