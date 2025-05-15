import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import CategoryCard from './CategoryCard';

function CategoryList({ categories, isLoading, isError, error, onEdit, onDelete, totalCount }) {
    return (
        <Card>
            <CardHeader className="mt-4">
                <CardTitle>Lista de Categorías</CardTitle>
                <CardDescription>
                    {totalCount} categorías registradas en total
                </CardDescription>
            </CardHeader>
            <CardContent className="mb-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-red-500">
                        Error al cargar las categorías
                    </div>
                ) : categories?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron categorías
                    </div>
                ) : (
                    <div className="divide-y">
                        {categories?.map((category) => (
                            <CategoryCard
                                key={category._id}
                                category={category}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default CategoryList;