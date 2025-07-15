import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product, onAddToCart, isInCart, cartQuantity }) => {
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
            className={`overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 relative aspect-square ${isInCart
                ? 'ring-2 ring-gray-600 ring-offset-2 shadow-lg'
                : ''
                }`}
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

                {isInCart && cartQuantity > 0 && (
                    <Badge
                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-800 text-white min-w-[1.5rem] h-6 flex items-center justify-center"
                        variant="default"
                    >
                        {cartQuantity}
                    </Badge>
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
