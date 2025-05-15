import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function CategorySearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                className="pl-10"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

export default CategorySearchBar;