import React, { useEffect, useState, useContext } from 'react';
import { fetchUserPosts } from '../services/userService';  // Функция для загрузки постов
import { fetchUserProfile } from '../services/userService';  // Функция для загрузки профиля
import { NotifyContext } from '../context/NotifyContext';
import { Link, useParams } from 'react-router-dom';
import PostPreview from '../components/PostPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

function User() {
    const { id } = useParams();  // Получаем id пользователя из маршрута
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;
    const showNotification = useContext(NotifyContext);

    // Загрузка профиля пользователя и его постов
    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            try {
                const userProfile = await fetchUserProfile(id);
                setUser(userProfile);

                const { posts, totalPosts } = await fetchUserPosts(currentPage, postsPerPage, id);
                setPosts(posts);
                setTotalPosts(totalPosts);
            } catch (error) {
                console.error('Failed to load user data:', error);
                showNotification('Failed to load user data.', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [id, currentPage, showNotification]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <LoadingSpinner />;

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // Функция для окраски рейтинга
    const getRatingColor = (rating) => {
        if (rating > 0) return 'bg-green-400';
        if (rating < 0) return 'bg-red-400';
        return 'bg-gray-400';
    };

    return (
        <div className="flex flex-col items-center pt-16 mt-5 bg-gray-100 min-h-screen">
            {/* User Info Section */}
            <div className="w-full max-w-3xl mb-6 p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                    <img
                        src={user?.profilePicture}
                        alt={`${user?.fullName}'s profile`}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user?.fullName}</h1>
                        <p className="text-lg text-gray-600">@{user?.login}</p>
                        <p className="text-gray-600">{user?.email}</p>
                        <p className="text-gray-500">{user?.role}</p>

                        {/* Рейтинг отображаем как число с окраской */}
                        <div className="mt-2">
                            <span className="text-gray-500">Rating: </span>
                            <span
                                className={`text-white px-3 py-1 rounded-lg ${getRatingColor(user?.rating)}`}
                            >
                                {user?.rating}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User's Posts Section */}
            <div className="w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl w-full mb-10">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} to={`/post/${post.id}`} className="hover:shadow-2xl transition-shadow duration-300">
                                {/* <div className="flex flex-col bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{post.title}</h3>
                                    <p className="text-gray-700">
                                        {stripMarkdown(post.content).length > 50
                                            ? `${stripMarkdown(post.content).slice(0, 50)}...`
                                            : stripMarkdown(post.content)}
                                    </p>
                                    <div className="flex-shrink-0 mt-4">
                                        <CategoryTags categories={post.categories} maxVisible={3} />
                                    </div>
                                </div> */}
                                                        <PostPreview post={post} />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No posts yet.</p>
                    )}
                </div>

                {/* Pagination Component */}
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
}

export default User;
