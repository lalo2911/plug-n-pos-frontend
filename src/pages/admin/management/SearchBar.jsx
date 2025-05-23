import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

/**
 * Componente reutilizable para barras de búsqueda
 * 
 * @param {Object} props
 * @param {string} props.value - Valor actual del campo de búsqueda
 * @param {Function} props.onChange - Función para manejar cambios en el campo
 * @param {string} [props.placeholder="Buscar..."] - Texto placeholder para el campo
 * @param {string} [props.className] - Clases adicionales para el contenedor
 * @param {string} [props.inputClassName] - Clases adicionales para el input
 * @param {React.ReactNode} [props.icon] - Ícono personalizado (por defecto: Search)
 */
function SearchBar({
    value,
    onChange,
    placeholder = "Buscar...",
    className = "",
    inputClassName = "",
    icon = <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
}) {
    return (
        <div className={`relative ${className}`}>
            {icon}
            <Input
                className={`pl-10 ${inputClassName}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

// Para mantener compatibilidad con los componentes existentes que usen searchTerm/setSearchTerm
SearchBar.withSearchTerm = function SearchBarWithTerm({
    searchTerm,
    setSearchTerm,
    placeholder,
    className,
    inputClassName,
    icon
}) {
    const handleChange = (e) => setSearchTerm(e.target.value);

    return (
        <SearchBar
            value={searchTerm}
            onChange={handleChange}
            placeholder={placeholder}
            className={className}
            inputClassName={inputClassName}
            icon={icon}
        />
    );
};

export default SearchBar;