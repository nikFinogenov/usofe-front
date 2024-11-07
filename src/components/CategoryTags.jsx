import React from 'react';
import { Link } from 'react-router-dom';

function CategoryTags({ categories, maxVisible }) {
    // const maxVisible = 5; // Maximum tags to show before truncating

    // Determine if truncation is needed
    const visibleCategories = categories.slice(0, maxVisible);
    const remainingCount = categories.length - maxVisible;

    return (
        <div className="flex flex-wrap mt-4">
            {visibleCategories.map((category, index) => (
                <Link to={`/categories/${category.id}/posts`}>
                    <span
                        key={category.id || index}
                        className="bg-blue-100 text-blue-600 text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full"
                    >
                        {category.title}
                    </span>
                </Link>
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
