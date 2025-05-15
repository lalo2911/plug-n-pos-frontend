import { useState } from 'react';
import { useProducts } from '../../../../hooks/useProducts';
import { Card } from "@/components/ui/card";
import PageHeader from '../PageHeader';
import ProductsList from './ProductsList';
import ProductSearch from './ProductSearch';
import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';
import DeleteProductDialog from './DeleteProductDialog';

function ProductsManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        category_id: ''
    });

    const {
        products,
        isLoading,
        error,
        createProduct,
        updateProduct,
        deleteProduct
    } = useProducts();

    // Filtrar productos por término de búsqueda
    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <PageHeader
                title="Productos"
                description="Gestiona los productos de tu negocio"
                onAddNew={() => setIsAddDialogOpen(true)}
                addButtonText="Nuevo Producto"
            />

            <ProductSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <Card>
                <ProductsList
                    filteredProducts={filteredProducts}
                    isLoading={isLoading}
                    error={error}
                    openEditDialog={openEditDialog}
                    openDeleteDialog={openDeleteDialog}
                    productsCount={products?.length}
                />
            </Card>

            <AddProductDialog
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
                formData={formData}
                setFormData={setFormData}
                createProduct={createProduct}
                resetForm={resetForm}
            />

            <EditProductDialog
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                formData={formData}
                setFormData={setFormData}
                updateProduct={updateProduct}
                selectedProduct={selectedProduct}
            />

            <DeleteProductDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                deleteProduct={deleteProduct}
                selectedProduct={selectedProduct}
            />
        </div>
    );
}

export default ProductsManagement;