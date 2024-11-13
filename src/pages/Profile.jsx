// src/pages/Profile.jsx

import React, { useEffect, useState, useContext } from 'react';
import { fetchUserPosts } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import PostPreview from '../components/PostPreview';
import LoadingSpinner from '../components/LoadingSpinner';

function Profile() {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                console.log(user);
                // const userPosts = await fetchUserPosts(user.login);
                // const userPosts = []
                // setPosts(userPosts);
            } catch (error) {
                console.error('Failed to load user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserPosts();
    }, [user.login]);

    if (loading) return <LoadingSpinner />;

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
                            Email Confirmed: <span className={`text-cyan-50 rounded-sm px-2 py-1 ${user.emailConfirmed ? 'bg-green-400' : 'bg-red-400'}`}>{user.emailConfirmed ? 'True' : 'False'}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* User's Posts Section */}
            <div className="w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mb-10">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostPreview key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-gray-500">No posts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
