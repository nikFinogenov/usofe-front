import React, { useEffect, useState, useContext } from 'react';
import { fetchUserPosts, fetchUserProfile, deleteAccount, updateUser } from '../services/userService';
import { NotifyContext } from '../context/NotifyContext';
import { Link, useParams } from 'react-router-dom';
import PostPreview from '../components/PostPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import UpdateUserModal from '../components/UpdateUserModal';

function User() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const postsPerPage = 12;
    const showNotification = useContext(NotifyContext);

    const currentUserRole = 'admin'; // Replace with actual logic for checking user role

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

    const handleBanUser = async () => {
        if (window.confirm(`Are you sure you want to ban ${user?.fullName}?`)) {
            try {
                await deleteAccount(user.id);
                showNotification(`${user.fullName} has been banned.`, 'success');
            } catch (error) {
                showNotification('Failed to ban user.', 'error');
            }
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            const fieldsChanged = Object.keys(updatedUser).some(
                (key) => updatedUser[key] !== user[key]
            );
    
            if (fieldsChanged) {
                await updateUser(user.id, updatedUser);
                setUser(updatedUser);
                showNotification('User details have been updated.', 'success');
                setIsModalOpen(false);
            } else {
                showNotification('No changes were made.', 'info');
            }
        } catch (error) {
            showNotification('Failed to update user details.', 'error');
        }
    };
    

    if (loading) return <LoadingSpinner />;

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const getRatingColor = (rating) => {
        if (rating > 0) return 'bg-green-400';
        if (rating < 0) return 'bg-red-400';
        return 'bg-gray-400';
    };

    return (
        <div className="flex flex-col items-center pt-16 mt-5 bg-gray-100 min-h-screen mbl:px-4 tbl:px-4 2tbl:px-4">
            <div className="w-full max-w-3xl mb-6 p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src={user?.profilePicture}
                            alt={`${user?.fullName}'s profile`}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-3xl mbl:text-xl font-bold text-gray-900">{user?.fullName}</h1>
                            <p className="text-lg text-gray-600 mbl:text-sm">@{user?.login}</p>
                            <p className="text-gray-600 mbl:text-sm">{user?.email}</p>
                            <p className="text-gray-500">{user?.role}</p>
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
                    {currentUserRole === 'admin' && (
                        <div className="space-x-2">
                            <button
                                onClick={handleBanUser}
                                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
                            >
                                Ban User
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                            >
                                Update User
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl w-full mb-10">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} to={`/post/${post.id}`} className="hover:shadow-2xl transition-shadow duration-300">
                                <PostPreview post={post} />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No posts yet.</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                )}
            </div>

            {isModalOpen && (
                <UpdateUserModal
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUpdateUser}
                />
            )}
        </div>
    );
}

export default User;
