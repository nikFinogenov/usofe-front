// pages/Categories.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/categoryService';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoryData = await fetchCategories();
                setCategories(categoryData);
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) return <div>Loading categories...</div>;

    return (
        <div className="max-w-2xl mx-auto pt-16 mt-5">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <ul className="space-y-4 mb-5">
                {categories.map(category => (
                    <li key={category.id} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <span className="bg-blue-100 text-blue-600 text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full">{category.title}</span>
                            <p className="mt-1">{category.description}</p>
                            <span className="text-gray-500">Posts: {category.postCount}</span>
                        </div>
                        <Link to={`/categories/${category.id}/posts`} className="text-blue-500 hover:underline">
                            View Posts
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;
