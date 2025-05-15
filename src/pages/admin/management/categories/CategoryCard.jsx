import { Tag, Package, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CategoryCard({ category, onEdit, onDelete }) {
    // Contar productos por categoría (placeholder)
    const getProductCount = () => {
        return Math.floor(Math.random() * 20);
    };

    return (
        <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded-full">
                    <Tag className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        {getProductCount()} productos
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => onDelete(category)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default CategoryCard;