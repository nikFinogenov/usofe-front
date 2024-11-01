import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postService';
import Post from '../components/Post';

function Main() {
    const postPerPage = 2; // Количество постов на странице
    const [posts, setPosts] = useState([]); // Все посты
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0); // Общее количество постов

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const postsData = await fetchPosts();
                setPosts(postsData); // Сохраняем все посты
                setTotalPosts(postsData.length); // Сохраняем общее количество постов
                setLoading(false);
            } catch (error) {
                console.error('Failed to load posts:', error);
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    // Расчет постов для текущей страницы
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // Посты для отображения

    const totalPages = Math.ceil(totalPosts / postPerPage); // Общее количество страниц

    // Функция для переключения страниц
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    // Функция для генерации кнопок пагинации
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 10;

        // Определяем диапазон страниц для отображения
        let startPage = Math.max(1, currentPage - 4);
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        // Если страниц больше 10, подстраиваем отображение
        if (endPage - startPage < maxVisibleButtons - 1) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        // Добавляем кнопку "Первая"
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

        // Генерируем кнопки для текущего диапазона
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

        // Добавляем кнопку "Последняя"
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
        <div className="flex flex-col items-center py-8 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl w-full mt-6">
                {currentPosts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>

            {/* Навигация по страницам */}
            <div className="mt-4 flex justify-center">
                {renderPaginationButtons()}
            </div>
        </div>
    );
}

export default Main;
