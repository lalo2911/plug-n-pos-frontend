import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryTabs = ({ categories, isLoading }) => {
    return (
        <div className="mb-4 overflow-x-auto pb-2">
            <TabsList className="h-auto flex-nowrap min-w-max">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="px-8 py-2">
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))
                ) : (
                    categories?.map(category => (
                        <TabsTrigger
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </TabsTrigger>
                    ))
                )}
            </TabsList>
        </div>
    );
};

export default CategoryTabs;