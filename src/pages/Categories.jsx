import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchCategories } from '../services/categoryService';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

function Categories() {
    const categoriesPerPage = 8;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const location = useLocation();

    // Fetch query parameters from the URL to handle pagination
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const page = query.get('page');
        if (page) setCurrentPage(parseInt(page));
    }, [location.search]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { categories, totalCategories } = await fetchCategories(currentPage, categoriesPerPage);
                setCategories(categories);
                setTotalCategories(totalCategories); // Assuming the API provides total categories
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto pt-16 mt-5">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <ul className="space-y-6">
                {categories.map(category => (
                    <Link
                        key={category.id}
                        to={`/categories/${category.id}/posts`}
                        className="bg-white border border-gray-300 rounded-lg shadow-md p-6 flex flex-col items-start justify-between hover:bg-blue-50"
                    >
                        <div className="flex items-start mb-4">
                            <span className="bg-blue-100 text-blue-600 text-xs font-bold mr-3 px-3 py-1 rounded-full">
                                {category.title}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                            {category.description
                                ? (category.description.length > 50
                                    ? `${category.description.slice(0, 50)}...`
                                    : category.description)
                                : "No description available."}
                        </p>
                        <p className="text-gray-500 mb-4">Posts: {category.postCount}</p>
                        <span className="text-sm text-blue-500 font-semibold">Click to View</span>
                    </Link>
                ))}
            </ul>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => setCurrentPage(newPage)} // Update current page
            />
        </div>
    );
}

export default Categories;
