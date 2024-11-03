import React from 'react';

function CategoryTags({ categories }) {
    const maxVisible = 5; // Maximum tags to show before truncating

    // Determine if truncation is needed
    const visibleCategories = categories.slice(0, maxVisible);
    const remainingCount = categories.length - maxVisible;

    return (
        <div className="flex flex-wrap mt-4">
            {visibleCategories.map((category, index) => (
                <span
                    key={category.id || index}
                    className="bg-blue-100 text-blue-600 text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full"
                >
                    {category.title}
                </span>
            ))}
            {remainingCount > 0 && (
                <span className="text-gray-500 text-sm font-semibold">
                    +{remainingCount} more
                </span>
            )}
        </div>
    );
}

export default CategoryTags;
