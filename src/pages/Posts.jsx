import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postService';
import Post from '../components/Post';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Posts() {
    const postPerPage = 12; // Количество постов на странице
    const [posts, setPosts] = useState([]); // Все посты
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0); // Общее количество постов
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const page = query.get('page');
        if (page) {
            setCurrentPage(parseInt(page));
        }
    }, [location.search]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { posts, totalPosts } = await fetchPosts(currentPage);
                setPosts(posts); // Сохраняем все посты
                setTotalPosts(totalPosts); // Сохраняем общее количество постов
                setLoading(false);
            } catch (error) {
                console.error('Failed to load posts:', error);
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentPage]); // Зависимость от текущей страницы

    const totalPages = Math.ceil(totalPosts / postPerPage); // Общее количество страниц

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`?page=${pageNumber}`);
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 10;

        let startPage = Math.max(1, currentPage - 4);
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (endPage - startPage < maxVisibleButtons - 1) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(<span key="ellipsis-start">...</span>);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            buttons.push(
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                    {page}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="ellipsis-end">...</span>);
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-semibold text-gray-800 mt-4 text-left w-full max-w-5xl px-4">Posts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl w-full mb-5">
                {posts.map((post) => (
                    <Link key={post.id} to={`/post/${post.id}`} className="hover:shadow-2xl transition-shadow duration-300">
                        <Post post={post} />
                    </Link>
                ))}
            </div>

            <div className="mt-4 flex justify-center mb-5">
                {renderPaginationButtons()}
            </div>
        </div>
    );
}

export default Posts;
