import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';

export function useProducts() {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAll(),
        select: (data) => data.data.map(product => ({
            ...product,
            price: Number(product.price["$numberDecimal"]),
        })),
    });

    const getProductById = (id) => {
        return useQuery({
            queryKey: ['products', id],
            queryFn: () => productService.getById(id),
            select: (data) => ({
                ...data.data,
                price: Number(data.data.price["$numberDecimal"]),
            }),
            enabled: !!id,
        });
    };

    const createProduct = useMutation({
        mutationFn: (newProduct) => productService.create(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateProduct = useMutation({
        mutationFn: ({ id, data }) => productService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const deleteProduct = useMutation({
        mutationFn: (id) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return {
        products: productsQuery.data,
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        error: productsQuery.error,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}
