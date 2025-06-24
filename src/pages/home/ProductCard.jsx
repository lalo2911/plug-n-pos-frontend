import { useState } from 'react';
import { Card } from '@/components/ui/card';

const ProductCard = ({ product, onAddToCart }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (
        <Card
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 relative aspect-square"
            onClick={() => onAddToCart(product)}
        >
            <div className="h-full w-full bg-gray-100 flex items-center justify-center relative">
                {product.image_url && !imageError ? (
                    <>
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        )}
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            loading="lazy"
                        />
                    </>
                ) : (
                    <span className="text-gray-400 text-xs">Sin imagen</span>
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
            </div>
        </Card>
    );
};

export default ProductCard;
