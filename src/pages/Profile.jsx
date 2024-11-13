import React, { useEffect, useState, useContext } from 'react';
import { fetchUserPosts } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import CategoryTags from '../components/CategoryTags';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';

function Profile() {
    const postsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                const { posts, totalPosts } = await fetchUserPosts(currentPage, postsPerPage, user.id);
                setPosts(posts);
                setTotalPosts(totalPosts);
            } catch (error) {
                console.error('Failed to load user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserPosts();
    }, [currentPage, user.id]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setLoading(true);
    };

    if (loading) return <LoadingSpinner />;

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <div className="flex flex-col items-center pt-16 mt-5 bg-gray-100 min-h-screen">
            {/* User Info Section */}
            <div className="w-full max-w-3xl mb-6 p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                    <img
                        src={user.profilePicture}
                        alt={`${user.fullName}'s profile`}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                        <p className="text-lg text-gray-600">@{user.login}</p>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-500">{user.role}</p>
                        <p className="text-gray-500">Rating: {user.rating}</p>
                        <p className="text-gray-500">
                            Email Confirmed: 
                            <span className={`text-cyan-50 rounded-sm px-2 py-1 m-2 ${user.emailConfirmed ? 'bg-green-400' : 'bg-red-400'}`}>
                                {user.emailConfirmed ? 'True' : 'False'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* User's Posts Section */}
            <div className="w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Posts</h2>
                <div className="flex flex-col gap-4 px-4 mb-10">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="flex items-center bg-white rounded-lg shadow-md p-6">
                                {/* Post Title and Content */}
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{post.title}</h3>
                                    <p className="text-gray-700">
                                        {post.content.length > 50 ? `${post.content.slice(0, 50)}...` : post.content}
                                    </p>
                                </div>

                                {/* Category Tags */}
                                <div className="flex-shrink-0 ml-4">
                                    <CategoryTags categories={post.categories} maxVisible={3} />
                                </div>

                                {/* Post Stats */}
                                <div className="flex flex-col ml-6 text-gray-500 text-sm text-nowrap">
                                    <span>❤️ {post.likeCount}</span>
                                    <span>👎 {post.dislikeCount}</span>
                                    <span>👀 {post.views}</span>
                                    <span>💬 {post.commentCount}</span>
                                </div>

                                {/* Edit Button */}
                                <div className="ml-6 text-nowrap">
                                    <Link to={`/edit-post/${post.id}`} className="text-blue-500 hover:text-blue-700">
                                        ✏️ Edit
                                    </Link>
                                </div>
                            </div>
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

export default Profile;
