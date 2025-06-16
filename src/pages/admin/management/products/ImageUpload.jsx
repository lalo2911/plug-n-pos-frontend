import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

function ImageUpload({ onImageChange, currentImageUrl = null, label = "Imagen del producto", scrollRef }) {
    const [preview, setPreview] = useState(currentImageUrl);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('El archivo es demasiado grande. Máximo 5MB.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
                setSelectedFile(file);
            };
            reader.readAsDataURL(file);

            // Notificar al componente padre
            onImageChange(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const removeImage = () => {
        const scrollTop = scrollRef?.current?.scrollTop;

        setPreview(null);
        onImageChange(null);
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Restaurar scroll en el siguiente ciclo del event loop
        setTimeout(() => {
            if (scrollTop !== undefined && scrollRef?.current) {
                scrollRef.current.scrollTop = scrollTop;
            }
        }, 0);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            {preview ? (
                <div className="relative">
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {selectedFile && (
                            <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs px-2 py-1 text-center whitespace-nowrap overflow-hidden text-ellipsis rounded-b-lg">
                                {selectedFile.name}
                            </div>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 cursor-pointer"
                        title="Borrar"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={openFileDialog}
                >
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 text-center">
                        Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WebP - Máximo 5MB
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />

            {!preview && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={openFileDialog}
                    className="w-full"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar imagen
                </Button>
            )}
        </div>
    );
}

export default ImageUpload;