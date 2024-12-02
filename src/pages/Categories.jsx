import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchCategories, createCategory, deleteCategory, updateCategory } from '../services/categoryService';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';
import { IoIosClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { MdOutlineModeEditOutline } from "react-icons/md";

function Categories() {
    const categoriesPerPage = 8;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const showNotification = useContext(NotifyContext);

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
                setTotalCategories(totalCategories);
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    const handleAddCategory = async () => {
        if (!newCategoryTitle.trim()) return;

        try {
            await createCategory({ title: newCategoryTitle, description: newCategoryDescription });
            setNewCategoryTitle('');
            setNewCategoryDescription('');
            setShowModal(false);
            const { categories, totalCategories } = await fetchCategories(currentPage, categoriesPerPage);
            setCategories(categories);
            setTotalCategories(totalCategories);
            showNotification('Category added successfully!', 'success');
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteCategory(categoryToDelete);
            const { categories, totalCategories } = await fetchCategories(currentPage, categoriesPerPage);
            setCategories(categories);
            setTotalCategories(totalCategories);
            showNotification('Category deleted successfully!', 'success');
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleEditCategory = async () => {
        if (!categoryToEdit.title.trim()) return;

        try {
            await updateCategory(categoryToEdit.id, categoryToEdit.title, categoryToEdit.description);
            const { categories, totalCategories } = await fetchCategories(currentPage, categoriesPerPage);
            setCategories(categories);
            setTotalCategories(totalCategories);
            showNotification('Category updated successfully!', 'success');
            setShowEditModal(false);
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto pt-16 mt-5 mbl:px-4 tbl:px-4 2tbl:px-4">
            <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
                Categories
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-blue-600"
                    >
                        <FaPlus size={15} />
                    </button>
                )}
            </h1>

            <ul className="space-y-6">
                {categories.map(category => (
                    <li key={category.id} className="relative flex justify-between items-center">
                        <Link
                            to={`/categories/${category.id}/posts`}
                            className="bg-white border border-gray-300 rounded-lg shadow-md p-6 flex flex-col items-start justify-between hover:bg-blue-50 w-full"
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

                        {user?.role === 'admin' && (
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => {
                                        setCategoryToEdit(category);
                                        setShowEditModal(true);
                                    }}
                                    className="text-gray-500 hover:text-blue-500"
                                >
                                    <MdOutlineModeEditOutline size={24} />
                                </button>
                                <button
                                    onClick={() => {
                                        setCategoryToDelete(category.id);
                                        setShowDeleteConfirm(true);
                                    }}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <IoIosClose size={32} />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => setCurrentPage(newPage)}
            />

            {/* Modal for adding a new category */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                        <input
                            type="text"
                            value={newCategoryTitle}
                            onChange={(e) => setNewCategoryTitle(e.target.value)}
                            placeholder="Category Title"
                            className="border p-2 w-full mb-4 rounded-md"
                        />
                        <textarea
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                            placeholder="Category Description"
                            className="border p-2 w-full mb-4 rounded-md"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 p-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for editing a category */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                        <input
                            type="text"
                            value={categoryToEdit?.title}
                            onChange={(e) => setCategoryToEdit({ ...categoryToEdit, title: e.target.value })}
                            placeholder="Category Title"
                            className="border p-2 w-full mb-4 rounded-md"
                        />
                        <textarea
                            value={categoryToEdit?.description}
                            onChange={(e) => setCategoryToEdit({ ...categoryToEdit, description: e.target.value })}
                            placeholder="Category Description"
                            className="border p-2 w-full mb-4 rounded-md"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-300 p-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditCategory}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this category?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="bg-gray-300 p-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCategory}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categories;
