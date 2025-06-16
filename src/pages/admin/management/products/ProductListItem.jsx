import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ImageIcon, Trash } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

function ProductListItem({ product, openEditDialog, openDeleteDialog }) {
    const { categories } = useCategories();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

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

    // Manejar error de imagen
    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    // Manejar carga de imagen
    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 align-middle">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {product.image_url && !imageError ? (
                            <>
                                {imageLoading && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
                                )}
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-10 w-10 object-cover rounded-md"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    loading="lazy"
                                />
                            </>
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
    );
}

export default ProductListItem;