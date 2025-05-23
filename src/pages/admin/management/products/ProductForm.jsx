import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '../../../../hooks/useCategories';

function ProductForm({ formData, setFormData }) {
    const { categories } = useCategories();

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

    return (
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
                    className="resize-none"
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
    );
}

export default ProductForm;