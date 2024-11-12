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
                const { categories, totalCategories} = await fetchCategories(currentPage, categoriesPerPage);
                setCategories(categories);
                setTotalCategories(totalCategories); // Assuming the API provides total pages
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
            <ul className="space-y-4 mb-5">
                {categories.map(category => (
                    <li key={category.id} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <span className="bg-blue-100 text-blue-600 text-xs font-semibold mr-5 mb-2 px-3 py-1 rounded-full">
                                {category.title}
                            </span>
                            <p className="mt-1">
                                {category.description.length > 50 ? `${category.description.slice(0, 50)}...` : category.description}
                            </p>
                            <span className="text-gray-500">Posts: {category.postCount}</span>
                        </div>
                        <Link to={`/categories/${category.id}/posts`} className="text-blue-500 hover:underline text-nowrap">
                            View Posts
                        </Link>
                    </li>
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
