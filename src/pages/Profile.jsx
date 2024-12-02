import React, { useEffect, useState, useContext } from 'react';
import { fetchUserPosts } from '../services/userService';
import { deletePostById } from '../services/postService'
import { AuthContext } from '../context/AuthContext';
import CategoryTags from '../components/CategoryTags';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { NotifyContext } from '../context/NotifyContext';

function stripMarkdown(content) {
    return content.replace(/[#_*~`>|-]/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim();
}

function Profile() {
    const postsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const navigate = useNavigate();
    const showNotification = useContext(NotifyContext);

    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                const { posts, totalPosts } = await fetchUserPosts(currentPage, postsPerPage, user?.id);
                setPosts(posts);
                setTotalPosts(totalPosts);
            } catch (error) {
                console.error('Failed to load user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserPosts();
    }, [currentPage, user?.id]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setLoading(true);
    };

    const handleDeletePost = async () => {
        try {
            await deletePostById(postIdToDelete);  // Delete the selected post
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postIdToDelete));  // Remove the deleted post from state
            setTotalPosts((prevTotal) => prevTotal - 1);  // Decrease total post count
            setShowDeleteConfirm(false);  // Close the confirmation modal
            showNotification('Post deleted successfully!', 'success');  // Display success notification
        } catch (error) {
            showNotification('Failed to delete post.', 'error');  // Error notification
        }
    };

    const handleDeleteConfirmation = (postId) => {
        setPostIdToDelete(postId);  // Set the post ID to be deleted
        setShowDeleteConfirm(true);  // Show the confirmation modal
    };
    const handleBorderClick = () => {
        // console.log('Border clicked!');
        window.open('https://github.com/DMYTRO-DOLHII', '_blank');
    };

    if (loading) return <LoadingSpinner />;

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <div className="flex flex-col items-center pt-16 mt-5 bg-gray-100 min-h-screen px-4">
            {/* User Info Section */}
            <div className="w-full max-w-3xl mb-6 p-4 bg-white rounded-lg shadow-lg sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                    <div
                        className="relative w-25 h-25 sm:w-28 sm:h-28 rounded-full bg-gradient-to-bl from-[#0800A7] to-[#EC7EEA] p-[5px]"
                        onClick={handleBorderClick}
                    >
                        <img
                            src={user?.profilePicture}
                            alt={`${user?.fullName}'s profile`}
                            className="w-full h-full rounded-full object-cover"
                            onClick={(e) => e.stopPropagation()}  // Prevent event propagation on the image
                        />
                    </div>


                    <div className="mt-4 sm:mt-0">
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{user?.fullName}</h1>
                        <p className="text-sm sm:text-lg text-gray-600">@{user?.login}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                        <p className="text-sm text-gray-500">Rating: {user?.rating}</p>
                        <p className="text-sm text-gray-500">
                            Email Confirmed:
                            <span className={`text-cyan-50 rounded-sm px-2 py-1 m-2 ${user?.emailConfirmed ? 'bg-green-400' : 'bg-red-400'}`}>
                                {user?.emailConfirmed ? 'True' : 'False'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* User's Posts Section */}
            <div className="w-full max-w-5xl">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4">Your Posts</h2>
                <div className="flex flex-col gap-4 px-2 sm:px-4 mb-10">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="relative flex flex-col sm:flex-row items-start bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition"
                                onClick={() => post.status !== 'inactive' && navigate(`/post/${post.id}`)}
                            >
                                {post.status === 'inactive' && (
                                    <div className="absolute inset-0 bg-black/30 flex justify-center items-center pointer-events-none rounded-lg">
                                        <span className="text-lg sm:text-4xl font-bold text-white opacity-50 transform rotate-[-15deg]">
                                            INACTIVE
                                        </span>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{post.title}</h3>
                                    <p className="text-sm sm:text-gray-700">
                                        {stripMarkdown(post.content).length > 50
                                            ? `${stripMarkdown(post.content).slice(0, 50)}...`
                                            : stripMarkdown(post.content)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4">
                                    <CategoryTags categories={post.categories} maxVisible={3} />
                                </div>
                                <div className="flex flex-col mt-4 sm:mt-0 sm:ml-6 text-gray-500 text-xs sm:text-sm">
                                    <span>❤️ {post.likeCount}</span>
                                    <span>👎 {post.dislikeCount}</span>
                                    <span>👀 {post.views}</span>
                                    <span>💬 {post.commentCount}</span>
                                </div>
                                <div className="flex mt-4 sm:mt-0 sm:ml-6 space-x-2">
                                    <Link
                                        to={`/edit-post/${post.id}`}
                                        className="bg-blue-500 text-white px-3 sm:px-4 py-1 text-sm rounded hover:bg-blue-400 transition"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="bg-red-500 text-white px-3 sm:px-4 py-1 text-sm rounded hover:bg-red-400 transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteConfirmation(post.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No posts yet.</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                )}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                        <div className="relative bg-white p-6 rounded-md w-1/3 z-60">
                            <h3 className="text-lg font-semibold mb-4">
                                Are you sure you want to delete this post?
                            </h3>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeletePost}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Profile;
